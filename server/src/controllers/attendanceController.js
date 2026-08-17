import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Lecture } from '../models/Lecture.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { User } from '../models/User.js';

/**
 * @desc Open attendance for a lecture (Server-enforced scheduled date check)
 * @route POST /api/v1/attendance/open-lecture/:lectureId
 */
export const openLectureAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId).populate('courseId');

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    // Check teacher permission (must be assigned teacher, demo teacher, or owner)
    if (req.user.role === 'teacher' && req.user.rollNumber !== 'DEMO-TCH-01' && lecture.courseId.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You are not the assigned teacher for this course.' });
    }

    // Server-side Date Enforcement
    const allowPast = process.env.ALLOW_PAST_ATTENDANCE === 'true' || process.env.NODE_ENV === 'development' || req.user.rollNumber === 'DEMO-TCH-01' || req.user.role === 'owner';
    const lectureDateStr = new Date(lecture.date).toISOString().split('T')[0];
    const todayDateStr = new Date().toISOString().split('T')[0];

    if (lectureDateStr !== todayDateStr && !allowPast) {
      return res.status(403).json({
        message: `Attendance can only be opened on the lecture's actual scheduled date (${lectureDateStr}).`,
        scheduledDate: lectureDateStr,
        todayDate: todayDateStr,
      });
    }

    lecture.status = 'attendance-open';
    await lecture.save();

    return res.status(200).json({
      message: 'Attendance portal is now OPEN for this lecture.',
      lecture,
    });
  } catch (error) {
    console.error('Open Attendance Error:', error);
    return res.status(500).json({ message: 'Server error opening attendance.', error: error.message });
  }
};

/**
 * @desc Fast bulk-mark attendance (Default all present, absentees array set to absent)
 * @route POST /api/v1/attendance/mark/:lectureId
 */
export const markBulkAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { absentees = [] } = req.body; // Array of student IDs marked absent

    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    // Check teacher permission (must be assigned teacher, demo teacher, or owner)
    const isTeacherAuthorized =
      req.user.role === 'owner' ||
      req.user.rollNumber === 'DEMO-TCH-01' ||
      (lecture.courseId?.teacherId && lecture.courseId.teacherId.toString() === req.user._id.toString());

    if (req.user.role === 'teacher' && !isTeacherAuthorized) {
      return res.status(403).json({ message: 'Forbidden. You are not the teacher for this course.' });
    }

    // Fetch all enrolled students for this course (fallback to all section students)
    let enrollments = await Enrollment.find({ courseId: lecture.courseId._id }).populate('studentId');
    let enrolledStudents = enrollments.map((e) => e.studentId).filter(Boolean);

    if (enrolledStudents.length === 0) {
      enrolledStudents = await User.find({ role: 'student' }).sort({ rollNumber: 1 });
    }

    const absenteeSet = new Set(absentees.map((id) => id.toString()));
    const markedRecords = [];

    for (const student of enrolledStudents) {
      const isAbsent = absenteeSet.has(student._id.toString());
      const status = isAbsent ? 'absent' : 'present';

      // Upsert attendance record with append-only audit trail
      let record = await AttendanceRecord.findOne({
        lectureId: lecture._id,
        studentId: student._id,
      });

      if (!record) {
        record = new AttendanceRecord({
          lectureId: lecture._id,
          courseId: lecture.courseId._id,
          studentId: student._id,
          status,
          markedBy: req.user._id,
          markedAt: new Date(),
          history: [
            {
              previousStatus: undefined,
              newStatus: status,
              changedBy: req.user._id,
              changedAt: new Date(),
              reason: 'Initial fast attendance marking',
            },
          ],
        });
      } else {
        const prev = record.status;
        record.status = status;
        record.markedBy = req.user._id;
        record.markedAt = new Date();
        record.history.push({
          previousStatus: prev,
          newStatus: status,
          changedBy: req.user._id,
          changedAt: new Date(),
          reason: 'Updated via bulk attendance sheet',
        });
      }

      await record.save();
      markedRecords.push(record);
    }

    // Mark lecture status as attendance-closed
    lecture.status = 'attendance-closed';
    await lecture.save();

    return res.status(200).json({
      message: `Attendance marked successfully for ${enrolledStudents.length} students.`,
      summary: {
        totalEnrolled: enrolledStudents.length,
        presentCount: enrolledStudents.length - absentees.length,
        absentCount: absentees.length,
      },
    });
  } catch (error) {
    console.error('Mark Attendance Error:', error);
    return res.status(500).json({ message: 'Server error marking attendance.', error: error.message });
  }
};

/**
 * @desc Get marked attendance for a specific lecture
 * @route GET /api/v1/attendance/lecture/:lectureId
 */
export const getLectureAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const records = await AttendanceRecord.find({ lectureId })
      .populate('studentId', 'name rollNumber email')
      .populate('markedBy', 'name role')
      .sort({ 'studentId.rollNumber': 1 });

    return res.status(200).json({ records, count: records.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching lecture attendance records.' });
  }
};

