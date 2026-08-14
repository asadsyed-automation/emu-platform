import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { TimetableSlot } from '../models/TimetableSlot.js';
import { Lecture } from '../models/Lecture.js';

dotenv.config();

const realStudentsData = [
  { rollNumber: 'COSC231122102', name: 'Muhammad Ajmal', email: 'ajmalshahzad713@gmail.com' },
  { rollNumber: 'COSC231122104', name: 'Mueeza Yaqoob Khar', email: 'hyk41591@gmail.com' },
  { rollNumber: 'COSC231122105', name: 'Muneeb ur Rehman', email: 'momuneeb9@gmail.com' },
  { rollNumber: 'COSC231122107', name: 'Syed Kumail Haider Zaidi', email: 'kumailhaiderxl@gmail.com' },
  { rollNumber: 'COSC231122109', name: 'Anam Gulzar', email: 'anumkashif514@gmail.com' },
  { rollNumber: 'COSC231122111', name: 'Hamad Jamil', email: 'hammadranar65@gmail.com' },
  { rollNumber: 'COSC231122112', name: 'Muhammad Ikramullah', email: 'ikramrumi516@gmail.com' },
  { rollNumber: 'COSC231122113', name: 'Sami Ullah', email: 'cosc231122113@emerson.edu.pk' },
  { rollNumber: 'COSC231122114', name: 'Syed Asad Ali Raza Shah', email: 'asadraza5670@gmail.com' },
  { rollNumber: 'COSC231122115', name: 'Abdullah Zahoor', email: 'zahoorabdullah5062@gmail.com' },
  { rollNumber: 'COSC231122117', name: 'Mubashir Umar', email: 'mubashirumar957@gmail.com' },
  { rollNumber: 'COSC231122118', name: 'Muhammad Adnan', email: 'adnanmeer7860@gmail.com' },
  { rollNumber: 'COSC231122119', name: 'Muhammad Salman Qadir', email: 'msalmanqadir590@gmail.com' },
  { rollNumber: 'COSC231122120', name: 'Huzaifa Inam', email: 'awanhuzaifa889@gmail.com' },
  { rollNumber: 'COSC231122122', name: 'Muhammad Aqeel', email: 'aqeeldigizix5544@gmail.com' },
  { rollNumber: 'COSC231122123', name: 'Muhammad Hamraz', email: 'muhammadhamrazofficial@gmail.com' },
  { rollNumber: 'COSC231122124', name: 'Maryam Ishfaq', email: 'maryamishfaq434@gmail.com' },
  { rollNumber: 'COSC231122125', name: 'Areeba Ikram', email: 'areebaikram388@gmail.com' },
  { rollNumber: 'COSC231122126', name: 'Saad Saddique', email: 'saadsiddique60@gmail.com' },
  { rollNumber: 'COSC231122127', name: 'Irej Arshad', email: 'irejarshad0125@gmail.com' },
  { rollNumber: 'COSC231122128', name: 'Muhammad Huzaifa', email: 'huzafamajid165@gmail.com' },
  { rollNumber: 'COSC231122129', name: 'Muqaddas Bibi', email: 'muqaddashussain42@gmail.com' },
  { rollNumber: 'COSC231122130', name: 'Abdul Rauf', email: 'rauf30548@gmail.com' },
  { rollNumber: 'COSC231122131', name: 'Zubair Hussain', email: 'muhammadzubair154@gmail.com' },
  { rollNumber: 'COSC231122132', name: 'Muhammad Shazaib Rizwan', email: 'shahzaiby71@gmail.com' },
  { rollNumber: 'COSC231122133', name: 'Muhammad Yaqoob', email: 'yaqoobalam7939@gmail.com' },
  { rollNumber: 'COSC231122134', name: 'Muhammad Amman', email: 'muhammadamman27@gmail.com' },
  { rollNumber: 'COSC231122135', name: 'Areesha Farhat', email: 'areesh149@gmail.com' },
  { rollNumber: 'COSC231122136', name: 'Yasam Ali', email: 'yasamali734@gmail.com' },
  { rollNumber: 'COSC231122137', name: 'Aown Raza', email: 'aownraza7272@gmail.com' },
  { rollNumber: 'COSC231122138', name: 'Nida Akram', email: 'nidaakram41749@gmail.com' },
  { rollNumber: 'COSC231122139', name: 'Muhammad Zohaib', email: 'stolidkha@gmail.com' },
  { rollNumber: 'COSC231122140', name: 'Muhammad Usman Ahmad', email: 'manu9malik@gmail.com' },
  { rollNumber: 'COSC231122141', name: 'Abdullah Farooq', email: 'abdullahfarooqmuhammad@gmail.com' },
  { rollNumber: 'COSC231122142', name: 'Muhammad Awais', email: 'awaits.awais124@gmail.com' },
  { rollNumber: 'COSC231122143', name: 'Asma Khalid', email: 'asmakhalid0781@gmail.com' },
  { rollNumber: 'COSC231122144', name: 'Zainab Naveed', email: 'zainabnaveed0802@gmail.com' },
  { rollNumber: 'COSC231122145', name: 'Muhammad Nafil Azam Qureshi', email: 'cosc231122145@emerson.edu.pk' },
  { rollNumber: 'COSC231122146', name: 'Muhammad Faheem Saeed', email: 'fahimsaeed07@gmail.com' },
  { rollNumber: 'COSC231122147', name: 'Usman Shukoor', email: 'usmanshakoorsumra@gmail.com' },
  { rollNumber: 'COSC231122148', name: 'Muhammad Kashif', email: 'mkhashif789@gmail.com' },
  { rollNumber: 'COSC231122149', name: 'Muhammad Azwar', email: 'cosc231122149@emerson.edu.pk' },
  { rollNumber: 'COSC231122150', name: 'Hammad Zaheer', email: 'hamadzaheer4267@gmail.com' },
  { rollNumber: 'COSC231122151', name: 'Muhammad Khawar Shahzad', email: 'khawarshahzad2057@gmail.com' },
  { rollNumber: 'COSC231122152', name: 'Syed Ali Naqi Zaidi', email: 'syedalinaqqiz@gmail.com' },
  { rollNumber: 'COSC231122153', name: 'Muhammad Zahid', email: 'zahidchohan003@gmail.com' },
  { rollNumber: 'COSC231122154', name: 'Awais Mazhar', email: 'awaiss.khan05@gmail.com' },
  { rollNumber: 'COSC231122155', name: 'Muhammad Sharjeel', email: 'sharjeel2172@gmail.com' },
  { rollNumber: 'COSC231122156', name: 'Mubashir Mehmood', email: 'mubashir.mehmood@gmail.com' },
  { rollNumber: 'COSC231122157', name: 'Muhammad Abdullah', email: 'abdullahexpert@gmail.com' },
  { rollNumber: 'COSC231122158', name: 'Ghanwa Alina', email: 'ghanwaaleena12@gmail.com' },
  { rollNumber: 'COSC231122159', name: 'Muhammad Hasnain', email: 'hasnain.rana.bs.cs@gmail.com' },
  { rollNumber: 'COSC231122160', name: 'Muhammad Imran', email: 'cosc231122160@emerson.edu.pk' },
  { rollNumber: 'COSC231122161', name: 'Muhammad Mubeen', email: 'mubeenzahoor4078@gmail.com' },
];

