const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    unique: true,
    index: true
  },
  culpritId: {
    type: String,
    required: true
  },
  culpritName: {
    type: String,
    required: true
  },
  motive: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  methodOfInvolvement: {
    type: String,
    required: true
  },
  actualTimeline: [{
    time: String,
    event: String,
    culpritAction: String
  }],
  revealingEvidenceIds: {
    type: [String],
    default: []
  },
  redHerringExplanations: [{
    evidenceId: String,
    explanation: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Solution', solutionSchema);

