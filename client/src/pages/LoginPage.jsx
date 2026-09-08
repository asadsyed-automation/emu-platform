import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import {
  Shield,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from 'lucide-react';

export const LoginPage = ({ onBackToLanding }) => {
  const { login } = useAuth();

  // Role Selection State: null (shows picker) or 'student' | 'teacher' | 'owner'
  const [selectedRole, setSelectedRole] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(null);
  const [error, setError] = useState('');

  // 1-Click Sandbox Demo Login
  const handleInstantDemoLogin = async (roleKey, demoName, demoPass) => {
    setError('');
    setActiveDemoRole(roleKey);
    try {
      await login(demoName, demoPass);
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed.');
      setActiveDemoRole(null);
    }
  };

  // Direct 1-Step Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = identifier.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setError('Please enter both your Roll Number / Name and Password.');
      return;
    }

    setLoading(true);
    try {
      await login(trimmedId, trimmedPass);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid credentials. Please verify your Roll Number / Name and Password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setIdentifier('');
    setPassword('');
    setShowPassword(false);
    setError('');
    setActiveDemoRole(null);
  };

  // Role Configurations
  const roleConfig = {
    student: {
      title: 'Student Portal Sign In',
      badge: 'BS(CS) 7th Semester (Section 7A)',
      idLabel: 'Roll Number or Full Name',
      idPlaceholder: 'e.g. COSC231122114 or Syed Asad Ali Raza Shah',
      passLabel: 'Password',
      passPlaceholder: 'Your Roll Number (e.g. COSC231122114)',
      note: '💡 Note: Initial default password is your Roll Number. You can change it inside your dashboard anytime.',
      demoName: 'Demo Student (Zaid Khan)',
      demoPass: 'DEMO-STU-01',
      demoLabel: 'Demo Student',
      icon: <GraduationCap size={28} />,
      color: 'var(--eum-green)',
    },
    teacher: {
      title: 'Faculty Portal Sign In',
      badge: 'Course Instructor',
      idLabel: 'Faculty Name or ID',
      idPlaceholder: 'e.g. Qasim Niaz / Rozina Riaz / Samra Mushtaq',
      passLabel: 'Faculty Password',
      passPlaceholder: 'e.g. TCH-AOA01',
      note: '💡 Note: Enter faculty credentials to access fast attendance & lecture grading.',
      demoName: 'Prof. Tariq Demo (Faculty)',
      demoPass: 'DEMO-TCH-01',
      demoLabel: 'Demo Teacher',
      icon: <User size={28} />,
      color: 'var(--eum-gold)',
    },
    owner: {
      title: 'Portal Lead & Admin Sign In',
      badge: 'System Administrator',
      idLabel: 'Admin ID or Name',
      idPlaceholder: 'e.g. Asad Syed (Shah G) or OWNER-01',
      passLabel: 'Admin Password',
      passPlaceholder: 'e.g. OWNER-01',
      note: '💡 Note: Authorized administrator credentials required for full timetable & course controls.',
      demoName: 'Demo Admin (Portal Lead)',
      demoPass: 'DEMO-ADM-01',
      demoLabel: 'Demo Admin',
      icon: <Shield size={28} />,
      color: 'var(--eum-maroon)',
    },
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Sticky Navbar */}
      <Navbar
        variant="login"
        onBackToLanding={onBackToLanding}
        onGoHome={onBackToLanding}
        selectedRole={selectedRole}
        onSwitchRole={() => setSelectedRole(null)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
      >
        {/* VIEW 1: ROLE SELECTION ONBOARDING */}
        {!selectedRole ? (
          <div style={{ width: '100%', maxWidth: '920px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-fade-in-up">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--eum-gold-light)',
                  color: '#795548',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={14} /> Emerson University Multan • Academic Portal
              </span>
              <h1 style={{ fontSize: '2.2rem', color: 'var(--eum-maroon)', marginBottom: '8px' }}>
                Select Your Role to Sign In
              </h1>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto' }}>
                Direct, 1-step sign in. Enter your Roll Number or Name to access attendance, lectures, and academic schedules.
              </p>
            </div>

            {/* 3 Role Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {/* CARD 1: STUDENT */}
              <div
                className="card-hover animate-fade-in-up delay-100"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--eum-green)' }} />

                <div>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(28, 92, 52, 0.08)',
                      color: 'var(--eum-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <GraduationCap size={28} />
                  </div>

                  <span className="badge badge-student" style={{ marginBottom: '8px' }}>
                    BS(CS) 7th Semester (7A)
                  </span>

                  <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Student Portal
                  </h2>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                    Check live attendance %, 75% target threshold badges, view weekly timetable, and submit coursework.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => handleSelectRole('student')}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '11px', fontSize: '0.92rem', marginBottom: '10px' }}
                  >
                    Sign In as Student <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => handleInstantDemoLogin('student', roleConfig.student.demoName, roleConfig.student.demoPass)}
                    disabled={activeDemoRole !== null}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.8rem',
                      borderColor: 'rgba(28, 92, 52, 0.3)',
                      color: 'var(--eum-green)',
                      backgroundColor: 'rgba(28, 92, 52, 0.03)',
                      opacity: activeDemoRole && activeDemoRole !== 'student' ? 0.6 : 1,
                    }}
                  >
                    {activeDemoRole === 'student' ? (
                      <>
                        <Loader2 size={13} className="spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={13} style={{ fill: 'var(--eum-green)' }} />
                        <span>⚡ 1-Click Demo Student</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CARD 2: TEACHER */}
              <div
                className="card-hover animate-fade-in-up delay-200"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--eum-gold)' }} />

                <div>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(201, 162, 39, 0.12)',
                      color: '#9E7700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <User size={28} />
                  </div>

                  <span className="badge badge-teacher" style={{ marginBottom: '8px' }}>
                    Course Instructor
                  </span>

                  <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Faculty Portal
                  </h2>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                    Mark lecture attendance in &lt;45s, review student submissions, and export Date-Wise Registers.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => handleSelectRole('teacher')}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '11px',
                      fontSize: '0.92rem',
                      marginBottom: '10px',
                      backgroundColor: '#8C6800',
                    }}
                  >
                    Sign In as Faculty <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => handleInstantDemoLogin('teacher', roleConfig.teacher.demoName, roleConfig.teacher.demoPass)}
                    disabled={activeDemoRole !== null}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.8rem',
                      borderColor: 'rgba(201, 162, 39, 0.4)',
                      color: '#8C6800',
                      backgroundColor: 'rgba(201, 162, 39, 0.04)',
                      opacity: activeDemoRole && activeDemoRole !== 'teacher' ? 0.6 : 1,
                    }}
                  >
                    {activeDemoRole === 'teacher' ? (
                      <>
                        <Loader2 size={13} className="spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={13} style={{ fill: '#8C6800' }} />
                        <span>⚡ 1-Click Demo Faculty</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CARD 3: ADMIN / OWNER */}
              <div
                className="card-hover animate-fade-in-up delay-300"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--eum-maroon)' }} />

                <div>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(122, 31, 31, 0.08)',
                      color: 'var(--eum-maroon)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Shield size={28} />
                  </div>

                  <span className="badge badge-owner" style={{ marginBottom: '8px' }}>
                    Pilot Lead & Admin
                  </span>

                  <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Administration
                  </h2>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                    Full timetable slot CRUD, course management, student & faculty rosters, password resets, and marks import.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => handleSelectRole('owner')}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '11px', fontSize: '0.92rem', marginBottom: '10px' }}
                  >
                    Sign In as Admin <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => handleInstantDemoLogin('owner', roleConfig.owner.demoName, roleConfig.owner.demoPass)}
                    disabled={activeDemoRole !== null}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.8rem',
                      borderColor: 'rgba(122, 31, 31, 0.3)',
                      color: 'var(--eum-maroon)',
                      backgroundColor: 'rgba(122, 31, 31, 0.03)',
                      opacity: activeDemoRole && activeDemoRole !== 'owner' ? 0.6 : 1,
                    }}
                  >
                    {activeDemoRole === 'owner' ? (
                      <>
                        <Loader2 size={13} className="spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={13} style={{ fill: 'var(--eum-maroon)' }} />
                        <span>⚡ 1-Click Demo Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: 1-STEP DIRECT LOGIN FORM */
          <div
            className="animate-fade-in-up"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              width: '100%',
              maxWidth: '460px',
              overflow: 'hidden',
            }}
          >
            {/* Top Accent Strip */}
            <div style={{ height: '5px', backgroundColor: roleConfig[selectedRole].color }} />

            {/* Card Header */}
            <div
              style={{
                padding: '26px 28px 18px',
                textAlign: 'center',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-main)',
                  color: roleConfig[selectedRole].color,
                  marginBottom: '10px',
                  border: `2px solid ${roleConfig[selectedRole].color}`,
                }}
              >
                {roleConfig[selectedRole].icon}
              </div>

              <div style={{ marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: roleConfig[selectedRole].color,
                    letterSpacing: '0.5px',
                  }}
                >
                  {roleConfig[selectedRole].badge}
                </span>
              </div>

              <h1 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '4px' }}>
                {roleConfig[selectedRole].title}
              </h1>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                Direct sign in with your credentials
              </p>
            </div>

            {/* Card Body */}
            <div style={{ padding: '24px 28px' }}>
              {error && (
                <div
                  style={{
                    backgroundColor: 'var(--status-danger-bg)',
                    color: 'var(--status-danger)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(179, 55, 44, 0.2)',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="identifier-input" style={{ fontSize: '0.84rem' }}>
                    {roleConfig[selectedRole].idLabel}
                  </label>
                  <input
                    id="identifier-input"
                    type="text"
                    className="form-input"
                    placeholder={roleConfig[selectedRole].idPlaceholder}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="password-input" style={{ fontSize: '0.84rem' }}>
                    {roleConfig[selectedRole].passLabel}
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder={roleConfig[selectedRole].passPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: '42px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        padding: '6px',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      display: 'block',
                      marginTop: '6px',
                      lineHeight: 1.4,
                    }}
                  >
                    {roleConfig[selectedRole].note}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.96rem',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Sign In to Dashboard</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Login Option */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleInstantDemoLogin(
                      selectedRole,
                      roleConfig[selectedRole].demoName,
                      roleConfig[selectedRole].demoPass
                    )
                  }
                  disabled={activeDemoRole !== null}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '0.8rem',
                    color: roleConfig[selectedRole].color,
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {activeDemoRole === selectedRole ? (
                    <>
                      <Loader2 size={13} className="spin" />
                      <span>Signing in as {roleConfig[selectedRole].demoLabel}...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={13} />
                      <span>⚡ 1-Click {roleConfig[selectedRole].demoLabel} Sign In</span>
                    </>
                  )}
                </button>
              </div>

              {/* Back to Role Picker */}
              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  ← Switch Role / Return to Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
