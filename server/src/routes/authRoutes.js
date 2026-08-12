import express from 'express';
import { login, sendOtp, verifyOtp, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/send-otp', protect, sendOtp);
router.post('/verify-otp', protect, verifyOtp);
router.get('/me', protect, getMe);

export default router;
