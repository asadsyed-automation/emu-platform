import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Zap,
  Lock,
  Edit2,
  CalendarDays,
  Sparkles,
  BookOpen,
  Filter,
  RefreshCw,
  X,
  Layers,
  Award,
} from 'lucide-react';

export const CourseLectureScheduleTable = ({ initialCourseId, onOpenFastMark }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || '');
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unmarked', 'marked', 'upcoming'

  // Edit Date Modal State
  const [editingLecture, setEditingLecture] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch Courses scoped to user
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        const list = res.data.courses || [];
        setCourses(list);
        if (!selectedCourseId && list.length > 0) {
          setSelectedCourseId(list[0]._id);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const fetchSchedule = async () => {
    if (!selectedCourseId) return;
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/lectures/course-schedule/${selectedCourseId}`);
      setScheduleData(res.data);
    } catch (err) {
      setError('Failed to load course lecture schedule.');
      console.error('Error loading schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [selectedCourseId]);

  const handleOpenEditModal = (lec) => {
    setEditingLecture(lec);
    setEditDate(lec.isoDate || new Date(lec.date).toISOString().split('T')[0]);
    setEditTopic(lec.topic || '');
  };

  const handleSaveEditSchedule = async (e) => {
    e.preventDefault();
    if (!editingLecture) return;

    setUpdating(true);
    try {
      await API.patch(`/lectures/${editingLecture._id}/schedule`, {
        date: editDate,
        topic: editTopic,
      });
      setActionSuccess(`Lecture ${editingLecture.lectureNumber} schedule updated!`);
      setEditingLecture(null);
      fetchSchedule();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating lecture date.');
    } finally {
      setUpdating(false);
    }
  };

  const lectures = scheduleData?.lectures || [];
  const courseInfo = scheduleData?.course;
  const academicEvents = scheduleData?.academicEvents || [];

  // Filter lectures
  const filteredLectures = lectures.filter((l) => {
    if (filterStatus === 'unmarked') return (l.isPast || l.isToday) && !l.isMarked;
    if (filterStatus === 'marked') return l.isMarked;
    if (filterStatus === 'upcoming') return l.isFuture;
    return true;
  });

  const markedCount = lectures.filter((l) => l.isMarked).length;
  const readyToMarkCount = lectures.filter((l) => (l.isPast || l.isToday) && !l.isMarked).length;
  const upcomingCount = lectures.filter((l) => l.isFuture).length;

  return (
    <div className="animate-fade-in">
      {/* Course Header & Timeline Context */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(122, 31, 31, 0.1)',
                color: 'var(--eum-maroon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--eum-maroon)', margin: 0 }}>
                Course Lecture Schedule & Attendance Hub
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Official 30+ lecture semester calendar • Mark attendance for held lectures & manage dates
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {courses.length > 1 && (
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.86rem', width: 'auto', maxWidth: '100%' }}
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={fetchSchedule}
              className="btn btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
              title="Refresh Schedule"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '12px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '16px',
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Course Title</div>
            <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--eum-maroon)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {courseInfo?.code} ({courseInfo?.title})
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Instructor: <strong>{courseInfo?.teacherName}</strong>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Semester Total</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: 1.1, marginTop: '2px' }}>
              {lectures.length} Lectures
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Classes Started: <strong>07 Sep 2026</strong>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Marked Attendance</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--eum-green)', lineHeight: 1.1, marginTop: '2px' }}>
              {markedCount} Held
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--eum-green)', marginTop: '2px' }}>
              {readyToMarkCount} Pending past classes
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Upcoming Lectures</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#8C6800', lineHeight: 1.1, marginTop: '2px' }}>
              {upcomingCount} Ahead
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Locked until class day
            </div>
          </div>
        </div>

        {/* Academic Calendar Timeline Highlight */}
        <div
          style={{
            marginTop: '14px',
            backgroundColor: 'rgba(201, 162, 39, 0.08)',
            border: '1px solid rgba(201, 162, 39, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.8rem',
            color: '#7C5E00',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} style={{ color: 'var(--eum-gold)', flexShrink: 0 }} />
            <span>
              <strong>Fall 2026 Academic Highlights:</strong> Classes Start: <strong>07 Sep 2026</strong> • Midterm Exams: <strong>26 Oct – 31 Oct 2026</strong> • Final Exams: <strong>21 Dec – 28 Dec 2026</strong>
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', fontWeight: '600', color: 'var(--eum-maroon)' }}>
            Regular lectures automatically skip exam periods
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.84rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={15} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Tabs & Table Container */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterStatus('all')}
              className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              All Scheduled ({lectures.length})
            </button>
            <button
              onClick={() => setFilterStatus('unmarked')}
              className={`btn ${filterStatus === 'unmarked' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem', color: filterStatus === 'unmarked' ? '#fff' : '#B45309' }}
            >
              Ready to Mark ({readyToMarkCount})
            </button>
            <button
              onClick={() => setFilterStatus('marked')}
              className={`btn ${filterStatus === 'marked' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem', color: filterStatus === 'marked' ? '#fff' : 'var(--eum-green)' }}
            >
              Marked ({markedCount})
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`btn ${filterStatus === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Upcoming ({upcomingCount})
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Showing {filteredLectures.length} of {lectures.length} lecture instances
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading course schedule...
          </div>
        ) : filteredLectures.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No lectures found for filter "{filterStatus}".
          </div>
        ) : (
          <div
            style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: '780px',
                borderCollapse: 'collapse',
                fontSize: '0.84rem',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '10px 12px', width: '70px' }}>Lec #</th>
                  <th style={{ padding: '10px 14px' }}>Date & Day</th>
                  <th style={{ padding: '10px 14px' }}>Time & Room</th>
                  <th style={{ padding: '10px 14px' }}>Topic / Notes</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Attendance Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLectures.map((lec) => {
                  const isToday = lec.isToday;
                  const isFuture = lec.isFuture;
                  const isMarked = lec.isMarked;

                  let rowBg = 'var(--bg-surface)';
                  if (isToday) rowBg = 'rgba(28, 92, 52, 0.06)';
                  else if (isFuture) rowBg = 'var(--bg-main)';

                  return (
                    <tr
                      key={lec._id}
                      style={{
                        backgroundColor: rowBg,
                        borderBottom: '1px solid var(--border-color)',
                        opacity: isFuture ? 0.75 : 1,
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* Lec # */}
                      <td style={{ padding: '12px 12px', fontWeight: '800', color: 'var(--eum-maroon)' }}>
                        Lec {String(lec.lectureNumber).padStart(2, '0')}
                      </td>

                      {/* Date & Day + Edit Pencil */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div>
                            <div style={{ fontWeight: '700', color: isToday ? 'var(--eum-green)' : 'var(--text-dark)' }}>
                              {lec.dayOfWeek}, {lec.dateStr}
                            </div>
                            {isToday && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.68rem',
                                  fontWeight: '800',
                                  backgroundColor: 'var(--eum-green)',
                                  color: '#FFFFFF',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  marginTop: '2px',
                                  letterSpacing: '0.5px',
                                }}
                              >
                                ● TODAY'S LECTURE
                              </span>
                            )}
                          </div>

                          {/* Reschedule Date Button */}
                          <button
                            onClick={() => handleOpenEditModal(lec)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px',
                            }}
                            title="Reschedule / Edit Lecture Date"
                          >
                            <Edit2 size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Time & Room */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {lec.startTime} – {lec.endTime}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            <MapPin size={12} style={{ display: 'inline', marginRight: '4px', color: 'var(--eum-green)' }} />
                            {lec.room} {lec.isLab ? '(Lab)' : ''}
                          </span>
                        </div>
                      </td>

                      {/* Topic / Academic Notes */}
                      <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {lec.academicEvent ? (
                          <span style={{ color: 'var(--status-warning)', fontWeight: '600' }}>
                            [Academic Notice: {lec.academicEvent.title}]
                          </span>
                        ) : (
                          lec.topic || 'Regular Course Lecture'
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px' }}>
                        {isMarked ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="badge badge-success" style={{ width: 'fit-content' }}>
                              <CheckCircle2 size={11} /> Attendance Marked
                            </span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--eum-green)', fontWeight: '600' }}>
                              {lec.presentCount} Present • {lec.absentCount} Absent
                            </span>
                          </div>
                        ) : isToday || !isFuture ? (
                          <span className="badge badge-warning" style={{ width: 'fit-content' }}>
                            <Clock3 size={11} /> Ready to Mark
                          </span>
                        ) : (
                          <span className="badge badge-student" style={{ width: 'fit-content', opacity: 0.8 }}>
                            <Lock size={11} /> Upcoming (Disabled)
                          </span>
                        )}
                      </td>

                      {/* Attendance Action */}
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {isFuture ? (
                          <button
                            disabled
                            className="btn btn-outline"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.76rem',
                              opacity: 0.5,
                              cursor: 'not-allowed',
                            }}
                            title="Upcoming lecture - Attendance can only be marked on or after class day"
                          >
                            <Lock size={12} /> Upcoming (Disabled)
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (onOpenFastMark) {
                                onOpenFastMark(lec);
                              }
                            }}
                            className={isMarked ? 'btn btn-outline' : 'btn btn-primary'}
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                            }}
                          >
                            <Zap size={13} /> {isMarked ? 'Edit Attendance' : 'Mark Attendance'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Academic Calendar, Examination Durations & Weekly Holidays Reference */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px 18px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '12px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.88rem', color: 'var(--eum-maroon)' }}>
              <CalendarDays size={16} />
              <span>Fall 2026 Academic Schedule, Exam Durations & Holiday Schedule</span>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                backgroundColor: 'rgba(28, 92, 52, 0.12)',
                color: 'var(--eum-green)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              Current: Week 1 (07 Sep – 11 Sep 2026) • Regular Classes
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
              gap: '10px',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: '700', color: 'var(--eum-maroon)' }}>Mid Term Examinations</div>
              <div style={{ color: 'var(--text-dark)', fontWeight: '600', marginTop: '2px' }}>26 Oct 2026 – 31 Oct 2026</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1px' }}>Duration: 1 Week (Classes Suspended)</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: '700', color: 'var(--eum-maroon)' }}>Final Term Examinations</div>
              <div style={{ color: 'var(--text-dark)', fontWeight: '600', marginTop: '2px' }}>21 Dec 2026 – 28 Dec 2026</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1px' }}>Final Semester Assessments & Projects</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: '700', color: 'var(--eum-maroon)' }}>National Holidays & Breaks</div>
              <div style={{ color: 'var(--text-dark)', fontWeight: '600', marginTop: '2px' }}>09 Nov (Iqbal Day) • 25 Dec (Quaid Day)</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1px' }}>Winter Recess: 25 Dec 2026 – 01 Jan 2027</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: '700', color: 'var(--eum-maroon)' }}>This Week's Status</div>
              <div style={{ color: 'var(--eum-green)', fontWeight: '700', marginTop: '2px' }}>Active Teaching Week</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1px' }}>No gazetted holidays this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Date Modal */}
      {editingLecture && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '12px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 'min(460px, 95vw)',
              width: '100%',
              padding: '22px 24px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-maroon)', margin: 0 }}>
                Reschedule Lecture {editingLecture.lectureNumber}
              </h3>
              <button
                onClick={() => setEditingLecture(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Lecture Topic / Syllabus Outline
                </label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  placeholder="e.g. Dynamic Programming & Memoization"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingLecture(null)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  {updating ? 'Saving...' : 'Update Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
