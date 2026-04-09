import { Router } from 'express';
import protect from '../middleware/auth.js';
import { feedbackLimiter } from '../middleware/rateLimiter.js';
import { createFeedback, getFeedbackBySession, getFeedbackStats } from '../controllers/feedbackController.js';

const router = Router();

router.use(protect); // all feedback routes are protected

router.post('/', feedbackLimiter, createFeedback);
router.get('/stats', getFeedbackStats);
router.get('/:sessionId', getFeedbackBySession);

export default router;

// Ready for: no further connections needed
