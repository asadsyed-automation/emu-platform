import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendOtpEmail } from '../utils/resend.js';

/**
 * @desc Authenticate user with rollNumber (or email) & password
 * @route POST /api/v1/auth/login
 */
export const login = async (req, res) => {
  try {
    const { rollNumber, email, password } = req.body;
    const identifier = (rollNumber || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide roll number / email and password.' });
    }

    // Find user by rollNumber (uppercase) or email (lowercase)
    const user = await User.findOne({
      $or: [
        { rollNumber: identifier.toUpperCase() },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user._id, user.role);

    // If OTP is not verified yet, auto-trigger sending OTP code
    if (!user.otpVerified) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otpCode;
      user.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      await user.save();

      await sendOtpEmail({
        toEmail: user.email,
        studentName: user.name,
        otpCode,
      });
    }

    return res.status(200).json({
      message: user.otpVerified ? 'Login successful' : 'Login successful. OTP verification required.',
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        role: user.role,
        otpVerified: user.otpVerified,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

/**
 * @desc Request a new OTP email
 * @route POST /api/v1/auth/send-otp
 */
export const sendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry
    await user.save();

    await sendOtpEmail({
      toEmail: user.email,
      studentName: user.name,
      otpCode,
    });

    return res.status(200).json({
      message: `OTP code sent to ${user.email}`,
      emailSentTo: user.email,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ message: 'Server error sending OTP.', error: error.message });
  }
};

/**
 * @desc Verify OTP code submitted by user
 * @route POST /api/v1/auth/verify-otp
 */
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: 'OTP code is required.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.otpVerified) {
      return res.status(200).json({
        message: 'Account is already verified.',
        user: {
          id: user._id,
          name: user.name,
          rollNumber: user.rollNumber,
          email: user.email,
          role: user.role,
          otpVerified: true,
        },
      });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No active OTP request found. Please request a new OTP.' });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new OTP.' });
    }

    if (user.otpCode.trim() !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check and try again.' });
    }

    // Mark user as verified
    user.otpVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      message: 'OTP verified successfully! Account is now active.',
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        role: user.role,
        otpVerified: true,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ message: 'Server error verifying OTP.', error: error.message });
  }
};

/**
 * @desc Get current authenticated user details
 * @route GET /api/v1/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash -otpCode');
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};
