import express from 'express';
import {
  raiseDispute,
  getMyDisputes,
  getPeerBallots,
  castPeerVote,
  getCourseDisputes,
  resolveDisputeByTeacher,
} from '../controllers/disputeController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Student Routes
router.post('/raise', requireRole('student'), raiseDispute);
router.get('/my-disputes', requireRole('student'), getMyDisputes);
router.get('/peer-ballots', requireRole('student'), getPeerBallots);
router.post('/vote/:disputeId', requireRole('student'), castPeerVote);

// Teacher & Owner Routes
router.get('/course/:courseId', requireRole('teacher', 'owner'), getCourseDisputes);
router.patch('/resolve/:disputeId', requireRole('teacher', 'owner'), resolveDisputeByTeacher);

export default router;
