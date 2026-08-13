import React, { useState } from 'react';
import API from '../services/api';
import { Link, CheckCircle2, AlertCircle, ExternalLink, X } from 'lucide-react';

export const StudentSubmissionModal = ({ assessment, existingSubmission, onClose, onSuccess }) => {
  const [driveUrl, setDriveUrl] = useState(existingSubmission ? existingSubmission.driveUrl : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!driveUrl || !driveUrl.toLowerCase().includes('drive.google.com') && !driveUrl.toLowerCase().startsWith('http')) {
      setError('Please paste a valid Google Drive URL (e.g. https://drive.google.com/file/d/...).');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/submissions/submit', {
        assignmentQuizId: assessment._id,
        driveUrl: driveUrl.trim(),
      });
      setSuccessMsg(res.data.message || 'Submission recorded successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit Drive link.');
    } finally {
      setLoading(false);
    }
  };

  const isPastDeadline = new Date() > new Date(assessment.deadline);

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link style={{ color: 'var(--eum-maroon)' }} size={24} />
            <h3 style={{ color: 'var(--eum-maroon)', fontSize: '1.25rem' }}>Submit Google Drive URL</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-main)',
          padding: '12px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '16px'
        }}>
          <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{assessment.title}</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Deadline: <strong>{new Date(assessment.deadline).toLocaleString()}</strong> • Tag: <span className="badge badge-teacher">{assessment.examPeriod} #{assessment.sequenceIndex}</span>
          </div>
          {isPastDeadline && (
            <div style={{ color: 'var(--status-danger)', fontWeight: '600', marginTop: '6px' }}>
              ⚠️ Deadline has passed! Submissions now will be recorded as <strong>LATE</strong>.
            </div>
          )}
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="drive-url-input">External Google Drive Link</label>
            <input
              id="drive-url-input"
              type="url"
              className="form-input"
              placeholder="https://drive.google.com/file/d/..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              required
            />
          </div>

          {driveUrl && (
            <div style={{ marginBottom: '16px', fontSize: '0.82rem' }}>
              <a href={driveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--eum-green)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ExternalLink size={14} /> Test Open Link in New Tab
              </a>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Save Drive Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
