# AI MYSTERY ROOM
## Master Product Requirements & Technical Specification

**Document Type:** Single Source of Truth (SSOT)  
**Development Methodology:** Spec-Driven Development (SDD)  
**Project Type:** AI-Powered Interactive Mystery Investigation Platform  
**Frontend:** React.js  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**AI Engine:** Google Gemini API  
**Primary Development IDE:** Antigravity  
**Version:** 1.0  
**Status:** Ready for Development

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered interactive detective game where users become investigators and solve fictional mysteries using AI-generated evidence.

The user provides a short scenario, story idea, or mystery theme. Based on this input, the AI generates a complete fictional investigation containing:

- A mystery storyline.
- A list of suspects.
- One actual culprit.
- Motives and possible reasons.
- Evidence and investigation materials.
- Hidden clues and misleading information.
- A final solution that the user must discover.

The user explores the investigation room, examines the available evidence, connects clues, and identifies the culprit.

The experience should feel like entering a detective's investigation room rather than simply answering a quiz.

## 1.2 Core Concept

**User Input → AI Investigation Generation → Evidence Exploration → Clue Analysis → Culprit Selection → Case Resolution**

Example:

A user enters:

"A businessman was found missing from his office on Monday night. Three employees were present in the building. Everyone claims they left before 9 PM."

The AI creates:

1. A fictional mystery involving the missing businessman.
2. Three suspects with individual backgrounds.
3. Different possible motives.
4. Simulated chat conversations.
5. Security camera evidence.
6. Photographic evidence.
7. A timeline of events.
8. Hidden contradictions between statements.
9. One predetermined culprit.

The user investigates the evidence and submits their final accusation.

## 1.3 Product Vision

Build an immersive AI-powered detective experience that combines storytelling, logical reasoning, interactive evidence exploration, and artificial intelligence.

The platform should make every investigation feel unique, challenging, and unpredictable.

## 1.4 Main Objectives

1. Allow users to generate mysteries from their own story ideas.
2. Generate consistent fictional investigations using Gemini.
3. Create different types of AI-generated evidence.
4. Provide an interactive investigation environment.
5. Encourage logical reasoning and critical thinking.
6. Allow users to accuse suspects and receive explanations.
7. Maintain consistency between the mystery, suspects, evidence, and final solution.

---

# 2. TARGET USERS

### Primary Users
- Students.
- Mystery and detective game enthusiasts.
- Puzzle lovers.
- Casual gamers.
- Users interested in AI-powered experiences.

### User Expectations

Users should be able to:
- Create their own mystery.
- Investigate cases without time pressure.
- Explore different evidence formats.
- Discover hidden clues.
- Make their own deductions.
- Replay investigations with different scenarios.

---

# 3. TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Styling | Tailwind CSS |
| UI Components | Reusable React components |
| Backend | Node.js |
| API Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| AI Model | Google Gemini API |
| Authentication | JWT |
| Password Security | bcrypt |
| Image Generation | Gemini image generation capability or compatible image-generation provider |
| Video Evidence | Generated video where supported, otherwise AI-created CCTV-style frames |
| File Storage | Cloudinary or compatible object storage |
| API Communication | REST API |
| State Management | React Context or Zustand |
| Deployment | Vercel (frontend), Render or equivalent (backend), MongoDB Atlas |

### Technical Rules

1. Use JavaScript throughout the MERN application unless there is a strong technical reason to introduce TypeScript.
2. Keep frontend and backend code separate.
3. Never expose Gemini API keys in frontend code.
4. All AI generation must happen through the backend.
5. Use environment variables for credentials and configuration.
6. Keep AI model names configurable.
7. Use reusable components and maintainable architecture.
8. Store generated evidence in persistent storage rather than relying on temporary local URLs.

---

# 4. APPLICATION MODULES

The application consists of seven major modules.

1. Landing Page.
2. Authentication and User Management.
3. Mystery Creation.
4. AI Investigation Generator.
5. Investigation Room.
6. Culprit Selection and Case Results.
7. User Dashboard and Case History.

---

# 5. DETAILED FUNCTIONAL REQUIREMENTS

## 5.1 Landing Page

The landing page introduces the AI Mystery Room experience.

### Required Sections

**A. Navigation Bar**
- Application logo: AI Mystery Room.
- Home.
- How It Works.
- My Cases.
- Login / Sign Up.
- User profile when authenticated.

**B. Hero Section**

Main heading:

