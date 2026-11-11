const mongoose = require('mongoose');

const suspectSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  suspectId: {
    type: String,
    required: true // e.g. "S001"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 35
  },
  occupation: {
    type: String,
    default: 'Associate'
  },
  avatar: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  alibi: {
    type: String,
    required: true
  },
  publicInfo: {
    type: [String],
    default: []
  },
  // Private backend fields (not exposed to client)
  secretInfo: {
    type: String,
    select: false
  },
  suspicionLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Suspect', suspectSchema);

