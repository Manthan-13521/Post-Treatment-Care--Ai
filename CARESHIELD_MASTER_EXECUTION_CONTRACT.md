# CareShield AI — Permanent Master Execution Contract

## Purpose

CareShield AI is a Zero-Trust AI Remote Patient Monitoring & Predictive Care Platform. It follows a discharged patient at home, supports adherence and recovery, detects deterioration, coordinates family and care teams, and protects AI interactions and healthcare actions through a Zero-Trust security layer.

This document is the repository source of truth. Before every implementation phase, read this file and `CARESHIELD_EXECUTION_STATE.md`, inspect the repository, perform only the requested phase, validate it, update the state file, and stop. Do not rely on chat history or ask for requirements captured here again.

## Authoritative architecture

```text
Browser / PWA
  -> Next.js App Router (server components, route handlers, server actions)
  -> server-only TypeScript services
  -> MongoDB Atlas via serverless-safe Mongoose connection
  -> provider interfaces (Google OAuth, Meta WhatsApp Cloud API, future SMS/voice/video/AI)
```

Deployment is GitHub -> Vercel -> Next.js -> MongoDB Atlas. Production must not require FastAPI, Flask, PostgreSQL, SQLAlchemy, Alembic, a separate backend deployment, local-file persistence, permanent workers, Docker, or hard-coded localhost URLs. Legacy code may only be used as a migration reference until Phase 4.

Use strict TypeScript, Next.js App Router, React, Tailwind CSS, Mongoose, secure server-side authentication, responsive PWA-ready UI, provider abstractions, and Vercel-compatible serverless design. Google sign-in and Meta WhatsApp must be production-ready through configuration, never hard-coded credentials. Development/demo substitutes must be explicitly enabled and denied in production.

## Completion standard

A feature is complete only when its data model, server service, route/action, authorization, validation, relevant UI wiring, tests, and documentation are all present and work together. Never represent a model, endpoint, mock, or document alone as feature completion. Prefer real product flows over disconnected debug screens or fake buttons.

Every phase must include appropriate unit/integration/browser coverage, lint, TypeScript checking, and production build validation. Record exact results and any credential-dependent checks that cannot run locally. Do not silently weaken security, authorization, validation, auditability, or healthcare safety to make a test pass.

## Security and safety rules

- Enforce least privilege and tenant/organization scope on every patient-data operation.
- Keep secrets server-side; never expose provider secrets, raw tokens, plaintext OTPs, or protected health data in logs/client state.
- Normalize phone numbers to E.164. OTPs are securely hashed, expire in 10 minutes, have a five-attempt limit, resend cooldown, single use, and a verified timestamp.
- Centralize patient authorization, e.g. `authorize({ actor, action, patientId, organizationId, resource })`. Guardian access requires an active authorized relationship; doctor access requires MongoDB-backed assignment; organization membership is never checked through a legacy runtime.
- Audit security-sensitive reads, writes, identity events, consent, authorization failures, alerts, and AI/tool actions.
- AI must be bounded by explicit authorization, input/output safety controls, tool allowlists, confirmation for consequential actions, and security-event recording. It must not invent clinical facts or autonomously perform an unsafe emergency/clinical action.
- Treat health signals as decision support, not diagnosis. Preserve provenance, confidence/signal quality, baselines, thresholds, hysteresis, review/escalation paths, and explainability.

## Product domains

Identity includes users, Google identity, roles, account state, profiles, onboarding, phones, OTP verification, versioned consents, notification preferences, patient identity, organizations/memberships, guardian relationships, doctor profiles, care-team assignments, sessions, and audit events.

Clinical care includes post-discharge profile, allergies, conditions, discharge context, care plans and instructions, medication schedules/adherence, symptoms, availability and appointments, clinical notes, and recovery timeline for patient, guardian, and doctor experiences.

Monitoring includes secure sensor devices/credentials, telemetry, signal quality and trust, baseline/trends/anomalies, risk scoring with hysteresis, Patient Shadow, priority queue, charts, and a clearly-labelled simulator.

Later product capabilities include emergency response/packet/ambulance assistance, AI health companion, clinical copilot and video care, medication and appointment intelligence, Zero-Trust AI security/replay, and a polished complete product/hackathon experience.

## Phase roadmap and stop rule

| Phase | Required outcome |
| --- | --- |
| 0 | Install this contract, audit repository, establish state/environment/scripts/migration/test strategy. |
| 1 | Next.js/MongoDB identity cutover: auth, demo auth, onboarding, OTP, roles, organization, consent/preferences, patient/guardian/doctor/care-team authorization, audit. No FastAPI identity dependency. |
| 2 | Next.js/MongoDB clinical cutover: care data, medications, symptoms, appointments, notes, recovery timeline, and role-specific UI. No FastAPI clinical dependency. |
| 3 | Next.js/MongoDB monitoring cutover: devices, telemetry, trust/baseline/risk/Patient Shadow, priority UI, charts, simulator. No FastAPI monitoring dependency. |
| 4 | Remove/archive legacy FastAPI/PostgreSQL/SQL runtime; complete seed/migrations, Vercel/Atlas/Google/Meta readiness, and browser E2E. |
| 5 | Emergency response system. |
| 6 | AI health companion. |
| 7 | AI clinical copilot and video care. |
| 8 | Medication intelligence. |
| 9 | Appointment intelligence. |
| 10 | Zero-Trust AI security. |
| 11 | Complete Product + Hardening: polished role dashboards, War Room/security UI, one-click demo, accessibility/mobile, E2E, IDOR/red-team, query/index/concurrency/load optimization, provider/AI outage handling, privacy review, and all discovered P0/P1 fixes. |
| 12 | Final Release + Break-It Audit: Vercel/Atlas/OAuth/Meta readiness, demo seed/reset, README/runbook/judge and offline demos, final adversarial audit including prompt injection, production build, and release verdict. |

When the user sends `PHASE X`, execute the entire requested phase—not a self-invented subphase—then stop. Do not begin the next phase automatically. Normal fixable errors are not a reason to stop; report a blocker only when it is genuinely external or technically impossible to resolve in scope.

## Required state record

`CARESHIELD_EXECUTION_STATE.md` must always state: current requested and last completed phase; completed phases; architecture; implemented/incomplete features; changed files; collections/indexes/routes/services/UI pages; tests and results; lint/typecheck/build/migration/seed results; credentials required; limitations; security decisions; deferred work; legacy dependencies; and exact next phase.

## Continuation protocol

When the user sends exactly `CONTINUE`, read this contract and the execution state, inspect the unfinished repair objective and actual code, then resume from the first unchecked item in `CURRENT WORK QUEUE`. Do not plan, restart completed work, or claim a partial repair is complete. Implement and validate as much of that queue as the run permits, update the queue accurately, and end only with `CONTINUE REQUIRED` while any unchecked item remains. When all definition-of-done items are verified, run full validation and report the required completion marker. Current repair must not start Phase 7.
