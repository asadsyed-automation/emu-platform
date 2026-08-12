import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, User, GraduationCap, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please enter both your Roll Number / Email and Password.');
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (roll, pass) => {
    setIdentifier(roll);
    setPassword(pass);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #7A1F1F 0%, #3B0D0D 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '460px',
        overflow: 'hidden'
      }}>
        {/* Card Header with EUM Colors */}
        <div style={{
          backgroundColor: 'var(--eum-maroon)',
          padding: '32px 24px 24px',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--eum-gold)',
            color: 'var(--eum-maroon-dark)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.6rem',
            border: '3px solid #FFFFFF',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '12px'
          }}>
            EMU
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: 0 }}>EMU Platform</h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
            Emerson University Multan • BS(CS) 7th Semester
          </p>
        </div>

        {/* Card Body */}
        <div style={{ padding: '28px 28px 20px' }}>
          {error && (
            <div style={{
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="roll-number-input">Roll Number / Email</label>
              <input
                id="roll-number-input"
                type="text"
                className="form-input"
                placeholder="e.g. 21-BSCS-01 or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }}
            >
              <LogIn size={18} />
              <span>{loading ? 'Authenticating...' : 'Log In to EMU'}</span>
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '8px', textAlign: 'center', color: 'var(--text-dark)' }}>
              Demo Quick Fill (Click to load):
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                onClick={() => setDemoCredentials('OWNER-01', 'Password123!')}
              >
                <Shield size={12} /> Owner
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                onClick={() => setDemoCredentials('TCH-CS01', 'Password123!')}
              >
                <User size={12} /> Teacher
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                onClick={() => setDemoCredentials('21-BSCS-01', 'Password123!')}
              >
                <GraduationCap size={12} /> Student
              </button>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div style={{
          backgroundColor: 'var(--bg-main)',
          padding: '12px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-color)'
        }}>
          Built for BS(CS) Section • Fast, Transparent & Disputable
        </div>
      </div>
    </div>
  );
};
