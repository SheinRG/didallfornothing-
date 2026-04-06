// TODO: Import Feedback model when mongoose is connected
// import Feedback from '../models/Feedback.js';

/**
 * POST /api/feedback
 * Create feedback for a session.
 */
export const createFeedback = async (req, res) => {
  // TODO: const feedback = await Feedback.create({ userId: req.user.userId, ...req.body });
  res.status(201).json({ message: 'Feedback created', feedback: {} });
};

/**
 * GET /api/feedback/:sessionId
 * Return feedback for a given session.
 */
export const getFeedbackBySession = async (req, res) => {
  // TODO: const feedback = await Feedback.findOne({ sessionId: req.params.sessionId });
  // if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
  res.status(200).json({ feedback: {} });
};

// Ready for: real Feedback model DB operations
