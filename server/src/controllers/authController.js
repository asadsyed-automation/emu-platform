import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendOtpEmail } from '../utils/resend.js';

// Helper to mask email address (e.g. asadraza5670@gmail.com -> a***a@gmail.com)
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
};

/**
 * @desc Step 1: Verify Name + Password (roll number)
 * @route POST /api/v1/auth/verify-step1
 */
export const verifyStep1 = async (req, res) => {
  try {
    const { name, password } = req.body;
    const trimmedName = (name || '').trim();
    const trimmedPass = (password || '').trim();

    if (!trimmedName || !trimmedPass) {
      return res.status(400).json({ message: 'Please provide both your Name and Password (Roll Number).' });
    }

    // Match by exact Name, Roll Number, Email, or partial name match
    const escapedInput = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactRegex = new RegExp(`^${escapedInput}$`, 'i');
    const partialRegex = new RegExp(escapedInput, 'i');

    let user = await User.findOne({
      $or: [
        { name: { $regex: exactRegex } },
        { rollNumber: trimmedName.toUpperCase() },
        { email: trimmedName.toLowerCase() },
      ],
    });

    if (!user) {
      // Fallback: partial name match (e.g. "Syed Asad Ali Raza" matching "Syed Asad Ali Raza Shah")
      user = await User.findOne({ name: { $regex: partialRegex } });
    }

    if (!user) {
      return res.status(401).json({
        message: `Account not found for name "${trimmedName}". Please enter your full name exactly as listed on the class roll.`,
      });
    }

    // Match password: matchPassword (bcrypt) OR direct rollNumber match
    const isPasswordMatch = await user.matchPassword(trimmedPass);
    const isRollMatch = user.rollNumber.toUpperCase() === trimmedPass.toUpperCase();

    if (!isPasswordMatch && !isRollMatch) {
      return res.status(401).json({
        message: 'Invalid credentials. Please enter your valid Roll Number as password.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Credentials verified. Please confirm your registered email.',
      userId: user._id,
      name: user.name,
      rollNumber: user.rollNumber,
      email: user.email,
      maskedEmail: maskEmail(user.email),
      role: user.role,
      otpVerified: user.otpVerified,
      user: {
        id: user._id,
        userId: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        email: user.email,
        maskedEmail: maskEmail(user.email),
        role: user.role,
        otpVerified: user.otpVerified,
      },
    });
  } catch (error) {
    console.error('Verify Step 1 Error:', error);
    return res.status(500).json({ message: 'Server error verifying credentials.', error: error.message });
  }
};

/**
 * @desc Step 2: Prompt for registered email -> verify match -> send OTP
 * @route POST /api/v1/auth/verify-step2-email
 */
export const verifyStep2Email = async (req, res) => {
  try {
    const { userId, email } = req.body;
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!userId || !trimmedEmail) {
      return res.status(400).json({ message: 'User ID and registered email are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    // Verify email matches the user's pre-registered record
    if (user.email.toLowerCase() !== trimmedEmail) {
      return res.status(400).json({
        message: `Email "${trimmedEmail}" does not match the registered email on record (${maskEmail(user.email)}).`,
      });
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save();

    await sendOtpEmail({
      toEmail: user.email,
      studentName: user.name,
      otpCode,
    });

    return res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}`,
      emailSentTo: user.email,
    });
  } catch (error) {
    console.error('Verify Step 2 Error:', error);
    return res.status(500).json({ message: 'Server error sending verification OTP.', error: error.message });
  }
};

/**
 * @desc Step 3: Enter OTP -> grant token & access
 * @route POST /api/v1/auth/verify-step3-otp
 */
export const verifyStep3Otp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const trimmedOtp = (otp || '').trim();

    if (!userId || !trimmedOtp) {
      return res.status(400).json({ message: 'User ID and 6-digit OTP code are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No active OTP request found. Please request a new OTP.' });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ message: 'Verification OTP has expired. Please request a new code.' });
    }

    if (user.otpCode.trim() !== trimmedOtp) {
      return res.status(400).json({ message: 'Invalid verification code. Please check and try again.' });
    }

    // Mark user verified and clear temporary OTP
    user.otpVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully! Welcome to EMU Platform.',
      token,
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
    console.error('Verify Step 3 Error:', error);
    return res.status(500).json({ message: 'Server error verifying OTP.', error: error.message });
  }
};

/**
 * @desc Direct Authenticate user (fallback / programmatic login)
 * @route POST /api/v1/auth/login
 */
export const login = async (req, res) => {
  try {
    const { name, rollNumber, email, password } = req.body;
    const identifier = (name || rollNumber || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide Name / Roll Number and password.' });
    }

    const escapedInput = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactRegex = new RegExp(`^${escapedInput}$`, 'i');
    const partialRegex = new RegExp(escapedInput, 'i');

    let user = await User.findOne({
      $or: [
        { name: { $regex: exactRegex } },
        { rollNumber: identifier.toUpperCase() },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      user = await User.findOne({ name: { $regex: partialRegex } });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = (await user.matchPassword(password)) || user.rollNumber.toUpperCase() === password.trim().toUpperCase();
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    // For direct / demo login, mark OTP verified so dashboard is instantly unlocked
    if (!user.otpVerified) {
      user.otpVerified = true;
      user.otpCode = null;
      user.otpExpiresAt = null;
      await user.save();
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      message: 'Login successful',
      token,
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
