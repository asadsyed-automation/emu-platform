import { AcademicEvent } from '../models/AcademicEvent.js';
import { Lecture } from '../models/Lecture.js';
import { Course } from '../models/Course.js';

/**
 * @desc Get all academic events, vacations, and datesheets
 * @route GET /api/v1/academic-events
 */
export const getAllAcademicEvents = async (req, res) => {
  try {
    const events = await AcademicEvent.find()
      .populate('examDatesheet.courseId', 'title code teacherName')
      .populate('createdBy', 'name rollNumber')
      .sort({ startDate: 1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate countdowns for upcoming events
    const processedEvents = events.map((event) => {
      const start = new Date(event.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(event.endDate);
      end.setHours(23, 59, 59, 999);

      const diffTime = start.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isOngoing = today >= start && today <= end;
      const isPast = today > end;

      return {
        ...event.toObject(),
        daysLeft: isOngoing ? 0 : Math.max(0, daysLeft),
        isOngoing,
        isPast,
      };
    });

    return res.status(200).json({
      success: true,
      events: processedEvents,
    });
  } catch (error) {
    console.error('Error fetching academic events:', error);
    return res.status(500).json({ message: 'Server error loading academic events.', error: error.message });
  }
};

/**
 * @desc Get the nearest active / upcoming examination countdown
 * @route GET /api/v1/academic-events/countdown
 */
export const getExamCountdown = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingExams = await AcademicEvent.find({
      type: { $in: ['mid-term', 'final-term'] },
      endDate: { $gte: today },
    })
      .populate('examDatesheet.courseId', 'title code')
      .sort({ startDate: 1 });

    if (upcomingExams.length === 0) {
      return res.status(200).json({
        hasUpcoming: false,
        message: 'No upcoming examinations scheduled at this time.',
      });
    }

    const nextExam = upcomingExams[0];
    const start = new Date(nextExam.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(nextExam.endDate);
    end.setHours(23, 59, 59, 999);

    const diffTime = start.getTime() - today.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const isOngoing = today >= start && today <= end;

    return res.status(200).json({
      hasUpcoming: true,
      exam: {
        id: nextExam._id,
        title: nextExam.title,
        type: nextExam.type,
        startDate: nextExam.startDate,
        endDate: nextExam.endDate,
        daysLeft,
        isOngoing,
        description: nextExam.description,
        datesheet: nextExam.examDatesheet,
      },
    });
  } catch (error) {
    console.error('Error calculating countdown:', error);
    return res.status(500).json({ message: 'Error calculating exam countdown.', error: error.message });
  }
};

/**
 * @desc Create a new academic event (Vacation, Mid-term, Final-term datesheet) - Admin Only
 * @route POST /api/v1/academic-events
 */
export const createAcademicEvent = async (req, res) => {
  try {
    const { title, type, startDate, endDate, description, skipLectures, examDatesheet } = req.body;

    if (!title || !type || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, type, start date, and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'Start date cannot be after end date.' });
    }

    const newEvent = new AcademicEvent({
      title: title.trim(),
      type,
      startDate: start,
      endDate: end,
      description: (description || '').trim(),
      skipLectures: skipLectures !== undefined ? skipLectures : true,
      examDatesheet: Array.isArray(examDatesheet) ? examDatesheet : [],
      createdBy: req.user._id,
    });

    await newEvent.save();

    // Auto-adjust calendar: if skipLectures is true, mark any existing scheduled lectures in that window
    if (newEvent.skipLectures) {
      await Lecture.updateMany(
        {
          date: { $gte: start, $lte: end },
          status: 'scheduled',
        },
        {
          status: type === 'vacation' || type === 'holiday' ? 'attendance-closed' : 'attendance-closed',
          topic: `[${type.toUpperCase()}] ${title}`,
        }
      );
    }

    const populated = await AcademicEvent.findById(newEvent._id)
      .populate('examDatesheet.courseId', 'title code')
      .populate('createdBy', 'name rollNumber');

    return res.status(201).json({
      message: `${type === 'vacation' ? 'Vacation' : 'Exam schedule'} created and semester calendar adjusted successfully.`,
      event: populated,
    });
  } catch (error) {
    console.error('Create Event Error:', error);
    return res.status(500).json({ message: 'Error creating academic event.', error: error.message });
  }
};

/**
 * @desc Delete an academic event - Admin Only
 * @route DELETE /api/v1/academic-events/:id
 */
export const deleteAcademicEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await AcademicEvent.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Academic event not found.' });
    }

    await AcademicEvent.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Academic event removed successfully.',
    });
  } catch (error) {
    console.error('Delete Event Error:', error);
    return res.status(500).json({ message: 'Error deleting academic event.', error: error.message });
  }
};
