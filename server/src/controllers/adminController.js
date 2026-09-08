import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { TimetableSlot } from '../models/TimetableSlot.js';
import { Lecture } from '../models/Lecture.js';

// ==========================================
// 1. STUDENT ACCOUNTS MANAGEMENT
// ==========================================

/**
 * @desc Bulk create student accounts from roll list (Owner only)
 * @route POST /api/v1/admin/bulk-create-students
 */
export const bulkCreateStudents = async (req, res) => {
  try {
    const { students, defaultPassword } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Payload must contain a non-empty array of students.' });
    }

    const fallbackPassword = defaultPassword || 'EMU@2026';
    const fallbackHash = await User.hashPassword(fallbackPassword);

    let createdCount = 0;
    let skippedCount = 0;
    const errors = [];
    const createdUsers = [];

    // Fetch all existing courses so we can auto-enroll newly created students
    const existingCourses = await Course.find();

    for (const item of students) {
      const rollNumber = (item.rollNumber || '').trim().toUpperCase();
      const name = (item.name || '').trim();
      const email = (item.email || '').trim().toLowerCase();

      if (!rollNumber || !name || !email) {
        errors.push({ rollNumber, name, error: 'Missing rollNumber, name, or email.' });
        skippedCount++;
        continue;
      }

      // Check if student already exists
      const existingUser = await User.findOne({
        $or: [{ rollNumber }, { email }],
      });

      if (existingUser) {
        skippedCount++;
        continue;
      }

      const passwordHash = item.password
        ? await User.hashPassword(item.password)
        : fallbackHash;

      const newUser = await User.create({
        rollNumber,
        name,
        email,
        passwordHash,
        role: 'student',
        otpVerified: false,
      });

      createdUsers.push(newUser);
      createdCount++;

      // Auto-enroll student into every existing course in the section
      for (const course of existingCourses) {
        await Enrollment.create({
          studentId: newUser._id,
          courseId: course._id,
        }).catch(() => {});
      }
    }

    return res.status(200).json({
      message: `Bulk creation complete. Created: ${createdCount}, Skipped/Existing: ${skippedCount}`,
      summary: {
        createdCount,
        skippedCount,
        errorCount: errors.length,
        errors,
      },
    });
  } catch (error) {
    console.error('Bulk Create Error:', error);
    return res.status(500).json({ message: 'Server error during bulk creation.', error: error.message });
  }
};

/**
 * @desc Create single student account (Owner only)
 * @route POST /api/v1/admin/create-student
 */
export const createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, password, otpVerified } = req.body;

    if (!name || !email || !rollNumber) {
      return res.status(400).json({ message: 'Name, email, and rollNumber are required.' });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      $or: [{ rollNumber: cleanRoll }, { email: cleanEmail }],
    });

    if (existing) {
      return res.status(400).json({ message: 'A user with this roll number or email already exists.' });
    }

    const passwordHash = await User.hashPassword(password || cleanRoll);

    const student = await User.create({
      rollNumber: cleanRoll,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'student',
      otpVerified: otpVerified === true,
    });

    // Auto-enroll in all courses
    const existingCourses = await Course.find();
    for (const course of existingCourses) {
      await Enrollment.create({
        studentId: student._id,
        courseId: course._id,
      }).catch(() => {});
    }

    return res.status(201).json({
      message: 'Student account created successfully.',
      student: {
        _id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        role: student.role,
        otpVerified: student.otpVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating student account.', error: error.message });
  }
};

/**
 * @desc Update student account (Owner only)
 * @route PUT /api/v1/admin/students/:id
 */
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, otpVerified } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Student account not found.' });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (rollNumber) user.rollNumber = rollNumber.trim().toUpperCase();
    if (typeof otpVerified === 'boolean') user.otpVerified = otpVerified;

    await user.save();

    return res.status(200).json({
      message: 'Student updated successfully.',
      student: {
        _id: user._id,
        rollNumber: user.rollNumber,
        name: user.name,
        email: user.email,
        role: user.role,
        otpVerified: user.otpVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating student account.', error: error.message });
  }
};

/**
 * @desc Delete student account (Owner only)
 * @route DELETE /api/v1/admin/students/:id
 */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Student account not found.' });
    }

    await User.findByIdAndDelete(id);
    await Enrollment.deleteMany({ studentId: id });

    return res.status(200).json({ message: 'Student account removed successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting student account.', error: error.message });
  }
};

/**
 * @desc Reset student password (Owner only)
 * @route POST /api/v1/admin/students/:id/reset-password
 */
