import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Award, AlertTriangle, CheckCircle2, XCircle, Clock, BookOpen, ChevronDown, ChevronUp, History } from 'lucide-react';

export const StudentAttendanceSummary = () => {
  const [coursesSummary, setCoursesSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [selectedAuditRecord, setSelectedAuditRecord] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get('/attendance/student/my-summary');
        const summary = res.data.coursesSummary || [];
        setCoursesSummary(summary);
        if (summary.length > 0) {
          setExpandedCourse(summary[0].courseId);
        }
      } catch (err) {
        console.error('Error fetching student attendance summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const getStandingBadge = (standing) => {
    switch (standing) {
      case 'Good Standing':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> Good Standing (≥ 75%)</span>;
      case 'At Risk':
        return <span className="badge badge-warning"><AlertTriangle size={12} /> At Risk (65-74%)</span>;
      default:
        return <span className="badge badge-danger"><XCircle size={12} /> Critical (&lt; 65%)</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Calculating attendance percentages and history...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.3rem', color: 'var(--eum-maroon)', marginBottom: '16px' }}>
        My Course Attendance & Standing Overview
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {coursesSummary.map((item) => {
          const isExpanded = expandedCourse === item.courseId;

          return (
            <div
              key={item.courseId}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-color)',
                borderTop: item.percentage >= 75 ? '4px solid var(--eum-green)' : item.percentage >= 65 ? '4px solid var(--status-warning)' : '4px solid var(--status-danger)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--eum-maroon)' }}>{item.code}</span>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginTop: '2px' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Instructor: {item.teacherName}</span>
                </div>
                {getStandingBadge(item.standing)}
              </div>

              {/* Progress & Stat Cards */}
              <div style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                textAlign: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attendance</div>
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: item.percentage >= 75 ? 'var(--eum-green)' : item.percentage >= 65 ? 'var(--status-warning)' : 'var(--status-danger)'
                  }}>
                    {item.percentage}%
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Present</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--status-success)' }}>
                    {item.presentCount}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Absent</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--status-danger)' }}>
                    {item.absentCount}
                  </div>
                </div>
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => setExpandedCourse(isExpanded ? null : item.courseId)}
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.82rem', padding: '6px', justifyContent: 'center' }}
              >
                <span>{isExpanded ? 'Hide Lecture History' : `View Lecture History (${item.records?.length || 0})`}</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Expandable Lecture History */}
              {isExpanded && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
                  <h5 style={{ fontSize: '0.88rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Lecture-by-Lecture Attendance Log:
                  </h5>

                  {item.records?.length === 0 ? (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No attendance marked for this course yet.</p>
                  ) : (
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '6px' }}>Date</th>
                            <th style={{ padding: '6px' }}>Status</th>
                            <th style={{ padding: '6px', textAlign: 'right' }}>Audit Log</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.records.map((r) => (
                            <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '6px', fontWeight: '600' }}>
                                {new Date(r.lectureId?.date || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </td>
                              <td style={{ padding: '6px' }}>
                                {r.status === 'present' ? (
                                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Present</span>
                                ) : (
                                  <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Absent</span>
                                )}
                              </td>
                              <td style={{ padding: '6px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedAuditRecord(r)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--eum-maroon)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                                >
                                  <History size={12} />
                                  <span>{r.history?.length || 1} edits</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Audit History Modal */}
      {selectedAuditRecord && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-maroon)', marginBottom: '12px' }}>
              Append-Only Audit Trail Log
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Full unalterable change log for attendance record ID: <strong>{selectedAuditRecord._id}</strong>
            </p>

            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {selectedAuditRecord.history?.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    marginBottom: '8px',
                    fontSize: '0.82rem',
                    borderLeft: '3px solid var(--eum-gold)'
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                    Action #{idx + 1}: {h.previousStatus ? `${h.previousStatus.toUpperCase()} ➔ ${h.newStatus.toUpperCase()}` : `INITIAL STATUS: ${h.newStatus.toUpperCase()}`}
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                    Reason: <em>"{h.reason}"</em>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                    Timestamp: {new Date(h.changedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setSelectedAuditRecord(null)} className="btn btn-outline">
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
