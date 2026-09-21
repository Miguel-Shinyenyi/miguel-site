---
title: "Idempotency keys, under load"
date: 2026-09-21
summary: "What an idempotency key actually guarantees in a real settlement system, the two concurrency races that show up under load, and a gap that studying it surfaced."
draft: false
---

An idempotency key is a client-generated identifier attached to a request, so that if the
same request arrives twice, the server recognizes it and returns the original result instead
of processing it again. That's the textbook version. The real version, the one that shows up
once you put a system under actual concurrent load, has two more layers to it.

**The guarantee isn't "block the duplicate," it's "answer it correctly."** A retry of an
in-flight request gets told the process is underway. A retry of a *finished* request gets
back the exact same result the first one got, replayed from a stored snapshot, not a fresh
answer. That second case is the actual point. A caller retrying after a timeout isn't told
"processing," they're told what genuinely happened.

Here's the check, in the real code:

```java
Optional<IdempotencyKey> existing = settlementTransactions.findExisting(idempotencyKey);
if (existing.isPresent()) {
    return handleExisting(existing.get(), requestHash);
}
try {
    executionRequest = settlementTransactions.createPendingSettlement(idempotencyKey, requestHash, command);
} catch (DataAccessException raceLost) {
    IdempotencyKey winner = settlementTransactions.findExisting(idempotencyKey)
            .orElseThrow(() -> raceLost);
    return handleExisting(winner, requestHash);
}
```

**Race one: two requests, same key, genuinely at the same time.** Check-then-write always
has a gap. Two requests can both see nothing during `findExisting`, before either has
written anything. Rather than closing that gap with an upfront lock, the code lets both
proceed, and leans on a database-level unique constraint to guarantee only one insert
survives. The other throws, and gets recovered by re-reading whoever won.

What's not obvious from reading the code: that failure doesn't always look the same. Under
Postgres, the identical race sometimes surfaces as a clean unique-constraint violation, and
sometimes as an outright deadlock between the two competing index insertions, depending on
timing. That's not something you'd predict from the schema. It's something you'd only find
by actually running concurrent load against it and watching what comes back.

```
Thread A                                Thread B
--------                                --------
findExisting(key) -> empty              findExisting(key) -> empty
INSERT idempotency_keys(key)            INSERT idempotency_keys(key)
|                                       |
+-------------------+-------------------+
                    v
                Postgres

unique constraint on (key): only one INSERT wins
the loser fails as EITHER:
  - a clean unique-violation, or
  - a Postgres deadlock (CannotAcquireLockException)
depending on timing of the two index insertions

Losing thread: catch(DataAccessException) -> findExisting(key) -> return winner's result
```

**Race two is a different race, on the winner.** The losing threads above, in their own
doomed transactions, are inserting into `settlements`, which has a foreign key back to
`idempotency_keys`. Validating that foreign key takes a shared lock on the referenced row.
If those losing transactions haven't rolled back yet when the winner tries to `UPDATE` that
same row to mark it complete, the update deadlocks against locks held for an unrelated
reason.

```
Winning thread                            Losing thread (mid-rollback)
--------------                            -----------------------------
createPendingSettlement() committed

                                          INSERT INTO settlements
                                          (FK -> idempotency_keys)
                                          takes shared lock on that row for FK
                                          validation; transaction now rolling
                                          back, lock still held

finalizeSettlement():
UPDATE idempotency_keys
SET status = COMPLETED  <-- blocked on the shared lock above
|
v
Postgres detects deadlock, aborts this update
caught as TransientDataAccessException
retry finalizeSettlement only
(settlement is already durably PENDING;
re-running the whole flow would make this
thread see its own key as a conflict)
|
v
                                          rollback completes, lock released
retry succeeds
```

Five bounded retries, short backoff. If all five are exhausted, still under heavy
contention, the system doesn't leave the settlement stuck. It falls back to a second,
independent retry budget that finalizes the settlement as `UNKNOWN`, the same "we genuinely
don't know, let reconciliation resolve it later" state used when the external call itself
fails outright. Both concurrency behaviors were found by actually running load and chaos
tests against the system, not by design review.

**One thing worth being honest about here, since this piece is meant to show real thinking,
not a finished one.** Studying this closely enough to write the above surfaced a genuine gap,
not in the two races described, in a third failure mode neither of them covers: what happens
if the process hard-crashes between the two transactions entirely, after the settlement is
written as `PENDING` but before it's ever finalized. No thread survives to catch anything in
that case, and the settlement has no external reference yet, since that's only set during
finalization, which makes it invisible to reconciliation's own query. The idempotency key
would stay `IN_PROGRESS` indefinitely. That's a real, verified gap, confirmed against the
actual repository, not assumed. It isn't fixed yet. It's queued.

The interesting part was never the key itself. It's every place where "the same request
happening twice" turns out to have more than one way of actually happening.
