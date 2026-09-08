import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    creditHours: {
      type: String,
      default: '3+0',
    },
    semesterLabel: {
      type: String,
      required: true,
      default: '7th Semester (Fall 2026)',
    },
    section: {
      type: String,
      default: '7A',
    },
    defaultRoom: {
      type: String,
      default: 'CTB1-02',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'var(--eum-maroon)',
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model('Course', courseSchema);

