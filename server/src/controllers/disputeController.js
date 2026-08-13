import { AttendanceDispute } from '../models/AttendanceDispute.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Lecture } from '../models/Lecture.js';
import { Enrollment } from '../models/Enrollment.js';

/**
 * @desc Raise an attendance dispute (Student only)
 * @route POST /api/v1/disputes/raise
 */
export const raiseDispute = async (req, res) => {
  try {
    const { attendanceRecordId, reason } = req.body;

    if (!attendanceRecordId || !reason || reason.trim().length === 0) {
      return res.status(400).json({ message: 'Attendance record ID and reason are required.' });
    }

    const record = await AttendanceRecord.findById(attendanceRecordId).populate('lectureId');
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found.' });
    }

    if (record.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. You can only raise disputes for your own attendance.' });
    }

    if (record.status !== 'absent') {
      return res.status(400).json({ message: 'Disputes can only be raised for ABSENT records.' });
    }

    // Check if dispute already raised for this record
    const existing = await AttendanceDispute.findOne({ attendanceRecordId });
    if (existing) {
      return res.status(400).json({ message: 'A dispute has already been raised for this lecture.' });
    }

    const lecture = record.lectureId;
    const allowLate = process.env.ALLOW_LATE_DISPUTES === 'true' || process.env.NODE_ENV === 'development';

    // 1. Enforce 24-Hour Raise Window
    const hoursDifference = (Date.now() - new Date(lecture.date).getTime()) / (1000 * 60 * 60);
    if (hoursDifference > 24 && !allowLate) {
      return res.status(400).json({
        message: 'Disputes must be raised within 24 hours of the scheduled lecture date.',
        hoursElapsed: Math.round(hoursDifference),
      });
    }

    // 2. Enforce 3-Dispute Cap per Course per Semester
    const existingCount = await AttendanceDispute.countDocuments({
      studentId: req.user._id,
      courseId: record.courseId,
    });

    if (existingCount >= 3) {
      return res.status(400).json({
        message: 'Semester dispute cap reached! You may raise at most 3 disputes per course per semester.',
        currentCount: existingCount,
      });
    }

    // 3. Automated Peer Selection (Present students on same date sorted by highest attendance %)
    const presentRecords = await AttendanceRecord.find({
      lectureId: lecture._id,
      status: 'present',
      studentId: { $ne: req.user._id },
    }).populate('studentId');

    const totalLecturesInCourse = await Lecture.countDocuments({
      courseId: record.courseId,
      status: 'attendance-closed',
    });

    const peerCandidates = [];
    for (const pr of presentRecords) {
      const student = pr.studentId;
      if (!student) continue;

      const studentPresents = await AttendanceRecord.countDocuments({
        courseId: record.courseId,
        studentId: student._id,
        status: 'present',
      });

      const percentage = totalLecturesInCourse > 0 ? (studentPresents / totalLecturesInCourse) * 100 : 100;
      peerCandidates.push({
        studentId: student._id,
        percentage,
      });
    }

    // Sort present students by highest attendance % and select top 10
    peerCandidates.sort((a, b) => b.percentage - a.percentage);
    const selectedPeers = peerCandidates.slice(0, 10).map((c) => c.studentId);

    const dispute = await AttendanceDispute.create({
      attendanceRecordId: record._id,
      lectureId: lecture._id,
      courseId: record.courseId,
      studentId: req.user._id,
      reason: reason.trim(),
      peerVoterIds: selectedPeers,
      status: 'voting',
    });

    return res.status(201).json({
      message: `Dispute raised successfully. ${selectedPeers.length} top peers selected for validation.`,
      dispute,
      remainingDisputes: 3 - (existingCount + 1),
    });
  } catch (error) {
    console.error('Raise Dispute Error:', error);
    return res.status(500).json({ message: 'Server error raising dispute.', error: error.message });
  }
};

/**
 * @desc Get disputes raised by logged-in student
 * @route GET /api/v1/disputes/my-disputes
 */
export const getMyDisputes = async (req, res) => {
  try {
    const disputes = await AttendanceDispute.find({ studentId: req.user._id })
      .populate('courseId', 'title code')
      .populate('lectureId', 'date')
      .sort({ createdAt: -1 });

    const totalCount = disputes.length;
    return res.status(200).json({ disputes, totalCount, remainingCap: Math.max(0, 3 - totalCount) });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching student disputes.' });
  }
};

/**
 * @desc Get active peer voting ballots for logged-in student
 * @route GET /api/v1/disputes/peer-ballots
 */
