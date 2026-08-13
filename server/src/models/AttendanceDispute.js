import mongoose from 'mongoose';

const voteItemSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vote: {
    type: String,
    enum: ['yes', 'no'],
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
  },
});

const attendanceDisputeSchema = new mongoose.Schema(
  {
    attendanceRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceRecord',
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    raisedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    peerVoterIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    votes: [voteItemSchema],
    peerResult: {
      type: String,
      enum: ['pending', 'supported', 'not-supported'],
      default: 'pending',
    },
    teacherDecision: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    teacherDecisionReason: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['voting', 'escalated', 'approved', 'rejected'],
      default: 'voting',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find disputes by student & course
attendanceDisputeSchema.index({ studentId: 1, courseId: 1 });

export const AttendanceDispute = mongoose.model('AttendanceDispute', attendanceDisputeSchema);
