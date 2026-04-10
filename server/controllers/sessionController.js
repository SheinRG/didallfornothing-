import Session from '../models/Session.js';
import User from '../models/User.js';
import { generateQuestions, generateHint, generateFollowUp } from '../services/groqService.js';

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
 * If the user has uploaded a resume, questions are personalized.
 */
export const createSession = async (req, res) => {
  try {
    const { role, level, interviewType, difficulty, jobDescription } = req.body;

    if (!role || !level || !interviewType || !difficulty) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user has resume data for personalized questions
    const user = await User.findById(req.user.userId).select('resumeData');
    const resumeContext = user?.resumeData?.uploadedAt ? user.resumeData : null;

    // Generate real or mock questions via Groq service
    const { questions, isAiGenerated, isResumeTailored } = await generateQuestions(
      role,
      level,
      interviewType,
      resumeContext,
      jobDescription,
      difficulty
    );

    const session = await Session.create({
      userId: req.user.userId,
      role,
      level,
      interviewType,
      difficulty,
      questions,
      isAiGenerated,
      isResumeTailored,
      jobDescription,
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

/**
 * POST /api/sessions/:id/hint
 * Retrieve a hint for a specific question.
 */
export const getHint = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    const hint = await generateHint(question);
    res.status(200).json({ hint });
  } catch (err) {
    res.status(500).json({ message: 'Error generating hint' });
  }
};

/**
 * POST /api/sessions/:id/followup
 * Generate and save a follow-up question based on the previous answer.
 */
export const getFollowUp = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }
    
    const followup = await generateFollowUp(question, answer);
    
    // Let's persist it to the session question array so feedback analysis sees it
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.userId });
    if (session) {
      session.questions.push(followup);
      await session.save();
    }

    res.status(200).json({ followup });
  } catch (err) {
    res.status(500).json({ message: 'Error generating follow-up' });
  }
};
