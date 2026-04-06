// TODO: Import Session model when mongoose is connected
// import Session from '../models/Session.js';

/**
 * GET /api/sessions
 * Return all sessions for the authenticated user.
 */
export const getSessions = async (req, res) => {
  // TODO: const sessions = await Session.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.status(200).json({ sessions: [] });
};

/**
 * POST /api/sessions
 * Create a new interview session.
 */
export const createSession = async (req, res) => {
  // TODO: const session = await Session.create({ userId: req.user.userId, ...req.body });
  res.status(201).json({ message: 'Session created', session: {} });
};

/**
 * GET /api/sessions/:id
 * Return a single session by ID.
 */
export const getSessionById = async (req, res) => {
  // TODO: const session = await Session.findById(req.params.id);
  // if (!session) return res.status(404).json({ message: 'Session not found' });
  res.status(200).json({ session: {} });
};

// Ready for: real Session model DB operations
