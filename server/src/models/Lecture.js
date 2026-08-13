import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    timetableSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimetableSlot',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    topic: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'attendance-open', 'attendance-closed'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate lecture instances for same slot on same date
lectureSchema.index({ courseId: 1, date: 1, timetableSlotId: 1 }, { unique: true });

export const Lecture = mongoose.model('Lecture', lectureSchema);