export const resetStudentPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const pass = newPassword || user.rollNumber;
    user.passwordHash = await User.hashPassword(pass);
    await user.save();

    return res.status(200).json({ message: `Password reset successfully to: ${pass}` });
  } catch (error) {
    return res.status(500).json({ message: 'Error resetting password.', error: error.message });
  }
};

// ==========================================
// 2. FACULTY / TEACHER MANAGEMENT
// ==========================================

/**
 * @desc Create single teacher account (Owner only)
 * @route POST /api/v1/admin/create-teacher
 */
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, employeeId } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const rollNumber = (employeeId || `TCH-${Date.now().toString().slice(-4)}`).toUpperCase();
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await User.hashPassword(password || rollNumber);

    const teacher = await User.create({
      rollNumber,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'teacher',
      otpVerified: true,
    });

    return res.status(201).json({
      message: 'Teacher account created successfully.',
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        rollNumber: teacher.rollNumber,
        role: teacher.role,
        otpVerified: teacher.otpVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating teacher account.', error: error.message });
  }
};

/**
 * @desc Update teacher account (Owner only)
 * @route PUT /api/v1/admin/teachers/:id
 */
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, password } = req.body;

    const teacher = await User.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher account not found.' });
    }

    if (name) teacher.name = name.trim();
    if (email) teacher.email = email.trim().toLowerCase();
    if (rollNumber) teacher.rollNumber = rollNumber.trim().toUpperCase();
    if (password) teacher.passwordHash = await User.hashPassword(password);

    await teacher.save();

    return res.status(200).json({
      message: 'Teacher updated successfully.',
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        rollNumber: teacher.rollNumber,
        role: teacher.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating teacher account.', error: error.message });
  }
};

/**
 * @desc Delete teacher account (Owner only)
 * @route DELETE /api/v1/admin/teachers/:id
 */
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await User.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    // Set course teacherId to null if associated
    await Course.updateMany({ teacherId: id }, { $set: { teacherId: null } });
    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Teacher account deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting teacher account.', error: error.message });
  }
};

/**
 * @desc List all users by role (Owner only)
 * @route GET /api/v1/admin/users
 */
export const listUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-passwordHash -otpCode').sort({ rollNumber: 1 });
    return res.status(200).json({ users, count: users.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users list.' });
  }
};

// ==========================================
// 3. COURSES MANAGEMENT
// ==========================================

/**
 * @desc Create new academic course (Owner only)
 * @route POST /api/v1/admin/courses
 */
export const createCourse = async (req, res) => {
  try {
    const { title, code, teacherId, creditHours, semesterLabel, section, defaultRoom, isOnline, color } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: 'Course title and code are required.' });
    }

    const newCourse = await Course.create({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      teacherId: teacherId || null,
      creditHours: creditHours || '3+0',
      semesterLabel: semesterLabel || '7th Semester (Fall 2026)',
      section: section || '7A',
      defaultRoom: defaultRoom || 'CTB1-02',
      isOnline: isOnline === true,
      color: color || 'var(--eum-maroon)',
    });

    // Auto-enroll all existing students in this new course
    const allStudents = await User.find({ role: 'student' });
    for (const student of allStudents) {
      await Enrollment.create({
        studentId: student._id,
        courseId: newCourse._id,
      }).catch(() => {});
    }

    const populated = await Course.findById(newCourse._id).populate('teacherId', 'name email rollNumber');

    return res.status(201).json({
      message: 'Course created successfully and enrolled for all students.',
      course: populated,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating course.', error: error.message });
  }
};

/**
 * @desc Update course details (Owner only)
 * @route PUT /api/v1/admin/courses/:id
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, teacherId, creditHours, semesterLabel, section, defaultRoom, isOnline, color } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (title !== undefined) course.title = title.trim();
    if (code !== undefined) course.code = code.trim().toUpperCase();
    if (teacherId !== undefined) course.teacherId = teacherId || null;
    if (creditHours !== undefined) course.creditHours = creditHours;
    if (semesterLabel !== undefined) course.semesterLabel = semesterLabel;
    if (section !== undefined) course.section = section;
    if (defaultRoom !== undefined) course.defaultRoom = defaultRoom;
    if (isOnline !== undefined) course.isOnline = isOnline;
    if (color !== undefined) course.color = color;

    await course.save();
    const populated = await Course.findById(course._id).populate('teacherId', 'name email rollNumber');

    return res.status(200).json({
      message: 'Course updated successfully.',
      course: populated,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating course.', error: error.message });
  }
};

/**
 * @desc Delete course (Owner only)
 * @route DELETE /api/v1/admin/courses/:id
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    await Course.findByIdAndDelete(id);
    await TimetableSlot.deleteMany({ courseId: id });
    await Enrollment.deleteMany({ courseId: id });
    await Lecture.deleteMany({ courseId: id });

    return res.status(200).json({ message: 'Course and related timetable slots deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting course.', error: error.message });
  }
};

// ==========================================
// 4. TIMETABLE SLOTS MANAGEMENT
// ==========================================

/**
 * @desc Create new timetable slot (Owner only)
 * @route POST /api/v1/admin/timetable-slots
 */
