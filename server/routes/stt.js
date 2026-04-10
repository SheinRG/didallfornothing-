import { Router } from 'express';
import multer from 'multer';
import { handleSTT } from '../controllers/sttController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint: POST /api/stt
router.post('/', upload.single('audio'), handleSTT);

export default router;
