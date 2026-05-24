const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  studentName: { type: String, required: true, trim: true },
  studentMobile: { type: String, required: true, trim: true },
  answers: {
    type: Map,
    of: String,
    default: {},
  },
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  durationUsedSeconds: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'submitted'], default: 'in_progress' },
});

module.exports = mongoose.model('Attempt', attemptSchema);
