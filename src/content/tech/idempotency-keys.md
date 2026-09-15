---
title: "Idempotency keys, plainly"
date: 2026-09-16
summary: "What an idempotency key actually does in a distributed settlement system, and what breaks without one."
draft: false
---

An idempotency key is a client-generated identifier attached to a request, so that if the same
request arrives twice, the server can recognize it and return the original result instead of
processing it again.

It matters most in payments and settlement, where a network retry after a timeout is
indistinguishable from a genuine second request. Without one, a retried transfer can execute
twice. With one, the server keeps a record of keys it has already handled, checks incoming
requests against that record, and short-circuits duplicates.

The interesting part isn't the key itself. It's deciding what counts as "the same request" and
how long the record needs to live.
