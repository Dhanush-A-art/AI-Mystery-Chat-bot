# 🕵️ AI Mystery Room

> **Master Product Requirements & Technical Specification:** See [spec.md](spec.md) for the authoritative Single Source of Truth (SSOT).

An AI-powered interactive mystery investigation platform built with the MERN stack and Google Gemini. Users become investigators, exploring digital crime rooms, analyzing WhatsApp-style chat recreations, CCTV surveillance frames, forensic documents, crime scene photos, and witness transcripts to identify the true culprit.

---

## 🚀 Features

- **Dynamic Case Commissioning:** Submit any mystery prompt or story scenario. The AI pipeline analyzes the crime, generates 3–6 suspects, locks in a predetermined culprit, and creates a logical timeline.
- **Multi-Format Evidence:** Every investigation includes $\ge 8$ exhibits across:
  - 💬 Encrypted Chat Logs (WhatsApp / Signal / Slack recreation)
  - 📹 CCTV Surveillance Feeds (CRT scanlines, timecode overlays, anomaly detection)
  - 📄 Forensic Documents (Audit badge logs, purchase receipts, classified memos)
  - 📸 Crime Scene Photography (High-res zoomable captures with lab notes)
  - 🎙️ Witness Interrogations (Audio tape styling with credibility ratings)
- **AI Detective Assistant:** Context-isolated assistant providing 3 tiered hints (`Gentle`, `Evidence-Based`, `Strong`) without spoiling the private solution.
- **Detective Notebook:** Log deductions, tag suspects or evidence exhibits, and persist notes.
- **Accusation & Scoring:** Submit your official warrant, explain the motive, and receive deduction scoring (with bonuses for unassisted deduction).
- **Dual-Mode Access:** Full support for registered investigator accounts (JWT) as well as instant guest sessions.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router
- **Backend:** Node.js, Express.js (REST API under `/api/v1`)
- **Database:** MongoDB with Mongoose
- **AI Engine:** Google Gemini API (`gemini-1.5-flash` or configurable)

---

## 📁 Directory Structure

```text
├── backend/
│   ├── config/             # Database connection
│   ├── controllers/        # Auth, Case, Evidence, Investigation controllers
│   ├── middleware/         # Auth & error handling middlewares
│   ├── models/             # Mongoose schemas (User, Case, Suspect, Evidence, Solution, Investigation)
│   ├── routes/             # Express API routes
│   ├── services/ai/        # Gemini integration, pipeline, assistant & validator
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Evidence viewers, layout, detective modals
│   │   ├── context/        # AuthContext (JWT + Guest Mode)
│   │   ├── pages/          # Home, Login, Register, Dashboard, CreateMystery, InvestigationRoom, CaseResult
│   │   ├── services/       # Centralized API client
│   │   ├── App.jsx         # Router & routes
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── tailwind.config.js
│
├── docs/                   # System documentation (Architecture, API, Database, Roadmap)
└── spec.md                 # Master Single Source of Truth (SSOT)
```

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your MONGODB_URI and GEMINI_API_KEY to .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

