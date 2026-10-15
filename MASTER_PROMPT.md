# MASTER PROMPT: Production-Ready Email OTP Authentication System with Idempotency Keys

## 1. Role and Objective
Act as a senior full-stack engineer, backend architect, and application security engineer.
Build a complete, secure, production-oriented email OTP authentication system for a modern web application.
The system must use real email delivery and a real MongoDB database. Do not implement mock authentication, hardcoded OTPs, fake email delivery, or simulated API responses.
A mandatory requirement is end-to-end idempotency support for authentication requests so that duplicate submissions, client retries, network timeouts, and concurrent requests do not cause duplicate side effects.
Build the application using clean architecture, modular code, strong validation, centralized error handling, and comprehensive automated tests.

## 2. Technology Stack
### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Axios or Fetch API
- React Router

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod for request validation
- express-rate-limit for rate limiting
- A secure server-side session implementation using express-session and a MongoDB-compatible session store

### Email Delivery
Choose one real email provider:
- Resend API, or
- Nodemailer with a configured SMTP provider.
Use an adapter-based email service so the provider can be replaced without rewriting the authentication logic.

### Security and Infrastructure
- Cryptographically secure random OTP generation
- HMAC-SHA-256 for OTP hashing
- Secure, HTTP-only session cookies
- MongoDB transactions where supported and appropriate
- Idempotency key storage with unique indexes
- Structured logging with secret redaction
- Environment-based configuration
- HTTPS in production
- Use currently supported, mutually compatible package versions and document the versions selected.

---

## 3. Core Authentication Flow
Implement the following complete flow:

### Step 1: Request an OTP
The user enters their email address and clicks "Send OTP".
#### Frontend requirements:
- Normalize the email consistently.
- Validate the email format.
- Generate a new UUID v4 idempotency key for the logical send-OTP operation.
- Send the request to `POST /api/auth/send-otp`.
- Include the idempotency key in the `Idempotency-Key` HTTP header.
- Reuse the same key when retrying the same logical operation.
- Generate a new key only when beginning a genuinely new operation.
- Prevent accidental duplicate submissions while the request is pending.
- Do not expose secrets or OTP values in browser logs.

#### Backend requirements:
- Validate the request and idempotency key.
- Normalize the email consistently.
- Enforce rate limits before expensive operations.
- Generate a cryptographically secure, random six-digit OTP.
- Set OTP expiration to five minutes.
- Hash the OTP using HMAC-SHA-256 with a server-side secret.
- Store the challenge securely in MongoDB.
- Deliver the OTP to the actual email address using the configured provider.
- Return a safe response without exposing the OTP, hash, provider credentials, or internal errors.
- The system must handle both existing users and new users without exposing whether an email address is registered.

### Step 2: Verify the OTP
The user enters the six-digit OTP received by email.
#### Frontend requirements:
- Provide six accessible OTP input boxes or an equivalent accessible single input.
- Support pasting the entire code.
- Support keyboard navigation and mobile devices.
- Display clear validation, loading, expiration, and network error states.
- Send the OTP and an idempotency key to `POST /api/auth/verify-otp`.
- Reuse the same key when retrying the same verification operation after a timeout.

#### Backend requirements:
- Validate the OTP challenge and expiration.
- Verify the HMAC securely using constant-time comparison where appropriate.
- Enforce a maximum of five failed attempts per challenge.
- Reject expired, consumed, superseded, or invalid OTPs.
- Consume the OTP atomically so concurrent requests cannot authenticate more than once.
- Ensure successful verification is not repeated as a new authentication side effect.
- Create the user record when appropriate, or retrieve the existing account.
- Establish a secure authenticated session.
- Return a safe success response.

### Step 3: Authenticated Dashboard
After successful verification:
- Redirect the user to the dashboard.
- Retrieve the current user through `GET /api/auth/me`.
- Protect authenticated frontend routes.
- Protect backend APIs with authentication middleware.
- Enforce authorization on the server.
- Do not store authentication credentials in localStorage or sessionStorage.

### Step 4: Logout
- Implement `POST /api/auth/logout`.
- Require an idempotency key for the logical logout operation.
- Destroy the server-side session.
- Clear the session cookie using matching cookie attributes.
- Make repeated logout requests safe.
- Ensure the browser returns to the unauthenticated state.
- Reject access to protected endpoints after logout.

### Step 5: Resend OTP
- Implement `POST /api/auth/resend-otp`.
- Require an idempotency key.
- Allow resend only after a 60-second cooldown.
- Enforce server-side request limits.
- Set the new OTP expiration to five minutes.
- Invalidate the previous challenge when the new challenge is successfully established.
- Ensure the old OTP cannot be used afterward.
- Reuse the same idempotency key for retries of the same resend operation.
- Use a new key for a new resend operation.
- Return a generic response that does not reveal account existence.
- A resend is a new logical operation; it must not accidentally reuse the original send-OTP idempotency key.

---

## 4. Idempotency Key System — Mandatory
Design and implement a complete idempotency mechanism, not just a request header.

### 4.1 Idempotency Key Format
Accept the `Idempotency-Key` HTTP header.
- Require a non-empty key for all idempotent authentication mutation endpoints.
- Accept UUID v4 keys generated by the frontend.
- Validate the key format and enforce a maximum length.
- Scope every key to its authenticated or anonymous client context, endpoint, and operation.
- Never treat a key as a substitute for authentication, authorization, CSRF protection, or rate limiting.
- For anonymous OTP requests, define a consistent scope using a server-generated anonymous flow identifier or an appropriate privacy-preserving client context. Do not rely on the email address alone as the scope.

