import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { OwnerBulkImportModal } from '../components/OwnerBulkImportModal';
import { TimetableGrid } from '../components/TimetableGrid';
import { LectureCalendar } from '../components/LectureCalendar';
import { FastAttendanceSheet } from '../components/FastAttendanceSheet';
import { StudentAttendanceSummary } from '../components/StudentAttendanceSummary';
import { CourseAttendanceReport } from '../components/CourseAttendanceReport';
import { PeerVotingWidget } from '../components/PeerVotingWidget';
import { TeacherDisputeQueue } from '../components/TeacherDisputeQueue';
import { AssessmentManager } from '../components/AssessmentManager';
import { StudentCourseworkList } from '../components/StudentCourseworkList';
import { TeacherGradingMatrix } from '../components/TeacherGradingMatrix';
import { DatewiseAttendanceRegister } from '../components/DatewiseAttendanceRegister';
import { SubmissionStatusMatrix } from '../components/SubmissionStatusMatrix';
import { Shield, User, GraduationCap, UserPlus, CheckCircle2, RefreshCw, CheckSquare, PlusCircle, FileSpreadsheet, FileText, LayoutDashboard } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'pageA', 'pageB'
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [generatingLectures, setGeneratingLectures] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [activeFastMarkLecture, setActiveFastMarkLecture] = useState(null);
  const [todaysLectures, setTodaysLectures] = useState([]);

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

  return (
    <div className="container" style={{ padding: '30px 20px 60px' }}>
      {/* Welcome Banner */}
      <div className="no-print" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--eum-maroon)' }}>
              Welcome, {user?.name}!
            </h2>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> OTP Verified
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Logged in as <strong>{user?.rollNumber}</strong> ({user?.role?.toUpperCase()}) • Emerson University Multan
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(user?.role === 'teacher' || user?.role === 'owner') && (
            <button
              onClick={() => setShowAssessmentModal(!showAssessmentModal)}
              className="btn btn-outline"
              style={{ padding: '10px 16px' }}
            >
              <PlusCircle size={16} />
              <span>{showAssessmentModal ? 'Hide Form' : '+ New Assignment / Quiz'}</span>
            </button>
          )}

          {user?.role === 'owner' && (
            <>
              <button
                onClick={handleGenerateLectures}
                disabled={generatingLectures}
                className="btn btn-secondary"
                style={{ padding: '10px 16px' }}
              >
                <RefreshCw size={16} className={generatingLectures ? 'spin' : ''} />
                <span>{generatingLectures ? 'Generating...' : 'Auto-Generate Lectures'}</span>
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="btn btn-primary"
                style={{ padding: '10px 18px' }}
              >
                <UserPlus size={18} />
                <span>Bulk Student Import</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Bar for Teachers / Owner Pitch Reports */}
      {(user?.role === 'teacher' || user?.role === 'owner') && (
        <div className="no-print" style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          borderBottom: '2px solid var(--border-color)',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <LayoutDashboard size={16} /> Overview & Marking
          </button>

          <button
            onClick={() => setActiveTab('pageA')}
            className={`btn ${activeTab === 'pageA' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <FileSpreadsheet size={16} /> Page A: Date-Wise Register (Pitch)
          </button>

          <button
            onClick={() => setActiveTab('pageB')}
            className={`btn ${activeTab === 'pageB' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.88rem', padding: '8px 16px' }}
          >
            <FileText size={16} /> Page B: Submission Matrix (Pitch)
          </button>
        </div>
      )}

      {actionMessage && (
        <div className="no-print" style={{
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.88rem',
          marginBottom: '20px'
        }}>
          {actionMessage}
        </div>
      )}

      {/* Teacher / Owner Assessment Publisher Component */}
      {showAssessmentModal && (user?.role === 'teacher' || user?.role === 'owner') && (
        <AssessmentManager onCreated={() => setShowAssessmentModal(false)} />
      )}

      {/* Page A Pitch View */}
      {activeTab === 'pageA' && (user?.role === 'teacher' || user?.role === 'owner') && (
        <DatewiseAttendanceRegister />
      )}

      {/* Page B Pitch View */}
      {activeTab === 'pageB' && (user?.role === 'teacher' || user?.role === 'owner') && (
        <SubmissionStatusMatrix />
      )}

      {/* Overview & Core Operational View */}
      {(activeTab === 'overview' || user?.role === 'student') && (
        <>
          {/* Peer Validation Widget (For Students who are peer voters) */}
          {user?.role === 'student' && <PeerVotingWidget />}

          {/* Teacher / Owner Fast Attendance Trigger Banner */}
          {(user?.role === 'teacher' || user?.role === 'owner') && !activeFastMarkLecture && (
            <div className="no-print" style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              borderLeft: '5px solid var(--eum-maroon)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckSquare size={24} style={{ color: 'var(--eum-maroon)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--eum-maroon)' }}>Fast 45-Second Attendance Marking Portal</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Select a lecture to open attendance sheet (defaults everyone present, 1-tap absentee toggle)
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '0.88rem', width: 'auto' }}
                    onChange={(e) => {
                      const selected = todaysLectures.find((l) => l._id === e.target.value);
                      if (selected) setActiveFastMarkLecture(selected);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>-- Select Lecture to Mark Attendance --</option>
                    {todaysLectures.slice(0, 10).map((l) => (
                      <option key={l._id} value={l._id}>
                        {new Date(l.date).toLocaleDateString()} — {l.courseId?.code || 'CS'} ({l.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Fast Attendance Sheet Mode */}
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
              {/* Student Dedicated Views */}
              {user?.role === 'student' && (
                <>
                  <StudentAttendanceSummary />
                  <StudentCourseworkList />
                </>
              )}

              {/* Teacher / Owner Grading Matrix */}
              {(user?.role === 'teacher' || user?.role === 'owner') && <TeacherGradingMatrix />}

              {/* Teacher / Owner Escalated Dispute Queue */}
              {(user?.role === 'teacher' || user?.role === 'owner') && <TeacherDisputeQueue />}

              {/* Teacher / Owner Class-Wide Attendance Matrix */}
              {(user?.role === 'teacher' || user?.role === 'owner') && <CourseAttendanceReport />}

              {/* Timetable Grid & Lecture Calendar */}
              <TimetableGrid />
              <LectureCalendar />
            </>
          )}

          {/* Owner User Directory Card */}
          {user?.role === 'owner' && !activeFastMarkLecture && (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              border: '1px solid var(--border-color)',
              marginTop: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--eum-maroon)' }}>
                  Class Accounts Directory (54 Real Students + Teachers)
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Total Accounts: <strong>{usersList.length}</strong>
                </span>
              </div>

              {loadingUsers ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Loading account roster...</p>
              ) : (
                <div style={{ overflowX: 'auto', maxHeight: '320px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 1 }}>
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
          )}
        </>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <OwnerBulkImportModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};
