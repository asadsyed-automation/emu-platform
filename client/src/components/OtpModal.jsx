import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export const OtpModal = () => {
  const { user, verifyOtp, resendOtp, logout } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(otp);
      setMessage(res.message || 'OTP verified successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setResending(true);
    try {
      const res = await resendOtp();
      setMessage(res.message || `New OTP code sent to ${user.email}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-warning-bg)',
            color: 'var(--eum-maroon)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <KeyRound size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--eum-maroon)' }}>
            First Login Verification
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Enter the 6-digit OTP code sent to your registered email:
          </p>
          <p style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--eum-green)', marginTop: '4px' }}>
            {user?.email}
          </p>
        </div>

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

        {message && (
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
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label" htmlFor="otp-input">Enter 6-Digit OTP Code</label>
            <input
              id="otp-input"
              type="text"
              className="form-input"
              placeholder="e.g. 123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{
                textAlign: 'center',
                fontSize: '1.6rem',
                letterSpacing: '8px',
                fontWeight: '700',
                fontFamily: 'monospace'
              }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || otp.length !== 6}
            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }}
          >
            {loading ? 'Verifying Code...' : 'Verify OTP & Enter Dashboard'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <Send size={14} />
            <span>{resending ? 'Sending...' : 'Resend OTP Code'}</span>
          </button>

          <button
            type="button"
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.82rem'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
