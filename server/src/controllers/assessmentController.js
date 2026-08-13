import { AssignmentQuiz } from '../models/AssignmentQuiz.js';
import { Course } from '../models/Course.js';
import { Submission } from '../models/Submission.js';

/**
 * @desc Create new Assignment or Quiz (Teacher / Owner)
 * @route POST /api/v1/assessments
 */
export const createAssessment = async (req, res) => {
  try {
    const { courseId, type, title, description, deadline, maxMarks, examPeriod, sequenceIndex } = req.body;

    if (!courseId || !type || !title || !deadline || !sequenceIndex) {
      return res.status(400).json({ message: 'Course, type, title, deadline, and sequence index are required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (req.user.role === 'teacher' && course.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You are not the teacher for this course.' });
    }

    const assessment = await AssignmentQuiz.create({
      courseId,
      type,
      title: title.trim(),
      description: description ? description.trim() : '',
      deadline: new Date(deadline),
      maxMarks: maxMarks || 10,
      examPeriod: examPeriod || 'before Mids',
      sequenceIndex: Number(sequenceIndex),
    });

    return res.status(201).json({
      message: `${type.toUpperCase()} created successfully (${examPeriod} #${sequenceIndex}).`,
      assessment,
    });
  } catch (error) {
    console.error('Create Assessment Error:', error);
    return res.status(500).json({ message: 'Server error creating assessment.', error: error.message });
  }
};

/**
 * @desc Get assessments for a course
 * @route GET /api/v1/assessments
 */
export const getCourseAssessments = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = courseId ? { courseId } : {};

    const assessments = await AssignmentQuiz.find(filter)
      .populate('courseId', 'title code')
      .sort({ deadline: 1 });

    const list = [];
    for (const a of assessments) {
      const submissionCount = await Submission.countDocuments({ assignmentQuizId: a._id });
      list.push({
        ...a.toObject(),
        submissionCount,
      });
    }

    return res.status(200).json({ assessments: list, count: list.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching course assessments.' });
  }
};
