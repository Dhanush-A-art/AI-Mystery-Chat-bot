# AI Mystery Room - API Reference

Base URL: `/api/v1`

## 1. Authentication Endpoints

### `POST /auth/register`
Register a new investigator profile.
- **Request Body:** `{ "name": "string", "email": "string", "password": "string" }`
- **Response:** `{ "success": true, "data": { "token": "jwt", "user": { ... } } }`

### `POST /auth/login`
Authenticate existing investigator.
- **Request Body:** `{ "email": "string", "password": "string" }`
- **Response:** `{ "success": true, "data": { "token": "jwt", "user": { ... } } }`

### `POST /auth/guest`
Create temporary guest session identifier.
- **Response:** `{ "success": true, "data": { "guestSessionId": "guest_..." } }`

### `GET /auth/me`
Retrieve currently logged-in user profile. Header `Authorization: Bearer <token>` required.

---

## 2. Mystery Dossier Endpoints

### `POST /cases`
Commission and generate a new mystery.
- **Headers:** `Authorization: Bearer <token>` OR `x-guest-session-id: <id>`
- **Request Body:**
  ```json
  {
    "title": "Optional Title",
    "scenario": "Crime scenario description (min 15 chars)",
    "category": "Theft | Murder Mystery | Missing Person | Corporate Secrets | Cyber Mystery | Historical Mystery | Custom Mystery",
    "difficulty": "Easy | Medium | Hard | Expert",
    "suspectCount": 4,
    "evidenceComplexity": "Beginner | Intermediate | Advanced"
  }
  ```
- **Response:** Case creation status and generated IDs.

### `GET /cases`
Fetch all cases belonging to authenticated user or guest.

### `GET /cases/:id`
Fetch public case file details.

### `DELETE /cases/:id`
Purge case file and all associated evidence, suspects, and notes.

### `GET /cases/:id/status`
Check background AI generation progress and percentage.

---

## 3. Evidence & Suspect Endpoints

### `GET /cases/:id/evidence`
Retrieve all evidence records for a case. Note: `isKeyEvidence` and `isRedHerring` are sanitized out.

### `GET /cases/:id/evidence/:evidenceId`
Retrieve specific evidence exhibit content. Automatically marks the evidence as opened in the player's investigation record.

### `GET /cases/:id/suspects`
Retrieve suspect roster with public profiles, occupations, and alibis. `secretInfo` is protected and omitted.

### `GET /cases/:id/timeline`
Retrieve public chronological timeline of incident events.

---

## 4. Investigation & Accusation Endpoints

### `GET /investigations/:caseId`
Retrieve player's active investigation status (opened evidence IDs, notes, hints used, accusation status).

### `PUT /investigations/:caseId/notes`
Save, update, or sync personal detective notes.
- **Request Body:** `{ "notes": [ { "noteId": "...", "text": "...", "suspectId": "...", "evidenceId": "..." } ] }`

### `POST /investigations/:caseId/hints`
Request assistance from the AI Detective Assistant.
- **Request Body:** `{ "level": "gentle | evidence_based | strong", "question": "optional text" }`
- **Response:** Contextual hint guidance without culprit disclosure.

### `POST /investigations/:caseId/accuse`
Submit the final official accusation.
- **Request Body:** `{ "suspectId": "S003", "reasoning": "Forensic explanation" }`
- **Response:** `{ "success": true, "data": { "isCorrect": true, "score": 120, "scoreBreakdown": { ... } } }`

### `GET /investigations/:caseId/result`
Unseal full case resolution, culprit confession, true motive, and actual timeline. Returns HTTP 403 until an accusation has been submitted.

