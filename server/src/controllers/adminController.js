import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';

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
        otpVerified: false, // Must verify OTP on first login
      });

      createdUsers.push(newUser);
      createdCount++;

      // Auto-enroll student into every existing course in the section
      for (const course of existingCourses) {
        await Enrollment.create({
          studentId: newUser._id,
          courseId: course._id,
        }).catch((err) => {
          // Ignore duplicate enrollment error if any
        });
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
 * @desc Create single teacher account (Owner only)
 * @route POST /api/v1/admin/create-teacher
 */
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, employeeId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const rollNumber = (employeeId || `TCH-${Date.now().toString().slice(-4)}`).toUpperCase();
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await User.hashPassword(password);

    const teacher = await User.create({
      rollNumber,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'teacher',
      otpVerified: true, // Teachers created by owner can be pre-verified
    });

    return res.status(201).json({
      message: 'Teacher account created successfully.',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        rollNumber: teacher.rollNumber,
        role: teacher.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating teacher account.', error: error.message });
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
