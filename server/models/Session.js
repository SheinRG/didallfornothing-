import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['swe', 'pm', 'design', 'marketing'],
    required: true,
  },
  level: {
    type: String,
    enum: ['intern', 'junior', 'mid', 'senior'],
    required: true,
  },
  jobDescription: {
    type: String,
    default: '',
  },
  interviewType: {
    type: String,
    enum: ['behavioral', 'technical', 'case-study'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
  questions: {
    type: [String],
    default: [],
  },
  isAiGenerated: {
    type: Boolean,
    default: false,
  },
  isResumeTailored: {
    type: Boolean,
    default: false,
  },
  answers: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;

// Ready for: mongoose.connect() to persist data
