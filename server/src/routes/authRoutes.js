import express from 'express';
import {
  login,
  verifyStep1,
  verifyStep2Email,
  verifyStep3Otp,
  sendOtp,
  verifyOtp,
  getMe,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Direct Login & Password Change
router.post('/login', login);
router.post('/change-password', protect, changePassword);

// Legacy Multi-Step
router.post('/verify-step1', verifyStep1);
router.post('/verify-step2-email', verifyStep2Email);
router.post('/verify-step3-otp', verifyStep3Otp);
router.post('/send-otp', protect, sendOtp);
router.post('/verify-otp', protect, verifyOtp);
router.get('/me', protect, getMe);

export default router;
