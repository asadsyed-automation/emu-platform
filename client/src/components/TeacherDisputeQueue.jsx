import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, MessageSquare } from 'lucide-react';

export const TeacherDisputeQueue = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

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
        console.error('Error fetching teacher courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const fetchDisputes = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await API.get(`/disputes/course/${selectedCourse}`);
      setDisputes(res.data.disputes || []);
    } catch (err) {
      console.error('Error loading course disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [selectedCourse]);

  const handleResolve = async (disputeId, decision) => {
    setActionError('');
    setActionSuccess('');

    if (!actionReason || actionReason.trim().length === 0) {
      setActionError('A decision reason must be provided for audit trail logging.');
      return;
    }

    try {
      const res = await API.patch(`/disputes/resolve/${disputeId}`, {
        decision,
        reason: actionReason.trim(),
      });
      setActionSuccess(res.data.message || `Dispute ${decision} successfully.`);
      setResolvingId(null);
      setActionReason('');
      fetchDisputes();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error resolving dispute.');
    }
  };

  const escalatedDisputes = disputes.filter((d) => d.status === 'escalated' || d.status === 'voting');
  const resolvedDisputes = disputes.filter((d) => d.status === 'approved' || d.status === 'rejected');

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
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
          <ShieldCheck style={{ color: 'var(--eum-maroon)' }} size={24} />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)' }}>
              Attendance Disputes Review Queue
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Review peer-validated student attendance disputes & issue binding decisions
            </p>
          </div>
        </div>

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

      {actionSuccess && (
        <div style={{
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '16px'
        }}>
          {actionSuccess}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading course disputes...
        </div>
      ) : escalatedDisputes.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem'
        }}>
          ✨ No pending dispute escalations for this course!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {escalatedDisputes.map((d) => {
            const yesVotes = d.votes?.filter((v) => v.vote === 'yes').length || 0;
            const totalPeers = d.peerVoterIds?.length || 0;
            const isResolvingThis = resolvingId === d._id;

            return (
              <div
                key={d._id}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  border: '1px solid var(--border-color)',
                  borderLeft: '4px solid var(--eum-maroon)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-dark)' }}>
                      {d.studentId?.name} ({d.studentId?.rollNumber})
                    </span>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Lecture Date: <strong>{new Date(d.lectureId?.date).toDateString()}</strong> • Raised: {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                      Peer Validation: {yesVotes}/{totalPeers} Yes ({d.peerResult?.toUpperCase()})
                    </span>
                  </div>
                </div>

                <div style={{
                  margin: '12px 0',
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <strong>Student Reason:</strong> "{d.reason}"
                </div>

                {!isResolvingThis ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setResolvingId(d._id);
                        setActionError('');
                      }}
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    >
                      <MessageSquare size={14} /> Review & Issue Decision
                    </button>
                  </div>
                ) : (
                  <div style={{
                    marginTop: '12px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--eum-maroon)'
                  }}>
                    <h5 style={{ fontSize: '0.88rem', color: 'var(--eum-maroon)', marginBottom: '8px' }}>
                      Teacher Decision Form (Appends Audit Entry)
                    </h5>

                    {actionError && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--status-danger)', marginBottom: '8px' }}>
                        {actionError}
                      </div>
                    )}

                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter mandatory decision reason (e.g. Verified by attendance log, Medical cert approved, or Peer vote insufficient)..."
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      style={{ fontSize: '0.85rem', marginBottom: '10px' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setResolvingId(null)}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolve(d._id, 'rejected')}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.82rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                      >
                        <XCircle size={14} /> Reject Dispute
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolve(d._id, 'approved')}
                        className="btn btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        <CheckCircle2 size={14} /> Approve (Mark Present)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
