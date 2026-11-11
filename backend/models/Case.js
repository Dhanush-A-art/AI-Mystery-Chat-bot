const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  time: { type: String, required: true },
  event: { type: String, required: true },
  location: { type: String, default: '' },
  verified: { type: Boolean, default: true }
}, { _id: false });

const caseSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Case title is required'],
    trim: true,
    maxlength: 120
  },
  scenario: {
    type: String,
    required: [true, 'Original scenario description is required'],
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Murder Mystery',
      'Theft',
      'Missing Person',
      'Corporate Secrets',
      'Cyber Mystery',
      'Historical Mystery',
      'Custom Mystery'
    ],
    default: 'Theft'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    default: 'Medium'
  },
  evidenceComplexity: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  suspectCount: {
    type: Number,
    min: 3,
    max: 6,
    default: 4
  },
  location: {
    type: String,
    default: 'Classified Scene'
  },
  incident: {
    type: { type: String, default: 'Incident' },
    date: { type: String, default: '' },
    time: { type: String, default: '' }
  },
  publicTimeline: [timelineItemSchema],
  status: {
    type: String,
    enum: ['generating', 'active', 'solved', 'failed', 'abandoned'],
    default: 'generating'
  },
  generationProgress: {
    stage: { type: String, default: 'initializing' },
    message: { type: String, default: 'Preparing your investigation...' },
    percent: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);

