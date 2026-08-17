import express from 'express';
import {
  getAllAcademicEvents,
  getExamCountdown,
  createAcademicEvent,
  deleteAcademicEvent,
} from '../controllers/academicEventController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public / Authenticated read routes
router.get('/', protect, getAllAcademicEvents);
router.get('/countdown', protect, getExamCountdown);

// Admin-only management routes
router.post('/', protect, requireRole('owner'), createAcademicEvent);
router.delete('/:id', protect, requireRole('owner'), deleteAcademicEvent);

export default router;