### 4.2 Request Fingerprinting
Calculate a request fingerprint using a cryptographic hash of the canonical request data:
- HTTP method
- Endpoint or operation name
- Normalized request payload
- Relevant operation context
- Never store raw OTP values, passwords, or other authentication secrets in logs.
- For sensitive verification requests, calculate fingerprints using a keyed HMAC or another design that prevents offline guessing of short OTP values from stored fingerprints.

### 4.3 Idempotency Storage Model
Create an `IdempotencyRecord` Mongoose model with fields:
- `scopeHash`
- `key`
- `operation`
- `requestFingerprint`
- `status` (PROCESSING, COMPLETED, FAILED)
- `responseStatus`
- `safeResponseBody`
- `ownerToken`
- `leaseExpiresAt`
- `createdAt`
- `updatedAt`
- `expiresAt`
- Compound unique index on `{ scopeHash: 1, key: 1 }`.
- TTL index for eventual cleanup of expired records.
- Explicit expiration check in application logic.
- Store only safe response data (never persist raw OTP values, session IDs, cookie values, or authentication tokens).
- Retention period: 24 hours.

### 4.4 Request Processing Algorithm
- **Case A (New Key):** Validate key & request -> Compute fingerprint -> Atomically reserve key (`PROCESSING`) -> Execute operation -> Store safe response -> Mark `COMPLETED` -> Return response.
- **Case B (Completed Key, matching fingerprint):** Return original HTTP status & safe response body without re-executing side effects.
- **Case C (In-flight / Processing Key):** Return HTTP 409 Conflict with `RETRY_LATER` or HTTP 202 with `Retry-After`.
- **Case D (Same Key, different fingerprint):** Reject with HTTP 422 Unprocessable Content (`IDEMPOTENCY_KEY_REUSED`).
- **Case E (Operation fails):** Handle deterministic vs transient errors cleanly.
- **Case F (Expired key):** Apply retention and reuse policy safely.

### 4.5 Idempotency Middleware Architecture
Reusable modules:
- `src/middleware/idempotency.middleware.ts`
- `src/services/idempotency.service.ts`
- `src/models/idempotency-record.model.ts`
- `src/utils/request-fingerprint.ts`

---

## 5. Idempotency and Real Email Delivery
- Transactional Outbox pattern with `EmailOutbox` model.
- Fields: `eventId`, `eventType`, `recipient`, `encryptedPayload`, `status`, `attempts`, `nextAttemptAt`, `providerMessageId`, `lastErrorCode`, `createdAt`, `expiresAt`.
- Create OTP challenge, idempotency record, and outbox event atomically.
- Dedicated background worker processing email jobs with exponential backoff and jitter.
- AES-256-GCM encryption for outbox payloads using `EMAIL_ENCRYPTION_KEY`.
- Provider idempotency headers and provider message reconciliation.

---

## 6. API Contract
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Consistent response format:
```json
{
  "success": true,
  "message": "A verification request has been processed.",
  "data": null,
  "error": null
}
```

---

## 7. MongoDB Models and Indexes
- `User`: normalized email unique index, verification timestamp.
- `OTPChallenge`: challengeId unique, normalized email, HMAC-SHA256 hash, attempts counter, atomic consumption.
- `IdempotencyRecord`: scoped unique key index, fingerprint, lease & safe response.
- `EmailOutbox`: eventId unique, status, retry index, encrypted payload.
- `Session`: connect-mongo session store.

---

## 8. Security Requirements
- `crypto.randomInt` for 6-digit OTPs.
- `crypto.timingSafeEqual` for HMAC comparisons.
- 5-minute OTP TTL, 5 maximum failed attempts per challenge, 60s resend cooldown.
- HttpOnly, Secure, SameSite=lax/strict cookies.
- Constant-time checks, CSRF and CORS protections, rate limiting per IP and per identifier.
- Zero secret logging.

---

## 9. Environment Variables
- `NODE_ENV`, `PORT`, `FRONTEND_URL`, `MONGO_URI`, `SESSION_SECRET`, `OTP_HMAC_SECRET`, `IDEMPOTENCY_HMAC_SECRET`, `EMAIL_ENCRYPTION_KEY`, `EMAIL_PROVIDER`, `RESEND_API_KEY`, `SMTP_*`, `EMAIL_FROM`, etc.

---

## 10. Frontend UI Requirements
- Login with email
- Accessible OTP 6-box entry
- Resend cooldown timer
- Dashboard & user profile display
- Logout flow
- Idempotency key generation (UUID v4) and retry reuse logic.

---

## 11. Project Structure
```
frontend/
backend/
```

---

## 12. Required Automated Tests
Unit, integration, security, and concurrency test suites covering the entire flow.

---

## 13. Implementation Workflow
1. Phase 1: Architecture, project setup, dependency selection, and environment validation.
2. Phase 2: MongoDB models, indexes, and database transaction strategy.
3. Phase 3: Idempotency service and middleware, including concurrency tests.
4. Phase 4: OTP generation, hashing, verification, expiration, and rate limiting.
5. Phase 5: Real email integration and transactional outbox worker.
6. Phase 6: Secure session management, authentication middleware, and logout.
7. Phase 7: React login interface and API integration.
8. Phase 8: OpenAPI documentation and integration tests.
9. Phase 9: Security testing, failure recovery, and deployment configuration.
10. Phase 10: Final audit, setup documentation, and production readiness checklist.

