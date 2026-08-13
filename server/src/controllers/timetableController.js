import { TimetableSlot } from '../models/TimetableSlot.js';

/**
 * @desc Get complete weekly timetable grid for section
 * @route GET /api/v1/timetable
 */
export const getWeeklyTimetable = async (req, res) => {
  try {
    const slots = await TimetableSlot.find()
      .populate({
        path: 'courseId',
        select: 'title code semesterLabel',
        populate: { path: 'teacherId', select: 'name email' },
      })
      .sort({ startTime: 1 });

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const grouped = {};

    daysOrder.forEach((day) => {
      grouped[day] = slots.filter((slot) => slot.dayOfWeek === day);
    });

    return res.status(200).json({
      timetable: grouped,
      allSlots: slots,
    });
  } catch (error) {
    console.error('Get Timetable Error:', error);
    return res.status(500).json({ message: 'Error fetching weekly timetable.', error: error.message });
  }
};
