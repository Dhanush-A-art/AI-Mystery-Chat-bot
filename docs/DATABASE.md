# AI Mystery Room - Database Schema Reference

The database engine is MongoDB managed through Mongoose ODM.

## Collections

### 1. `users`
Stores investigator profiles and aggregate forensic statistics.
- `_id`: ObjectId
- `name`: String (required, max 50)
- `email`: String (required, unique, lowercase)
- `password`: String (bcrypt hash, excluded in queries by default)
- `role`: String ('investigator' | 'admin')
- `stats`:
  - `casesCreated`: Number (default 0)
  - `casesSolved`: Number (default 0)
  - `casesFailed`: Number (default 0)
  - `totalScore`: Number (default 0)
- `createdAt`, `updatedAt`: Timestamps

### 2. `cases`
Primary record for each generated mystery investigation.
- `_id`: ObjectId
- `userId`: ObjectId ref `User` (nullable for guest cases)
- `guestSessionId`: String (indexed)
- `title`: String (required)
- `scenario`: String (original user input)
- `category`: String enum
- `difficulty`: String ('Easy' | 'Medium' | 'Hard' | 'Expert')
- `suspectCount`: Number (3–6)
- `evidenceComplexity`: String
- `location`: String
- `incident`: { `type`, `date`, `time` }
- `publicTimeline`: Array of { `time`, `event`, `location`, `verified` }
- `status`: String ('generating' | 'active' | 'solved' | 'failed' | 'abandoned')
- `generationProgress`: { `stage`, `message`, `percent` }

### 3. `suspects`
Suspect profiles generated for each case.
- `_id`: ObjectId
- `caseId`: ObjectId ref `Case` (indexed)
- `suspectId`: String (e.g. "S001")
- `name`: String
- `age`: Number
- `occupation`: String
- `avatar`: String (image URL)
- `description`: String
- `relationship`: String
- `alibi`: String
- `publicInfo`: Array of String
- `secretInfo`: String (private, excluded by default)
- `suspicionLevel`: String ('Low' | 'Moderate' | 'High' | 'Critical')

### 4. `evidences`
Catalog of forensic items generated for a case.
- `_id`: ObjectId
- `caseId`: ObjectId ref `Case` (indexed)
- `evidenceId`: String (e.g. "E001")
- `type`: String ('chat' | 'cctv' | 'document' | 'image' | 'audio_transcript' | 'witness_statement')
- `title`: String
- `description`: String
- `content`: Mixed Object (messages, logs, transcripts, visual details)
- `assetUrl`: String
- `timestamp`: String
- `location`: String
- `relatedSuspectIds`: Array of String
- `isUnlocked`: Boolean
- `isKeyEvidence`: Boolean (private backend field, `select: false`)
- `isRedHerring`: Boolean (private backend field, `select: false`)

### 5. `solutions` (Protected Vault)
Contains the predetermined truth. Access strictly guarded by `investigationController.js`.
- `_id`: ObjectId
- `caseId`: ObjectId ref `Case` (unique index)
- `culpritId`: String
- `culpritName`: String
- `motive`: String
- `explanation`: String
- `methodOfInvolvement`: String
- `actualTimeline`: Array of { `time`, `event`, `culpritAction` }
- `revealingEvidenceIds`: Array of String
- `redHerringExplanations`: Array of { `evidenceId`, `explanation` }

### 6. `investigations`
Tracks a player's interactive progress, notes, and deductions.
- `_id`: ObjectId
- `caseId`: ObjectId ref `Case` (indexed)
- `userId`: ObjectId ref `User` (nullable)
- `guestSessionId`: String (nullable)
- `openedEvidenceIds`: Array of String
- `notes`: Array of { `noteId`, `text`, `suspectId`, `evidenceId`, `createdAt` }
- `hintsUsed`: Number
- `hintHistory`: Array of { `level`, `question`, `hint`, `timestamp` }
- `status`: String ('active' | 'solved' | 'failed' | 'abandoned')
- `accusation`: { `suspectId`, `reasoning`, `isCorrect`, `submittedAt` }
- `score`: Number
- `scoreBreakdown`: { `basePoints`, `hintPenalty`, `reasoningBonus`, `finalScore` }

