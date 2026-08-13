import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { TimetableSlot } from '../models/TimetableSlot.js';

/**
 * @desc Get courses relevant to the authenticated user
 * @route GET /api/v1/courses
 */
export const getCourses = async (req, res) => {
  try {
    const { user } = req;
    let courses = [];

    if (user.role === 'owner') {
      courses = await Course.find().populate('teacherId', 'name email rollNumber');
    } else if (user.role === 'teacher') {
      courses = await Course.find({ teacherId: user._id }).populate('teacherId', 'name email rollNumber');
    } else {
      // Student: fetch enrolled courses
      const enrollments = await Enrollment.find({ studentId: user._id }).populate({
        path: 'courseId',
        populate: { path: 'teacherId', select: 'name email rollNumber' },
      });
      courses = enrollments.map((e) => e.courseId).filter(Boolean);
    }

    return res.status(200).json({ courses, count: courses.length });
  } catch (error) {
    console.error('Get Courses Error:', error);
    return res.status(500).json({ message: 'Error fetching courses.', error: error.message });
  }
};

/**
 * @desc Get single course detail with timetable slots
 * @route GET /api/v1/courses/:id
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('teacherId', 'name email rollNumber');
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const timetableSlots = await TimetableSlot.find({ courseId: id }).sort({ dayOfWeek: 1, startTime: 1 });

    return res.status(200).json({ course, timetableSlots });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching course details.' });
  }
};
