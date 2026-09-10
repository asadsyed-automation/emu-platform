import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Printer,
  Download,
  FileSpreadsheet,
  Check,
  X,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Lock,
  LayoutGrid,
  Table,
  Filter,
} from 'lucide-react';

export const DatewiseAttendanceRegister = ({ initialCourseId, onOpenFastMark }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(initialCourseId || '');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [togglingCell, setTogglingCell] = useState(null); // 'studentId-lectureId'
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' | 'concise'
  const [searchFilter, setSearchFilter] = useState('');

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

  const fetchRegister = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await API.get(`/reports/attendance-register?courseId=${selectedCourse}`);
      setReportData(res.data);
    } catch (err) {
      console.error('Error loading attendance register:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegister();
  }, [selectedCourse]);

  const handleCellClick = async (student, col) => {
    // If future date, prevent edit
    if (col.isFuture) return;

    const sId = student.studentId;
    const lId = col.lectureId;
    const cellKey = `${sId}-${lId}`;
    if (togglingCell === cellKey) return;

    const currentVal = student.attendanceMap[lId] || '-';
    // Cycle: '-' -> 'P' -> 'A' -> 'P'
    const nextVal = currentVal === 'P' ? 'A' : 'P';

    // Optimistic UI update
    setTogglingCell(cellKey);
    const updatedStudents = reportData.students.map((s) => {
      if (s.studentId === sId) {
        const newMap = { ...s.attendanceMap, [lId]: nextVal };
        let pres = 0;
        let abs = 0;
        Object.entries(newMap).forEach(([k, v]) => {
          if (v === 'P') pres++;
          else if (v === 'A') abs++;
        });
        const totalMarked = pres + abs;
        const pct = totalMarked > 0 ? parseFloat(((pres / totalMarked) * 100).toFixed(1)) : null;
        return {
          ...s,
          attendanceMap: newMap,
          presentCount: pres,
          absentCount: abs,
          percentage: pct,
        };
      }
      return s;
    });

    setReportData({
      ...reportData,
      students: updatedStudents,
    });

    try {
      await API.post('/attendance/toggle-cell', {
        lectureId: lId,
        studentId: sId,
        courseId: selectedCourse,
        status: nextVal,
      });
      setActionMessage(`Updated ${student.rollNumber} to ${nextVal === 'P' ? 'Present' : 'Absent'}`);
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err) {
      console.error('Error updating cell:', err);
      // Revert on error
      fetchRegister();
    } finally {
      setTogglingCell(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    const { course, dateColumns, students } = reportData;

    let csv = `EMERSON UNIVERSITY MULTAN - OFFICIAL ATTENDANCE REGISTER\n`;
    csv += `Course: ${course.title} (${course.code}), Teacher: ${course.teacherName}, Semester: ${course.semesterLabel}\n\n`;

    if (viewMode === 'concise') {
      const headers = ['SR #', 'Roll Number', 'Student Name', 'Total Held', 'Presents', 'Absents', 'Attendance %', 'Academic Standing'];
      csv += headers.map((h) => `"${h}"`).join(',') + '\n';

      students.forEach((s, idx) => {
        let standing = 'Good Standing';
        if (s.percentage !== null) {
          if (s.percentage < 65) standing = 'Critical Shortage';
          else if (s.percentage < 75) standing = 'At Risk (<75%)';
        }
        const row = [
          idx + 1,
          s.rollNumber,
          s.name,
          reportData.totalMarkedLectures || 0,
          s.presentCount,
          s.absentCount,
          s.percentage !== null ? `${s.percentage}%` : 'N/A',
          standing,
        ];
        csv += row.map((cell) => `"${cell}"`).join(',') + '\n';
      });
    } else {
      const headers = [
        'SR #',
        'Roll Number',
        'Student Name',
        ...dateColumns.map((d) => `${d.dateStr} (${d.dayOfWeek || ''})`),
        'Total Held',
        'Presents',
        'Absents',
        'Attendance %',
      ];
      csv += headers.map((h) => `"${h}"`).join(',') + '\n';

      students.forEach((s, idx) => {
        const row = [
          idx + 1,
          s.rollNumber,
          s.name,
          ...dateColumns.map((col) => s.attendanceMap[col.lectureId] || '-'),
          reportData.totalMarkedLectures || 0,
          s.presentCount,
          s.absentCount,
          s.percentage !== null ? `${s.percentage}%` : 'N/A',
        ];
        csv += row.map((cell) => `"${cell}"`).join(',') + '\n';
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${course.code}_Attendance_Register_${viewMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const courseInfo = reportData?.course;
  const dateColumns = reportData?.dateColumns || [];
  const rawStudents = reportData?.students || [];

  const students = rawStudents.filter((s) => {
    const q = searchFilter.toLowerCase();
    return (
      (s.rollNumber || '').toLowerCase().includes(q) ||
      (s.name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '30px',
      }}
    >
      {/* Top Action Bar (Hidden on Print) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
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
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', margin: 0 }}>
              Official Attendance Register
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Switch between concise summary roster and detailed 16-week datewise matrix
            </p>
          </div>
        </div>

        {/* View Mode Toggle + Course Select + Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Segmented Switch: Concise Summary vs Detailed Matrix */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-main)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => setViewMode('detailed')}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'detailed' ? 'var(--eum-maroon)' : 'transparent',
                color: viewMode === 'detailed' ? '#FFFFFF' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              <LayoutGrid size={13} /> Detailed Date-Wise Matrix
            </button>
            <button
              onClick={() => setViewMode('concise')}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'concise' ? 'var(--eum-maroon)' : 'transparent',
                color: viewMode === 'concise' ? '#FFFFFF' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              <Table size={13} /> Concise Summary Table
            </button>
          </div>

          {courses.length > 1 && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="form-input"
              style={{ padding: '7px 12px', fontSize: '0.86rem', width: 'auto', maxWidth: '100%' }}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.82rem' }}
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            <Printer size={14} /> Print (PDF)
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className="no-print"
          style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={14} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Detailed Legend & Quick Filter */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: 'var(--bg-main)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}
      >
        {viewMode === 'detailed' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>Legend:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <strong style={{ color: 'var(--eum-green)', backgroundColor: 'rgba(28,92,52,0.12)', padding: '2px 6px', borderRadius: '4px' }}>P</strong> Present
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <strong style={{ color: 'var(--status-danger)', backgroundColor: 'rgba(179,55,44,0.12)', padding: '2px 6px', borderRadius: '4px' }}>A</strong> Absent
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <strong style={{ color: 'var(--text-muted)', backgroundColor: 'rgba(100,100,100,0.12)', padding: '2px 6px', borderRadius: '4px' }}>-</strong> Blank / Not Marked
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: 0.75 }}>
              <Lock size={12} /> Upcoming (Disabled)
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>Examination Thresholds:</span>
            <span style={{ color: 'var(--eum-green)', fontWeight: '600' }}>✓ &ge; 75% Eligible</span>
            <span style={{ color: 'var(--status-warning)', fontWeight: '600' }}>⚠️ 65% - 74% At Risk</span>
            <span style={{ color: 'var(--status-danger)', fontWeight: '600' }}>❌ &lt; 65% Critical Shortage</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search Roll No or Name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="form-input"
            style={{ padding: '4px 10px', fontSize: '0.78rem', width: '180px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading official register data...
        </div>
      ) : (
        <div className="print-container">
          {/* Official Emerson University Multan Header Block */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '16px',
              borderBottom: '2px solid var(--eum-maroon)',
              paddingBottom: '14px',
            }}
          >
            <h2
              style={{
                fontSize: '1.45rem',
                color: 'var(--eum-maroon)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0,
              }}
            >
              Emerson University Multan
            </h2>
            <h4 style={{ fontSize: '0.96rem', color: 'var(--eum-green)', fontWeight: '600', marginTop: '3px', margin: 0 }}>
              Faculty of Computing & Emerging Technologies • BS(CS) Section-A
            </h4>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
                fontSize: '0.84rem',
                fontWeight: '600',
                color: 'var(--text-dark)',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>Course: <strong>{courseInfo?.title} ({courseInfo?.code})</strong></div>
              <div>Instructor: <strong>{courseInfo?.teacherName}</strong></div>
              <div>Semester: <strong>{courseInfo?.semesterLabel} (Classes Started: 07 Sep 2026)</strong></div>
            </div>
          </div>

          {/* VIEW MODE 1: CONCISE SUMMARY TABLE */}
          {viewMode === 'concise' ? (
            <div
              style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  minWidth: '650px',
                  borderCollapse: 'collapse',
                  fontSize: '0.84rem',
                  textAlign: 'left',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: 'var(--eum-maroon)', color: '#FFFFFF' }}>
                    <th style={{ padding: '10px 12px', width: '40px' }}>#</th>
                    <th style={{ padding: '10px 14px', width: '130px' }}>Roll Number</th>
                    <th style={{ padding: '10px 14px' }}>Student Name</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', width: '90px' }}>Classes Held</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', width: '80px', backgroundColor: 'var(--eum-green-dark)' }}>Presents</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', width: '80px', backgroundColor: 'var(--eum-maroon-dark)' }}>Absents</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', width: '100px' }}>Attendance %</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', width: '140px' }}>Exam Standing</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => {
                    let standingBadge = (
                      <span className="badge badge-student" style={{ fontSize: '0.74rem' }}>
                        Semester Inception
                      </span>
                    );

                    if (s.percentage !== null) {
                      if (s.percentage >= 75) {
                        standingBadge = (
                          <span className="badge badge-success" style={{ fontSize: '0.74rem' }}>
                            ✓ Good Standing
                          </span>
                        );
                      } else if (s.percentage >= 65) {
                        standingBadge = (
                          <span className="badge badge-warning" style={{ fontSize: '0.74rem' }}>
                            ⚠️ At Risk
                          </span>
                        );
                      } else {
                        standingBadge = (
                          <span className="badge badge-danger" style={{ fontSize: '0.74rem' }}>
                            ❌ Critical Shortage
                          </span>
                        );
                      }
                    }

                    return (
                      <tr
                        key={s.studentId}
                        style={{
                          backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                          borderBottom: '1px solid var(--border-color)',
                        }}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: '600' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--eum-maroon)', fontFamily: 'monospace' }}>
                          {s.rollNumber}
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>{s.name}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '700' }}>
                          {reportData.totalMarkedLectures || 0}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '700', color: 'var(--eum-green)' }}>
                          {s.presentCount}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '700', color: 'var(--status-danger)' }}>
                          {s.absentCount}
                        </td>
                        <td
                          style={{
                            padding: '10px 14px',
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: '0.9rem',
                            color:
                              s.percentage === null
                                ? 'var(--text-muted)'
                                : s.percentage >= 75
                                ? 'var(--eum-green)'
                                : s.percentage >= 65
                                ? 'var(--status-warning)'
                                : 'var(--status-danger)',
                          }}
                        >
                          {s.percentage !== null ? `${s.percentage}%` : 'N/A'}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          {standingBadge}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* VIEW MODE 2: DETAILED DATE-WISE MATRIX */
            <div
              style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                position: 'relative',
                maxHeight: '650px',
              }}
            >
              <table
                style={{
                  minWidth: '850px',
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.78rem',
                  textAlign: 'center',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: 'var(--eum-maroon)', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 10 }}>
                    <th style={{ padding: '8px 4px', border: '1px solid #ddd', width: '32px', position: 'sticky', left: 0, backgroundColor: 'var(--eum-maroon)', zIndex: 11 }}>#</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #ddd', textAlign: 'left', width: '90px', position: 'sticky', left: '32px', backgroundColor: 'var(--eum-maroon)', zIndex: 11 }}>Roll No</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #ddd', textAlign: 'left', minWidth: '130px', position: 'sticky', left: '122px', backgroundColor: 'var(--eum-maroon)', zIndex: 11 }}>Student Name</th>
                    {dateColumns.map((col) => {
                      const isFut = col.isFuture;
                      return (
                        <th
                          key={col.lectureId}
                          style={{
                            padding: '6px 3px',
                            border: '1px solid #ddd',
                            fontSize: '0.70rem',
                            minWidth: '42px',
                            backgroundColor: isFut ? '#5c1b1b' : col.isToday ? 'var(--eum-green)' : 'var(--eum-maroon)',
                            opacity: isFut ? 0.65 : 1,
                          }}
                          title={isFut ? `Upcoming scheduled class (${col.dayOfWeek})` : `Class held on ${col.dateStr}`}
                        >
                          <div style={{ fontWeight: '700' }}>{col.dateStr}</div>
                          <div style={{ fontSize: '0.62rem', opacity: 0.85 }}>
                            {col.dayOfWeek ? col.dayOfWeek.slice(0, 3) : ''}
                          </div>
                          {isFut && (
                            <div style={{ fontSize: '0.58rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '2px', padding: '1px 2px', marginTop: '2px' }}>
                              Future
                            </div>
                          )}
                          {!isFut && onOpenFastMark && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenFastMark(col);
                              }}
                              className="no-print"
                              style={{
                                marginTop: '2px',
                                padding: '1px 4px',
                                fontSize: '0.58rem',
                                backgroundColor: '#FFFFFF',
                                color: 'var(--eum-maroon)',
                                border: 'none',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                fontWeight: '700',
                              }}
                              title="Fast Mark Lecture"
                            >
                              Mark
                            </button>
                          )}
                        </th>
                      );
                    })}
                    <th style={{ padding: '8px 4px', border: '1px solid #ddd', backgroundColor: 'var(--eum-green-dark)', minWidth: '42px' }}>Held</th>
                    <th style={{ padding: '8px 4px', border: '1px solid #ddd', backgroundColor: 'var(--eum-green-dark)', minWidth: '38px' }}>P</th>
                    <th style={{ padding: '8px 4px', border: '1px solid #ddd', backgroundColor: 'var(--eum-maroon-dark)', minWidth: '38px' }}>A</th>
                    <th style={{ padding: '8px 6px', border: '1px solid #ddd', backgroundColor: 'var(--eum-green-dark)', minWidth: '55px' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr
                      key={s.studentId}
                      style={{
                        backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                      }}
                    >
                      <td
                        style={{
                          padding: '4px',
                          border: '1px solid var(--border-color)',
                          fontWeight: '600',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                          zIndex: 5,
                        }}
                      >
                        {idx + 1}
                      </td>
                      <td
                        style={{
                          padding: '4px 6px',
                          border: '1px solid #ddd',
                          textAlign: 'left',
                          fontWeight: '700',
                          color: 'var(--eum-maroon)',
                          position: 'sticky',
                          left: '32px',
                          backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                          zIndex: 5,
                        }}
                      >
                        {s.rollNumber}
                      </td>
                      <td
                        style={{
                          padding: '4px 6px',
                          border: '1px solid #ddd',
                          textAlign: 'left',
                          fontWeight: '600',
                          position: 'sticky',
                          left: '122px',
                          backgroundColor: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                          zIndex: 5,
                        }}
                      >
                        {s.name}
                      </td>
                      {dateColumns.map((col) => {
                        const val = s.attendanceMap[col.lectureId] || '-';
                        const isFut = col.isFuture;

                        let cellBg = 'transparent';
                        let cellColor = 'var(--text-muted)';
                        if (val === 'P') {
                          cellBg = 'rgba(28,92,52,0.12)';
                          cellColor = 'var(--eum-green)';
                        } else if (val === 'A') {
                          cellBg = 'rgba(179,55,44,0.12)';
                          cellColor = 'var(--status-danger)';
                        }

                        return (
                          <td
                            key={col.lectureId}
                            onClick={() => handleCellClick(s, col)}
                            style={{
                              padding: '4px 2px',
                              border: '1px solid #ddd',
                              fontWeight: '700',
                              color: cellColor,
                              backgroundColor: isFut ? 'rgba(0,0,0,0.02)' : cellBg,
                              cursor: isFut ? 'not-allowed' : 'pointer',
                              opacity: isFut ? 0.45 : 1,
                              userSelect: 'none',
                              transition: 'background-color 0.15s ease',
                            }}
                            title={isFut ? 'Upcoming date - cannot mark in advance' : `Click to toggle status for ${s.rollNumber}`}
                          >
                            {isFut ? '-' : val}
                          </td>
                        );
                      })}
                      <td style={{ padding: '4px', border: '1px solid #ddd', fontWeight: '700' }}>
                        {reportData.totalMarkedLectures || 0}
                      </td>
                      <td style={{ padding: '4px', border: '1px solid #ddd', fontWeight: '700', color: 'var(--eum-green)' }}>
                        {s.presentCount}
                      </td>
                      <td style={{ padding: '4px', border: '1px solid #ddd', fontWeight: '700', color: 'var(--status-danger)' }}>
                        {s.absentCount}
                      </td>
                      <td
                        style={{
                          padding: '4px 6px',
                          border: '1px solid #ddd',
                          fontWeight: '800',
                          color:
                            s.percentage === null
                              ? 'var(--text-muted)'
                              : s.percentage >= 75
                              ? 'var(--eum-green)'
                              : s.percentage >= 65
                              ? 'var(--status-warning)'
                              : 'var(--status-danger)',
                        }}
                      >
                        {s.percentage !== null ? `${s.percentage}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Signature Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '36px',
              paddingTop: '20px',
              fontSize: '0.85rem',
              color: 'var(--text-dark)',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '4px', textAlign: 'center', fontWeight: '600' }}>
                Course Instructor Signature
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '4px', textAlign: 'center', fontWeight: '600' }}>
                Head of Department Signature
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
