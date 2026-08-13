import express from 'express';
import { getWeeklyTimetable } from '../controllers/timetableController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWeeklyTimetable);

export default router;
