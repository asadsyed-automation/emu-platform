import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { OwnerBulkImportModal } from '../components/OwnerBulkImportModal';
import { TimetableGrid } from '../components/TimetableGrid';
import { LectureCalendar } from '../components/LectureCalendar';
import { FastAttendanceSheet } from '../components/FastAttendanceSheet';
import { StudentAttendanceSummary } from '../components/StudentAttendanceSummary';
import { CourseAttendanceReport } from '../components/CourseAttendanceReport';
import { TeacherDisputeQueue } from '../components/TeacherDisputeQueue';
import { AssessmentManager } from '../components/AssessmentManager';
import { StudentCourseworkList } from '../components/StudentCourseworkList';
import { TeacherGradingMatrix } from '../components/TeacherGradingMatrix';
import { DatewiseAttendanceRegister } from '../components/DatewiseAttendanceRegister';
import { SubmissionStatusMatrix } from '../components/SubmissionStatusMatrix';
import { AnnouncementsBoard } from '../components/AnnouncementsBoard';
import { ResultsImportManager } from '../components/ResultsImportManager';
import { EnrolledCoursesView } from '../components/EnrolledCoursesView';
import { StudentDisputesView } from '../components/StudentDisputesView';
import { AcademicScheduleManager } from '../components/AcademicScheduleManager';
import { ExamCountdownWidget } from '../components/ExamCountdownWidget';
import {
  Shield,
  User,
  GraduationCap,
  UserPlus,
  CheckCircle2,
  RefreshCw,
  CheckSquare,
  PlusCircle,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  CalendarCheck,
  AlertCircle,
  FileCheck,
  BookOpen,
  Bell,
  Clock,
  Zap,
  TrendingUp,
  Award,
  Users,
  CalendarDays,
  UploadCloud,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage = ({ mobileSidebarOpen: externalMobileOpen, onCloseMobileSidebar }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [localMobileOpen, setLocalMobileOpen] = useState(false);

  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : localMobileOpen;
  const handleCloseMobile = () => {
    setLocalMobileOpen(false);
    if (onCloseMobileSidebar) onCloseMobileSidebar();
  };

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [generatingLectures, setGeneratingLectures] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [activeFastMarkLecture, setActiveFastMarkLecture] = useState(null);
  const [todaysLectures, setTodaysLectures] = useState([]);

  // Fetch users for admin/owner
  const fetchUsers = async () => {
    if (user?.role !== 'owner') return;
    setLoadingUsers(true);
    try {
      const res = await API.get('/admin/users');
      setUsersList(res.data.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch lectures for teacher attendance marking
  const fetchLecturesForMarking = async () => {
    try {
      const res = await API.get('/lectures');
      setTodaysLectures(res.data.lectures || []);
    } catch (err) {
      console.error('Error loading lectures:', err);
    }
  };

  const handleGenerateLectures = async () => {
    setGeneratingLectures(true);
    setActionMessage('');
    try {
      const res = await API.post('/lectures/generate-semester');
      setActionMessage(res.data.message || 'Semester lectures generated successfully!');
      fetchLecturesForMarking();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Error generating semester lectures.');
    } finally {
      setGeneratingLectures(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLecturesForMarking();
  }, [user]);

  // Demo Attendance trigger: opens the first available lecture in fast attendance sheet
  const handleLaunchDemoAttendance = (lectureObj) => {
    const targetLecture = lectureObj || (todaysLectures.length > 0 ? todaysLectures[0] : {
      _id: '6a81895f4a3d82e0a1550d55',
      date: new Date(),
      status: 'scheduled',
      courseId: {
        _id: '6a8189584a3d82e0a1550bb5',
        code: 'COSE-4149',
        title: 'Cloud Computing',
      },
    });
    setActiveFastMarkLecture(targetLecture);
  };

  return (
    <div className="dashboard-layout">
      {/* Persistent Left Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setActiveFastMarkLecture(null);
          handleCloseMobile();
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Welcome & Context Banner */}
        <div
          className="no-print animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '22px 26px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.45rem', color: 'var(--eum-maroon)' }}>
                Welcome, {user?.name}!
              </h2>
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> OTP Verified
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Logged in as <strong>{user?.rollNumber}</strong> ({user?.role?.toUpperCase()}) • BS(CS) 7th Semester (Fall 2026)
            </p>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(user?.role === 'teacher' || user?.role === 'owner') && (
              <button
                onClick={() => setShowAssessmentModal(!showAssessmentModal)}
                className="btn btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.84rem' }}
              >
                <PlusCircle size={15} />
                <span>{showAssessmentModal ? 'Hide Form' : '+ New Assessment'}</span>
              </button>
            )}

            {user?.role === 'owner' && (
              <>
                <button
                  onClick={handleGenerateLectures}
                  disabled={generatingLectures}
                  className="btn btn-outline"
                  style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                >
                  <RefreshCw size={15} className={generatingLectures ? 'spin' : ''} />
                  <span>{generatingLectures ? 'Generating...' : 'Auto-Generate Lectures'}</span>
                </button>
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  <UserPlus size={16} />
                  <span>Bulk Import</span>
                </button>
              </>
            )}
          </div>
        </div>

        {actionMessage && (
          <div
            className="no-print"
            style={{
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Assessment Publisher Modal / In-line */}
        {showAssessmentModal && (user?.role === 'teacher' || user?.role === 'owner') && (
          <AssessmentManager onCreated={() => setShowAssessmentModal(false)} />
        )}

        {/* ------------------------------------------------------------- */}
        {/* FAST ATTENDANCE MARKING MODAL / VIEW (IF ACTIVE) */}
        {/* ------------------------------------------------------------- */}
        {activeFastMarkLecture ? (
          <FastAttendanceSheet
            lecture={activeFastMarkLecture}
            onBack={() => setActiveFastMarkLecture(null)}
            onSubmitted={() => {
              setActiveFastMarkLecture(null);
              fetchLecturesForMarking();
            }}
          />
        ) : (
          <>
            {/* ========================================================= */}
            {/* ROLE 1: STUDENT DASHBOARD TABS */}
            {/* ========================================================= */}
            {user?.role === 'student' && (
              <>
                {/* TAB 1: STUDENT OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    {/* Real-Time Exam Countdown Banner */}
                    <ExamCountdownWidget onOpenDatesheet={() => setActiveTab('datesheet')} />

                    {/* Quick Stats Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Aggregate Attendance
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--eum-green)', lineHeight: 1.1 }}>
                          88.5%
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--eum-green)', marginTop: '4px', fontWeight: '600' }}>
                          ✓ Above 75% Examination Threshold
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Upcoming Deadlines
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--eum-maroon)', lineHeight: 1.1 }}>
                          2 Pending
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Cloud Computing & HCI assignments
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Disputes Status
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#8C6800', lineHeight: 1.1 }}>
                          1 In Review
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          2/3 Peer votes gathered
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Enrolled Courses
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: 1.1 }}>
                          6 Subjects
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          18 Credit Hours (Theory + Labs)
                        </div>
                      </div>
                    </div>

                    <StudentAttendanceSummary />
                    <StudentCourseworkList />
                    <TimetableGrid />
                  </div>
                )}

                {/* TAB 2: MY ATTENDANCE */}
                {activeTab === 'attendance' && (
                  <div className="animate-fade-in">
                    <StudentAttendanceSummary />
                    <LectureCalendar />
                  </div>
                )}

                {/* TAB 3: MY DISPUTES */}
                {activeTab === 'disputes' && (
                  <StudentDisputesView />
                )}

                {/* TAB 4: ASSIGNMENTS & QUIZZES */}
                {activeTab === 'coursework' && (
                  <div className="animate-fade-in">
                    <StudentCourseworkList />
                  </div>
                )}

                {/* TAB 5: DATESHEET & SCHEDULE */}
                {activeTab === 'datesheet' && (
                  <div className="animate-fade-in">
                    <AcademicScheduleManager />
                  </div>
                )}

                {/* TAB 6: COURSES */}
                {activeTab === 'courses' && (
                  <EnrolledCoursesView />
                )}

                {/* TAB 7: ANNOUNCEMENTS */}
                {activeTab === 'announcements' && (
                  <AnnouncementsBoard />
                )}
              </>
            )}

            {/* ========================================================= */}
            {/* ROLE 2: TEACHER DASHBOARD TABS */}
            {/* ========================================================= */}
            {user?.role === 'teacher' && (
              <>
                {/* TAB 1: TEACHER OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    {/* Real-Time Exam Countdown Banner */}
                    <ExamCountdownWidget onOpenDatesheet={() => setActiveTab('schedule')} />

                    {/* Item 6: Demo Attendance Marking Card for Testing */}
                    <div
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '22px 26px',
                        border: '1px solid var(--border-color)',
                        borderLeft: '5px solid var(--eum-maroon)',
                        boxShadow: 'var(--shadow-sm)',
                        marginBottom: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(122, 31, 31, 0.1)',
                            color: 'var(--eum-maroon)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Zap size={22} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="badge badge-teacher">Demo Evaluation Mode</span>
                            <h3 style={{ fontSize: '1.15rem', color: 'var(--eum-maroon)', margin: 0 }}>
                              Test Today's Fast Attendance Marking
                            </h3>
                          </div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Simulate 45-second lecture attendance marking anytime (defaults everyone present, 1-tap absentee toggle).
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLaunchDemoAttendance()}
                        className="btn btn-primary"
                        style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                      >
                        <CheckSquare size={16} /> Mark Today's Lecture Now
                      </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Today's Scheduled Lectures
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--eum-maroon)', lineHeight: 1.1 }}>
                          3 Lectures
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Room: BOT-B1-F-102 & LAB BLOCK
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Peer-Verified Disputes
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#8C6800', lineHeight: 1.1 }}>
                          2 Pending
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--status-warning)', marginTop: '4px', fontWeight: '600' }}>
                          Requires Instructor Final Ruling
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Course Submissions
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--eum-green)', lineHeight: 1.1 }}>
                          48 / 54
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--eum-green)', marginTop: '4px' }}>
                          88.8% submission rate on Lab 03
                        </div>
                      </div>
                    </div>

                    <TeacherDisputeQueue />
                    <TeacherGradingMatrix />
                    <TimetableGrid />
                  </div>
                )}

                {/* TAB 2: TEACHER ATTENDANCE */}
                {activeTab === 'attendance' && (
                  <div className="animate-fade-in">
                    {/* Item 6: Attendance selector / launcher */}
                    <div
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px 24px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '14px',
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--eum-maroon)', marginBottom: '3px' }}>
                          Fast Lecture Attendance Sheet Launcher
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          Select any lecture slot to open and mark class attendance:
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                          className="form-input"
                          style={{ padding: '8px 12px', fontSize: '0.88rem', width: 'auto' }}
                          onChange={(e) => {
                            const selected = todaysLectures.find((l) => l._id === e.target.value);
                            if (selected) setActiveFastMarkLecture(selected);
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>-- Select Lecture Slot --</option>
                          {todaysLectures.slice(0, 15).map((l) => (
                            <option key={l._id} value={l._id}>
                              {new Date(l.date).toLocaleDateString()} — {l.courseId?.code || 'CS'} ({l.status})
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleLaunchDemoAttendance()}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.86rem' }}
                        >
                          <Zap size={14} /> Mark Demo Lecture
                        </button>
                      </div>
                    </div>

                    <CourseAttendanceReport />
                    <LectureCalendar />
                  </div>
                )}

                {/* TAB 3: TEACHER DISPUTES */}
                {activeTab === 'disputes' && (
                  <div className="animate-fade-in">
                    <TeacherDisputeQueue />
                  </div>
                )}

                {/* TAB 4: TEACHER ASSIGNMENTS & QUIZZES */}
                {activeTab === 'coursework' && (
                  <div className="animate-fade-in">
                    <TeacherGradingMatrix />
                  </div>
                )}

                {/* TAB 5: SEMESTER REPORTS (PAGE A & PAGE B PITCH) */}
                {activeTab === 'reports' && (
                  <div className="animate-fade-in">
                    <DatewiseAttendanceRegister />
                    <div style={{ height: '30px' }} />
                    <SubmissionStatusMatrix />
                  </div>
                )}

                {/* TAB 6: TEACHER ACADEMIC SCHEDULE */}
                {activeTab === 'schedule' && (
                  <div className="animate-fade-in">
                    <AcademicScheduleManager />
                  </div>
                )}

                {/* TAB 7: TEACHER ANNOUNCEMENTS */}
                {activeTab === 'announcements' && (
                  <AnnouncementsBoard />
                )}
              </>
            )}

            {/* ========================================================= */}
            {/* ROLE 3: ADMIN / OWNER DASHBOARD TABS */}
            {/* ========================================================= */}
            {user?.role === 'owner' && (
              <>
                {/* TAB 1: ADMIN OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="animate-fade-in">
                    {/* Real-Time Exam Countdown Banner */}
                    <ExamCountdownWidget onOpenDatesheet={() => setActiveTab('academic_schedule')} />

                    {/* System Stats Cards */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Total Registered Accounts
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--eum-maroon)', lineHeight: 1.1 }}>
                          {usersList.length || 62} Users
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--eum-green)', marginTop: '4px', fontWeight: '600' }}>
                          55 Students • 6 Faculty • 1 Lead
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Total Academic Courses
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--eum-green)', lineHeight: 1.1 }}>
                          6 Courses
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          15 Weekly Timetable Slots
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Pending Disputes
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#8C6800', lineHeight: 1.1 }}>
                          2 Pending
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--status-warning)', marginTop: '4px' }}>
                          Active across semester
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px 20px',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Semester Lectures
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: 1.1 }}>
                          240 Generated
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          16 Weeks (Aug 10 - Nov 27, 2026)
                        </div>
                      </div>
                    </div>

                    <TeacherDisputeQueue />
                    <CourseAttendanceReport />
                    <TimetableGrid />
                  </div>
                )}

                {/* TAB 2: ADMIN ACCOUNTS */}
                {activeTab === 'accounts' && (
                  <div className="animate-fade-in">
                    <div
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px 28px',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)',
                        marginBottom: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '14px',
                      }}
                    >
                      <div>
                        <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
                          Student & Faculty Account Management
                        </h2>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          Manage pre-created section roster, OTP verification statuses, and credentials.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowBulkModal(true)}
                        className="btn btn-primary"
                        style={{ padding: '9px 18px', fontSize: '0.86rem' }}
                      >
                        <UserPlus size={16} /> Bulk Create Accounts
                      </button>
                    </div>

                    {/* Users Roster Table */}
                    <div
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        padding: '24px',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--eum-maroon)' }}>
                          Class Roll Directory ({usersList.length} Accounts)
                        </h3>
                        <button
                          onClick={fetchUsers}
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          <RefreshCw size={13} /> Refresh
                        </button>
                      </div>

                      {loadingUsers ? (
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Loading account roster...</p>
                      ) : (
                        <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-subtle)', zIndex: 1 }}>
                              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px 12px' }}>Roll / ID</th>
                                <th style={{ padding: '10px 12px' }}>Name</th>
                                <th style={{ padding: '10px 12px' }}>Email</th>
                                <th style={{ padding: '10px 12px' }}>Role</th>
                                <th style={{ padding: '10px 12px' }}>OTP Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {usersList.map((u) => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>{u.rollNumber}</td>
                                  <td style={{ padding: '10px 12px' }}>{u.name}</td>
                                  <td style={{ padding: '10px 12px' }}>{u.email}</td>
                                  <td style={{ padding: '10px 12px' }}>
                                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                                  </td>
                                  <td style={{ padding: '10px 12px' }}>
                                    {u.otpVerified ? (
                                      <span className="badge badge-success">Verified</span>
                                    ) : (
                                      <span className="badge badge-warning">Pending First Login</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: ADMIN COURSES & TIMETABLE */}
                {activeTab === 'courses_timetable' && (
                  <div className="animate-fade-in">
                    <TimetableGrid />
                    <LectureCalendar />
                  </div>
                )}

                {/* TAB 4: ADMIN VACATIONS & DATESHEETS */}
                {activeTab === 'academic_schedule' && (
                  <div className="animate-fade-in">
                    <AcademicScheduleManager />
                  </div>
                )}

                {/* TAB 5: ADMIN RESULTS IMPORT */}
                {activeTab === 'results_import' && (
                  <ResultsImportManager />
                )}
              </>
            )}
          </>
        )}

        {/* Bulk Student Import Modal */}
        {showBulkModal && (
          <OwnerBulkImportModal
            onClose={() => setShowBulkModal(false)}
            onSuccess={() => {
              fetchUsers();
            }}
          />
        )}
      </div>
    </div>
  );
};
