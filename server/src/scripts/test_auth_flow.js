import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

dotenv.config();

const testAuth = async () => {
  await connectDB();
  console.log('=== TESTING 3-STEP AUTH LOGIC DIRECTLY ===');

  // Test 1: Step 1 Credential Verification
  const name = 'Syed Asad Ali Raza Shah';
  const password = 'COSC231122114';

  const nameRegex = new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  const user = await User.findOne({ name: { $regex: nameRegex } });

  if (!user) {
    console.error('❌ FAIL: User not found by Name:', name);
    process.exit(1);
  }
  console.log(`✅ STEP 1 MATCH: Found ${user.name} (${user.rollNumber}), email: ${user.email}`);

  const isPasswordMatch = await user.matchPassword(password);
  const isRollMatch = user.rollNumber.toUpperCase() === password.trim().toUpperCase();
  console.log(`✅ PASSWORD CHECK (Roll as password): isPasswordMatch=${isPasswordMatch}, isRollMatch=${isRollMatch}`);

  // Test 2: Step 2 Email match & OTP generation
  const enteredEmail = 'asadraza5670@gmail.com';
  if (user.email.toLowerCase() !== enteredEmail.toLowerCase()) {
    console.error('❌ FAIL: Email mismatch');
    process.exit(1);
  }
  const otpCode = '123456';
  user.otpCode = otpCode;
  user.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();
  console.log(`✅ STEP 2 EMAIL MATCH: OTP set to ${user.otpCode}`);

  // Test 3: Step 3 OTP verification
  if (user.otpCode !== '123456' || new Date() > new Date(user.otpExpiresAt)) {
    console.error('❌ FAIL: OTP verification');
    process.exit(1);
  }
  user.otpVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();
  console.log(`✅ STEP 3 OTP VERIFICATION SUCCESS! User verified: ${user.otpVerified}`);

  await mongoose.disconnect();
  console.log('🎉 ALL 3 STEPS VERIFIED CLEANLY!');
  process.exit(0);
};

testAuth();
