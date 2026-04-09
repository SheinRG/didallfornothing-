import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 60,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  targetRoles: {
    type: [String],
    default: [],
  },
  resumeData: {
    rawText: { type: String, default: null },
    name: { type: String, default: null },
    detectedRole: { type: String, default: null },
    skills: { type: [String], default: [] },
    experienceLevel: { type: String, default: null },
    projects: { type: [String], default: [] },
    summary: { type: String, default: null },
    uploadedAt: { type: Date, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;

// Ready for: mongoose.connect() to persist data
