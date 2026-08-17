import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ExternalLink, CheckCircle2, Clock, AlertTriangle, Save, Filter, FileText, PlusCircle, Search, Award, Check } from 'lucide-react';
import { AssessmentManager } from './AssessmentManager';

export const TeacherGradingMatrix = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradingMap, setGradingMap] = useState({}); // { studentId: marks }
  const [savingMap, setSavingMap] = useState({});
  const [savedSuccessMap, setSavedSuccessMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState('all');

  const fetchAssessments = async () => {
    try {
      const res = await API.get('/assessments');
      const list = res.data.assessments || [];
      setAssessments(list);
      if (list.length > 0 && !selectedAssessment) {
        setSelectedAssessment(list[0]._id);
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
    }
  };

  useEffect(() => {
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
      setSavedSuccessMap((prev) => ({ ...prev, [item.studentId]: true }));
      setTimeout(() => {
        setSavedSuccessMap((prev) => ({ ...prev, [item.studentId]: false }));
      }, 2500);
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

  const filteredMatrix = matrix.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.rollNumber?.toLowerCase().includes(q) ||
      item.name?.toLowerCase().includes(q)
    );
  });

  const uniqueCourses = Array.from(new Set(assessments.map((a) => a.courseId?.code).filter(Boolean)));

  const displayedAssessments = assessments.filter((a) => {
    if (filterCourse === 'all') return true;
    return a.courseId?.code === filterCourse;
  });

  const gradedCount = matrix.filter((m) => m.marksAwarded !== null && m.marksAwarded !== undefined).length;

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
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
          <FileText style={{ color: 'var(--eum-maroon)' }} size={26} />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)' }}>
              Coursework Submissions & Evaluation Matrix
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              View all class coursework items at once, inspect Google Drive links, and mark student scores inline
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(!showCreateModal)}
          className="btn btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.84rem' }}
        >
          <PlusCircle size={15} /> {showCreateModal ? 'Hide Form' : '+ New Assessment'}
        </button>
      </div>

      {showCreateModal && (
        <div style={{ marginBottom: '20px' }}>
          <AssessmentManager onCreated={() => {
            fetchAssessments();
            setShowCreateModal(false);
          }} />
        </div>
      )}

      {/* Coursework Quick-Picker (All items at once) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Active Assignments & Quizzes ({displayedAssessments.length})
          </span>

          {uniqueCourses.length > 1 && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => setFilterCourse('all')}
                style={{
                  background: filterCourse === 'all' ? 'var(--eum-maroon)' : 'transparent',
                  color: filterCourse === 'all' ? '#FFFFFF' : 'var(--text-dark)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                All Courses
              </button>
              {uniqueCourses.map((code) => (
                <button
                  key={code}
                  onClick={() => setFilterCourse(code)}
                  style={{
                    background: filterCourse === code ? 'var(--eum-maroon)' : 'transparent',
                    color: filterCourse === code ? '#FFFFFF' : 'var(--text-dark)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '3px 10px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
          maxHeight: '180px',
          overflowY: 'auto',
          padding: '4px',
        }}>
          {displayedAssessments.map((a) => {
            const isSelected = selectedAssessment === a._id;
            return (
              <div
                key={a._id}
                onClick={() => setSelectedAssessment(a._id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'rgba(122, 31, 31, 0.08)' : 'var(--bg-main)',
                  border: isSelected ? '2px solid var(--eum-maroon)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: isSelected ? 'var(--eum-maroon)' : 'var(--text-dark)' }}>
                    {a.courseId?.code || 'CS'}
                  </span>
                  <span className={`badge ${a.type === 'quiz' ? 'badge-warning' : 'badge-student'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                    {a.type?.toUpperCase()} #{a.sequenceIndex}
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {a.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Max: {a.maxMarks} Marks • {a.examPeriod}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Assessment Stats Banner */}
      {assessmentInfo && (
        <div style={{
          backgroundColor: 'var(--bg-main)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '18px',
          fontSize: '0.86rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: '800', color: 'var(--eum-maroon)', fontSize: '0.95rem' }}>
              {assessmentInfo.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Deadline: {new Date(assessmentInfo.deadline).toLocaleString()} • Maximum Score: <strong>{assessmentInfo.maxMarks}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem' }}>
              Submitted: <strong style={{ color: 'var(--eum-green)' }}>{matrixData?.submittedCount || 0} / {matrixData?.totalEnrolled || matrix.length}</strong>
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              Graded: <strong style={{ color: 'var(--eum-maroon)' }}>{gradedCount} / {matrix.length}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Search Filter inside Table */}
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px', paddingRight: '10px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.85rem' }}
            placeholder="Search roll number or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Showing {filteredMatrix.length} students
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading coursework evaluation roster...
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: '460px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 1 }}>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '10px 12px', width: '40px' }}>#</th>
                <th style={{ padding: '10px 12px', width: '130px' }}>Roll Number</th>
                <th style={{ padding: '10px 12px' }}>Student Name</th>
                <th style={{ padding: '10px 12px', width: '140px' }}>Submission Link</th>
                <th style={{ padding: '10px 12px', width: '100px' }}>Status</th>
                <th style={{ padding: '10px 12px', width: '180px' }}>Marks / {assessmentInfo?.maxMarks || 10}</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrix.map((item, idx) => (
                <tr key={item.studentId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 12px', fontWeight: '700', color: 'var(--eum-maroon)' }}>{item.rollNumber}</td>
                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>{item.name}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {item.driveUrl ? (
                      <a
                        href={item.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.76rem', color: 'var(--eum-green)', borderColor: 'var(--eum-green)' }}
                      >
                        <ExternalLink size={12} /> View Drive
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.78rem' }}>Pending link</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '75px', padding: '5px 8px', fontSize: '0.85rem' }}
                        value={gradingMap[item.studentId] !== undefined ? gradingMap[item.studentId] : ''}
                        onChange={(e) => setGradingMap({ ...gradingMap, [item.studentId]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveGrade(item);
                        }}
                        placeholder="Marks"
                        min={0}
                        max={assessmentInfo?.maxMarks || 100}
                      />
                      <button
                        onClick={() => handleSaveGrade(item)}
                        disabled={savingMap[item.studentId]}
                        className={`btn ${savedSuccessMap[item.studentId] ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                        title="Save Grade (Enter)"
                      >
                        {savedSuccessMap[item.studentId] ? (
                          <>
                            <Check size={12} /> Saved
                          </>
                        ) : (
                          <>
                            <Save size={12} /> Save
                          </>
                        )}
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

