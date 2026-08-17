import { Submission } from '../models/Submission.js';
import { AssignmentQuiz } from '../models/AssignmentQuiz.js';
import { Enrollment } from '../models/Enrollment.js';
import { User } from '../models/User.js';

/**
 * @desc Submit or update Google Drive URL (Student only)
 * @route POST /api/v1/submissions/submit
 */
export const submitDriveUrl = async (req, res) => {
  try {
    const { assignmentQuizId, driveUrl } = req.body;

    if (!assignmentQuizId || !driveUrl || !driveUrl.trim()) {
      return res.status(400).json({ message: 'Assignment ID and Google Drive URL are required.' });
    }

    const assessment = await AssignmentQuiz.findById(assignmentQuizId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found.' });
    }

    const submittedAt = new Date();
    // Compute status (on-time vs late)
    const isLate = submittedAt > new Date(assessment.deadline);
    const status = isLate ? 'late' : 'on-time';

    let submission = await Submission.findOne({
      assignmentQuizId,
      studentId: req.user._id,
    });

    if (!submission) {
      submission = await Submission.create({
        assignmentQuizId,
        courseId: assessment.courseId,
        studentId: req.user._id,
        driveUrl: driveUrl.trim(),
        submittedAt,
        status,
      });
    } else {
      submission.driveUrl = driveUrl.trim();
      submission.submittedAt = submittedAt;
      submission.status = status;
      await submission.save();
    }

    return res.status(200).json({
      message: `Google Drive submission received (${status.toUpperCase()}).`,
      submission,
    });
  } catch (error) {
    console.error('Submit Drive URL Error:', error);
    return res.status(500).json({ message: 'Server error submitting Google Drive URL.', error: error.message });
  }
};

/**
 * @desc Get student's submission history and grades
 * @route GET /api/v1/submissions/my-submissions
 */
export const getStudentSubmissions = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = { studentId: req.user._id };
    if (courseId) filter.courseId = courseId;

    const submissions = await Submission.find(filter)
      .populate('assignmentQuizId')
      .populate('courseId', 'title code')
      .sort({ createdAt: -1 });

    return res.status(200).json({ submissions, count: submissions.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching student submissions.' });
  }
};

/**
 * @desc Get full 54-student submission matrix for an assessment (Teacher / Owner)
 * @route GET /api/v1/submissions/assessment/:id
 */
export const getAssessmentSubmissionMatrix = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await AssignmentQuiz.findById(id).populate('courseId');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found.' });
    }

    let enrollments = await Enrollment.find({ courseId: assessment.courseId._id }).populate('studentId', 'name rollNumber email');
    let students = enrollments.map((e) => e.studentId).filter(Boolean);

    if (students.length === 0) {
      students = await User.find({ role: 'student' }).select('name rollNumber email').sort({ rollNumber: 1 });
    }

    const existingSubmissions = await Submission.find({ assignmentQuizId: id });
    const subMap = {};
    existingSubmissions.forEach((s) => {
      subMap[s.studentId.toString()] = s;
    });

    const matrix = [];
    const now = new Date();
    const isPastDeadline = now > new Date(assessment.deadline);

    for (const student of students) {
      const sub = subMap[student._id.toString()];
      let status = sub ? sub.status : isPastDeadline ? 'missing' : 'pending';

      matrix.push({
        studentId: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        submissionId: sub ? sub._id : null,
        driveUrl: sub ? sub.driveUrl : null,
        submittedAt: sub ? sub.submittedAt : null,
        status,
        marksAwarded: sub ? sub.marksAwarded : null,
        feedback: sub ? sub.feedback : '',
      });
    }

    matrix.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    return res.status(200).json({
      assessment,
      totalEnrolled: enrollments.length,
      submittedCount: existingSubmissions.length,
      matrix,
    });
  } catch (error) {
    console.error('Submission Matrix Error:', error);
    return res.status(500).json({ message: 'Error fetching submission matrix.', error: error.message });
  }
};

/**
 * @desc Grade a student submission (Teacher / Owner)
 * @route PATCH /api/v1/submissions/grade/:id
 */
export const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params; // submissionId or creates new if passing studentId + assessmentId
    const { marksAwarded, feedback, studentId, assignmentQuizId } = req.body;

    if (marksAwarded === undefined || marksAwarded === null) {
      return res.status(400).json({ message: 'Marks awarded is required.' });
    }

    let submission;
    if (id && id !== 'new') {
      submission = await Submission.findById(id);
    } else if (studentId && assignmentQuizId) {
      submission = await Submission.findOne({ assignmentQuizId, studentId });
      if (!submission) {
        const assessment = await AssignmentQuiz.findById(assignmentQuizId);
        submission = new Submission({
          assignmentQuizId,
          courseId: assessment.courseId,
          studentId,
          driveUrl: 'https://drive.google.com/manual-teacher-grading',
          submittedAt: new Date(),
          status: 'on-time',
        });
      }
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission record not found.' });
    }

    submission.marksAwarded = Number(marksAwarded);
    if (feedback !== undefined) submission.feedback = feedback.trim();
    await submission.save();

    return res.status(200).json({
      message: `Submission graded (${marksAwarded} marks awarded).`,
      submission,
    });
  } catch (error) {
    console.error('Grade Submission Error:', error);
    return res.status(500).json({ message: 'Error grading submission.', error: error.message });
  }
};
