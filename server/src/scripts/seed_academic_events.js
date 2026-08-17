import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AcademicEvent } from '../models/AcademicEvent.js';
import { Course } from '../models/Course.js';
import { User } from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const seedAcademicEvents = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Fetch courses and admin user
    const courses = await Course.find();
    const admin = await User.findOne({ role: 'owner' });

    if (courses.length === 0) {
      console.log('❌ No courses found to seed datesheet.');
      process.exit(1);
    }

    // Clear existing academic events
    await AcademicEvent.deleteMany({});
    console.log('🧹 Cleared existing academic events.');

    // 1. Mid-Term Examination Event (Starting in ~12 days from today)
    const today = new Date();
    const midStart = new Date(today);
    midStart.setDate(today.getDate() + 12);
    const midEnd = new Date(midStart);
    midEnd.setDate(midStart.getDate() + 8);

    const examDatesheet = courses.map((course, idx) => {
      const examDate = new Date(midStart);
      examDate.setDate(midStart.getDate() + (idx * 1) + (idx > 2 ? 2 : 0)); // alternate dates with gap
      return {
        courseId: course._id,
        date: examDate,
        timeSlot: idx % 2 === 0 ? '02:00 PM - 04:30 PM' : '05:00 PM - 07:30 PM',
        room: 'BOT-B1-F-102 (Evening Wing)',
        instructor: course.teacherName || 'Assigned Course Faculty',
      };
    });

    const midTermEvent = new AcademicEvent({
      title: 'Official Mid-Term Examinations Fall 2026',
      type: 'mid-term',
      startDate: midStart,
      endDate: midEnd,
      description: 'Official centralized Mid-Semester examinations conducted under HOD supervision. Roll slips & university photo ID required in examination rooms.',
      skipLectures: true,
      examDatesheet,
      createdBy: admin?._id,
    });

    await midTermEvent.save();
    console.log(`✅ Seeded Mid-Term Event: ${midTermEvent.title} (Starts in 12 days, ${examDatesheet.length} papers mapped)`);

    // 2. Winter Vacation / Semester Break (Starting in ~50 days)
    const winterStart = new Date(today);
    winterStart.setDate(today.getDate() + 50);
    const winterEnd = new Date(winterStart);
    winterEnd.setDate(winterStart.getDate() + 10);

    const winterVacation = new AcademicEvent({
      title: 'Annual Gazetted Winter Recess & Semester Break',
      type: 'vacation',
      startDate: winterStart,
      endDate: winterEnd,
      description: 'University closed for annual winter holidays. Academic activities and lectures will resume as per spring timetable.',
      skipLectures: true,
      examDatesheet: [],
      createdBy: admin?._id,
    });

    await winterVacation.save();
    console.log(`✅ Seeded Vacation Event: ${winterVacation.title}`);

    console.log('🎉 Academic Events seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedAcademicEvents();
