import Feedback from '../models/Feedback.js';
import Session from '../models/Session.js';
import { analyseAnswer } from '../services/claudeService.js';

/**
 * POST /api/feedback
 * Create feedback for a session by analyzing the answers with AI.
 */
export const createFeedback = async (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    if (!sessionId || !answers) {
      return res.status(400).json({ message: 'Session ID and answers are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Save the answers to the session
    session.answers = answers;
    await session.save();

    // For simplicity, we analyze the last answer or provide a general analysis.
    // In a real app, we'd analyze each answer.
    const lastQuestion = session.questions[session.questions.length - 1];
    const lastAnswer = answers[answers.length - 1];

    const analysis = await analyseAnswer(lastQuestion, lastAnswer);

    const feedback = await Feedback.create({
      sessionId,
      userId: req.user.userId,
      scores: {
        clarity: analysis.clarity,
        relevance: analysis.relevance,
        structure: analysis.structure,
        confidence: analysis.confidence,
      },
      fillerWordCount: analysis.fillerWords,
      overallScore: analysis.overallScore,
      feedback: analysis.feedback,
      modelAnswer: analysis.modelAnswer,
    });

    res.status(201).json({ message: 'Feedback generated successfully', feedback });
  } catch (err) {
    console.error('Feedback creation error:', err);
    res.status(500).json({ message: 'Error generating feedback' });
  }
};

/**
 * GET /api/feedback/:sessionId
 * Return feedback for a given session.
 */
export const getFeedbackBySession = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      sessionId: req.params.sessionId,
      userId: req.user.userId,
    });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.status(200).json({ feedback });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};