export const createTimetableSlot = async (req, res) => {
  try {
    const { courseId, dayOfWeek, startTime, endTime, room, isLab, isOnline, isTBA, slotType, customTitle, customInstructor } = req.body;

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ message: 'dayOfWeek, startTime, and endTime are required.' });
    }

    const slot = await TimetableSlot.create({
      courseId: courseId || null,
      dayOfWeek,
      startTime,
      endTime,
      room: room || 'CTB1-02',
      isLab: isLab === true,
      isOnline: isOnline === true,
      isTBA: isTBA === true,
      slotType: slotType || (isLab ? 'lab' : isOnline ? 'online' : isTBA ? 'tba' : 'theory'),
      customTitle: customTitle || '',
      customInstructor: customInstructor || '',
    });

    const populated = await TimetableSlot.findById(slot._id).populate({
      path: 'courseId',
      populate: { path: 'teacherId', select: 'name email rollNumber' },
    });

    return res.status(201).json({
      message: 'Timetable slot created successfully.',
      slot: populated,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating timetable slot.', error: error.message });
  }
};

/**
 * @desc Update timetable slot (Owner only)
 * @route PUT /api/v1/admin/timetable-slots/:id
 */
export const updateTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, dayOfWeek, startTime, endTime, room, isLab, isOnline, isTBA, slotType, customTitle, customInstructor } = req.body;

    const slot = await TimetableSlot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: 'Timetable slot not found.' });
    }

    if (courseId !== undefined) slot.courseId = courseId || null;
    if (dayOfWeek !== undefined) slot.dayOfWeek = dayOfWeek;
    if (startTime !== undefined) slot.startTime = startTime;
    if (endTime !== undefined) slot.endTime = endTime;
    if (room !== undefined) slot.room = room;
    if (isLab !== undefined) slot.isLab = isLab;
    if (isOnline !== undefined) slot.isOnline = isOnline;
    if (isTBA !== undefined) slot.isTBA = isTBA;
    if (slotType !== undefined) slot.slotType = slotType;
    if (customTitle !== undefined) slot.customTitle = customTitle;
    if (customInstructor !== undefined) slot.customInstructor = customInstructor;

    await slot.save();

    const populated = await TimetableSlot.findById(slot._id).populate({
      path: 'courseId',
      populate: { path: 'teacherId', select: 'name email rollNumber' },
    });

    return res.status(200).json({
      message: 'Timetable slot updated successfully.',
      slot: populated,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating timetable slot.', error: error.message });
  }
};

/**
 * @desc Delete timetable slot (Owner only)
 * @route DELETE /api/v1/admin/timetable-slots/:id
 */
export const deleteTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await TimetableSlot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: 'Timetable slot not found.' });
    }

    await TimetableSlot.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Timetable slot deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting timetable slot.', error: error.message });
  }
};

/**
 * @desc Reset timetable to official 7th semester schedule (Owner only)
 * @route POST /api/v1/admin/timetable-slots/reset-default
 */
