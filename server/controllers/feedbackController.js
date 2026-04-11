import Feedback from '../models/Feedback.js';
import Session from '../models/Session.js';
import { analyseAnswer } from '../services/groqService.js';

/**
 * POST /api/feedback
 * Create feedback for a session by analyzing the answers with AI.
 */
export const createFeedback = async (req, res) => {
  try {
    const { sessionId, answers, snapshots } = req.body;

    if (!sessionId || !answers) {
      return res.status(400).json({ message: 'Session ID and answers are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Save the answers to the session
    session.answers = answers;
    await session.save();

    // Combine all questions and answers into a transcript
    let transcript = '';
    for (let i = 0; i < session.questions.length; i++) {
      const ans = answers[i] && answers[i].trim().length > 0 ? answers[i] : '[NO ANSWER PROVIDED BY CANDIDATE / SKIPPED]';
      transcript += `Q: ${session.questions[i]}\nA: ${ans}\n\n`;
    }

    const analysis = await analyseAnswer(transcript, snapshots);

    const feedback = await Feedback.create({
      sessionId,
      userId: req.user.userId,
      scores: {
        clarity: analysis.clarity,
        relevance: analysis.relevance,
        structure: analysis.structure,
        confidence: analysis.confidence,
      },
      fillerWordCount: analysis.fillerWordCount,
      fillerWordsList: analysis.fillerWordsList,
      overallScore: analysis.overallScore,
      feedback: analysis.feedback,
      starFeedback: analysis.starFeedback, // new field
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

/**
 * GET /api/feedback/stats
 * Return aggregated feedback stats for readiness score.
 */
export const getFeedbackStats = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.userId }).sort({ createdAt: 1 });
    if (!feedbacks.length) {
      return res.status(200).json({ averageScore: 0, trend: [] });
    }

    const trend = feedbacks.map(f => f.overallScore);
    const averageScore = Math.round(trend.reduce((a, b) => a + b, 0) / trend.length);

    res.status(200).json({ averageScore, trend });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback stats' });
  }
};

/**
 * POST /api/feedback/single
 * Target Rep Practice: Analyze a single question and answer.
 */
export const analyzeSingleAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const transcript = `Q: ${question}\nA: ${answer}\n\n`;
    const analysis = await analyseAnswer(transcript);

    res.status(200).json({ analysis });
  } catch (err) {
    console.error('analyzeSingleAnswer error:', err);
    res.status(500).json({ message: 'Error analyzing answer' });
  }
};
