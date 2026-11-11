# AI Mystery Room - Architecture Documentation

## Overview
AI Mystery Room is an interactive AI-powered detective platform designed around Spec-Driven Development (SDD). The platform generates dynamic, logically sound mystery cases through Google Gemini, presents forensic evidence in an interactive investigation room, and facilitates deductions.

```
┌────────────────────────────────────────────────────────┐
│                   React.js Frontend                    │
│   (Investigation Room, Evidence Viewers, Dashboard)    │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JWT & Guest ID)
┌───────────────────────────▼────────────────────────────┐
│                  Node.js / Express API                 │
│  (Auth, Case Controller, Evidence & Accusation Logic)  │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼───────┐
│   MongoDB   │      │ Google GenAI│      │ Cloud Storage│
│  (Mongoose) │      │  (Gemini)   │      │  (Assets)    │
└─────────────┘      └─────────────┘      └──────────────┘
```

## System Modules

### 1. Frontend Client (`frontend/`)
- **Technology:** React 18, Vite, Tailwind CSS, Lucide icons.
- **State & Communication:** Centralized `api.js` Axios instance with interceptors for JWT token and guest session IDs; React Context for authentication and guest workflows.
- **Evidence Renderers:**
  - `ChatEvidenceViewer.jsx`: Simulates messaging apps (Signal/WhatsApp/Slack) with speech bubbles and timestamps.
  - `CctvEvidenceViewer.jsx`: Simulates security camera feeds with scanline CRT effects, camera timecode HUD, and visual anomaly notes.
  - `DocumentViewer.jsx`: Audit logs, badge access sheets, store receipts.
  - `ImageEvidenceViewer.jsx`: High-resolution crime scene forensic captures with zoom controls.
  - `WitnessViewer.jsx`: Sworn witness interview transcripts with credibility indicators.

### 2. Backend API Service (`backend/`)
- **Technology:** Express.js, Node.js.
- **Authentication:** Dual-mode authentication supporting registered investigators via JWT and guest visitors via persistent `x-guest-session-id` tokens.
- **AI Investigation Generation Pipeline:**
  - `gemini.service.js`: Interacts with Google Gemini using structured JSON schema output and safe prompt templates.
  - `mysteryGenerator.service.js`: Coordinates the 6-stage generation pipeline (Story Analysis -> Suspects -> Predetermined Culprit -> Timeline -> Evidence -> Consistency Validation).
  - `detectiveAssistant.service.js`: Context-isolated assistant providing 3 tiered hints (Gentle, Evidence-Based, Strong) without access to the secret solution vault.
  - `consistencyValidator.service.js`: Verifies suspect IDs, evidence links, and timeline alignment before database persistence.

### 3. Database Layer (`backend/models/`)
- `User`: Investigator accounts, credentials, and solving metrics.
- `Case`: Investigation dossier metadata, scenario, public timeline, and difficulty.
- `Suspect`: Fictional suspects, occupations, descriptions, stated alibis, and public background facts.
- `Evidence`: Exhibits (chat, cctv, document, image, witness_statement) with private flags `isKeyEvidence` and `isRedHerring`.
- `Solution`: **Protected Collection** containing true culprit ID, true motive, narrative explanation, and unsealed chronological steps.
- `Investigation`: Player state, opened evidence list, detective notes, consulted hints, and final accusation scores.

