import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
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
  { name: 'Qasim Niaz', email: 'qasim.niaz@emerson.edu.pk', rollNumber: 'TCH-AOA01' },
  { name: 'Rozina Riaz', email: 'rozina.riaz@emerson.edu.pk', rollNumber: 'TCH-CC01' },
  { name: 'Samra Mushtaq', email: 'samra.mushtaq@emerson.edu.pk', rollNumber: 'TCH-CS01' },
  { name: 'TO BE ASSIGNED (Computer Graphics)', email: 'cg.faculty@emerson.edu.pk', rollNumber: 'TCH-CG01' },
  { name: 'TO BE ASSIGNED (Foreign Language)', email: 'flng.faculty@emerson.edu.pk', rollNumber: 'TCH-FLNG01' },
  { name: 'TO BE ASSIGNED (Holy Quran-V)', email: 'arab.faculty@emerson.edu.pk', rollNumber: 'TCH-ARAB01' },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await TimetableSlot.deleteMany({});
    await Lecture.deleteMany({});
    console.log('🧹 Cleared existing users, courses, enrollments, slots, and lectures.');

    // 1. Create Real Owner Account (Shah G)
    const ownerPasswordHash = await User.hashPassword('OWNER-01');
    const owner = await User.create({
      rollNumber: 'OWNER-01',
      name: 'Asad Syed (Shah G)',
      email: 'owner@emerson.edu.pk',
      passwordHash: ownerPasswordHash,
      role: 'owner',
      otpVerified: true,
    });
    console.log(`👑 Owner Account Created: OWNER-01 (${owner.name})`);

    // 1b. Create Fictional Sandbox Demo Admin
    const demoAdminPassHash = await User.hashPassword('DEMO-ADM-01');
    const demoAdmin = await User.create({
      rollNumber: 'DEMO-ADM-01',
      name: 'Demo Admin (Portal Lead)',
      email: 'demo.admin@emerson.test',
      passwordHash: demoAdminPassHash,
      role: 'owner',
      otpVerified: true,
    });
    console.log(`👑 Demo Admin Created: DEMO-ADM-01 (${demoAdmin.name})`);

    // 2. Create Teachers Map
    const teacherDocMap = {};
    for (const t of teachersData) {
      const teacherPasswordHash = await User.hashPassword(t.rollNumber);
      const teacher = await User.create({
        ...t,
        passwordHash: teacherPasswordHash,
        role: 'teacher',
        otpVerified: true,
      });
      teacherDocMap[t.name] = teacher._id;
      console.log(`👨‍🏫 Teacher Created: ${teacher.name} (${teacher.email}) - Roll/Pass: ${teacher.rollNumber}`);
    }

    // 2b. Create Fictional Sandbox Demo Teacher
    const demoTeacherPassHash = await User.hashPassword('DEMO-TCH-01');
    const demoTeacher = await User.create({
      rollNumber: 'DEMO-TCH-01',
      name: 'Prof. Tariq Demo (Faculty)',
      email: 'demo.faculty@emerson.test',
      passwordHash: demoTeacherPassHash,
      role: 'teacher',
      otpVerified: true,
    });
    teacherDocMap['Prof. Tariq Demo (Faculty)'] = demoTeacher._id;
    console.log(`👨‍🏫 Demo Teacher Created: DEMO-TCH-01 (${demoTeacher.name})`);

    // 3. Create 6 Official 7th Semester Courses
    const coursesDefinition = [
      {
        key: 'AOA',
        title: 'Analysis of Algorithms',
        code: 'COSC-4113',
        teacherName: 'Qasim Niaz',
        creditHours: '3+0',
        defaultRoom: 'CTB1-02',
        isOnline: false,
        color: '#1E88E5',
      },
      {
        key: 'CC',
        title: 'Compiler Construction',
        code: 'COSE-4135',
        teacherName: 'Rozina Riaz',
        creditHours: '2+1',
        defaultRoom: 'CTB1-02 / CLab-06',
        isOnline: false,
        color: '#E65100',
      },
      {
        key: 'CG',
        title: 'Computer Graphics',
        code: 'COSE-4150',
        teacherName: 'TO BE ASSIGNED (Computer Graphics)',
        creditHours: '2+1',
        defaultRoom: 'CTB1-02 / CLab-06',
        isOnline: false,
        color: '#E91E63',
      },
      {
        key: 'CS',
        title: 'Cyber Security',
        code: 'IT-404',
        teacherName: 'Samra Mushtaq',
        creditHours: '3+0',
        defaultRoom: 'CTB1-02 / CLab-02',
        isOnline: false,
        color: '#00897B',
      },
      {
        key: 'FLNG',
        title: 'Foreign Language',
        code: 'FLNG-xxxx',
        teacherName: 'TO BE ASSIGNED (Foreign Language)',
        creditHours: '3+0',
        defaultRoom: 'Online',
        isOnline: true,
        color: '#8E24AA',
      },
      {
        key: 'QURAN',
        title: 'Translation of the Holy Quran-V',
        code: 'ARAB-3101',
        teacherName: 'TO BE ASSIGNED (Holy Quran-V)',
        creditHours: '3+0',
        defaultRoom: 'Online',
        isOnline: true,
        color: '#5E35B1',
      },
    ];

    const courseDocMap = {};
    for (const c of coursesDefinition) {
      const course = await Course.create({
        title: c.title,
        code: c.code,
        teacherId: teacherDocMap[c.teacherName],
        creditHours: c.creditHours,
        semesterLabel: '7th Semester (Fall 2026)',
        section: '7A',
        defaultRoom: c.defaultRoom,
        isOnline: c.isOnline,
        color: c.color,
      });
      courseDocMap[c.key] = course._id;
      console.log(`📚 Course Created: ${course.code} — ${course.title} (Cr: ${course.creditHours})`);
    }

    // 4. Create Students and Enroll in All Courses
    const studentUserDocs = await Promise.all(
      realStudentsData.map(async (s) => ({
        rollNumber: s.rollNumber,
        name: s.name,
        email: s.email,
        passwordHash: await User.hashPassword(s.rollNumber),
        role: 'student',
        otpVerified: false,
      }))
    );

    // 4b. Add Fictional Sandbox Demo Student
    const demoStudentDoc = {
      rollNumber: 'DEMO-STU-01',
      name: 'Demo Student (Zaid Khan)',
      email: 'demo.student@emerson.test',
      passwordHash: await User.hashPassword('DEMO-STU-01'),
      role: 'student',
      otpVerified: true,
    };
    studentUserDocs.push(demoStudentDoc);

    const insertedStudents = await User.insertMany(studentUserDocs);

    // Build student enrollment documents across all 6 courses
    const enrollmentDocs = [];
    for (const student of insertedStudents) {
      for (const courseId of Object.values(courseDocMap)) {
        enrollmentDocs.push({ studentId: student._id, courseId });
      }
    }
    await Enrollment.insertMany(enrollmentDocs);
    console.log(`🎓 Created & Enrolled ${insertedStudents.length} Students (including Demo Student) in all 6 courses.`);

    // 5. Seed Official 7th Semester Timetable Slots
    const slotsDefinition = [
      // Monday
      {
        courseKey: 'CC',
        dayOfWeek: 'Monday',
        startTime: '03:10 PM',
        endTime: '04:00 PM',
        room: 'CLab-06',
        isLab: true,
        slotType: 'lab',
      },
      {
        courseKey: 'AOA',
        dayOfWeek: 'Monday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Tuesday
      {
        courseKey: 'CC',
        dayOfWeek: 'Tuesday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },
      {
        courseKey: 'AOA',
        dayOfWeek: 'Tuesday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Wednesday
      {
        courseKey: 'CS',
        dayOfWeek: 'Wednesday',
        startTime: '01:30 PM',
        endTime: '02:20 PM',
        room: 'CLab-02',
        isLab: true,
        slotType: 'lab',
      },
      {
        courseKey: 'CG',
        dayOfWeek: 'Wednesday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        isTBA: true,
        slotType: 'tba',
      },
      {
        courseKey: 'CS',
        dayOfWeek: 'Wednesday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Thursday
      {
        courseKey: 'CC',
        dayOfWeek: 'Thursday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },
      {
        courseKey: 'CS',
        dayOfWeek: 'Thursday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        slotType: 'theory',
      },

      // Friday
      {
        courseKey: null,
        dayOfWeek: 'Friday',
        startTime: '01:30 PM',
        endTime: '02:20 PM',
        room: '—',
        isLab: false,
        slotType: 'break',
        customTitle: 'Jummah Break',
      },
      {
        courseKey: 'CG',
        dayOfWeek: 'Friday',
        startTime: '02:20 PM',
        endTime: '03:10 PM',
        room: 'CLab-06',
        isLab: true,
        isTBA: true,
        slotType: 'lab',
      },
      {
        courseKey: 'CG',
        dayOfWeek: 'Friday',
        startTime: '04:00 PM',
        endTime: '04:50 PM',
        room: 'CTB1-02',
        isLab: false,
        isTBA: true,
        slotType: 'tba',
      },
      {
        courseKey: 'CG',
        dayOfWeek: 'Friday',
        startTime: '04:50 PM',
        endTime: '05:40 PM',
        room: 'CTB1-02',
        isLab: false,
        isTBA: true,
        slotType: 'theory',
      },
      {
        courseKey: 'QURAN',
        dayOfWeek: 'Friday',
        startTime: '05:40 PM',
        endTime: '06:30 PM',
        room: 'Online',
        isOnline: true,
        isTBA: true,
        slotType: 'online',
      },
      {
        courseKey: 'FLNG',
        dayOfWeek: 'Friday',
        startTime: '06:30 PM',
        endTime: '07:20 PM',
        room: 'Online',
        isOnline: true,
        isTBA: true,
        slotType: 'online',
      },
    ];

    const slotObjects = slotsDefinition.map((slotDef) => ({
      courseId: slotDef.courseKey ? courseDocMap[slotDef.courseKey] : null,
      dayOfWeek: slotDef.dayOfWeek,
      startTime: slotDef.startTime,
      endTime: slotDef.endTime,
      room: slotDef.room,
      isLab: slotDef.isLab || false,
      isOnline: slotDef.isOnline || false,
      isTBA: slotDef.isTBA || false,
      slotType: slotDef.slotType || 'theory',
      customTitle: slotDef.customTitle || '',
    }));

    const slotDocs = await TimetableSlot.insertMany(slotObjects);
    console.log(`📅 Created ${slotDocs.length} Official 7th Semester Timetable Slots.`);

    // 6. Generate Dated Lecture Instances for the Semester (16 Weeks: Aug 10 - Nov 27, 2026)
    const startDate = new Date('2026-08-10');
    const endDate = new Date('2026-11-27');
    const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const lectureDocs = [];
    const curDate = new Date(startDate);
    curDate.setHours(0, 0, 0, 0);

    while (curDate <= endDate) {
      const dayName = dayNameMap[curDate.getDay()];
      const matchingSlots = slotDocs.filter((s) => s.dayOfWeek === dayName && s.courseId);

      for (const slot of matchingSlots) {
        lectureDocs.push({
          courseId: slot.courseId,
          timetableSlotId: slot._id,
          date: new Date(curDate),
          status: 'scheduled',
        });
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    await Lecture.insertMany(lectureDocs);
    console.log(`⏱️ Auto-Generated ${lectureDocs.length} Dated Lecture Instances across the 16-week semester!`);

    console.log('\n✨ Database Seeding Complete for BSCS 7th Semester (Section 7A)!');
    console.log('------------------------------------------------------------------------');
    console.log(`Owner Account:   Name: "Asad Syed (Shah G)" | Password: OWNER-01`);
    console.log(`Teacher Login:   Name: "Qasim Niaz"         | Password: TCH-AOA01`);
    console.log(`Teacher Login:   Name: "Rozina Riaz"        | Password: TCH-CC01`);
    console.log(`Teacher Login:   Name: "Samra Mushtaq"      | Password: TCH-CS01`);
    console.log(`Shah G Student:  Name: "Syed Asad Ali Raza Shah" | Password: COSC231122114 | Email: asadraza5670@gmail.com`);
    console.log(`Other Students:  Name on roll list          | Password: <their roll number>`);
    console.log('------------------------------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