/**
 * @desc Get student's attendance summary & lecture history (Strict User Scoping)
 * @route GET /api/v1/attendance/student/my-summary
 */
export const getStudentSummary = async (req, res) => {
  try {
    // Determine target student ID (students can only see self, teachers/owners can specify query target)
    let targetStudentId = req.user._id;
    if ((req.user.role === 'teacher' || req.user.role === 'owner') && req.query.studentId) {
      targetStudentId = req.query.studentId;
    }

    // Fetch student's enrolled courses
    const enrollments = await Enrollment.find({ studentId: targetStudentId }).populate({
      path: 'courseId',
      populate: { path: 'teacherId', select: 'name email' },
    });

    const coursesSummary = [];

    for (const env of enrollments) {
      const course = env.courseId;
      if (!course) continue;

      // Count closed/completed lectures for this course
      const totalLectures = await Lecture.countDocuments({
        courseId: course._id,
        status: 'attendance-closed',
      });

      // Fetch student's attendance records for this course
      const records = await AttendanceRecord.find({
        studentId: targetStudentId,
        courseId: course._id,
      }).populate('lectureId');

      const presentCount = records.filter((r) => r.status === 'present').length;
      const absentCount = records.filter((r) => r.status === 'absent').length;

      const percentage = totalLectures > 0 ? parseFloat(((presentCount / totalLectures) * 100).toFixed(1)) : 100.0;

      let standing = 'Good Standing';
      if (percentage < 65) standing = 'Critical';
      else if (percentage < 75) standing = 'At Risk';

      coursesSummary.push({
        courseId: course._id,
        title: course.title,
        code: course.code,
        teacherName: course.teacherId?.name,
        totalLectures,
        presentCount,
        absentCount,
        percentage,
        standing,
        records,
      });
    }

    return res.status(200).json({
      studentId: targetStudentId,
      coursesSummary,
    });
  } catch (error) {
    console.error('Student Attendance Summary Error:', error);
    return res.status(500).json({ message: 'Error calculating attendance summary.', error: error.message });
  }
};

/**
 * @desc Get class-wide roster attendance report for a course
 * @route GET /api/v1/attendance/course/:courseId/summary
 */
export const getCourseAttendanceSummary = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('teacherId', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Scoping check for teachers
    const isTeacherAuthorized =
      req.user.role === 'owner' ||
      req.user.rollNumber === 'DEMO-TCH-01' ||
      (course.teacherId && course.teacherId._id.toString() === req.user._id.toString());

    if (req.user.role === 'teacher' && !isTeacherAuthorized) {
      return res.status(403).json({ message: 'Forbidden. You do not teach this course.' });
    }

    // Total closed lectures
    const totalLectures = await Lecture.countDocuments({
      courseId,
      status: 'attendance-closed',
    });

    // Enrolled students (with fallback to all section students)
    let enrollments = await Enrollment.find({ courseId }).populate('studentId', 'name rollNumber email');
    let students = enrollments.map((e) => e.studentId).filter(Boolean);

    if (students.length === 0) {
      students = await User.find({ role: 'student' }).select('name rollNumber email').sort({ rollNumber: 1 });
    }

    const roster = [];

    for (const student of students) {
      const records = await AttendanceRecord.find({
        courseId,
        studentId: student._id,
      });

      const presentCount = records.filter((r) => r.status === 'present').length;
      const absentCount = records.filter((r) => r.status === 'absent').length;
      const percentage = totalLectures > 0 ? parseFloat(((presentCount / totalLectures) * 100).toFixed(1)) : 100.0;

      let standing = 'Good Standing';
      if (percentage < 65) standing = 'Critical';
      else if (percentage < 75) standing = 'At Risk';

      roster.push({
        studentId: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        presentCount,
        absentCount,
        percentage,
        standing,
      });
    }

    // Default sort by Roll Number
    roster.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    return res.status(200).json({
      course,
      totalLectures,
      rosterCount: roster.length,
      roster,
    });
  } catch (error) {
    console.error('Course Attendance Summary Error:', error);
    return res.status(500).json({ message: 'Error fetching course attendance summary.', error: error.message });
  }
};

/**
 * @desc Edit an individual student's attendance record with append-only audit trail
 * @route PATCH /api/v1/attendance/update-record/:recordId
 */
export const updateAttendanceRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { status, reason } = req.body;

    if (!status || !['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "present" or "absent".' });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ message: 'A reason must be provided for audit logging.' });
    }

    const record = await AttendanceRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found.' });
    }

    const prevStatus = record.status;
    record.status = status;
    record.history.push({
      previousStatus: prevStatus,
      newStatus: status,
      changedBy: req.user._id,
      changedAt: new Date(),
      reason: reason.trim(),
    });

    await record.save();

    return res.status(200).json({
      message: `Record updated from ${prevStatus.toUpperCase()} to ${status.toUpperCase()}. Audit log updated.`,
      record,
    });
  } catch (error) {
    console.error('Update Record Error:', error);
    return res.status(500).json({ message: 'Error updating attendance record.', error: error.message });
  }
};
