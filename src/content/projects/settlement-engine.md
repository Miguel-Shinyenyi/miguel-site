---
title: "Settlement Engine"
date: 2026-09-16
summary: "An idempotent settlement and reconciliation engine, built as a portfolio project for fintech backend roles."
draft: false
---

A monorepo project: Java Spring Boot for the core services, PostgreSQL for storage, Kafka for
event flow, Python/FastAPI for fraud detection, Next.js for the front end, and Kubernetes for
deployment. Observability through Prometheus, Grafana, and OpenTelemetry.

The application layer is invoice financing, but the actual subject of the project is correctness
under retries and failures: making sure a settlement executes exactly once even when the
network doesn't cooperate.

Status: architecture and documentation are done. Implementation starts with the idempotency
layer, since everything else depends on it working first.
