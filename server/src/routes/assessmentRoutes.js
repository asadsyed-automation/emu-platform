import express from 'express';
import { createAssessment, getCourseAssessments } from '../controllers/assessmentController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getCourseAssessments);
router.post('/', requireRole('teacher', 'owner'), createAssessment);

export default router;
