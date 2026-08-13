import React, { useState } from 'react';
import API from '../services/api';
import { AlertTriangle, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

export const DisputeModal = ({ record, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!reason || reason.trim().length < 10) {
      setError('Please provide a detailed reason (at least 10 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/disputes/raise', {
        attendanceRecordId: record._id,
        reason: reason.trim(),
      });
      setSuccessMsg(res.data.message || 'Dispute submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to raise dispute.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle style={{ color: 'var(--status-warning)' }} size={24} />
            <h3 style={{ color: 'var(--eum-maroon)', fontSize: '1.25rem' }}>Raise Attendance Dispute</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Date: <strong>{new Date(record.lectureId?.date || record.createdAt).toDateString()}</strong> • Status: <span className="badge badge-danger">ABSENT</span>
        </p>

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="dispute-reason-input">Reason for Dispute (Required)</label>
            <textarea
              id="dispute-reason-input"
              className="form-input"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain clearly why you were marked absent (e.g., Present in BOT-B1-F-102 room, medical slip submitted, late entry verified by peer)."
              required
            />
          </div>

          <div style={{
            backgroundColor: 'var(--bg-main)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} style={{ color: 'var(--eum-gold)' }} />
            <span>
              <strong>Peer Validation</strong>: Top 10 present students with highest attendance % in this course will vote on your request (2/3 majority required for teacher escalation).
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting Dispute...' : 'Submit to Peer Voting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