const teachersData = [
  { name: 'Dr. Wasif Akbar', email: 'wasif.akbar@emerson.edu.pk', rollNumber: 'TCH-CC01' },
  { name: 'Ms. Samia Nasir', email: 'samia.nasir@emerson.edu.pk', rollNumber: 'TCH-HCI01' },
  { name: 'Mr. Muhammad Farhan', email: 'muhammad.farhan@emerson.edu.pk', rollNumber: 'TCH-MATH01' },
  { name: 'Mr. Usman Mohyuddin', email: 'usman.mohyuddin@emerson.edu.pk', rollNumber: 'TCH-PDC01' },
  { name: 'Mr. Ammar Haider', email: 'ammar.haider@emerson.edu.pk', rollNumber: 'TCH-MKT01' },
  { name: 'Ms. Faeza Ayub', email: 'faezaayub134@gmail.com', rollNumber: 'TCH-ENG01' },
];

const seedData = async () => {
  try {
    const directUri = "mongodb://eumsyedasad14_db_user:QvBWyzG0fXdawsSQ@ac-x53x6do-shard-00-00.sjjmybr.mongodb.net:27017/emu_db?ssl=true&authSource=admin&directConnection=true";

    try {
      await mongoose.connect(directUri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB Atlas via Direct Host!');
    } catch (err) {
      console.warn('⚠️ Direct host connection failed, trying SRV string...');
      const connStr = process.env.MONGODB_URI || "mongodb+srv://eumsyedasad14_db_user:QvBWyzG0fXdawsSQ@cluster0.sjjmybr.mongodb.net/emu_db?retryWrites=true&w=majority";
      await mongoose.connect(connStr, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB Atlas via SRV!');
    }

    // Clear existing collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await TimetableSlot.deleteMany({});
    await Lecture.deleteMany({});
    console.log('🧹 Cleared existing users, courses, enrollments, slots, and lectures.');

    const defaultPasswordHash = await User.hashPassword('Password123!');

    // 1. Create Owner Account (Shah G)
    const owner = await User.create({
      rollNumber: 'OWNER-01',
      name: 'Asad Syed (Shah G)',
      email: 'owner@emerson.edu.pk',
      passwordHash: defaultPasswordHash,
      role: 'owner',
      otpVerified: true,
    });
    console.log(`👑 Owner Account Created: OWNER-01 (${owner.name})`);

    // 2. Create Teachers Map
    const teacherDocMap = {};
    for (const t of teachersData) {
      const teacher = await User.create({
        ...t,
        passwordHash: defaultPasswordHash,
        role: 'teacher',
        otpVerified: true,
      });
      teacherDocMap[t.name] = teacher._id;
      console.log(`👨‍🏫 Teacher Created: ${teacher.name} (${teacher.email})`);
    }

    // 3. Create Courses
    const coursesDefinition = [
      { key: 'CC', title: 'Cloud Computing', code: 'COSE-4149', teacherName: 'Dr. Wasif Akbar' },
      { key: 'HCI', title: 'HCI & Computer Graphics', code: 'COSE-3133', teacherName: 'Ms. Samia Nasir' },
      { key: 'MATH', title: 'Multivariable Calculus', code: 'MATH-3181', teacherName: 'Mr. Muhammad Farhan' },
      { key: 'PDC', title: 'Parallel & Distributed Computing', code: 'COSE-3136', teacherName: 'Mr. Usman Mohyuddin' },
      { key: 'MKT', title: 'Principles of Marketing', code: 'BUAD-2123', teacherName: 'Mr. Ammar Haider' },
      { key: 'ENG', title: 'Technical & Business Writing', code: 'ENGL-3184', teacherName: 'Ms. Faeza Ayub' },
    ];

    const courseDocMap = {};
    for (const c of coursesDefinition) {
      const course = await Course.create({
        title: c.title,
        code: c.code,
        teacherId: teacherDocMap[c.teacherName],
        semesterLabel: 'Fall 2026',
      });
      courseDocMap[c.key] = course._id;
      console.log(`📚 Course Created: ${course.code} — ${course.title}`);
    }

    // 4. Create Students and Enroll in All Courses
    let studentCount = 0;
    for (const s of realStudentsData) {
      const student = await User.create({
        rollNumber: s.rollNumber,
        name: s.name,
        email: s.email,
        passwordHash: defaultPasswordHash,
        role: 'student',
        otpVerified: s.rollNumber === 'COSC231122114',
      });

      for (const courseId of Object.values(courseDocMap)) {
        await Enrollment.create({ studentId: student._id, courseId });
      }
      studentCount++;
    }
    console.log(`🎓 Created & Enrolled ${studentCount} Students in all 6 courses.`);

    // 5. Seed 15 Timetable Slots matching Official EUM Grid
    const slotsDefinition = [
      // Monday
      { courseKey: 'PDC', dayOfWeek: 'Monday', startTime: '13:30', endTime: '14:20', room: 'BOT-B1-F-102', isLab: false },
      { courseKey: 'CC', dayOfWeek: 'Monday', startTime: '14:20', endTime: '15:10', room: 'BOT-B1-F-102', isLab: false },
      { courseKey: 'HCI', dayOfWeek: 'Monday', startTime: '15:10', endTime: '16:00', room: 'BOT-B1-F-102', isLab: false },
      // Tuesday
      { courseKey: 'PDC', dayOfWeek: 'Tuesday', startTime: '13:30', endTime: '14:20', room: 'BOT-B1-F-102', isLab: false },
      { courseKey: 'CC', dayOfWeek: 'Tuesday', startTime: '14:20', endTime: '15:10', room: 'BOT-B1-F-102', isLab: false },
      { courseKey: 'HCI', dayOfWeek: 'Tuesday', startTime: '15:10', endTime: '16:00', room: 'BOT-B1-F-102', isLab: false },
      // Wednesday
      { courseKey: 'CC', dayOfWeek: 'Wednesday', startTime: '12:30', endTime: '13:30', room: 'LAB BLOCK', isLab: true },
      { courseKey: 'ENG', dayOfWeek: 'Wednesday', startTime: '13:30', endTime: '14:45', room: 'BOT-B1-F-102', isLab: false },
      { courseKey: 'MATH', dayOfWeek: 'Wednesday', startTime: '14:45', endTime: '16:00', room: 'BOT-B1-F-102', isLab: false },
      // Thursday
      { courseKey: 'HCI', dayOfWeek: 'Thursday', startTime: '12:30', endTime: '13:30', room: 'LAB BLOCK', isLab: true },
      { courseKey: 'MATH', dayOfWeek: 'Thursday', startTime: '13:30', endTime: '14:45', room: 'BOT-B1-F-102', isLab: false },
      { courseKey: 'MKT', dayOfWeek: 'Thursday', startTime: '14:45', endTime: '16:00', room: 'BOT-B1-F-102', isLab: false },
      // Friday
      { courseKey: 'PDC', dayOfWeek: 'Friday', startTime: '12:30', endTime: '13:30', room: 'LAB BLOCK', isLab: true },
      { courseKey: 'MKT', dayOfWeek: 'Friday', startTime: '13:30', endTime: '14:45', room: 'BOT-B1-F-102', isLab: false },
      { courseKey: 'ENG', dayOfWeek: 'Friday', startTime: '14:45', endTime: '16:00', room: 'BOT-B1-F-102', isLab: false },
    ];

    const slotDocs = [];
    for (const slotDef of slotsDefinition) {
      const slot = await TimetableSlot.create({
        courseId: courseDocMap[slotDef.courseKey],
        dayOfWeek: slotDef.dayOfWeek,
        startTime: slotDef.startTime,
        endTime: slotDef.endTime,
        room: slotDef.room,
        isLab: slotDef.isLab,
      });
      slotDocs.push(slot);
    }
    console.log(`📅 Created ${slotDocs.length} Recurring Timetable Slots matching official grid.`);

    // 6. Generate Dated Lecture Instances for the Semester (16 Weeks starting from Aug 2026)
    const startDate = new Date('2026-08-10');
    const endDate = new Date('2026-11-27');
    const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let lectureCount = 0;
    const curDate = new Date(startDate);
    curDate.setHours(0, 0, 0, 0);

    while (curDate <= endDate) {
      const dayName = dayNameMap[curDate.getDay()];
      const matchingSlots = slotDocs.filter((s) => s.dayOfWeek === dayName);

      for (const slot of matchingSlots) {
        await Lecture.create({
          courseId: slot.courseId,
          timetableSlotId: slot._id,
          date: new Date(curDate),
          status: 'scheduled',
        });
        lectureCount++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    console.log(`⏱️ Auto-Generated ${lectureCount} Dated Lecture Instances across the 16-week semester!`);

    console.log('\n✨ Database Seeding Complete!');
    console.log('------------------------------------------------------------------------');
    console.log(`Owner Account:   OWNER-01 / Password123!`);
    console.log(`Shah G Student:  COSC231122114 / Password123! (Pre-verified)`);
    console.log(`Other Students:  COSC231122102 ... COSC231122161 / Password123!`);
    console.log(`Teacher Login:   TCH-CC01 / Password123! (Dr. Wasif Akbar)`);
    console.log('------------------------------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
