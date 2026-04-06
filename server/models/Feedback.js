import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scores: {
    clarity:    { type: Number, min: 0, max: 10, default: 0 },
    relevance:  { type: Number, min: 0, max: 10, default: 0 },
    structure:  { type: Number, min: 0, max: 10, default: 0 },
    confidence: { type: Number, min: 0, max: 10, default: 0 },
  },
  fillerWordCount: {
    type: Number,
    default: 0,
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  modelAnswer: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;

// Ready for: mongoose.connect() to persist data