export const getPeerBallots = async (req, res) => {
  try {
    const activeDisputes = await AttendanceDispute.find({
      peerVoterIds: req.user._id,
      status: 'voting',
      'votes.voterId': { $ne: req.user._id },
    })
      .populate('studentId', 'name rollNumber')
      .populate('courseId', 'title code')
      .populate('lectureId', 'date')
      .sort({ createdAt: -1 });

    return res.status(200).json({ ballots: activeDisputes, count: activeDisputes.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching peer voting ballots.' });
  }
};

/**
 * @desc Cast a peer vote ('yes'/'no') on a dispute
 * @route POST /api/v1/disputes/vote/:disputeId
 */
export const castPeerVote = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { vote } = req.body;

    if (!vote || !['yes', 'no'].includes(vote)) {
      return res.status(400).json({ message: 'Vote must be "yes" or "no".' });
    }

    const dispute = await AttendanceDispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found.' });
    }

    const isPeerVoter = dispute.peerVoterIds.some((id) => id.toString() === req.user._id.toString());
    if (!isPeerVoter) {
      return res.status(403).json({ message: 'Forbidden. You are not a selected peer voter for this dispute.' });
    }

    const alreadyVoted = dispute.votes.some((v) => v.voterId.toString() === req.user._id.toString());
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already cast your vote on this dispute.' });
    }

    dispute.votes.push({
      voterId: req.user._id,
      vote,
      votedAt: new Date(),
    });

    // 2/3 Majority Calculation
    const totalVoters = dispute.peerVoterIds.length;
    const threshold = Math.ceil((2 / 3) * totalVoters);
    const yesCount = dispute.votes.filter((v) => v.vote === 'yes').length;
    const noCount = dispute.votes.filter((v) => v.vote === 'no').length;

    if (yesCount >= threshold) {
      dispute.peerResult = 'supported';
      dispute.status = 'escalated'; // Escalates to teacher for final signoff
    } else if (noCount > totalVoters - threshold) {
      dispute.peerResult = 'not-supported';
      dispute.status = 'rejected';
      dispute.teacherDecision = 'rejected';
      dispute.teacherDecisionReason = 'Peer voting failed 2/3 majority validation threshold.';
      dispute.resolvedAt = new Date();
    }

    await dispute.save();

    return res.status(200).json({
      message: `Vote "${vote.toUpperCase()}" recorded successfully.`,
      dispute,
    });
  } catch (error) {
    console.error('Cast Vote Error:', error);
    return res.status(500).json({ message: 'Server error casting vote.', error: error.message });
  }
};

/**
 * @desc Get disputes for a course (Teacher / Owner)
 * @route GET /api/v1/disputes/course/:courseId
 */
export const getCourseDisputes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const disputes = await AttendanceDispute.find({ courseId })
      .populate('studentId', 'name rollNumber email')
      .populate('lectureId', 'date')
      .populate('attendanceRecordId')
      .sort({ createdAt: -1 });

    return res.status(200).json({ disputes, count: disputes.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching course disputes.' });
  }
};

/**
 * @desc Teacher/Owner final resolution of an escalated dispute
 * @route PATCH /api/v1/disputes/resolve/:disputeId
 */
export const resolveDisputeByTeacher = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { decision, reason } = req.body;

    if (!decision || !['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'Decision must be "approved" or "rejected".' });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ message: 'A reason for your decision is required.' });
    }

    const dispute = await AttendanceDispute.findById(disputeId).populate('attendanceRecordId');
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found.' });
    }

    dispute.teacherDecision = decision;
    dispute.teacherDecisionReason = reason.trim();
    dispute.resolvedAt = new Date();
    dispute.resolvedBy = req.user._id;
    dispute.status = decision;

    // If approved, update AttendanceRecord status to 'present' with audit log
    if (decision === 'approved') {
      const record = dispute.attendanceRecordId;
      if (record) {
        const prevStatus = record.status;
        record.status = 'present';
        record.history.push({
          previousStatus: prevStatus,
          newStatus: 'present',
          changedBy: req.user._id,
          changedAt: new Date(),
          reason: `Dispute Approved: ${reason.trim()}`,
        });
        await record.save();
      }
    }

    await dispute.save();

    return res.status(200).json({
      message: `Dispute ${decision.toUpperCase()} successfully. Attendance record audit trail updated.`,
      dispute,
    });
  } catch (error) {
    console.error('Resolve Dispute Error:', error);
    return res.status(500).json({ message: 'Server error resolving dispute.', error: error.message });
  }
};
