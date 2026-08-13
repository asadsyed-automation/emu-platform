import express from 'express';
import { getLectures, generateSemesterLectures } from '../controllers/lectureController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getLectures);
router.post('/generate-semester', requireRole('owner'), generateSemesterLectures);

export default router;
