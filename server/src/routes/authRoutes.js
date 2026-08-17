import express from 'express';
import {
  login,
  verifyStep1,
  verifyStep2Email,
  verifyStep3Otp,
  sendOtp,
  verifyOtp,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 3-Step Login Flow
router.post('/verify-step1', verifyStep1);
router.post('/verify-step2-email', verifyStep2Email);
router.post('/verify-step3-otp', verifyStep3Otp);

// Direct / Legacy endpoints
router.post('/login', login);
router.post('/send-otp', protect, sendOtp);
router.post('/verify-otp', protect, verifyOtp);
router.get('/me', protect, getMe);

export default router;
