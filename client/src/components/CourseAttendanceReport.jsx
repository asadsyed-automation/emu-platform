import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Filter, ArrowUpDown, Edit3, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

export const CourseAttendanceReport = ({ courseId, onMarkLecture }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rollNumber'); // 'rollNumber' or 'percentage'
  const [editingRecord, setEditingRecord] = useState(null);
  const [editStatus, setEditStatus] = useState('present');
  const [editReason, setEditReason] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        const list = res.data.courses || [];
        setCourses(list);
        if (!selectedCourse && list.length > 0) {
          setSelectedCourse(list[0]._id);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/attendance/course/${selectedCourse}/summary`);
        setReportData(res.data);
      } catch (err) {
        console.error('Error fetching course attendance summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedCourse]);

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    setEditError('');
    if (!editReason || editReason.trim().length === 0) {
      setEditError('A reason must be specified for audit logging.');
      return;
    }

    setEditLoading(true);
    try {
      await API.patch(`/attendance/update-record/${editingRecord._id}`, {
        status: editStatus,
        reason: editReason,
      });
      setEditingRecord(null);
      setEditReason('');
      // Refresh report
      const res = await API.get(`/attendance/course/${selectedCourse}/summary`);
      setReportData(res.data);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update record.');
    } finally {
      setEditLoading(false);
    }
  };

  const roster = reportData?.roster || [];
  const filteredRoster = roster.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRoster = [...filteredRoster].sort((a, b) => {
    if (sortBy === 'percentage') {
      return a.percentage - b.percentage; // Lowest attendance % first!
    }
    return a.rollNumber.localeCompare(b.rollNumber);
  });

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users style={{ color: 'var(--eum-maroon)' }} size={24} />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)' }}>
              Class-Wide Attendance Report (54 Students Roster)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total Lectures Closed: <strong>{reportData?.totalLectures || 0}</strong> • Enrolled: <strong>{reportData?.rosterCount || 0}</strong>
            </p>
          </div>
        </div>

        {/* Course Filter Dropdown */}
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

      {/* Filter and Sort Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search student roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort by:</span>
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'rollNumber' ? 'percentage' : 'rollNumber')}
            className="btn btn-outline"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
          >
            <ArrowUpDown size={14} />
            <span>{sortBy === 'rollNumber' ? 'Roll Number' : 'Lowest Attendance % First'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading class attendance report...
        </div>
      ) : sortedRoster.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No students found matching your query.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 1 }}>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px 12px' }}>Roll No</th>
                <th style={{ padding: '10px 12px' }}>Student Name</th>
                <th style={{ padding: '10px 12px' }}>Presents</th>
                <th style={{ padding: '10px 12px' }}>Absents</th>
                <th style={{ padding: '10px 12px' }}>Attendance %</th>
                <th style={{ padding: '10px 12px' }}>Academic Standing</th>
              </tr>
            </thead>
            <tbody>
              {sortedRoster.map((s) => (
                <tr key={s.studentId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--text-dark)' }}>
                    {s.rollNumber}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{s.name}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--status-success)', fontWeight: '600' }}>
                    {s.presentCount}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--status-danger)', fontWeight: '600' }}>
                    {s.absentCount}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: '800', fontSize: '0.95rem' }}>
                    <span style={{
                      color: s.percentage >= 75 ? 'var(--eum-green)' : s.percentage >= 65 ? 'var(--status-warning)' : 'var(--status-danger)'
                    }}>
                      {s.percentage}%
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {s.percentage >= 75 ? (
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Good Standing (≥75%)</span>
                    ) : s.percentage >= 65 ? (
                      <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>At Risk (65-74%)</span>
                    ) : (
                      <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>Critical (&lt;65%)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
