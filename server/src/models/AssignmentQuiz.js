import mongoose from 'mongoose';

const assignmentQuizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    type: {
      type: String,
      enum: ['assignment', 'quiz'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 10,
    },
    examPeriod: {
      type: String,
      enum: ['before Mids', 'before Finals'],
      default: 'before Mids',
      required: true,
    },
    sequenceIndex: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
  },
  {
    timestamps: true,
  }
);

export const AssignmentQuiz = mongoose.model('AssignmentQuiz', assignmentQuizSchema);
