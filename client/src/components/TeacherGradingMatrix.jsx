import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ExternalLink, CheckCircle2, Clock, AlertTriangle, Save, Filter } from 'lucide-react';

export const TeacherGradingMatrix = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradingMap, setGradingMap] = useState({}); // { studentId: marks }
  const [savingMap, setSavingMap] = useState({});

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await API.get('/assessments');
        const list = res.data.assessments || [];
        setAssessments(list);
        if (list.length > 0) setSelectedAssessment(list[0]._id);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      }
    };
    fetchAssessments();
  }, []);

  const fetchMatrix = async () => {
    if (!selectedAssessment) return;
    setLoading(true);
    try {
      const res = await API.get(`/submissions/assessment/${selectedAssessment}`);
      setMatrixData(res.data);
      const initialGradeMap = {};
      (res.data.matrix || []).forEach((item) => {
        if (item.marksAwarded !== null && item.marksAwarded !== undefined) {
          initialGradeMap[item.studentId] = item.marksAwarded;
        }
      });
      setGradingMap(initialGradeMap);
    } catch (err) {
      console.error('Error fetching submission matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [selectedAssessment]);

  const handleSaveGrade = async (item) => {
    const marks = gradingMap[item.studentId];
    if (marks === undefined || marks === '') return;

    setSavingMap((prev) => ({ ...prev, [item.studentId]: true }));
    try {
      await API.patch(`/submissions/grade/${item.submissionId || 'new'}`, {
        marksAwarded: Number(marks),
        studentId: item.studentId,
        assignmentQuizId: selectedAssessment,
      });
      fetchMatrix();
    } catch (err) {
      alert('Error saving grade.');
    } finally {
      setSavingMap((prev) => ({ ...prev, [item.studentId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'on-time':
        return <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>ON-TIME</span>;
      case 'late':
        return <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>LATE</span>;
      case 'missing':
        return <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>MISSING</span>;
      default:
        return <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>PENDING</span>;
    }
  };

  const assessmentInfo = matrixData?.assessment;
  const matrix = matrixData?.matrix || [];

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
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)' }}>
            Coursework Submissions & Grading Matrix
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Full 54-student submission roster with 1-click Google Drive launcher and inline grading
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedAssessment}
            onChange={(e) => setSelectedAssessment(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', fontSize: '0.88rem', width: 'auto' }}
          >
            {assessments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.courseId?.code} — {a.title} ({a.examPeriod} #{a.sequenceIndex})
              </option>
            ))}
          </select>
        </div>
      </div>

      {assessmentInfo && (
        <div style={{
          backgroundColor: 'var(--bg-main)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <strong>{assessmentInfo.title}</strong> (Max Marks: {assessmentInfo.maxMarks})
          </div>
          <div>
            Submitted: <strong>{matrixData?.submittedCount} / {matrixData?.totalEnrolled}</strong> • Deadline: {new Date(assessmentInfo.deadline).toLocaleString()}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading submission matrix...
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 1 }}>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px 12px' }}>Roll No</th>
                <th style={{ padding: '10px 12px' }}>Student Name</th>
                <th style={{ padding: '10px 12px' }}>Google Drive Link</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px' }}>Marks / {assessmentInfo?.maxMarks || 10}</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((item) => (
                <tr key={item.studentId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '700' }}>{item.rollNumber}</td>
                  <td style={{ padding: '10px 12px' }}>{item.name}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {item.driveUrl ? (
                      <a
                        href={item.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.78rem', color: 'var(--eum-green)', borderColor: 'var(--eum-green)' }}
                      >
                        <ExternalLink size={12} /> Open Link
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.8rem' }}>No link submitted</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '70px', padding: '4px 8px', fontSize: '0.85rem' }}
                        value={gradingMap[item.studentId] !== undefined ? gradingMap[item.studentId] : ''}
                        onChange={(e) => setGradingMap({ ...gradingMap, [item.studentId]: e.target.value })}
                        placeholder="Marks"
                        min={0}
                        max={assessmentInfo?.maxMarks || 100}
                      />
                      <button
                        onClick={() => handleSaveGrade(item)}
                        disabled={savingMap[item.studentId]}
                        className="btn btn-primary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        <Save size={12} /> Save
                      </button>
                    </div>
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
