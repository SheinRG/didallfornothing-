import { Router } from 'express';
import protect from '../middleware/auth.js';
import { getSessions, createSession, getSessionById } from '../controllers/sessionController.js';

const router = Router();

router.use(protect); // all session routes are protected

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:id', getSessionById);

export default router;

// Ready for: no further connections needed
