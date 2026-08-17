import mongoose from 'mongoose';

const examSlotSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String, // e.g. "02:00 PM - 04:30 PM"
    required: true,
    default: '02:00 PM - 04:30 PM',
  },
  room: {
    type: String,
    default: 'BOT-B1-F-102',
  },
  instructor: {
    type: String,
    default: '',
  },
});

const academicEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['vacation', 'mid-term', 'final-term', 'sports-week', 'holiday', 'prep-leave'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    skipLectures: {
      type: Boolean,
      default: true,
    },
    examDatesheet: [examSlotSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const AcademicEvent = mongoose.model('AcademicEvent', academicEventSchema);
