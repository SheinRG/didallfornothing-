import { Router } from 'express';
import protect from '../middleware/auth.js';
import { getSessions, createSession, getSessionById, getHint, getFollowUp, deleteSession } from '../controllers/sessionController.js';

const router = Router();

router.use(protect); // all session routes are protected

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:id', getSessionById);
router.post('/:id/hint', getHint);
router.post('/:id/followup', getFollowUp);
router.delete('/:id', deleteSession);

export default router;

// Ready for: no further connections needed
