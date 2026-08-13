import { Course } from '../models/Course.js';
import { Lecture } from '../models/Lecture.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Enrollment } from '../models/Enrollment.js';
import { AssignmentQuiz } from '../models/AssignmentQuiz.js';
import { Submission } from '../models/Submission.js';

/**
 * @desc Page A: Auto-compiled Date-Wise Attendance Register (Teacher / Owner)
 * @route GET /api/v1/reports/attendance-register
 */
export const getAttendanceRegisterReport = async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }

    const course = await Course.findById(courseId).populate('teacherId', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Scoping check for teachers
    if (req.user.role === 'teacher' && course.teacherId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You do not teach this course.' });
    }

    // Fetch all closed/completed lectures for this course sorted by date
    const lectures = await Lecture.find({ courseId, status: 'attendance-closed' })
      .populate('timetableSlotId', 'room isLab startTime')
      .sort({ date: 1 });

    // Format columns metadata
    const dateColumns = lectures.map((l) => ({
      lectureId: l._id,
      dateStr: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: new Date(l.date).toISOString().split('T')[0],
      room: l.timetableSlotId?.room || 'BOT-B1-F-102',
      isLab: l.timetableSlotId?.isLab || false,
    }));

    // Fetch all enrolled 54 students
    const enrollments = await Enrollment.find({ courseId }).populate('studentId', 'name rollNumber email');

    // Fetch all attendance records for this course
    const allRecords = await AttendanceRecord.find({ courseId });

    // Group records by studentId -> lectureId
    const recordMap = {};
    allRecords.forEach((r) => {
      const sKey = r.studentId.toString();
      const lKey = r.lectureId.toString();
      if (!recordMap[sKey]) recordMap[sKey] = {};
      recordMap[sKey][lKey] = r.status === 'present' ? 'P' : 'A';
    });

    const studentRows = [];
    const totalLecturesCount = lectures.length;

    for (const env of enrollments) {
      const student = env.studentId;
      if (!student) continue;

      const sKey = student._id.toString();
      const sAttendance = recordMap[sKey] || {};

      let presentCount = 0;
      let absentCount = 0;
      const attendanceMap = {};

      for (const col of dateColumns) {
        const val = sAttendance[col.lectureId.toString()] || 'A';
        attendanceMap[col.lectureId.toString()] = val;
        if (val === 'P') presentCount++;
        else absentCount++;
      }

      const percentage = totalLecturesCount > 0 ? parseFloat(((presentCount / totalLecturesCount) * 100).toFixed(1)) : 100.0;

      studentRows.push({
        studentId: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        attendanceMap,
        presentCount,
        absentCount,
        percentage,
      });
    }

    studentRows.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    return res.status(200).json({
      institution: 'Emerson University Multan',
      department: 'Faculty of Computing and Emerging Technologies',
      sectionLabel: 'BS(CS) 6th/7th Semester Evening Section-A',
      course: {
        id: course._id,
        title: course.title,
        code: course.code,
        semesterLabel: course.semesterLabel,
        teacherName: course.teacherId?.name,
      },
      totalLectures: totalLecturesCount,
      dateColumns,
      students: studentRows,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Attendance Register Report Error:', error);
    return res.status(500).json({ message: 'Error generating date-wise attendance register.', error: error.message });
  }
};

/**
 * @desc Page B: Coursework Submission Status Matrix (Teacher / Owner)
 * @route GET /api/v1/reports/submission-matrix
 */
export const getSubmissionMatrixReport = async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }

    const course = await Course.findById(courseId).populate('teacherId', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (req.user.role === 'teacher' && course.teacherId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You do not teach this course.' });
    }

    // Fetch all assignments/quizzes for this course
    const assessments = await AssignmentQuiz.find({ courseId }).sort({ deadline: 1 });

    const assessmentColumns = assessments.map((a) => ({
      assessmentId: a._id,
      title: a.title,
      type: a.type,
      examPeriod: a.examPeriod,
      sequenceIndex: a.sequenceIndex,
      maxMarks: a.maxMarks,
      deadlineStr: new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    const enrollments = await Enrollment.find({ courseId }).populate('studentId', 'name rollNumber email');
    const allSubmissions = await Submission.find({ courseId });

    // Group submissions by studentId -> assessmentId
    const subMap = {};
    allSubmissions.forEach((s) => {
      const sKey = s.studentId.toString();
      const aKey = s.assignmentQuizId.toString();
      if (!subMap[sKey]) subMap[sKey] = {};
      subMap[sKey][aKey] = {
        status: s.status,
        driveUrl: s.driveUrl,
        submittedAt: s.submittedAt,
        marksAwarded: s.marksAwarded,
      };
    });

    const studentRows = [];
    const now = new Date();

    for (const env of enrollments) {
      const student = env.studentId;
      if (!student) continue;

      const sKey = student._id.toString();
      const studentSubs = subMap[sKey] || {};

      let totalSubmitted = 0;
      let totalMarks = 0;
      const submissionsMap = {};

      for (const col of assessmentColumns) {
        const subData = studentSubs[col.assessmentId.toString()];
        const isPastDeadline = now > new Date(col.deadlineStr);

        let status = subData ? subData.status : isPastDeadline ? 'missing' : 'pending';
        if (subData) {
          totalSubmitted++;
          if (subData.marksAwarded !== null && subData.marksAwarded !== undefined) {
            totalMarks += subData.marksAwarded;
          }
        }

        submissionsMap[col.assessmentId.toString()] = {
          status,
          driveUrl: subData ? subData.driveUrl : null,
          marksAwarded: subData ? subData.marksAwarded : null,
        };
      }

      studentRows.push({
        studentId: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        submissionsMap,
        totalSubmitted,
        totalMarks,
      });
    }

    studentRows.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    return res.status(200).json({
      institution: 'Emerson University Multan',
      department: 'Faculty of Computing and Emerging Technologies',
      sectionLabel: 'BS(CS) 6th/7th Semester Evening Section-A',
      course: {
        id: course._id,
        title: course.title,
        code: course.code,
        semesterLabel: course.semesterLabel,
        teacherName: course.teacherId?.name,
      },
      assessmentColumns,
      students: studentRows,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Submission Matrix Report Error:', error);
    return res.status(500).json({ message: 'Error generating submission status matrix.', error: error.message });
  }
};