"Every Mystery Has a Secret. Can You Find It?"

Description:

"Enter the world of investigation. Create mysteries, uncover hidden evidence, connect clues, and discover the truth."

Primary CTA:
- Start Investigating.

Secondary CTA:
- Explore How It Works.

**C. How It Works**

Display three steps:

1. Create Your Mystery.
2. Investigate the Evidence.
3. Find the Culprit.

**D. Features Section**
- AI-generated mysteries.
- Interactive investigation room.
- Multiple evidence formats.
- Intelligent case solutions.
- Different difficulty levels.

**E. Footer**
- About.
- Contact.
- Privacy Policy.
- Terms and Conditions.

## 5.2 Authentication Module

Users should have the option to create an account and access their investigation history.

### Features

- User registration.
- User login.
- Logout.
- Protected routes.
- User profile.
- Password hashing.
- JWT-based authentication.

### Registration Fields
- Name.
- Email.
- Password.
- Confirm Password.

### Login Fields
- Email.
- Password.

Guest Mode:

Users should also be able to try a mystery without creating an account.

Guest sessions should use a temporary session identifier. Guest cases can be stored locally or temporarily on the server, subject to a defined expiration policy.

---

# 6. MYSTERY CREATION MODULE

This is the starting point of the actual game.

Users must be able to provide a story or scenario from which the AI creates an investigation.

## 6.1 Mystery Creation Interface

### Input Fields

**1. Mystery Title (Optional)**

Example: The Midnight Disappearance.

**2. Story / Scenario (Required)**

A large text area where users describe their mystery.

Example:

"A valuable diamond disappeared from a private museum during a special exhibition. Four employees had access to the building. The security system was offline for 15 minutes."

**3. Mystery Category**

- Murder Mystery (non-graphic, fictional).
- Theft.
- Missing Person.
- Corporate Secrets.
- Cyber Mystery.
- Historical Mystery.
- Custom Mystery.

**4. Difficulty Level**

- Easy.
- Medium.
- Hard.
- Expert.

**5. Number of Suspects**

- 3.
- 4.
- 5.
- 6.

**6. Evidence Complexity**

- Beginner.
- Intermediate.
- Advanced.

### Generate Mystery Button

When the user clicks Generate Mystery:

1. Validate the input.
2. Send the scenario and configuration to the backend.
3. Create a new investigation record.
4. Trigger the AI investigation generation workflow.
5. Validate the generated mystery.
6. Generate evidence.
7. Save all investigation data.
8. Navigate to the investigation room.

Display a loading interface while generation is happening.

Loading messages can include:

- Preparing your investigation...
- Identifying potential suspects...
- Generating evidence...
- Connecting the clues...
- Securing the investigation room...

Important: Generation must happen in stages so that failures can be retried without generating an entirely different culprit or story.

---

# 7. AI INVESTIGATION GENERATION ENGINE

This is the most important backend component of the project.

Gemini acts as the investigation architect.

The AI must create a logically consistent mystery instead of generating unrelated evidence.

## 7.1 AI Generation Pipeline

The generation pipeline must follow this order:

**Stage 1: Story Analysis**

Gemini analyzes the user's scenario and identifies:
- Mystery type.
- Main incident.
- Location.
- Relevant characters.
- Possible motives.
- Investigation context.

**Stage 2: Suspect Generation**

Generate the selected number of suspects.

Each suspect must contain:

- Unique suspect ID.
- Name.
- Age (fictional).
- Occupation.
- Character description.
- Relationship with the incident.
- Possible motive.
- Alibi.
- Publicly known information.
- Secret information.
- Suspicion level.

**Stage 3: Culprit Determination**

The AI must select exactly one actual culprit.

The culprit's identity must be determined BEFORE generating the evidence.

The following information must be generated and saved privately:

- Culprit ID.
- True motive.
- Actual sequence of events.
- Method of involvement.
- Reason for committing the fictional incident.
- Evidence connecting the culprit to the incident.

This information must never be included in publicly accessible investigation responses.

**Stage 4: Timeline Generation**

Generate a chronological timeline of the incident.

Example:

| Time | Event |
|---|---|
| 7:00 PM | Employees arrive |
| 8:15 PM | Manager leaves |
| 8:30 PM | Security footage shows movement |
| 8:45 PM | Incident occurs |
| 9:00 PM | Missing item discovered |

**Stage 5: Evidence Generation**

Generate different pieces of evidence that correspond to the actual storyline.

**Stage 6: Consistency Validation**

Check whether:
- All suspect IDs are valid.
- The culprit is one of the suspects.
- Evidence timestamps match the timeline.
- Evidence does not contradict the predetermined truth accidentally.
- The final solution is supported by sufficient clues.
- Misleading evidence has a reasonable explanation.

If validation fails, retry or repair the relevant generation stage.

## 7.2 AI Output Structure

Gemini should return structured JSON rather than unstructured paragraphs.

Suggested investigation structure:

```json
{
  "caseTitle": "The Midnight Mystery",
  "caseDescription": "A mysterious incident...",
  "category": "Theft",
  "difficulty": "Medium",
  "location": "Blackwood Museum",
  "incident": {
    "type": "Diamond Theft",
    "date": "2026-11-01",
    "time": "20:45"
  },
  "suspects": [],
  "timeline": [],
  "evidence": [],
  "solution": {
    "culpritId": "S03",
    "motive": "Hidden motive",
    "explanation": "Private explanation",
    "actualTimeline": []
  }
}
```

This is a conceptual schema. Implement and validate the complete schema using Mongoose and server-side validation.

The solution object must remain private.

---

# 8. EVIDENCE GENERATION MODULE

Evidence is the heart of the mystery-solving experience.

The AI must create multiple evidence types that help the user investigate.

## 8.1 Evidence Categories

### A. Chat / WhatsApp-Style Messages

Generate fictional messaging conversations between suspects.

Example:

Person A: "Were you still at the office at 8:30?"

Person B: "No, I left before 8."

Person A: "That's strange. Someone saw your car outside."

Features:
- Sender name.
- Receiver name.
- Message content.
- Timestamp.
- Conversation grouping.
- Optional attachments.

Important: Display these as fictional chat recreations. Do not impersonate real users or present generated messages as authentic WhatsApp records.

### B. CCTV Evidence

Generate fictional security camera evidence.

Evidence can include:
- Camera location.
- Timestamp.
- Description of the recorded event.
- AI-generated CCTV-style image.
- Optional video clip when a suitable video generation service is configured.

Example:

"Camera 03, East Corridor, 8:32 PM: A person carrying a dark bag enters the restricted area."

If actual video generation is unavailable, use a sequence of generated frames with a CCTV-style interface.

Do not claim a still image is an actual video recording.

### C. Photographic Evidence

Generate fictional images such as:
- Crime-scene environments.
- Objects found at the location.
- Damaged items.
- Footprints or visual traces.
- Suspect-related objects.
- Hidden clues.

Every image must have:
- Evidence ID.
- Image URL.
- Description.
- Timestamp.
- Location.
- Related suspect (if applicable).

### D. Documents

Generate fictional documents such as:
- Employee records.
- Letters.
- Notes.
- Receipts.
- Access logs.
- Newspaper reports.
- Meeting schedules.

### E. Audio Transcripts

Generate fictional audio transcripts, such as:
- Recorded conversations.
- Voice messages.
- Anonymous warnings.

Audio files are optional for the MVP. Transcripts should be available even if audio generation is not configured.

### F. Witness Statements

Generate statements from fictional witnesses.

Each statement should contain:
- Witness name.
- Statement.
- Time recorded.
- Reliability indicator.
- Possible contradictions.

## 8.2 Evidence Metadata

Each evidence item must contain:

```json
{
  "evidenceId": "E001",
  "type": "chat",
  "title": "Late Night Conversation",
  "description": "A conversation between two employees.",
  "content": {},
  "timestamp": "2026-11-01T20:30:00Z",
  "relatedSuspectIds": ["S01", "S03"],
  "isKeyEvidence": true,
  "isRedHerring": false,
  "isUnlocked": true
}
```

The `isKeyEvidence` and `isRedHerring` fields must be private backend metadata.

Do not expose these fields to the frontend.

## 8.3 Evidence Design Rules

1. Every mystery must have at least 8 evidence items.
2. Evidence should include at least 3 different formats.
3. At least 3 pieces of evidence should contribute to solving the case.
4. Include misleading clues where appropriate.
5. Every important clue must have a logical explanation.
6. Evidence must remain consistent with the predetermined culprit.
7. Avoid revealing the culprit directly through a single obvious clue.
8. Evidence should be discoverable without requiring random guessing.

---

# 9. INVESTIGATION ROOM

This is the primary gameplay interface.

The user should feel like a detective working inside a digital investigation room.

## 9.1 Main Layout

