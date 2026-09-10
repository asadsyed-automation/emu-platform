import { Lecture } from '../models/Lecture.js';
import { TimetableSlot } from '../models/TimetableSlot.js';
import { Course } from '../models/Course.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { AcademicEvent } from '../models/AcademicEvent.js';
import { Enrollment } from '../models/Enrollment.js';
import { User } from '../models/User.js';

/**
 * @desc Get dated lectures with teacher scoping & attendance stats
 * @route GET /api/v1/lectures
 */
export const getLectures = async (req, res) => {
  try {
    const { courseId, status } = req.query;
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (status) filter.status = status;

    // Strict Teacher Scoping: if teacher, only show lectures for their assigned courses
    if (req.user?.role === 'teacher' && req.user?.rollNumber !== 'DEMO-TCH-01' && !courseId) {
      const teacherCourses = await Course.find({ teacherId: req.user._id });
      const courseIds = teacherCourses.map((c) => c._id);
      filter.courseId = { $in: courseIds };
    }

    const lectures = await Lecture.find(filter)
      .populate('courseId', 'title code teacherId')
      .populate('timetableSlotId')
      .sort({ date: 1, 'timetableSlotId.startTime': 1 });

    return res.status(200).json({ lectures, count: lectures.length });
  } catch (error) {
    console.error('Get Lectures Error:', error);
    return res.status(500).json({ message: 'Error fetching lecture instances.', error: error.message });
  }
};

/**
 * @desc Get 30+ Lecture Schedule Matrix for a specific course with attendance stats & academic timeline
 * @route GET /api/v1/lectures/course-schedule/:courseId
 */
export const getCourseLectureSchedule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('teacherId', 'name email rollNumber');

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

    // Fetch all lectures for this course
    const lectures = await Lecture.find({ courseId })
      .populate('timetableSlotId', 'room startTime endTime isLab dayOfWeek isOnline')
      .sort({ date: 1 });

    // Fetch all attendance records for this course to calculate present/absent per lecture
    const allRecords = await AttendanceRecord.find({ courseId });
    const recordsByLecture = {};
    allRecords.forEach((r) => {
      const lId = r.lectureId.toString();
      if (!recordsByLecture[lId]) recordsByLecture[lId] = { present: 0, absent: 0 };
      if (r.status === 'present') recordsByLecture[lId].present++;
      else recordsByLecture[lId].absent++;
    });

    // Fetch total enrolled students for this course
    let enrolledCount = await Enrollment.countDocuments({ courseId });
    if (enrolledCount === 0) {
      enrolledCount = await User.countDocuments({ role: 'student' });
    }

    // Fetch academic events (Midterms, Finals, Vacations/Holidays)
    const academicEvents = await AcademicEvent.find().sort({ startDate: 1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scheduleList = lectures.map((lec, index) => {
      const lecDate = new Date(lec.date);
      const lecMidnight = new Date(lecDate);
      lecMidnight.setHours(0, 0, 0, 0);

      const isToday = lecMidnight.getTime() === today.getTime();
      const isPast = lecMidnight < today;
      const isFuture = lecMidnight > today;

      const lId = lec._id.toString();
      const stats = recordsByLecture[lId] || null;
      const isMarked = stats !== null || lec.status === 'attendance-closed';

      // Check if this lecture date falls in any academic event / holiday window
      const matchedEvent = academicEvents.find((ev) => {
        const evStart = new Date(ev.startDate);
        evStart.setHours(0, 0, 0, 0);
        const evEnd = new Date(ev.endDate);
        evEnd.setHours(23, 59, 59, 999);
        return lecMidnight >= evStart && lecMidnight <= evEnd;
      });

      return {
        _id: lec._id,
        lectureNumber: index + 1,
        courseId: lec.courseId,
        date: lec.date,
        dateStr: lecDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        isoDate: lecDate.toISOString().split('T')[0],
        dayOfWeek: lec.timetableSlotId?.dayOfWeek || lecDate.toLocaleDateString('en-US', { weekday: 'long' }),
        startTime: lec.timetableSlotId?.startTime || '01:30 PM',
        endTime: lec.timetableSlotId?.endTime || '02:20 PM',
        room: lec.timetableSlotId?.room || 'CTB1-02',
        isLab: lec.timetableSlotId?.isLab || false,
        isOnline: lec.timetableSlotId?.isOnline || false,
        topic: lec.topic || '',
        status: lec.status,
        isToday,
        isPast,
        isFuture,
        isMarked,
        presentCount: stats ? stats.present : 0,
        absentCount: stats ? stats.absent : 0,
        totalEnrolled: enrolledCount,
        academicEvent: matchedEvent ? {
          title: matchedEvent.title,
          type: matchedEvent.type,
          startDate: matchedEvent.startDate,
          endDate: matchedEvent.endDate,
        } : null,
      };
    });

    return res.status(200).json({
      course: {
        id: course._id,
        code: course.code,
        title: course.title,
        teacherName: course.teacherId?.name || 'Faculty Member',
        creditHours: course.creditHours,
        semesterLabel: course.semesterLabel || 'Fall 2026',
      },
      totalScheduled: scheduleList.length,
      totalMarked: scheduleList.filter((s) => s.isMarked).length,
      lectures: scheduleList,
      academicEvents,
    });
  } catch (error) {
    console.error('Get Course Lecture Schedule Error:', error);
    return res.status(500).json({ message: 'Error loading course lecture schedule.', error: error.message });
  }
};