export const resetDefaultTimetable = async (req, res) => {
  try {
    // 1. Fetch courses
    const courses = await Course.find();
    const courseMap = {};
    courses.forEach((c) => {
      courseMap[c.code] = c._id;
    });

    // 2. Clear existing slots
    await TimetableSlot.deleteMany({});

    // 3. Define Official 7th Semester Timetable (Exact from flyer)
    const officialSlots = [
      // Monday
      {
        courseId: courseMap['COSE-4135'] || null,
        dayOfWeek: 'Monday',
        startTime: '03:10 PM',
        endTime: '04:00 PM',
        room: 'CLab-06',
        isLab: true,
        slotType: 'lab',
      },
      {
        courseId: courseMap['COSC-4113'] || null,
        dayOfWeek: 'Monday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Tuesday
      {
        courseId: courseMap['COSE-4135'] || null,
        dayOfWeek: 'Tuesday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },
      {
        courseId: courseMap['COSC-4113'] || null,
        dayOfWeek: 'Tuesday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Wednesday
      {
        courseId: courseMap['IT-404'] || null,
        dayOfWeek: 'Wednesday',
        startTime: '01:30 PM',
        endTime: '02:20 PM',
        room: 'CLab-02',
        isLab: true,
        slotType: 'lab',
      },
      {
        courseId: courseMap['COSE-4150'] || null,
        dayOfWeek: 'Wednesday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        isTBA: true,
        slotType: 'tba',
      },
      {
        courseId: courseMap['IT-404'] || null,
        dayOfWeek: 'Wednesday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Thursday
      {
        courseId: courseMap['COSE-4135'] || null,
        dayOfWeek: 'Thursday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },
      {
        courseId: courseMap['IT-404'] || null,
        dayOfWeek: 'Thursday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Friday
      {
        courseId: null,
        dayOfWeek: 'Friday',
        startTime: '01:30 PM',
        endTime: '02:20 PM',
        room: '—',
        isLab: false,
        slotType: 'break',
        customTitle: 'Jummah Break',
      },
      {
        courseId: courseMap['COSE-4150'] || null,
        dayOfWeek: 'Friday',
        startTime: '02:20 PM',
        endTime: '03:10 PM',
        room: 'CLab-06',
        isLab: true,
        isTBA: true,
        slotType: 'lab',
      },
      {
        courseId: courseMap['COSE-4150'] || null,
        dayOfWeek: 'Friday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        isTBA: true,
        slotType: 'tba',
      },
      {
        courseId: courseMap['COSE-4150'] || null,
        dayOfWeek: 'Friday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        isTBA: true,
        slotType: 'theory',
      },
      {
        courseId: courseMap['ARAB-3101'] || null,
        dayOfWeek: 'Friday',
        startTime: '05:40 PM',
        endTime: '06:30 PM',
        room: 'Online',
        isOnline: true,
        isTBA: true,
        slotType: 'online',
      },
      {
        courseId: courseMap['FLNG-xxxx'] || null,
        dayOfWeek: 'Friday',
        startTime: '06:30 PM',
        endTime: '07:20 PM',
        room: 'Online',
        isOnline: true,
        isTBA: true,
        slotType: 'online',
      },
    ];

    const inserted = await TimetableSlot.insertMany(officialSlots);

    return res.status(200).json({
      message: `Reset complete! Created ${inserted.length} official 7th semester timetable slots.`,
      count: inserted.length,
    });
  } catch (error) {
    console.error('Reset Timetable Error:', error);
    return res.status(500).json({ message: 'Error resetting timetable slots.', error: error.message });
  }
};

// ==========================================
// 5. SEMESTER LECTURES SYNCHRONIZATION
// ==========================================

/**
 * @desc Re-sync and generate dated lecture instances for 16 weeks based on active timetable
 * @route POST /api/v1/admin/sync-lectures
 */
export const syncLectures = async (req, res) => {
  try {
    const slots = await TimetableSlot.find({ courseId: { $ne: null } });

    if (slots.length === 0) {
      return res.status(400).json({ message: 'No active timetable slots found. Please configure slots first.' });
    }

    // Default 16-week term window
    const startDate = new Date('2026-08-10');
    const endDate = new Date('2026-11-27');
    const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let createdCount = 0;
    const curDate = new Date(startDate);
    curDate.setHours(0, 0, 0, 0);

    while (curDate <= endDate) {
      const dayName = dayNameMap[curDate.getDay()];
      const matchingSlots = slots.filter((s) => s.dayOfWeek === dayName);

      for (const slot of matchingSlots) {
        if (!slot.courseId) continue;
        const exists = await Lecture.findOne({
          courseId: slot.courseId,
          timetableSlotId: slot._id,
          date: new Date(curDate),
        });

        if (!exists) {
          await Lecture.create({
            courseId: slot.courseId,
            timetableSlotId: slot._id,
            date: new Date(curDate),
            status: 'scheduled',
          });
          createdCount++;
        }
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    const totalLectures = await Lecture.countDocuments();

    return res.status(200).json({
      message: `Lectures synchronization complete. Added: ${createdCount} new instances. Total scheduled: ${totalLectures}.`,
      newCount: createdCount,
      totalCount: totalLectures,
    });
  } catch (error) {
    console.error('Sync Lectures Error:', error);
    return res.status(500).json({ message: 'Error synchronizing lectures.', error: error.message });
  }
};

