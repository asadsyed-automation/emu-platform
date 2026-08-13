import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Printer, Download, Filter, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export const SubmissionStatusMatrix = ({ initialCourseId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(initialCourseId || '');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchMatrix = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await API.get(`/reports/submission-matrix?courseId=${selectedCourse}`);
      setReportData(res.data);
    } catch (err) {
      console.error('Error loading submission matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [selectedCourse]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    const { course, assessmentColumns, students } = reportData;

    let csv = `EMERSON UNIVERSITY MULTAN - COURSEWORK SUBMISSION STATUS MATRIX\n`;
    csv += `Course: ${course.title} (${course.code}), Instructor: ${course.teacherName}\n\n`;

    const headers = ['SR #', 'Roll Number', 'Student Name', ...assessmentColumns.map((a) => `${a.title} (${a.examPeriod} #${a.sequenceIndex})`), 'Total Submissions', 'Total Marks Obtained'];
    csv += headers.map((h) => `"${h}"`).join(',') + '\n';

    students.forEach((s, idx) => {
      const row = [
        idx + 1,
        s.rollNumber,
        s.name,
        ...assessmentColumns.map((a) => {
          const sub = s.submissionsMap[a.assessmentId];
          if (!sub) return 'MISSING';
          return `${sub.status.toUpperCase()} (${sub.marksAwarded !== null ? sub.marksAwarded : 'Not Graded'})`;
        }),
        s.totalSubmitted,
        s.totalMarks,
      ];
      csv += row.map((cell) => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${course.code}_Submission_Status_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const courseInfo = reportData?.course;
  const assessmentColumns = reportData?.assessmentColumns || [];
  const students = reportData?.students || [];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '28px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '30px'
    }}>
      {/* Top Action Bar (Hidden on Print) */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText style={{ color: 'var(--eum-maroon)' }} size={26} />
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--eum-maroon)' }}>
              Page B — Coursework Submission Status Matrix
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              54 Students × Every Assignment/Quiz submission status and marks matrix
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '0.88rem', width: 'auto' }}
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.code} — {c.title}</option>
            ))}
          </select>

          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Download size={14} /> Export CSV
          </button>

          <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <Printer size={14} /> Print Matrix (PDF)
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Generating submission matrix...
        </div>
      ) : (
        <div className="print-container">
          {/* Header Block */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            borderBottom: '2px solid var(--eum-maroon)',
            paddingBottom: '16px'
          }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--eum-maroon)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Emerson University Multan
            </h2>
            <h4 style={{ fontSize: '1rem', color: 'var(--eum-green)', fontWeight: '600', marginTop: '2px' }}>
              Coursework Submission Matrix • BS(CS) Section-A
            </h4>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              fontSize: '0.88rem',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              <div>Course: <strong>{courseInfo?.title} ({courseInfo?.code})</strong></div>
              <div>Instructor: <strong>{courseInfo?.teacherName}</strong></div>
              <div>Semester: <strong>{courseInfo?.semesterLabel}</strong></div>
            </div>
          </div>

          {/* Matrix Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.78rem',
              textAlign: 'center'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--eum-maroon)', color: '#FFFFFF' }}>
                  <th style={{ padding: '8px 4px', border: '1px solid #ddd', width: '32px' }}>#</th>
                  <th style={{ padding: '8px 6px', border: '1px solid #ddd', textAlign: 'left', width: '90px' }}>Roll No</th>
                  <th style={{ padding: '8px 6px', border: '1px solid #ddd', textAlign: 'left', minWidth: '130px' }}>Student Name</th>
                  {assessmentColumns.map((col) => (
                    <th key={col.assessmentId} style={{ padding: '6px 4px', border: '1px solid #ddd', fontSize: '0.72rem' }}>
                      <div>{col.title}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>{col.examPeriod} #{col.sequenceIndex}</div>
                    </th>
                  ))}
                  <th style={{ padding: '8px 6px', border: '1px solid #ddd', backgroundColor: 'var(--eum-green-dark)' }}>Submitted</th>
                  <th style={{ padding: '8px 6px', border: '1px solid #ddd', backgroundColor: 'var(--eum-green-dark)' }}>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.studentId} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9F9F7' }}>
                    <td style={{ padding: '4px', border: '1px solid #ddd', fontWeight: '600' }}>{idx + 1}</td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '700', color: 'var(--eum-maroon)' }}>
                      {s.rollNumber}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd', textAlign: 'left', fontWeight: '600' }}>
                      {s.name}
                    </td>
                    {assessmentColumns.map((col) => {
                      const sub = s.submissionsMap[col.assessmentId];
                      const status = sub ? sub.status : 'missing';
                      return (
                        <td
                          key={col.assessmentId}
                          style={{
                            padding: '4px 4px',
                            border: '1px solid #ddd',
                            fontSize: '0.74rem',
                            fontWeight: '600',
                            backgroundColor: status === 'on-time' ? 'rgba(28,92,52,0.06)' : status === 'late' ? 'rgba(217,140,27,0.08)' : 'rgba(179,55,44,0.06)'
                          }}
                        >
                          <div style={{ color: status === 'on-time' ? 'var(--eum-green)' : status === 'late' ? 'var(--status-warning)' : 'var(--status-danger)' }}>
                            {status.toUpperCase()}
                          </div>
                          {sub && sub.marksAwarded !== null && (
                            <div style={{ fontWeight: '800', color: 'var(--text-dark)', marginTop: '2px' }}>
                              [{sub.marksAwarded}/{col.maxMarks}]
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd', fontWeight: '700' }}>
                      {s.totalSubmitted} / {assessmentColumns.length}
                    </td>
                    <td style={{ padding: '4px 6px', border: '1px solid #ddd', fontWeight: '800', color: 'var(--eum-green)' }}>
                      {s.totalMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '40px',
            paddingTop: '20px',
            fontSize: '0.85rem',
            color: 'var(--text-dark)'
          }}>
            <div>
              <div style={{ borderTop: '1px solid #000', width: '180px', paddingTop: '4px', textAlign: 'center', fontWeight: '600' }}>
                Course Instructor Signature
              </div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #000', width: '180px', paddingTop: '4px', textAlign: 'center', fontWeight: '600' }}>
                Head of Department Signature
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
