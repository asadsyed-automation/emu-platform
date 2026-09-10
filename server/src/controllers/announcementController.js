import { Announcement } from '../models/Announcement.js';
import { Course } from '../models/Course.js';

/**
 * @desc Get all announcements (sorted by pinned first, then createdAt desc)
 * @route GET /api/v1/announcements
 */
export const getAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.query;
    let filter = {};

    if (courseId && courseId !== 'all') {
      filter = { $or: [{ courseId }, { courseCode: 'All Courses' }, { courseId: null }] };
    }

    const announcements = await Announcement.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .populate('courseId', 'code title');

    return res.status(200).json({ announcements, count: announcements.length });
  } catch (error) {
    console.error('Get Announcements Error:', error);
    return res.status(500).json({ message: 'Failed to fetch announcements.', error: error.message });
  }
};

/**
 * @desc Create a new announcement (Faculty / Admin only)
 * @route POST /api/v1/announcements
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, courseId, courseCode, tag, pinned } = req.body;
    const { user } = req;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    let resolvedCourseCode = courseCode || 'All Courses';
    if (courseId && courseId !== 'all') {
      const course = await Course.findById(courseId);
      if (course) resolvedCourseCode = course.code;
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      authorId: user._id,
      authorName: user.name,
      authorRole: user.role,
      courseId: courseId && courseId !== 'all' ? courseId : null,
      courseCode: resolvedCourseCode,
      tag: tag || 'General',
      pinned: !!pinned,
    });

    return res.status(201).json({ message: 'Announcement published successfully!', announcement });
  } catch (error) {
    console.error('Create Announcement Error:', error);
    return res.status(500).json({ message: 'Failed to create announcement.', error: error.message });
  }
};

/**
 * @desc Delete an announcement (Author / Admin only)
 * @route DELETE /api/v1/announcements/:id
 */
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    // Only owner or the creator can delete
    if (user.role !== 'owner' && announcement.authorId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this announcement.' });
    }

    await Announcement.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error('Delete Announcement Error:', error);
    return res.status(500).json({ message: 'Failed to delete announcement.', error: error.message });
  }
};
