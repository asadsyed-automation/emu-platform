import express from 'express';
import {
  submitDriveUrl,
  getStudentSubmissions,
  getAssessmentSubmissionMatrix,
  gradeSubmission,
} from '../controllers/submissionController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/submit', requireRole('student'), submitDriveUrl);
router.get('/my-submissions', requireRole('student'), getStudentSubmissions);
router.get('/assessment/:id', requireRole('teacher', 'owner'), getAssessmentSubmissionMatrix);
router.patch('/grade/:id', requireRole('teacher', 'owner'), gradeSubmission);

export default router;
