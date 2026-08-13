import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar as CalendarIcon, Filter, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export const LectureCalendar = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        const list = res.data.courses || [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourse(list[0]._id);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetchLectures = async () => {
      setLoading(true);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'attendance-open':
        return <span className="badge badge-success"><CheckCircle size={12} /> Attendance Open</span>;
      case 'attendance-closed':
        return <span className="badge badge-danger"><AlertCircle size={12} /> Closed</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} /> Scheduled</span>;
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
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
              Auto-generated dated lecture instances for attendance tracking
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
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Day & Slot</th>
                <th style={{ padding: '10px 12px' }}>Room</th>
                <th style={{ padding: '10px 12px' }}>Topic / Notes</th>
                <th style={{ padding: '10px 12px' }}>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {lectures.slice(0, 15).map((l) => (
                <tr key={l._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
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
                    {getStatusBadge(l.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing first 15 lecture dates out of {lectures.length} total semester dates.
          </div>
        </div>
      )}
    </div>
  );
};
