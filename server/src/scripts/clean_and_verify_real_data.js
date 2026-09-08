import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { TimetableSlot } from '../models/TimetableSlot.js';
import { Lecture } from '../models/Lecture.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { AttendanceDispute } from '../models/AttendanceDispute.js';
import { AssignmentQuiz } from '../models/AssignmentQuiz.js';
import { Submission } from '../models/Submission.js';

dotenv.config();

const cleanAndSyncData = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to MongoDB Atlas.');

    // 1. Purge all dummy attendance, disputes, assessments, and submissions
    const deletedAttendance = await AttendanceRecord.deleteMany({});
    const deletedDisputes = await AttendanceDispute.deleteMany({});
    const deletedAssessments = await AssignmentQuiz.deleteMany({});
    const deletedSubmissions = await Submission.deleteMany({});
    console.log(`🧹 Cleaned Dummy Data:
    - ${deletedAttendance.deletedCount} Attendance records removed
    - ${deletedDisputes.deletedCount} Disputes removed
    - ${deletedAssessments.deletedCount} Assessments removed
    - ${deletedSubmissions.deletedCount} Submissions removed`);

    // 2. Ensure all users have otpVerified = true so OTP is completely skipped
    await User.updateMany({}, {
      otpVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    });
    console.log('✅ Unlocked all user accounts (OTP verification requirement disabled for instant 1-step sign-in).');

    // 3. Clear existing lectures and regenerate fresh 16-week scheduled lectures starting Monday, 07 September 2026
    await Lecture.deleteMany({});
    console.log('🔄 Cleared old lectures to align with official start date (07 September 2026).');

    const slots = await TimetableSlot.find({ courseId: { $ne: null } });
    console.log(`📅 Found ${slots.length} active course timetable slots.`);

    const startDate = new Date('2026-09-07');
    const endDate = new Date('2026-12-25');
    const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const lectureDocs = [];
    const curDate = new Date(startDate);
    curDate.setHours(0, 0, 0, 0);

    while (curDate <= endDate) {
      const dayName = dayNameMap[curDate.getDay()];
      const matchingSlots = slots.filter((s) => s.dayOfWeek === dayName);

      for (const slot of matchingSlots) {
        lectureDocs.push({
          courseId: slot.courseId,
          timetableSlotId: slot._id,
          date: new Date(curDate),
          status: 'scheduled',
        });
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    const insertedLectures = await Lecture.insertMany(lectureDocs);
    console.log(`⏱️ Generated ${insertedLectures.length} fresh scheduled lecture instances from 07 Sep 2026 to 25 Dec 2026.`);

    // 4. Fetch all user accounts and output full credentials list
    const students = await User.find({ role: 'student' }).sort({ rollNumber: 1 });
    const teachers = await User.find({ role: 'teacher' }).sort({ name: 1 });
    const owners = await User.find({ role: 'owner' }).sort({ name: 1 });

    console.log('\n================================================================================');
    console.log('📋 OFFICIAL CREDENTIALS DIRECTORY (BSCS 7th Semester Section 7A)');
    console.log('================================================================================');
    console.log('Role    | Roll / ID       | Full Name                      | Default Password | Email');
    console.log('--------|-----------------|--------------------------------|------------------|----------------------------------');
    
    owners.forEach((o) => {
      console.log(`ADMIN   | ${o.rollNumber.padEnd(15)} | ${o.name.padEnd(30)} | ${o.rollNumber.padEnd(16)} | ${o.email}`);
    });

    teachers.forEach((t) => {
      console.log(`FACULTY | ${t.rollNumber.padEnd(15)} | ${t.name.padEnd(30)} | ${t.rollNumber.padEnd(16)} | ${t.email}`);
    });

    students.forEach((s) => {
      console.log(`STUDENT | ${s.rollNumber.padEnd(15)} | ${s.name.padEnd(30)} | ${s.rollNumber.padEnd(16)} | ${s.email}`);
    });

    console.log('================================================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Clean & Sync Error:', error);
    process.exit(1);
  }
};

cleanAndSyncData();
