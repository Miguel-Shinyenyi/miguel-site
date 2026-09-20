---
title: "Settlement Engine"
date: 2026-09-20
summary: "A live, deployed idempotent settlement and reconciliation engine, all nine build phases complete."
draft: false
---

A monorepo project: Java Spring Boot for the core services, PostgreSQL for storage, Kafka for
event flow, Python/FastAPI for fraud detection, Next.js for the front end, Docker and
Kubernetes for deployment, and Prometheus, Grafana, and OpenTelemetry for observability.

The application layer is invoice financing, but the actual subject is correctness under
failure: guaranteeing a settlement executes exactly once on top of a network that only
guarantees at-least-once delivery, with every settlement carrying an explicit state
(`PENDING`, `CONFIRMED`, `FAILED`, `UNKNOWN`, `REVERSED`) and a reconciliation process that
catches drift against external reality instead of assuming success.

All nine planned build phases are done, deployed, and verified end to end on a live staging
server. Load and chaos testing in the final phase found and fixed two real gaps in gateway
failure handling and deadlock-retry exhaustion, alongside earlier concurrency bugs caught by
integration tests before they ever reached a real environment.

Current work: not building further, restudying. Having built it doesn't guarantee being able
to explain it cold, under interview pressure, and that gap is worth closing deliberately
rather than assuming it isn't there.