import mongoose from 'mongoose';

const timetableSlotSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: {
      type: String, // format "13:30"
      required: true,
    },
    endTime: {
      type: String, // format "14:20"
      required: true,
    },
    room: {
      type: String,
      required: true,
      default: 'BOT-B1-F-102',
    },
    isLab: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TimetableSlot = mongoose.model('TimetableSlot', timetableSlotSchema);
