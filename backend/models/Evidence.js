const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  evidenceId: {
    type: String,
    required: true // e.g. "E001"
  },
  type: {
    type: String,
    enum: [
      'chat',
      'cctv',
      'image',
      'document',
      'audio_transcript',
      'witness_statement'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  assetUrl: {
    type: String,
    default: ''
  },
  timestamp: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  relatedSuspectIds: {
    type: [String],
    default: []
  },
  isUnlocked: {
    type: Boolean,
    default: true
  },
  // Private backend metadata strictly guarded:
  isKeyEvidence: {
    type: Boolean,
    default: false,
    select: false
  },
  isRedHerring: {
    type: Boolean,
    default: false,
    select: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Evidence', evidenceSchema);

