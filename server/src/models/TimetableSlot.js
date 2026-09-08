import mongoose from 'mongoose';

const timetableSlotSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false, // Optional for Break slots like Jummah Break
      default: null,
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: {
      type: String, // e.g. "01:30 PM" or "13:30"
      required: true,
    },
    endTime: {
      type: String, // e.g. "02:20 PM" or "14:20"
      required: true,
    },
    room: {
      type: String,
      required: true,
      default: 'CTB1-02',
    },
    isLab: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isTBA: {
      type: Boolean,
      default: false,
    },
    slotType: {
      type: String,
      enum: ['theory', 'lab', 'online', 'break', 'tba'],
      default: 'theory',
    },
    customTitle: {
      type: String,
      default: '',
    },
    customInstructor: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const TimetableSlot = mongoose.model('TimetableSlot', timetableSlotSchema);

