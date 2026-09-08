import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { StudentSubmissionModal } from './StudentSubmissionModal';
import { FileText, Clock, ExternalLink, Award, CheckCircle2, AlertCircle } from 'lucide-react';

export const StudentCourseworkList = () => {
  const [assessments, setAssessments] = useState([]);
  const [submissionsMap, setSubmissionsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeModalAssessment, setActiveModalAssessment] = useState(null);

  const fetchData = async () => {
    try {
      const [assRes, subRes] = await Promise.all([
        API.get('/assessments'),
        API.get('/submissions/my-submissions'),
      ]);

      setAssessments(assRes.data.assessments || []);
      const subList = subRes.data.submissions || [];
      const map = {};
      subList.forEach((s) => {
        if (s.assignmentQuizId?._id) {
          map[s.assignmentQuizId._id] = s;
        }
      });
      setSubmissionsMap(map);
    } catch (err) {
      console.error('Error fetching student coursework:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDeadlineBadge = (deadlineStr, hasSubmission) => {
    const isPassed = new Date(deadlineStr).getTime() < Date.now();
    const diffHours = (new Date(deadlineStr).getTime() - Date.now()) / (1000 * 60 * 60);

    if (isPassed) {
      return hasSubmission ? (
        <span className="badge badge-success"><CheckCircle2 size={12} /> Submitted</span>
      ) : (
        <span className="badge badge-danger"><AlertCircle size={12} /> ⚠️ Missed (Closed)</span>
      );
    } else if (diffHours <= 24) {
      return <span className="badge badge-warning"><Clock size={12} /> Due in {Math.max(1, Math.round(diffHours))}h</span>;
    } else {
      return <span className="badge badge-success"><Clock size={12} /> Due in {Math.round(diffHours / 24)} days</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading active coursework...
      </div>
    );
  }

  // Friendly Empty State when 0 assignments/quizzes are assigned
  if (assessments.length === 0) {
    return (
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 24px',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(122, 31, 31, 0.08)',
            color: 'var(--eum-maroon)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
          }}
        >
          <FileText size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', marginBottom: '6px' }}>
          No Coursework Assigned Yet
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 16px', lineHeight: 1.5 }}>
          There are currently no active assignments or quizzes published. When your course instructor or department administrator assigns a coursework task, it will appear here with its Google Drive submission portal and deadline.
        </p>
        <span className="badge badge-success" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
          ✨ All Coursework Up to Date
        </span>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <FileText style={{ color: 'var(--eum-maroon)' }} size={24} />
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)' }}>My Coursework & Drive Submissions</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Submit external Google Drive URLs before the scheduled deadline
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {assessments.map((a) => {
          const sub = submissionsMap[a._id];
          const isPassed = new Date(a.deadline).getTime() < Date.now();
          const isMissed = isPassed && !sub;

          return (
            <div
              key={a._id}
              style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: isMissed ? '1px solid rgba(179, 55, 44, 0.35)' : '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-teacher">{a.examPeriod} #{a.sequenceIndex}</span>
                  {getDeadlineBadge(a.deadline, !!sub)}
                </div>

                <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)', marginBottom: '4px' }}>{a.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Course: <strong>{a.courseId?.code}</strong> • Max Marks: <strong>{a.maxMarks}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Deadline: <strong style={{ color: isPassed ? 'var(--status-danger)' : 'var(--text-dark)' }}>{new Date(a.deadline).toLocaleString()}</strong>
                </div>

                {/* Submission Status Box */}
                {sub ? (
                  <div style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '14px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--eum-green)' }}>
                        Status: {sub.status?.toUpperCase()}
                      </span>
                      {sub.marksAwarded !== null && (
                        <span style={{ fontWeight: '800', color: 'var(--eum-maroon)' }}>
                          Grade: {sub.marksAwarded} / {a.maxMarks}
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Link: <a href={sub.driveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--eum-green)' }}>{sub.driveUrl}</a>
                    </div>
                  </div>
                ) : isMissed ? (
                  <div style={{
                    backgroundColor: 'var(--status-danger-bg)',
                    color: 'var(--status-danger)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    marginBottom: '14px',
                    border: '1px solid rgba(179, 55, 44, 0.25)',
                  }}>
                    <strong>⚠️ Missed:</strong> The submission deadline has passed. Submissions are closed.
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: 'var(--status-warning)', fontStyle: 'italic', marginBottom: '14px' }}>
                    No Google Drive link submitted yet.
                  </div>
                )}
              </div>

              {isMissed ? (
                <button
                  disabled
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px', opacity: 0.6, cursor: 'not-allowed', color: 'var(--status-danger)' }}
                >
                  <AlertCircle size={14} />
                  <span>Submissions Closed (Missed)</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveModalAssessment(a)}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                >
                  <ExternalLink size={14} />
                  <span>{sub ? 'Update Drive Link' : 'Submit Google Drive Link'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {activeModalAssessment && (
        <StudentSubmissionModal
          assessment={activeModalAssessment}
          existingSubmission={submissionsMap[activeModalAssessment._id]}
          onClose={() => setActiveModalAssessment(null)}
          onSuccess={() => {
            setActiveModalAssessment(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
};
