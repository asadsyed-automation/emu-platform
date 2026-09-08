import express from 'express';
import {
  bulkCreateStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  resetStudentPassword,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  listUsers,
  createCourse,
  updateCourse,
  deleteCourse,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  resetDefaultTimetable,
  syncLectures,
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication + owner role
router.use(protect, requireRole('owner'));

// Student management
router.post('/bulk-create-students', bulkCreateStudents);
router.post('/create-student', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.post('/students/:id/reset-password', resetStudentPassword);

// Teacher management
router.post('/create-teacher', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Users query
router.get('/users', listUsers);

// Course management
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Timetable management
router.post('/timetable-slots', createTimetableSlot);
router.put('/timetable-slots/:id', updateTimetableSlot);
router.delete('/timetable-slots/:id', deleteTimetableSlot);
router.post('/timetable-slots/reset-default', resetDefaultTimetable);

// Sync lectures
router.post('/sync-lectures', syncLectures);

export default router;
