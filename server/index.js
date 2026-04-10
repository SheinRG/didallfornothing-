import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import feedbackRoutes from './routes/feedback.js';
import ttsRoutes from './routes/tts.js';
import resumeRoutes from './routes/resume.js';
import sttRoutes from './routes/stt.js';

import mongoose from 'mongoose';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// ── Database ────────────────────────────────────────────
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('📁 Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ── Security ────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ── Parsers ─────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/stt', sttRoutes);

// ── Health check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('API Key loaded successfully!');
});