/**
 * @desc Update / Reschedule a single lecture date or topic
 * @route PATCH /api/v1/lectures/:lectureId/schedule
 */
export const updateLectureDateAndTopic = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { date, topic } = req.body;

    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    // Permission check
    const isAuthorized =
      req.user.role === 'owner' ||
      req.user.rollNumber === 'DEMO-TCH-01' ||
      (lecture.courseId?.teacherId && lecture.courseId.teacherId.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden. You cannot edit this lecture.' });
    }

    if (date) {
      lecture.date = new Date(date);
    }
    if (topic !== undefined) {
      lecture.topic = topic.trim();
    }

    await lecture.save();

    return res.status(200).json({
      message: 'Lecture schedule updated successfully.',
      lecture,
    });
  } catch (error) {
    console.error('Update Lecture Error:', error);
    return res.status(500).json({ message: 'Error updating lecture date.', error: error.message });
  }
};

/**
 * @desc Auto-generate dated lecture instances for a date range (Owner only)
 * @route POST /api/v1/admin/generate-lectures
 */
export const generateSemesterLectures = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    // Default semester dates: 07 Sept 2026 to 25 Dec 2026
    const start = startDate ? new Date(startDate) : new Date('2026-09-07');
    const end = endDate ? new Date(endDate) : new Date('2026-12-25');

    const slots = await TimetableSlot.find({ courseId: { $ne: null } });
    if (slots.length === 0) {
      return res.status(400).json({ message: 'No active timetable slots found. Seed or add timetable slots first.' });
    }

    const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let generatedCount = 0;
    let skippedCount = 0;

    const cur = new Date(start);
    cur.setHours(0, 0, 0, 0);
    const stop = new Date(end);
    stop.setHours(23, 59, 59, 999);

    while (cur <= stop) {
      const dayName = dayNameMap[cur.getDay()];
      const daySlots = slots.filter((s) => s.dayOfWeek === dayName);

      for (const slot of daySlots) {
        const lectureDate = new Date(cur);
        try {
          await Lecture.create({
            courseId: slot.courseId,
            timetableSlotId: slot._id,
            date: lectureDate,
            status: 'scheduled',
          });
          generatedCount++;
        } catch (err) {
          skippedCount++;
        }
      }

      cur.setDate(cur.getDate() + 1);
    }

    return res.status(200).json({
      message: `Lecture generation complete. Generated: ${generatedCount}, Existing/Skipped: ${skippedCount}`,
      summary: { generatedCount, skippedCount },
    });
  } catch (error) {
    console.error('Generate Lectures Error:', error);
    return res.status(500).json({ message: 'Error generating lecture calendar.', error: error.message });
  }
};

