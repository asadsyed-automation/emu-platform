import express from 'express';
import {
  openLectureAttendance,
  markBulkAttendance,
  getLectureAttendance,
  getStudentSummary,
  getCourseAttendanceSummary,
  updateAttendanceRecord,
} from '../controllers/attendanceController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Student Endpoint
router.get('/student/my-summary', getStudentSummary);

// Teacher & Owner Endpoints
router.post('/open-lecture/:lectureId', requireRole('teacher', 'owner'), openLectureAttendance);
router.post('/mark/:lectureId', requireRole('teacher', 'owner'), markBulkAttendance);
router.get('/lecture/:lectureId', requireRole('teacher', 'owner'), getLectureAttendance);
router.get('/course/:courseId/summary', requireRole('teacher', 'owner'), getCourseAttendanceSummary);
router.patch('/update-record/:recordId', requireRole('teacher', 'owner'), updateAttendanceRecord);

export default router;
