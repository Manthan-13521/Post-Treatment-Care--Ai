# CareShield AI

CareShield AI is a Zero-Trust remote patient recovery platform built with Next.js, MongoDB, Auth.js, and server-side provider boundaries. It supports clinical recovery information, monitoring, deterministic emergency response, medication and appointment intelligence, bounded AI support, and an auditable AI-security layer.

## Release status

The application is production-build validated. A final production deployment remains dependent on real MongoDB Atlas, Google OAuth, WhatsApp Cloud API outbound credentials, signed WhatsApp webhook credentials, and (when medicine capture is enabled) vision-provider credentials. `/api/health` reports non-secret readiness signals and distinguishes core runtime readiness from complete external-provider release readiness.

## Local setup

1. Copy `.env.example` to `.env.local` and set `MONGODB_URI`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.
2. Install dependencies with `npm ci`.
3. Synchronize MongoDB indexes with `npm run migrate`.
4. Start the app with `npm run dev`.
5. Run checks with `npm run typecheck && npm test && npm run lint && npm run build`.

## Guarded demo

Run `npm run demo:seed` only against a disposable/demo database. The command requires an explicitly set `CARESHIELD_SEED_DEMO=true`, upserts demo records, and does not clear existing records. It outputs the organization, patient, doctor, medication, and incident identifiers required by the protected screens.

Use `/demo` for the judge walkthrough:

1. Recovery and medication plan
2. Safe medication-label comparison
3. Real slot suggestion with patient-confirmed booking
4. Zero-Trust AI scanner and Security Command Center
5. Deterministic Emergency War Room

`/demo/patient` is the public no-sign-up patient workspace. It uses only embedded fictional data and never calls a patient-record API, sends a provider notification, or creates a booking. The real product requires Google sign-in and patient-scoped authorization.

The demo does not claim live provider delivery when credentials are absent. Development-only demo login is enabled only with `CARESHIELD_DEMO_MODE=true` and is denied in production.

## Provider release checklist

- **Vercel:** set `MONGODB_URI`, `AUTH_SECRET`, `AUTH_URL`, Google credentials, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and signed-webhook credentials in encrypted project environment variables.
- **MongoDB Atlas:** allow Vercel connectivity, create a least-privilege application user, and run `npm run migrate` once per environment.
- **Google OAuth:** set `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` in Vercel. Register `https://post-treatment-care-ai.vercel.app/api/auth/callback/google` as an Authorized redirect URI in the same Google Cloud OAuth client. The sign-in page shows a setup message, rather than triggering Auth.js, if these values are absent. Do not enable dangerous email account linking.
- **WhatsApp outbound:** `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are mandatory for live `/messages` delivery through the official Meta Graph API. `WHATSAPP_BUSINESS_ACCOUNT_ID` is available for WABA/account APIs but is not required for outbound delivery. `WHATSAPP_API_VERSION` selects the Graph version; its documented compatibility default is `v22.0`. `WHATSAPP_EMERGENCY_TEMPLATE` identifies the approved emergency template and defaults to `careshield_emergency`.
- **WhatsApp webhooks:** point the signed webhook to `/api/webhooks/meta`. `WHATSAPP_WEBHOOK_VERIFY_TOKEN` and `META_APP_SECRET` are mandatory for subscription verification and signed inbound delivery/status callbacks. The endpoint fails closed when either is absent and validates `x-hub-signature-256` before parsing JSON.
- **Demo mode:** development-only `CARESHIELD_DEMO_MODE=true` enables the explicit demo WhatsApp provider when live credentials are absent. Production never falls back to fake delivery; a missing live configuration is persisted as a provider failure.
- **Vision:** set `MEDICINE_VISION_ENDPOINT` and `MEDICINE_VISION_API_KEY` for production label extraction. Without them, production capture refuses safely.

## Safety and security boundaries

- Every patient operation applies centralized patient/organization authorization.
- Emergency creation is deterministic monitoring policy only; no AI may create or escalate an incident.
- Medicine capture answers only whether a confident label matches an active doctor-approved plan. It never prescribes, changes a dose, substitutes, starts, or stops medicine.
- AI inputs/outputs are scanned for injection/exfiltration patterns; fixed tool firewalls only allow safe read tools. Security replay contains hashes and metadata, not prompt/document/voice/OCR content.
- Appointment AI can search persisted availability only. Booking and rescheduling require explicit patient confirmation; unique slot claims reject last-slot races.

## Operational response

- A `503` from `/api/health` means core deployment configuration is incomplete; do not route production traffic until fixed.
- A `release: external-provider-configuration-required` response means core app startup is configured but provider functions remain intentionally unavailable.
- Provider failures are recorded through existing notification/AI security boundaries; use the Security Command Center and Emergency War Room for authorized investigation.
- For actual patient emergencies, follow local emergency procedures. CareShield is decision support and coordination tooling, not emergency dispatch or diagnosis.
