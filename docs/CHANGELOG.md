# Changelog - AI Mystery Room

All notable project changes, schema definitions, and engine implementations are documented here.

## [1.0.0] - 2026-11-08
### Initial Implementation based on SSOT `spec.md`
- **Core Architecture:**
  - Implemented full MERN project structure: `backend/` and `frontend/` with dedicated `docs/`.
  - Configured custom Dark Detective Investigation Design System in Tailwind CSS (`#0B0F14` dark theme, `#D6A84F` detective gold accents).
- **Backend & Database:**
  - Developed Mongoose models: `User`, `Case`, `Suspect`, `Evidence`, `Solution` (private vault), `Investigation`.
  - Created authentication routes and controllers supporting registered users (JWT) and guest sessions (`x-guest-session-id`).
  - Implemented 6-stage AI generation pipeline in `mysteryGenerator.service.js` with predetermined culprit locking and consistency validation.
  - Implemented context-isolated AI Detective Assistant in `detectiveAssistant.service.js`.
  - Implemented accusation verification and scoring in `investigationController.js`.
- **Frontend Client:**
  - Implemented responsive navigation, landing hero, and feature breakdown.
  - Developed authentication pages (`Login.jsx`, `Register.jsx`, guest mode quickstart).
  - Developed investigator `Dashboard.jsx` with real-time statistics and case dossiers.
  - Developed `CreateMystery.jsx` with category, difficulty, suspect count controls, sample prompts, and staged progress screen.
  - Developed comprehensive `InvestigationRoom.jsx` with left panel (suspects, timeline, evidence), center workspace with 5 custom evidence inspectors (`ChatEvidenceViewer`, `CctvEvidenceViewer`, `DocumentViewer`, `ImageEvidenceViewer`, `WitnessViewer`), and right panel (readiness tracker, accusation, assistant).
  - Developed interactive `DetectiveNotes` modal with suspect/evidence tagging.
  - Developed `AssistantModal` with 3 tiered hint levels.
  - Developed `AccusationModal` and `CaseResult.jsx` showcasing case unsealing, perpetrator confession, true timeline, and forensic score breakdown.