The investigation interface should contain:

**Left Sidebar**
- Case Overview.
- Suspects.
- Evidence.
- Timeline.
- Detective Notes.

**Main Workspace**
- Selected evidence.
- Evidence viewer.
- Image preview.
- Chat conversation viewer.
- CCTV viewer.
- Document viewer.

**Right Sidebar**
- Investigation progress.
- Collected clues.
- Suspect comparison.
- Submit accusation button.

The layout must be responsive and usable on desktop, tablet, and mobile.

## 9.2 Case Overview

Display:
- Case title.
- Case description.
- Incident location.
- Incident date.
- Difficulty.
- Number of suspects.
- Number of evidence items.

## 9.3 Suspect Profiles

When the user selects a suspect, show:

- Profile image or avatar.
- Name.
- Occupation.
- Character description.
- Relationship with the incident.
- Known alibi.
- Available statements.

The suspect's secret information and actual culprit status must never be exposed.

## 9.4 Evidence Explorer

Users must be able to:

- Browse all evidence.
- Filter by evidence category.
- Open individual evidence.
- Zoom into images.
- Read documents.
- Explore chat conversations.
- View CCTV evidence.
- Return to the evidence list.

Evidence should be presented as interactive cards.

## 9.5 Detective Notes

Allow users to create personal investigation notes.

Features:
- Add a note.
- Edit a note.
- Delete a note.
- Associate a note with a suspect.
- Associate a note with evidence.

Notes must persist during the investigation.

## 9.6 Investigation Board

Provide an optional visual investigation board where users can connect:

- Suspects.
- Evidence.
- Events.
- Locations.

For the MVP, a simple clue relationship view is sufficient. Advanced drag-and-drop connections can be implemented in a later version.

## 9.7 AI Detective Assistant

Provide an optional AI assistant that helps users think through the evidence.

Example user questions:

- "What are the contradictions in the statements?"
- "Summarize the evidence against Suspect 2."
- "What happened between 8 PM and 9 PM?"
- "Which clues should I examine more carefully?"

The assistant must:
- Use only information available to the investigator.
- Avoid revealing the culprit.
- Avoid exposing private solution data.
- Offer hints rather than immediately providing the answer.
- Never invent evidence that is not part of the case.

Hint levels:

1. Gentle Hint.
2. Evidence-Based Hint.
3. Strong Hint.

Hints can optionally affect the final score.

---

# 10. CULPRIT SELECTION MODULE

After examining the evidence, the user must identify the culprit.

## 10.1 Accusation Interface

Display all suspect profiles as selectable cards.

The user selects exactly one suspect.

Provide an optional explanation field:

"Why do you think this person is responsible?"

Button:

**Submit Final Accusation**

Before submission, show a confirmation dialog.

## 10.2 Accusation Validation

The backend must:
1. Verify the case belongs to the current user or guest session.
2. Verify the case is active.
3. Verify the selected suspect exists.
4. Check whether an accusation has already been submitted.
5. Compare the selected suspect ID with the private culprit ID.
6. Save the result.

The culprit must never be calculated or selected by the frontend.

## 10.3 Result Screen

### Correct Accusation

Display:

"CASE SOLVED!"

Show:
- Correct suspect.
- Motive.
- How the incident happened.
- Important clues.
- Evidence that exposed the culprit.
- Explanation of misleading clues.
- Actual timeline.

### Incorrect Accusation

Display:

"CASE CLOSED, BUT THE TRUTH REMAINS HIDDEN."

Show:
- Selected suspect.
- An explanation of why the accusation was incorrect.
- A prompt to review the case if retries are enabled.

The actual solution should be revealed only when the game rules permit it.

## 10.4 Scoring System

Suggested scoring:

| Action | Score |
|---|---:|
| Correct accusation | 100 |
| Correct accusation without hints | Bonus 20 |
| Correct explanation | Bonus 20 |
| Used gentle hint | -5 |
| Used evidence-based hint | -10 |
| Used strong hint | -15 |

These values should be configurable on the backend.

An incorrect accusation should not award the completion score.

---

# 11. USER DASHBOARD

Authenticated users should have a dashboard containing their investigation history.

## Dashboard Sections

### A. Welcome Section

"Welcome back, Detective!"

### B. Statistics

- Total Cases Created.
- Cases Solved.
- Cases Unsolved.
- Success Rate.

### C. My Investigations

Display cases as cards containing:
- Case title.
- Category.
- Difficulty.
- Creation date.
- Status.
- Investigation progress.

