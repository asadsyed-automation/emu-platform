import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Lecture } from '../models/Lecture.js';
import { AssignmentQuiz } from '../models/AssignmentQuiz.js';
import { Submission } from '../models/Submission.js';
import { AttendanceDispute } from '../models/AttendanceDispute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedSubmissionsAndDisputes = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    const targetStudents = await User.find({
      $or: [
        { rollNumber: 'COSC231122114' },
        { rollNumber: 'DEMO-STD-01' },
      ],
    });

    const courses = await Course.find();
    console.log(`Found ${targetStudents.length} target students and ${courses.length} courses.`);

    // 1. Ensure 4 Assessments per course (24 total)
    for (const course of courses) {
      const itemsToCreate = [
        {
          courseId: course._id,
          type: 'assignment',
          title: `${course.code} Assignment 1: Architecture & Design`,
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
          title: `${course.code} Assignment 2: Implementation Project`,
          description: 'Full code repository and documentation Drive link.',
          deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // future (due in 4 days)
          maxMarks: 10,
          examPeriod: 'before Finals',
          sequenceIndex: 2,
        },
        {
          courseId: course._id,
          type: 'quiz',
          title: `${course.code} Quiz 2: Sessional Evaluation Quiz`,
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
    console.log('✅ Assessments verified.');

    // 2. Seed Submissions
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
              submittedAt: new Date(item.deadline.getTime() - 8 * 60 * 60 * 1000),
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
    console.log('✅ Submissions seeded.');

    // 3. Seed Disputes
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
    console.log('✅ Disputes seeded.');

    console.log('🎉 ALL RICH DEMO DATA SEEDED CLEANLY!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedSubmissionsAndDisputes();
