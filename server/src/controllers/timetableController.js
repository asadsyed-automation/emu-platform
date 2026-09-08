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
        select: 'title code creditHours defaultRoom isOnline color semesterLabel section',
        populate: { path: 'teacherId', select: 'name email rollNumber' },
      });

    // Time ordering helper for slot sorting
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const clean = timeStr.trim().toUpperCase();
      const match = clean.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
      if (!match) return 0;
      let hours = parseInt(match[1], 10);
      const mins = parseInt(match[2], 10);
      const meridiem = match[3];

      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      return hours * 60 + mins;
    };

    const sortedSlots = [...slots].sort((a, b) => {
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = {};

    daysOrder.forEach((day) => {
      grouped[day] = sortedSlots.filter((slot) => slot.dayOfWeek === day);
    });

    return res.status(200).json({
      timetable: grouped,
      allSlots: sortedSlots,
      days: daysOrder.slice(0, 5),
    });
  } catch (error) {
    console.error('Get Timetable Error:', error);
    return res.status(500).json({ message: 'Error fetching weekly timetable.', error: error.message });
  }
};