Case statuses:

- Generating.
- Active.
- Solved.
- Failed.
- Abandoned.

### D. Continue Investigation

Allow users to resume active investigations from where they left off.

### E. Create New Mystery

Provide a prominent button to start another investigation.

---

# 12. DATABASE DESIGN

Use MongoDB with Mongoose.

Suggested collections:

## 12.1 Users

```json
{
  "_id": "ObjectId",
  "name": "Detective",
  "email": "user@example.com",
  "password": "hashed_password",
  "createdAt": "Date"
}
```

## 12.2 Cases

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "The Midnight Mystery",
  "scenario": "Original user scenario",
  "category": "Theft",
  "difficulty": "Medium",
  "status": "active",
  "generationStatus": "completed",
  "createdAt": "Date"
}
```

## 12.3 Suspects

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "suspectId": "S001",
  "name": "Alex Morgan",
  "occupation": "Manager",
  "description": "Fictional character description",
  "motive": "Private or controlled information",
  "alibi": "Claimed alibi"
}
```

## 12.4 Evidence

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "evidenceId": "E001",
  "type": "image",
  "title": "Office Photograph",
  "description": "An image of the office",
  "content": {},
  "assetUrl": "",
  "createdAt": "Date"
}
```

## 12.5 Solutions

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "culpritId": "S003",
  "motive": "Private explanation",
  "explanation": "Complete solution",
  "actualTimeline": []
}
```

**Security requirement:** The Solutions collection must only be accessible through authorized backend operations. Never expose it through general case retrieval endpoints.

