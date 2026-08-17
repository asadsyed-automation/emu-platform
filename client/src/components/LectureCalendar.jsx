import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar as CalendarIcon, Filter, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export const LectureCalendar = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lectures, setLectures] = useState([]);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [coursesRes, eventsRes] = await Promise.all([
          API.get('/courses'),
          API.get('/academic-events').catch(() => ({ data: { events: [] } })),
        ]);
        const list = coursesRes.data.courses || [];
        setCourses(list);
        setAcademicEvents(eventsRes.data.events || []);
        if (list.length > 0) {
          setSelectedCourse(list[0]._id);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetchLectures = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        const res = await API.get(`/lectures?courseId=${selectedCourse}`);
        setLectures(res.data.lectures || []);
      } catch (err) {
        console.error('Error fetching lectures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [selectedCourse]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getEventForDate = (dateStr) => {
    if (!dateStr || academicEvents.length === 0) return null;
    const d = new Date(dateStr).toISOString().split('T')[0];
    return academicEvents.find((ev) => {
      const s = new Date(ev.startDate).toISOString().split('T')[0];
      const e = new Date(ev.endDate).toISOString().split('T')[0];
      return d >= s && d <= e;
    });
  };

  const getStatusBadge = (status, lectureDate) => {
    const matchingEvent = getEventForDate(lectureDate);
    if (matchingEvent) {
      if (matchingEvent.type === 'vacation' || matchingEvent.type === 'holiday') {
        return <span className="badge badge-warning">🏖️ Vacation / Holiday</span>;
      }
      if (matchingEvent.type === 'mid-term') {
        return <span className="badge badge-teacher">📝 Mid-Term Exam</span>;
      }
      if (matchingEvent.type === 'final-term') {
        return <span className="badge badge-owner">🎓 Final-Term Exam</span>;
      }
      return <span className="badge badge-student">✦ {matchingEvent.title}</span>;
    }

    switch (status) {
      case 'attendance-open':
        return <span className="badge badge-success"><CheckCircle size={12} /> Attendance Open</span>;
      case 'attendance-closed':
        return <span className="badge badge-danger"><AlertCircle size={12} /> Closed</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} /> Scheduled</span>;
    }
  };

  const totalPages = Math.ceil(lectures.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLectures = lectures.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarIcon style={{ color: 'var(--eum-maroon)' }} size={24} />
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-maroon)' }}>Semester Lecture Calendar</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Auto-generated dated lecture instances with real-time status tracking
            </p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', fontSize: '0.88rem', width: 'auto' }}
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading lecture instances...
        </div>
      ) : lectures.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No lectures generated for this course yet.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px 12px' }}>#</th>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Day & Slot</th>
                <th style={{ padding: '10px 12px' }}>Room</th>
                <th style={{ padding: '10px 12px' }}>Topic / Notes</th>
                <th style={{ padding: '10px 12px' }}>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {currentLectures.map((l, index) => (
                <tr key={l._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>{formatDate(l.date)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {l.timetableSlotId?.dayOfWeek} ({l.timetableSlotId?.startTime} - {l.timetableSlotId?.endTime})
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <MapPin size={12} />
                      {l.timetableSlotId?.room} {l.timetableSlotId?.isLab ? '(Lab)' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: l.topic ? 'var(--text-dark)' : 'var(--text-light)' }}>
                    {l.topic || 'Regular Lecture'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {getStatusBadge(l.status, l.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Clean 15-per-page Pagination Footer */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, lectures.length)}</strong> of <strong>{lectures.length}</strong> semester lecture entries (15 per page)
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.78rem',
                    opacity: currentPage === 1 ? 0.45 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      padding: '5px 11px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      borderRadius: 'var(--radius-sm)',
                      border: currentPage === pageNum ? '1px solid var(--eum-maroon)' : '1px solid var(--border-color)',
                      backgroundColor: currentPage === pageNum ? 'var(--eum-maroon)' : 'var(--bg-surface)',
                      color: currentPage === pageNum ? '#FFFFFF' : 'var(--text-dark)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      minWidth: '32px',
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.78rem',
                    opacity: currentPage === totalPages ? 0.45 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
