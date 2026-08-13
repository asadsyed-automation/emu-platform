import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignmentQuizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssignmentQuiz',
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
    driveUrl: {
      type: String,
      required: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['on-time', 'late', 'missing'],
      required: true,
    },
    marksAwarded: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submissions for same assignment by student
submissionSchema.index({ assignmentQuizId: 1, studentId: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
