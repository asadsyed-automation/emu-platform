import express from 'express';
import {
  getLectures,
  getCourseLectureSchedule,
  updateLectureDateAndTopic,
  generateSemesterLectures,
} from '../controllers/lectureController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getLectures);
router.get('/course-schedule/:courseId', getCourseLectureSchedule);
router.patch('/:lectureId/schedule', requireRole('teacher', 'owner'), updateLectureDateAndTopic);
router.post('/generate-semester', requireRole('owner'), generateSemesterLectures);

export default router;
