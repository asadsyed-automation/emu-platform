import express from 'express';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { requireAuth, requireTeacherOrOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getAnnouncements);
router.post('/', requireAuth, requireTeacherOrOwner, createAnnouncement);
router.delete('/:id', requireAuth, requireTeacherOrOwner, deleteAnnouncement);

export default router;
