import React, { useState } from 'react';
import API from '../services/api';
import { UserPlus, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const OwnerBulkImportModal = ({ onClose, onSuccess }) => {
  const [inputText, setInputText] = useState(`[
  {"rollNumber": "21-BSCS-04", "name": "Bilal Ahmed", "email": "bilal.21bscs04@emerson.edu.pk"},
  {"rollNumber": "21-BSCS-05", "name": "Sana Malik", "email": "sana.21bscs05@emerson.edu.pk"}
]`);
  const [defaultPassword, setDefaultPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    let parsedStudents = [];
    try {
      // Try parsing as JSON first
      parsedStudents = JSON.parse(inputText);
      if (!Array.isArray(parsedStudents)) {
        throw new Error('JSON input must be an array of student objects.');
      }
    } catch (jsonErr) {
      // Fallback: parse line-by-line CSV format: rollNumber, name, email
      const lines = inputText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      parsedStudents = lines.map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        return {
          rollNumber: parts[0] || '',
          name: parts[1] || 'Student',
          email: parts[2] || `${parts[0]?.toLowerCase()}@emerson.edu.pk`,
        };
      });
    }

    if (parsedStudents.length === 0) {
      setError('Please enter valid student data (JSON array or line-separated list).');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/admin/bulk-create-students', {
        students: parsedStudents,
        defaultPassword,
      });
      setResult(res.data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error executing bulk account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus style={{ color: 'var(--eum-maroon)' }} size={24} />
            <h3 style={{ color: 'var(--eum-maroon)', fontSize: '1.25rem' }}>Bulk Student Account Creation</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Accounts created here are pre-verified pending (OTP required on first login). Existing roll numbers are automatically skipped.
        </p>

        {error && (
          <div style={{
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              <CheckCircle2 size={18} />
              <span>{result.message}</span>
            </div>
            <div style={{ marginTop: '6px', fontSize: '0.82rem' }}>
              Created: <strong>{result.summary?.createdCount}</strong> | Skipped: <strong>{result.summary?.skippedCount}</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="default-password-input">Default Initial Password</label>
            <input
              id="default-password-input"
              type="text"
              className="form-input"
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
              placeholder="e.g. Password123!"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="students-data-input">Student Roll List (JSON Array or CSV lines)</label>
            <textarea
              id="students-data-input"
              className="form-input"
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.4' }}
              placeholder={`Example JSON:\n[\n  {"rollNumber": "21-BSCS-01", "name": "Ali Raza", "email": "ali@emerson.edu.pk"}\n]\n\nOR CSV format:\n21-BSCS-01, Ali Raza, ali@emerson.edu.pk`}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Accounts...' : 'Execute Bulk Creation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
