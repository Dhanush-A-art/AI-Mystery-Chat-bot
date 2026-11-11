const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  noteId: { type: String, required: true },
  text: { type: String, required: true },
  suspectId: { type: String, default: null },
  evidenceId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const hintHistorySchema = new mongoose.Schema({
  level: { type: String, enum: ['gentle', 'evidence_based', 'strong'] },
  question: { type: String, default: '' },
  hint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const investigationSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestSessionId: {
    type: String,
    default: null,
    index: true
  },
  openedEvidenceIds: {
    type: [String],
    default: []
  },
  notes: [noteSchema],
  hintsUsed: {
    type: Number,
    default: 0
  },
  hintHistory: [hintHistorySchema],
  status: {
    type: String,
    enum: ['active', 'solved', 'failed', 'abandoned'],
    default: 'active'
  },
  accusation: {
    suspectId: { type: String, default: null },
    reasoning: { type: String, default: '' },
    isCorrect: { type: Boolean, default: null },
    submittedAt: { type: Date, default: null }
  },
  score: {
    type: Number,
    default: 0
  },
  scoreBreakdown: {
    basePoints: { type: Number, default: 0 },
    hintPenalty: { type: Number, default: 0 },
    reasoningBonus: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Investigation', investigationSchema);

