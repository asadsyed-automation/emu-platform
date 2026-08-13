import { Lecture } from '../models/Lecture.js';
import { TimetableSlot } from '../models/TimetableSlot.js';
import { Course } from '../models/Course.js';

/**
 * @desc Get dated lectures for a specific course or entire section
 * @route GET /api/v1/lectures
 */
export const getLectures = async (req, res) => {
  try {
    const { courseId, status } = req.query;
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (status) filter.status = status;

    const lectures = await Lecture.find(filter)
      .populate('courseId', 'title code')
      .populate('timetableSlotId')
      .sort({ date: 1, 'timetableSlotId.startTime': 1 });

    return res.status(200).json({ lectures, count: lectures.length });
  } catch (error) {
    console.error('Get Lectures Error:', error);
    return res.status(500).json({ message: 'Error fetching lecture instances.', error: error.message });
  }
};

/**
 * @desc Auto-generate dated lecture instances for a date range (Owner only)
 * @route POST /api/v1/admin/generate-lectures
 */
export const generateSemesterLectures = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    // Default semester dates if not passed: current date to 16 weeks ahead
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000);

    const slots = await TimetableSlot.find();
    if (slots.length === 0) {
      return res.status(400).json({ message: 'No timetable slots found. Seed or add timetable slots first.' });
    }

    const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let generatedCount = 0;
    let skippedCount = 0;

    const cur = new Date(start);
    cur.setHours(0, 0, 0, 0);
    const stop = new Date(end);
    stop.setHours(23, 59, 59, 999);

    while (cur <= stop) {
      const dayName = dayNameMap[cur.getDay()];
      const daySlots = slots.filter((s) => s.dayOfWeek === dayName);

      for (const slot of daySlots) {
        const lectureDate = new Date(cur);
        try {
          await Lecture.create({
            courseId: slot.courseId,
            timetableSlotId: slot._id,
            date: lectureDate,
            status: 'scheduled',
          });
          generatedCount++;
        } catch (err) {
          // Skip duplicates
          skippedCount++;
        }
      }

      cur.setDate(cur.getDate() + 1);
    }

    return res.status(200).json({
      message: `Lecture generation complete. Generated: ${generatedCount}, Existing/Skipped: ${skippedCount}`,
      summary: { generatedCount, skippedCount },
    });
  } catch (error) {
    console.error('Generate Lectures Error:', error);
    return res.status(500).json({ message: 'Error generating lecture calendar.', error: error.message });
  }
};
