import mongoose from 'mongoose';

const auditHistorySchema = new mongoose.Schema({
  previousStatus: {
    type: String,
    enum: ['present', 'absent'],
  },
  newStatus: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
});

const attendanceRecordSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ['present', 'absent'],
      default: 'present',
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    history: [auditHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Enforce unique attendance record per student per lecture
attendanceRecordSchema.index({ lectureId: 1, studentId: 1 }, { unique: true });
// Index for fast query of a student's course attendance
attendanceRecordSchema.index({ studentId: 1, courseId: 1 });

export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);
