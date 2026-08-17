import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CheckCircle2, XCircle, Search, Save, AlertCircle, ArrowLeft, Clock, UserCheck } from 'lucide-react';

export const FastAttendanceSheet = ({ lecture, onBack, onSubmitted }) => {
  const [students, setStudents] = useState([]);
  const [absentMap, setAbsentMap] = useState({}); // { studentId: true }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchCourseRoster = async () => {
      try {
        const rawCourseId = lecture?.courseId?._id || lecture?.courseId || '6a8189584a3d82e0a1550bb5';
        let roster = [];

        try {
          const res = await API.get(`/attendance/course/${rawCourseId}/summary`);
          roster = res.data.roster || [];
        } catch (e) {
          console.warn('Course summary endpoint fallback:', e.message);
        }

        // If roster is still empty, fetch from section users
        if (roster.length === 0) {
          try {
            const adminRes = await API.get('/admin/users');
            const users = adminRes.data.users || [];
            roster = users
              .filter((u) => u.role === 'student')
              .map((u) => ({
                studentId: u._id,
                rollNumber: u.rollNumber,
                name: u.name,
                email: u.email,
              }));
          } catch (e) {
            console.warn('Admin users fallback:', e.message);
          }
        }

        if (roster.length > 0) {
          setStudents(roster);
        } else {
          setError('No students found in section roll list.');
        }

        // Fetch if already marked for this lecture
        if (lecture?._id && lecture._id !== 'demo-lecture-active') {
          try {
            const markedRes = await API.get(`/attendance/lecture/${lecture._id}`);
            const existingRecords = markedRes.data.records || [];

            if (existingRecords.length > 0) {
              const map = {};
              existingRecords.forEach((r) => {
                if (r.status === 'absent') {
                  const sId = r.studentId?._id || r.studentId;
                  if (sId) map[sId] = true;
                }
              });
              setAbsentMap(map);
            }
          } catch (e) {
            // Lecture not marked yet
          }
        }
      } catch (err) {
        setError('Error loading class roster for attendance marking.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseRoster();
  }, [lecture]);

  const toggleAbsent = (studentId) => {
    setAbsentMap((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSelectAllPresent = () => {
    setAbsentMap({});
  };

  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    const absentees = Object.keys(absentMap).filter((id) => absentMap[id] === true);

    try {
      // First open lecture if scheduled
      if (lecture.status === 'scheduled') {
        await API.post(`/attendance/open-lecture/${lecture._id}`).catch(() => {});
      }

      const res = await API.post(`/attendance/mark/${lecture._id}`, { absentees });
      setSuccessMsg(res.data.message || 'Attendance submitted successfully!');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const absentCount = Object.keys(absentMap).filter((id) => absentMap[id] === true).length;
  const presentCount = students.length - absentCount;

  if (loading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading student roster for fast marking...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      {/* Top Action Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--eum-maroon)' }}>
              Fast Attendance Sheet — {lecture.courseId?.code || 'Course'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {new Date(lecture.date).toDateString()} • Room: <strong>{lecture.timetableSlotId?.room || 'BOT-B1-F-102'}</strong>
            </p>
          </div>
        </div>

        {/* Counter Summary Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: '700',
            fontSize: '0.88rem'
          }}>
            Present: {presentCount}
          </span>

          <span style={{
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: '700',
            fontSize: '0.88rem'
          }}>
            Absent: {absentCount}
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--status-danger-bg)',
          color: 'var(--status-danger)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div style={{
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Controls Bar: Search & Select All */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search roll number or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleSelectAllPresent}
            className="btn btn-outline"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <UserCheck size={16} /> Reset All Present
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.92rem' }}
          >
            <Save size={16} />
            <span>{submitting ? 'Saving...' : 'Submit Class Attendance'}</span>
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
        💡 <strong>Tip for 45-Second Marking</strong>: All students default to <strong>Present</strong> (Green). Tap on any student who is absent to toggle them to <strong>Absent</strong> (Red).
      </p>

      {/* Fast Interactive Grid (54 Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '10px',
        maxHeight: '480px',
        overflowY: 'auto',
        padding: '4px'
      }}>
        {filteredStudents.map((student) => {
          const isAbsent = !!absentMap[student.studentId];

          return (
            <div
              key={student.studentId}
              onClick={() => toggleAbsent(student.studentId)}
              style={{
                backgroundColor: isAbsent ? 'var(--status-danger-bg)' : 'var(--status-success-bg)',
                border: isAbsent ? '2px solid var(--status-danger)' : '2px solid var(--status-success)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s ease',
                boxShadow: isAbsent ? '0 2px 6px rgba(179,55,44,0.15)' : '0 2px 6px rgba(28,92,52,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: isAbsent ? 'var(--status-danger)' : 'var(--status-success)'
                }}>
                  {student.rollNumber}
                </span>

                {isAbsent ? (
                  <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>
                    <XCircle size={12} /> ABSENT
                  </span>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    <CheckCircle2 size={12} /> PRESENT
                  </span>
                )}
              </div>

              <div style={{
                fontSize: '0.92rem',
                fontWeight: '600',
                color: 'var(--text-dark)',
                marginTop: '6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {student.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