## 12.6 Investigations

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "userId": "ObjectId",
  "openedEvidenceIds": [],
  "notes": [],
  "hintsUsed": 0,
  "status": "active",
  "accusation": {
    "suspectId": null,
    "isCorrect": null,
    "submittedAt": null
  }
}
```

Use appropriate indexes, references, timestamps, validation, and database constraints.

---

# 13. BACKEND API SPECIFICATION

Base URL:

`/api/v1`

## Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |
| GET | /auth/me | Get current user |
| POST | /auth/logout | Logout user |

## Mystery APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /cases | Create mystery |
| GET | /cases | Get user's cases |
| GET | /cases/:id | Get case details |
| DELETE | /cases/:id | Delete case |
| GET | /cases/:id/status | Get generation status |

## Evidence APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /cases/:id/evidence | Get evidence list |
| GET | /cases/:id/evidence/:evidenceId | Get evidence details |
| GET | /cases/:id/suspects | Get suspect profiles |
| GET | /cases/:id/timeline | Get public investigation timeline |

## Investigation APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /investigations/:caseId | Get investigation progress |
| PUT | /investigations/:caseId/notes | Save notes |
| POST | /investigations/:caseId/hints | Request hint |
| POST | /investigations/:caseId/accuse | Submit accusation |
| GET | /investigations/:caseId/result | Get authorized result |

All protected APIs must validate authentication or guest session ownership.

The API must use consistent response structures:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

For errors:

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

---

# 14. GEMINI AI INTEGRATION

## 14.1 Gemini Responsibilities

Gemini will handle:

1. Scenario understanding.
2. Storyline creation.
3. Suspect generation.
4. Culprit determination.
5. Timeline creation.
6. Evidence text generation.
7. Witness statements.
8. Investigation consistency validation.
9. Detective assistant responses.
10. Result explanations.

Image generation should use an image-capable model or a compatible external provider where required.

## 14.2 AI Architecture

Create a separate AI service layer.

Suggested structure:

`backend/services/ai/`

- gemini.service.js
- mysteryGenerator.service.js
- suspectGenerator.service.js
- evidenceGenerator.service.js
- consistencyValidator.service.js
- detectiveAssistant.service.js
- solutionGenerator.service.js

Each service should have a clearly defined responsibility.

## 14.3 AI Generation Rules

The AI must follow these rules:

1. Always generate one predetermined culprit.
2. Never change the culprit during evidence generation.
3. Never generate evidence that makes the solution logically impossible.
4. Ensure every suspect has a believable background.
5. Include both useful clues and reasonable red herrings.
6. Ensure the mystery has a solvable conclusion.
7. Return structured output.
8. Validate AI output before saving it.
9. Retry failed requests with controlled retry limits.
10. Never trust raw AI output without server-side validation.

## 14.4 Context Isolation

The AI Detective Assistant must receive only:

- Public case description.
- Public suspect information.
- Public evidence.
- User's questions.
- Relevant investigation progress.

It must NOT receive the secret solution object.

Use separate prompts and data access functions for investigation and solution operations.

## 14.5 Cost and Performance Management

- Avoid regenerating the entire mystery when only one evidence item fails.
- Cache completed generation stages.
- Use model configurations appropriate for each task.
- Limit input and output token usage.
- Implement request throttling.
- Record AI usage and generation errors.
- Set maximum generation time and retry limits.

---

# 15. UI/UX DESIGN SYSTEM

## 15.1 Design Direction

**Theme: Dark Detective Investigation Interface**

The website should look premium, cinematic, modern, and mysterious.

Avoid making it look like a generic AI chatbot or ordinary admin dashboard.

The visual identity should communicate investigation, intelligence, suspense, and discovery.

## 15.2 Color Palette

| Purpose | Color |
|---|---|
| Main Background | #0B0F14 |
| Secondary Background | #121923 |
| Card Background | #18212C |
| Primary Accent | #D6A84F |
| Secondary Accent | #8FA7BA |
| Main Text | #F4F1E8 |
| Secondary Text | #9AA6B2 |
| Danger | #C95D5D |
| Success | #69A982 |

## 15.3 Typography

Suggested fonts:
- Headings: Space Grotesk.
- Body: Inter.
- Case File Labels: IBM Plex Mono.

## 15.4 UI Elements

Use:
- Dark translucent panels.
- Subtle borders.
- Gold accent highlights.
- Case-file style evidence cards.
- Cinematic transitions.
- Smooth hover effects.
- Subtle background textures.
- Consistent iconography.
- Clear loading and error states.

Avoid:
- Excessive animations.
- Overcrowded layouts.
- Too many bright colors.
- Unnecessary gradients.
- Excessive glassmorphism.

## 15.5 Responsive Design

The website must work on:
- Desktop.
- Laptop.
- Tablet.
- Mobile.

On mobile, sidebars should become collapsible drawers.

---

# 16. PROJECT FOLDER STRUCTURE

Suggested project architecture:

```text
ai-mystery-room/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── evidence/
│       │   ├── suspects/
│       │   └── investigation/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreateMystery.jsx
│       │   ├── InvestigationRoom.jsx
│       │   └── CaseResult.jsx
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── ai/
│   │   ├── evidence/
│   │   └── investigation/
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── docs/
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   └── DEVELOPMENT_PLAN.md
│
├── .gitignore
└── README.md
```

This is the recommended starting structure. Antigravity may create additional files when necessary but must preserve separation of responsibilities.

---

# 17. SECURITY REQUIREMENTS

Security is critical because the solution must remain hidden until the user completes the investigation.

### Mandatory Rules

1. Gemini API keys must only exist on the backend.
2. Passwords must be hashed using bcrypt.
3. Protected endpoints must use authentication middleware.
4. Users must only access their own cases.
5. Guest sessions must have ownership validation and expiration.
6. Secret solution data must never be included in public case responses.
7. Do not expose the culprit ID in frontend state, HTML, API responses, or client-side bundles.
8. Validate all user input.
9. Apply rate limiting to mystery generation and AI requests.
10. Sanitize user-generated content.
11. Restrict uploaded file types and sizes.
12. Use secure CORS and security headers.
13. Never execute generated code or arbitrary AI instructions.
14. Prevent prompt injection from user scenarios and evidence content.

### Fictional Content Policy

All investigations, characters, chat messages, photographs, documents, and CCTV recreations are fictional.

The interface must clearly label generated content as AI-created fictional evidence.

Do not use real people's identities, private conversations, or real surveillance footage to create fabricated accusations.

---

# 18. ERROR HANDLING

The application must handle these scenarios:

| Scenario | Expected Behaviour |
|---|---|
| Gemini API unavailable | Show friendly error and retry option |
| Invalid scenario | Ask user to provide a valid scenario |
| AI returns invalid JSON | Validate and retry |
| Image generation fails | Retry or show evidence placeholder |
| Video generation unavailable | Use CCTV-style frames |
| Database connection fails | Display service error |
| User loses connection | Preserve progress and retry requests |
| Evidence fails to load | Display fallback state |
| Invalid accusation | Show validation error |
| Unauthorized access | Return 401/403 |
| Generation takes too long | Show status and retry option |

Never silently discard a user's investigation progress.

---

# 19. NON-FUNCTIONAL REQUIREMENTS

### Performance
- Normal page loads should be optimized for responsiveness.
- Use lazy loading for evidence images.
- Avoid loading all large media files simultaneously.
- AI generation should run asynchronously where necessary.
- Display generation progress to users.

### Reliability
- Save generated investigation stages.
- Use retryable background jobs.
- Prevent duplicate case generation from repeated requests.
- Ensure accusation submission is idempotent.

### Scalability
- Keep AI services independent.
- Use separate evidence storage.
- Support additional AI models in the future.
- Keep generation workflows modular.

### Maintainability
- Follow consistent naming conventions.
- Separate business logic from controllers.
- Use reusable components.
- Validate API request and response structures.
- Add meaningful comments where necessary.
- Maintain documentation.

---

# 20. DEVELOPMENT ROADMAP

Development must happen in phases. Do not attempt to generate the entire application in one step.

## Phase 1: Foundation

- Initialize MERN project.
- Configure MongoDB.
- Configure Express server.
- Create React application.
- Configure Tailwind CSS.
- Establish routing.
- Build reusable UI components.
- Create initial landing page.

**Completion condition:** Frontend and backend run successfully and communicate with each other.

## Phase 2: Authentication and Dashboard

- Registration.
- Login.
- JWT authentication.
- Protected routes.
- Guest mode.
- User dashboard.
- Case history.

**Completion condition:** Users can log in and access their own dashboard.

## Phase 3: Mystery Generation

- Build mystery creation form.
- Integrate Gemini API.
- Generate storyline.
- Generate suspects.
- Predetermine culprit.
- Generate timeline.
- Validate JSON.
- Save investigation.

**Completion condition:** User can enter a scenario and receive a complete, consistent mystery.

## Phase 4: Evidence Generation

- Generate chat evidence.
- Generate documents.
- Generate image evidence.
- Generate CCTV descriptions and frames.
- Generate witness statements.
- Store evidence metadata.
- Integrate media storage.

**Completion condition:** Each mystery has multiple usable evidence formats.

## Phase 5: Investigation Room

- Build investigation layout.
- Add suspect profiles.
- Add evidence explorer.
- Add image and document viewers.
- Add chat viewer.
- Add CCTV viewer.
- Add detective notes.
- Add progress tracking.

**Completion condition:** Users can independently investigate the generated mystery.

## Phase 6: Culprit Selection

- Build accusation interface.
- Validate accusation on backend.
- Compare against private solution.
- Generate case result.
- Display correct or incorrect outcome.
- Implement scoring.

**Completion condition:** Users can submit an accusation and receive an accurate result.

## Phase 7: AI Detective Assistant

- Integrate assistant.
- Add hint levels.
- Add evidence-based responses.
- Prevent solution leakage.
- Track hints used.

**Completion condition:** The assistant helps users investigate without revealing the answer.

## Phase 8: Testing and Deployment

- Test all application flows.
- Test AI generation consistency.
- Test authorization.
- Test secret solution isolation.
- Test mobile responsiveness.
- Fix errors.
- Deploy frontend and backend.
- Configure production environment variables.

**Completion condition:** Application is deployed and all core workflows function correctly.

---

# 21. MVP SCOPE

The first version must prioritize the core mystery-solving experience.

### Must Have (MVP)

- Landing page.
- User authentication.
- Guest mode.
- Mystery creation.
- Difficulty selection.
- AI-generated story.
- 3 to 5 suspects.
- Predetermined culprit.
- At least 8 evidence items.
- At least 3 evidence formats.
- Interactive investigation room.
- Suspect profiles.
- Evidence viewer.
- Culprit selection.
- Case result screen.
- Basic dashboard.
- Case persistence.
- Backend solution security.

### Should Have

- AI Detective Assistant.
- Detective notes.
- CCTV-style visual evidence.
- Image generation.
- Investigation progress.
- Scoring system.

### Future Enhancements

- Realistic AI-generated video clips.
- Voice recordings.
- Multiplayer investigations.
- Time-based detective challenges.
- Leaderboards.
- Community-created mysteries.
- Daily mystery challenges.
- Custom evidence uploads.
- Multiple endings.
- Advanced investigation boards.
- AI-generated mystery difficulty adaptation.

Do not delay the MVP to implement future enhancements.

---

# 22. ACCEPTANCE CRITERIA

The application will be considered successful when the following conditions are met.

| ID | Requirement | Expected Result |
|---|---|---|
| AC01 | User submits scenario | Mystery generation starts |
| AC02 | AI generates investigation | Valid structured investigation is created |
| AC03 | Suspect generation | Configured number of suspects is generated |
| AC04 | Culprit determination | Exactly one culprit is selected |
| AC05 | Evidence generation | Minimum 8 evidence items are generated |
| AC06 | Evidence consistency | Evidence matches the actual storyline |
| AC07 | Investigation room | User can explore all available evidence |
| AC08 | Detective notes | Notes persist after refreshing |
| AC09 | Accusation | User can select one suspect |
| AC10 | Correct answer | Correct solution is displayed |
| AC11 | Incorrect answer | Incorrect accusation is identified |
| AC12 | Solution protection | Culprit remains hidden before permitted reveal |
| AC13 | Case persistence | Investigation can be resumed |
| AC14 | Authentication | Users cannot access other users' cases |
| AC15 | Responsive design | Core functionality works on mobile |

### Critical Quality Test

Create at least 10 test mysteries with different scenarios.

Verify that:
- Every mystery has exactly one culprit.
- Every mystery has a logically supported solution.
- Important clues point toward the correct culprit.
- Red herrings have reasonable explanations.
- The detective assistant does not reveal private information.
- The frontend never receives the secret solution before the authorized reveal.

---

# 23. DEVELOPMENT RULES FOR ANTIGRAVITY

This section is especially important.

Antigravity must treat this specification as the authoritative project reference.

### Rule 1: Follow the Specification

Do not independently change the core project concept, technology stack, or essential functionality.

### Rule 2: Spec Before Code

Before implementing a feature:
- Understand its requirements.
- Identify affected frontend components.
- Identify affected backend services.
- Identify database changes.
- Identify API changes.
- Define acceptance criteria.

### Rule 3: Modular Development

Build features in independent modules.

Avoid placing all application logic in one component or controller.

### Rule 4: No Fake Functionality

Do not create buttons that do nothing.

Do not use hardcoded mystery results as a substitute for actual Gemini integration.

Use clearly labeled development fixtures only during testing.

### Rule 5: AI Consistency

The culprit must be predetermined and stored before evidence generation.

Never allow evidence generation to change the culprit.

### Rule 6: Solution Security

Never send the private solution to the frontend before the game permits its reveal.

### Rule 7: Responsive Design

Every page must be usable on desktop and mobile.

### Rule 8: Error Handling

Every AI, database, and API operation must have proper loading, success, and error states.

### Rule 9: Documentation

Update relevant documentation whenever architecture, APIs, database structures, or requirements change.

### Rule 10: No Unapproved Scope Changes

If a feature requires changing the specification, explain the proposed change and its impact before implementing it.

---

# 24. SOURCE OF TRUTH AND DOCUMENT MANAGEMENT

The following files must be maintained in the project's `docs/` directory.

| Document | Responsibility |
|---|---|
| SPEC.md | Main product and functional specification |
| ARCHITECTURE.md | System architecture and component relationships |
| API.md | Backend API documentation |
| DATABASE.md | MongoDB schemas and relationships |
| DEVELOPMENT_PLAN.md | Development phases and progress |
| CHANGELOG.md | Approved specification and implementation changes |

### Priority Order

When implementing the project, follow this priority:

1. SPEC.md: Product requirements and expected behavior.
2. ARCHITECTURE.md: Technical architecture.
3. API.md: API contracts.
4. DATABASE.md: Data structures.
5. DEVELOPMENT_PLAN.md: Development sequence.

If any implementation conflicts with the specification, the specification takes priority until an explicit change is approved.

---

# 25. FINAL PRODUCT DEFINITION

AI Mystery Room is not simply an AI story generator.

It is an interactive detective investigation platform.

The final experience must allow a user to:

1. Enter an original mystery scenario.
2. Receive an AI-generated fictional investigation.
3. Explore multiple suspects.
4. Examine different forms of AI-created evidence.
5. Discover contradictions and hidden clues.
6. Use logical reasoning to connect evidence.
7. Identify the actual culprit.
8. Submit a final accusation.
9. Discover the complete explanation behind the mystery.
10. Save and revisit previous investigations.

**The central product principle:**

"AI creates the mystery. Evidence tells the story. The user discovers the truth."

---

**END OF MASTER SPECIFICATION**

**Document Version:** 1.0  
**Project:** AI Mystery Room  
**Development Status:** Ready for Antigravity Implementation