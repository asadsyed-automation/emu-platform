import express from 'express';
import { bulkCreateStudents, createTeacher, listUsers } from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication + owner role
router.use(protect, requireRole('owner'));

router.post('/bulk-create-students', bulkCreateStudents);
router.post('/create-teacher', createTeacher);
router.get('/users', listUsers);

export default router;
