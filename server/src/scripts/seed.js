import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';

dotenv.config();

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ Cannot seed without MONGODB_URI in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for Seeding...');

    // Clear existing data for fresh seed (optional in dev)
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('🧹 Cleared existing users, courses, enrollments.');

    const defaultPassword = 'Password123!';
    const passwordHash = await User.hashPassword(defaultPassword);

    // 1. Create Owner Account (Shah G)
    const owner = await User.create({
      rollNumber: 'OWNER-01',
      name: 'Asad Syed (Shah G)',
      email: 'owner@emerson.edu.pk',
      passwordHash,
      role: 'owner',
      otpVerified: true,
    });
    console.log(`👤 Owner Created: ${owner.email} | Roll: ${owner.rollNumber} | Pass: ${defaultPassword}`);

    // 2. Create Sample Teacher Account
    const teacher = await User.create({
      rollNumber: 'TCH-CS01',
      name: 'Dr. Muhammad Imran',
      email: 'teacher@emerson.edu.pk',
      passwordHash,
      role: 'teacher',
      otpVerified: true,
    });
    console.log(`👨‍🏫 Teacher Created: ${teacher.email} | Roll: ${teacher.rollNumber} | Pass: ${defaultPassword}`);

    // 3. Create Sample Course
    const course = await Course.create({
      title: 'Advanced Web Engineering',
      code: 'CS-701',
      teacherId: teacher._id,
      semesterLabel: 'Fall 2026',
    });
    console.log(`📚 Course Created: ${course.code} - ${course.title}`);

    // 4. Create Sample Students
    const studentsData = [
      { rollNumber: '21-BSCS-01', name: 'Ali Raza', email: 'ali.21bscs01@emerson.edu.pk' },
      { rollNumber: '21-BSCS-02', name: 'Fatima Zahra', email: 'fatima.21bscs02@emerson.edu.pk' },
      { rollNumber: '21-BSCS-03', name: 'Usman Ghani', email: 'usman.21bscs03@emerson.edu.pk' },
    ];

    for (const studentInfo of studentsData) {
      const student = await User.create({
        ...studentInfo,
        passwordHash,
        role: 'student',
        otpVerified: false, // OTP required on first login!
      });

      // Enroll student in course
      await Enrollment.create({
        studentId: student._id,
        courseId: course._id,
      });

      console.log(`🎓 Student Created: ${student.rollNumber} (${student.name}) | OTP Verified: false`);
    }

    console.log('\n✨ Database Seeding Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log(`Owner Login:   OWNER-01 / Password123!`);
    console.log(`Teacher Login: TCH-CS01 / Password123!`);
    console.log(`Student Login: 21-BSCS-01 / Password123! (Will trigger OTP)`);
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
