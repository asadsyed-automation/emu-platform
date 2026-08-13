import express from 'express';
import { getAttendanceRegisterReport, getSubmissionMatrixReport } from '../controllers/reportController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/attendance-register', requireRole('teacher', 'owner'), getAttendanceRegisterReport);
router.get('/submission-matrix', requireRole('teacher', 'owner'), getSubmissionMatrixReport);

export default router;
