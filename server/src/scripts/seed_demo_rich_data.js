import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Lecture } from '../models/Lecture.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { TimetableSlot } from '../models/TimetableSlot.js';
import { AssignmentQuiz } from '../models/AssignmentQuiz.js';
import { Submission } from '../models/Submission.js';
import { AttendanceDispute } from '../models/AttendanceDispute.js';
import { Enrollment } from '../models/Enrollment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedRichDemoData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    // 1. Fetch Students
    const targetStudents = await User.find({
      $or: [
        { rollNumber: 'COSC231122114' },
        { rollNumber: 'DEMO-STD-01' },
      ],
    });

    const faculty = await User.findOne({ role: 'teacher' }) || await User.findOne({ role: 'owner' });
    const courses = await Course.find();

    console.log(`Found ${targetStudents.length} target students and ${courses.length} courses.`);

    // 2. Enroll target students in all 6 courses
    for (const student of targetStudents) {
      for (const course of courses) {
        await Enrollment.findOneAndUpdate(
          { courseId: course._id, studentId: student._id },
          { courseId: course._id, studentId: student._id, status: 'enrolled' },
          { upsert: true, new: true }
        );
      }
    }
    console.log('✅ Enrollments verified.');

    // 3. Ensure Timetable Slots exist for all courses
    const dayMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slotMap = {};
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      let slot = await TimetableSlot.findOne({ courseId: course._id });
      if (!slot) {
        slot = await TimetableSlot.create({
          courseId: course._id,
          dayOfWeek: dayMap[i % dayMap.length],
          startTime: '14:00',
          endTime: '15:30',
          room: 'BOT-B1-F-102',
        });
      }
      slotMap[course._id.toString()] = slot;
    }
    console.log('✅ Timetable slots ensured.');

    // 4. Create 15 lectures and realistic attendance for each course
    const attendancePatterns = {
      'COSE-4149': [true, true, true, true, true, true, false, true, true, true, true, true, true, true, true], // 93.3%
      'COSE-3133': [true, true, false, true, true, true, true, true, false, true, true, true, true, true, true], // 86.7%
      'MATH-3181': [true, false, true, false, true, false, true, false, true, false, true, true, false, true, false], // 60.0% (At Risk!)
      'COSE-3136': [true, true, true, false, true, true, true, false, true, true, true, false, true, true, true], // 80.0%
      'BUAD-2123': [true, true, true, true, false, true, true, true, true, true, true, true, true, true, true], // 93.3%
      'ENGL-3184': [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true], // 100%
    };

    for (const course of courses) {
      const pattern = attendancePatterns[course.code] || [true, true, true, true, true];
      const slot = slotMap[course._id.toString()];

      for (let i = 0; i < pattern.length; i++) {
        const isPresent = pattern[i];
        // Normalize date to noon to prevent timezone offsets
        const lectureDate = new Date();
        lectureDate.setDate(lectureDate.getDate() - (15 - i) * 3);
        lectureDate.setHours(12, 0, 0, 0);

        let lecture = await Lecture.findOne({
          courseId: course._id,
          date: lectureDate,
        });

        if (!lecture) {
          lecture = await Lecture.create({
            courseId: course._id,
            timetableSlotId: slot._id,
            date: lectureDate,
            topic: `Lecture ${i + 1}: ${course.title} Module ${Math.floor(i / 3) + 1}`,
            status: 'attendance-closed',
          });
        }

        for (const student of targetStudents) {
          await AttendanceRecord.findOneAndUpdate(
            { lectureId: lecture._id, studentId: student._id },
            {
              lectureId: lecture._id,
              courseId: course._id,
              studentId: student._id,
              status: isPresent ? 'present' : 'absent',
              markedBy: faculty._id,
              markedAt: lectureDate,
            },
            { upsert: true }
          );
        }
      }
      console.log(`✅ Seeded attendance for course: ${course.code}`);
    }

    // 5. Ensure 4 Assessments per course (24 total)
    for (const course of courses) {
      const itemsToCreate = [
        {
          courseId: course._id,
          type: 'assignment',
          title: `${course.code} Assignment 1: Fundamental Architecture & Design`,
          description: 'Submit PDF design documentation via Google Drive link.',
          deadline: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // past
          maxMarks: 10,
          examPeriod: 'before Mids',
          sequenceIndex: 1,
        },
        {
          courseId: course._id,
          type: 'quiz',
          title: `${course.code} Quiz 1: Core Concepts Evaluation`,
          description: 'Quiz submission sheet.',
          deadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // past
          maxMarks: 10,
          examPeriod: 'before Mids',
          sequenceIndex: 1,
        },
        {
          courseId: course._id,
          type: 'assignment',
          title: `${course.code} Assignment 2: Practical Implementation Report`,
          description: 'Full code repository and documentation Drive link.',
          deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // future (due in 4 days)
          maxMarks: 10,
          examPeriod: 'before Finals',
          sequenceIndex: 2,
        },
        {
          courseId: course._id,
          type: 'quiz',
          title: `${course.code} Quiz 2: Mid-Semester Evaluation Quiz`,
          description: 'Comprehensive evaluation quiz.',
          deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // missed/overdue 2 days ago
          maxMarks: 10,
          examPeriod: 'before Finals',
          sequenceIndex: 2,
        },
      ];

      for (const item of itemsToCreate) {
        await AssignmentQuiz.findOneAndUpdate(
          { courseId: item.courseId, title: item.title },
          item,
          { upsert: true }
        );
      }
    }
    console.log('✅ Assessments ensured.');

    // 6. Seed Submissions (On-Time, Late, Pending, Overdue)
    const allAssessments = await AssignmentQuiz.find().populate('courseId');

    for (const student of targetStudents) {
      for (const item of allAssessments) {
        const courseCode = item.courseId?.code;

        if (item.sequenceIndex === 1 && item.type === 'assignment') {
          // On-Time Graded (10/10)
          await Submission.findOneAndUpdate(
            { assignmentQuizId: item._id, studentId: student._id },
            {
              assignmentQuizId: item._id,
              courseId: item.courseId._id,
              studentId: student._id,
              driveUrl: `https://drive.google.com/drive/folders/emu_${courseCode.toLowerCase()}_a1_${student.rollNumber}`,
              submittedAt: new Date(item.deadline.getTime() - 10 * 60 * 60 * 1000),
              status: 'on-time',
              marksAwarded: 10,
              feedback: 'Outstanding architecture report with clear diagrammatic proof.',
            },
            { upsert: true }
          );
        } else if (item.sequenceIndex === 1 && item.type === 'quiz') {
          // On-Time Graded (9/10)
          await Submission.findOneAndUpdate(
            { assignmentQuizId: item._id, studentId: student._id },
            {
              assignmentQuizId: item._id,
              courseId: item.courseId._id,
              studentId: student._id,
              driveUrl: `https://drive.google.com/drive/folders/emu_${courseCode.toLowerCase()}_q1_${student.rollNumber}`,
              submittedAt: new Date(item.deadline.getTime() - 2 * 60 * 60 * 1000),
              status: 'on-time',
              marksAwarded: 9,
              feedback: 'Accurate analytical responses and strong grasp of fundamentals.',
            },
            { upsert: true }
          );
        } else if (item.sequenceIndex === 2 && item.type === 'assignment' && courseCode === 'MATH-3181') {
          // Late Submission (7/10)
          await Submission.findOneAndUpdate(
            { assignmentQuizId: item._id, studentId: student._id },
            {
              assignmentQuizId: item._id,
              courseId: item.courseId._id,
              studentId: student._id,
              driveUrl: `https://drive.google.com/drive/folders/emu_${courseCode.toLowerCase()}_a2_${student.rollNumber}`,
              submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              status: 'late',
              marksAwarded: 7,
              feedback: 'Submitted 3 hours late. Partial deduction applied.',
            },
            { upsert: true }
          );
        }
      }
    }
    console.log('✅ Diverse coursework states seeded.');

    // 7. Seed Real-world Attendance Disputes
    const calcCourse = courses.find((c) => c.code === 'MATH-3181');
    const pdcCourse = courses.find((c) => c.code === 'COSE-3136');

    if (calcCourse) {
      const calcLectures = await Lecture.find({ courseId: calcCourse._id }).sort({ date: 1 });
      if (calcLectures.length > 2) {
        for (const student of targetStudents) {
          await AttendanceDispute.findOneAndUpdate(
            { lectureId: calcLectures[1]._id, studentId: student._id },
            {
              lectureId: calcLectures[1]._id,
              courseId: calcCourse._id,
              studentId: student._id,
              reason: 'I was present in room BOT-B1-F-102. Marked absent mistakenly due to seat change during attendance.',
              status: 'approved',
              peerVotes: [
                { studentId: new mongoose.Types.ObjectId(), vote: 'agree', votedAt: new Date() },
                { studentId: new mongoose.Types.ObjectId(), vote: 'agree', votedAt: new Date() },
                { studentId: new mongoose.Types.ObjectId(), vote: 'agree', votedAt: new Date() },
              ],
              teacherDecision: 'approved',
              teacherComment: 'Confirmed by peers and seat record. Attendance updated to Present.',
              decidedAt: new Date(),
            },
            { upsert: true }
          );
        }
      }
    }

    if (pdcCourse) {
      const pdcLectures = await Lecture.find({ courseId: pdcCourse._id }).sort({ date: -1 });
      if (pdcLectures.length > 0) {
        for (const student of targetStudents) {
          await AttendanceDispute.findOneAndUpdate(
            { lectureId: pdcLectures[0]._id, studentId: student._id },
            {
              lectureId: pdcLectures[0]._id,
              courseId: pdcCourse._id,
              studentId: student._id,
              reason: 'Attended the lab session on Lab Block 2nd Floor. Name called while submitting workstation files.',
              status: 'pending',
              peerVotes: [
                { studentId: new mongoose.Types.ObjectId(), vote: 'agree', votedAt: new Date() },
                { studentId: new mongoose.Types.ObjectId(), vote: 'agree', votedAt: new Date() },
              ],
            },
            { upsert: true }
          );
        }
      }
    }
    console.log('✅ Dispute records seeded.');

    console.log('🎉 RICH DEMO DATA COMPLETE!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedRichDemoData();
