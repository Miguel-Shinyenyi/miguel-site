---
title: "What Becomes True When Both Stay"
date: 2026-09-22
summary: "A reading about how thin the evidence for the past actually is, applied to two live self-theories, and what a real system looks like when it refuses to force a premature answer."
draft: false
---

Sapiens describes the evidence for prehistoric life as a Rorschach test. A burial site with
ornaments on a skeleton might mean hierarchy. It might mean something else entirely. A
fracture on an ancient bone might mean violence. It might not. The book calls this its
Curtain of Silence, evidence thin enough that even careful scholarship can't get a clean
answer through it. Scholars keep asking anyway, because the past still shaped what came
after it, but the honest version of that inquiry holds its answers loosely.

That's a claim about archaeology. It turned out to be useful somewhere closer to home.

**Two truths instead of one.** Dialectical thinking, how my mind works?,
it generates a position and its counter-argument at the same time. Useful when pointed
outward. Corrosive when pointed inward, because the counter-argument doesn't sit next to the
first position, it tries to erase it. Grateful for the past, but it cost me something real,
failing a PostHog interview among the costs. Forgiving someone, but not reconciled with them.
The old move was picking one of those as the real feeling and discarding the other as noise.

The question that actually helps isn't which one is true. Both are. The question is what
becomes true if I stop forcing a choice between them.

**A system that already does this.** The settlement engine I built has a state called
`UNKNOWN`. It's not a bug, it's a deliberate third option, used when a payment might have
gone through or might not have, and the system genuinely doesn't have enough information yet
to say which.

```java
// Reused across three different situations: a real gateway failure,
// exhausted retries after a database deadlock, and a hard crash that
// left a settlement stuck with no way to confirm what happened.
settlementTransactions.finalizeSettlement(settlementId,
        new GatewayResult(SettlementOutcome.UNKNOWN, null));
```

The tempting design is to force an answer immediately: retry until you get a clean yes or no,
because "unknown" feels like a failure to decide. The actual design holds `UNKNOWN` as a
first-class state, moves on, and lets a separate reconciliation process resolve it later,
once there's real information to resolve it with. Forcing a premature CONFIRMED or FAILED
would be lying to the rest of the system, papering over uncertainty that was still genuinely
open. The honest version of "I don't know yet" turns out to be more useful than a fast, fake
certainty. That's the same shape as forgiving without reconciling. Not every open state needs
collapsing into a resolved one on a deadline. Some of them get resolved later, correctly,
once there's enough to resolve them with. Some of them are just allowed to be two things at
once, permanently, the way gratitude and grief can both be true about the same period without
either one cancelling the other.

**Where this gets tested, not just described.** I've also been carrying a specific belief:
that my anxiety comes from a need to control everything. It's a real, documented idea in
general, intolerance of uncertainty, anxiety tracking unpredictability rather than actual
danger, controlling behavior as an attempt to shrink that unpredictability back down. But a
documented general pattern isn't the same as a verified account of one specific person, and
right now I don't have an instance attached to it, just the label.

There's a code parallel here too, and it's not a flattering one. The same idempotency work
this week turned up two concurrency races, both caused by the system trying to guarantee
too much certainty upfront.

```
Two requests, same key, arriving at the same instant.
Option A: lock everything before either proceeds, force certainty immediately.
Option B: let both proceed, let the database's unique constraint decide
          who wins, recover the loser by reading the winner's result.
```

The actual code takes option B. Locking everything upfront to force immediate certainty is
exactly what produces a deadlock later, two transactions each holding what the other one
wants, both stuck, because the system tried to control too much of the outcome up front
instead of accepting a controlled version of not-knowing-yet and resolving it after the
fact. The fix that shipped this week for the crash-recovery gap follows the same shape: not
tighter control at the moment of failure, a sweep that runs later, accepts the outcome was
genuinely unknown for a while, and resolves it once enough time has passed to trust the
answer.

I don't know yet whether "addiction to control" is actually what's driving the anxiety, or
just the label that was closest at hand when I needed one. That's not resolved in this
piece, on purpose. If forcing a system to decide before it has enough information produces a
deadlock, forcing a belief about myself into a tidy answer before I've actually tested it
probably isn't any more reliable. The honest state to hold it in, for now, is `UNKNOWN`.