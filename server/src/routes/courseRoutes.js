import express from 'express';
import { getCourses, getCourseById } from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getCourses);
router.get('/:id', getCourseById);

export default router;
