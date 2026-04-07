import Session from '../models/Session.js';
import { generateQuestions } from '../services/claudeService.js';

/**
 * GET /api/sessions
 * Return all sessions for the authenticated user.
 */
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

/**
 * POST /api/sessions
 * Create a new interview session and generate AI questions.
 */
export const createSession = async (req, res) => {
  try {
    const { role, level, interviewType } = req.body;

    if (!role || !level || !interviewType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate real or mock questions via Claude service
    const { questions } = await generateQuestions(role, level, interviewType);

    const session = await Session.create({
      userId: req.user.userId,
      role,
      level,
      interviewType,
      questions,
    });

    res.status(201).json({ message: 'Session created successfully', session });
  } catch (err) {
    console.error('Session creation error:', err);
    res.status(500).json({ message: 'Error creating session' });
  }
};

/**
 * GET /api/sessions/:id
 * Return a single session by ID.
 */
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ session });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching session' });
  }
};
