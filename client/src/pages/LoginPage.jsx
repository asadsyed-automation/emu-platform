import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { EmuLogo } from '../components/EmuLogo';
import {
  LogIn,
  Shield,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

export const LoginPage = ({ onBackToLanding }) => {
  const { verifyStep1, verifyStep2Email, verifyStep3Otp, login } = useAuth();

  // Role Selection State: null (shows picker) or 'student' | 'teacher' | 'owner'
  const [selectedRole, setSelectedRole] = useState(null);

  // Multi-step states: 1 = Name+Pass, 2 = Email verification, 3 = OTP verification
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [verifiedUserData, setVerifiedUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(null);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // 1-Click Minimal Sandbox Demo Login
  const handleInstantDemoLogin = async (roleKey, demoName, demoPass) => {
    setError('');
    setInfoMessage('');
    setActiveDemoRole(roleKey);
    try {
      await login(demoName, demoPass);
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed.');
      setActiveDemoRole(null);
    }
  };

  // Handle Step 1 Submission: Name + Password (Roll Number)
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!name.trim() || !password.trim()) {
      setError('Please enter both your full name and password/roll number.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyStep1(name.trim(), password.trim());
      const userData = res.user || res;
      setVerifiedUserData(userData);
      if (userData?.email) {
        setEmail(userData.email);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 Submission: University Email Confirmation (Sends OTP)
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const targetUserId = verifiedUserData?.userId || verifiedUserData?.id || verifiedUserData?._id;
    if (!targetUserId) {
      setError('Session expired. Please re-enter your credentials.');
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const res = await verifyStep2Email(targetUserId, email.trim());
      setInfoMessage(res.message || 'OTP sent successfully!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 Submission: 6-Digit OTP Verification
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP verification code.');
      return;
    }

    const targetUserId = verifiedUserData?.userId || verifiedUserData?.id || verifiedUserData?._id;
    if (!targetUserId) {
      setError('Session expired. Please re-enter your credentials.');
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      await verifyStep3Otp(targetUserId, otp.trim());
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP in Step 3
  const handleResendOtp = async () => {
    setError('');
    setInfoMessage('');
    setResending(true);
    try {
      const res = await verifyStep2Email(verifiedUserData.userId, email.trim());
      setInfoMessage(res.message || 'A fresh 6-digit OTP code has been generated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setStep(1);
    setName('');
    setPassword('');
    setShowPassword(false);
    setEmail('');
    setOtp('');
    setError('');
    setInfoMessage('');
    setActiveDemoRole(null);
  };

  // Role Configurations with Fictional Sandbox Demo Accounts
  const roleConfig = {
    student: {
      title: 'Student Portal Sign In',
      badge: 'BS(CS) 7th Semester',
      nameLabel: 'Full Name (as listed on class roll)',
      namePlaceholder: 'e.g. Syed Asad Ali Raza Shah',
      passLabel: 'Password (Your Roll Number)',
      passPlaceholder: 'e.g. COSC231122114',
      emailPlaceholder: 'e.g. yourname@gmail.com',
      note: '💡 Note: Your Roll Number acts as your default password.',
      demoName: 'Demo Student (Zaid Khan)',
      demoPass: 'DEMO-STU-01',
      demoLabel: 'Demo Student',
      icon: <GraduationCap size={28} />,
      color: 'var(--eum-maroon)',
    },
    teacher: {
      title: 'Faculty Portal Sign In',
      badge: 'Subject Instructor',
      nameLabel: 'Faculty Name',
      namePlaceholder: 'e.g. Dr. Wasif Akbar / Ms. Samia Nasir',
      passLabel: 'Faculty Access Password',
      passPlaceholder: 'e.g. TCH-01',
      emailPlaceholder: 'e.g. faculty@emerson.edu.pk',
      note: '💡 Note: Fast attendance marking available.',
      demoName: 'Prof. Tariq Demo (Faculty)',
      demoPass: 'DEMO-TCH-01',
      demoLabel: 'Demo Teacher',
      icon: <User size={28} />,
      color: 'var(--eum-green)',
    },
    owner: {
      title: 'Portal Lead & Admin Sign In',
      badge: 'System Administrator',
      nameLabel: 'Administrator Name',
      namePlaceholder: 'e.g. Syed Asad Ali Raza Shah (Admin)',
      passLabel: 'Admin Access Key / Password',
      passPlaceholder: 'e.g. OWNER-01',
      emailPlaceholder: 'e.g. owner@emerson.edu.pk',
      note: '💡 Note: Authorized administrator access key required.',
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
                Select Your Role
              </h1>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto' }}>
                Choose your role to access your personalized attendance register, lecture records, and coursework management.
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
                    BS(CS) 7th Semester
                  </span>

                  <h2 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Student Portal
                  </h2>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                    Check live attendance %, 75% target threshold badges, submit coursework Drive links, and raise 24h peer disputes.
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
                        <span>⚡ Demo Student</span>
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
                    Mark attendance in &lt;45s, review coursework submissions, grade assignments, and export Date-Wise Registers for the HOD.
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
                        <span>⚡ Demo Faculty</span>
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
                    Section roll list management, 15-slot timetable setup, system logs, dispute escalation, and platform configuration.
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
                        <span>⚡ Demo Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: ROLE-SPECIFIC LOGIN FORM */
          <div
            className="animate-fade-in-up"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              width: '100%',
              maxWidth: '480px',
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
                {step === 1 ? roleConfig[selectedRole].icon : step === 2 ? <Mail size={24} /> : <KeyRound size={24} />}
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
                {step === 1 ? roleConfig[selectedRole].title : step === 2 ? 'Confirm Registered Email' : 'Verification OTP'}
              </h1>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                {step === 1 && 'Pre-created single section roll list authentication'}
                {step === 2 && 'Step 2 of 3: Registered email confirmation'}
                {step === 3 && 'Step 3 of 3: Enter the 6-digit passcode'}
              </p>

              {/* Step Progress Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '14px',
                }}
              >
                {[
                  { s: 1, label: 'Credentials' },
                  { s: 2, label: 'Email' },
                  { s: 3, label: 'OTP' },
                ].map((item) => (
                  <div key={item.s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          step === item.s
                            ? 'var(--eum-maroon)'
                            : step > item.s
                            ? 'var(--eum-green)'
                            : 'var(--bg-subtle)',
                        color: step >= item.s ? '#FFFFFF' : 'var(--text-muted)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {step > item.s ? '✓' : item.s}
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: step === item.s ? '700' : '500',
                        color: step === item.s ? 'var(--eum-maroon)' : 'var(--text-muted)',
                      }}
                    >
                      {item.label}
                    </span>
                    {item.s < 3 && (
                      <div style={{ width: '14px', height: '1px', backgroundColor: 'var(--border-color)' }} />
                    )}
                  </div>
                ))}
              </div>
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

              {infoMessage && (
                <div
                  style={{
                    backgroundColor: 'var(--status-success-bg)',
                    color: 'var(--eum-green)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(28, 92, 52, 0.2)',
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* STEP 1: Name + Password */}
              {step === 1 && (
                <form onSubmit={handleStep1Submit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="role-name-input">
                      {roleConfig[selectedRole].nameLabel}
                    </label>
                    <input
                      id="role-name-input"
                      type="text"
                      className="form-input"
                      placeholder={roleConfig[selectedRole].namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="role-pass-input">
                      {roleConfig[selectedRole].passLabel}
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        id="role-pass-input"
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
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                      {roleConfig[selectedRole].note}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '12px', fontSize: '0.96rem', marginTop: '8px' }}
                  >
                    {loading ? 'Verifying Account...' : 'Continue to Email Check'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* STEP 2: Email */}
              {step === 2 && (
                <form onSubmit={handleStep2Submit}>
                  <div
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '16px',
                      fontSize: '0.84rem',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ fontWeight: '700', color: 'var(--eum-maroon)' }}>
                      Account: {verifiedUserData?.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                      ID: <strong>{verifiedUserData?.rollNumber}</strong> • Registered Email Hint:{' '}
                      <strong>{verifiedUserData?.maskedEmail}</strong>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="role-email-input">
                      Registered Email Address
                    </label>
                    <input
                      id="role-email-input"
                      type="email"
                      className="form-input"
                      placeholder={roleConfig[selectedRole].emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '12px', fontSize: '0.96rem', marginTop: '6px' }}
                  >
                    <Mail size={16} />
                    <span>{loading ? 'Sending Verification OTP...' : 'Send OTP to My Email'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError('');
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%', padding: '8px', fontSize: '0.82rem', marginTop: '10px' }}
                  >
                    ← Back to Step 1
                  </button>
                </form>
              )}

              {/* STEP 3: OTP */}
              {step === 3 && (
                <form onSubmit={handleStep3Submit}>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Enter the 6-digit OTP code sent to:
                    </p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--eum-green)', marginTop: '2px' }}>
                      {email}
                    </p>
                  </div>

                  <div className="form-group">
                    <input
                      id="role-otp-input"
                      type="text"
                      className="form-input"
                      placeholder="123456"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      style={{
                        textAlign: 'center',
                        fontSize: '1.7rem',
                        letterSpacing: '10px',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        padding: '12px',
                      }}
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || otp.length !== 6}
                    style={{ width: '100%', padding: '12px', fontSize: '0.96rem', marginTop: '6px' }}
                  >
                    <KeyRound size={16} />
                    <span>{loading ? 'Verifying Code...' : 'Verify OTP & Enter Portal'}</span>
                  </button>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resending}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--eum-maroon)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <RotateCcw size={13} /> {resending ? 'Sending...' : 'Resend Code'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Start Over
                    </button>
                  </div>
                </form>
              )}

              {/* Instant 1-Click Demo Shortcut for the Selected Role */}
              <div
                style={{
                  marginTop: '22px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Want to skip manual entry during evaluation?
                </div>
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
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    borderColor: roleConfig[selectedRole].color,
                    color: roleConfig[selectedRole].color,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                  }}
                >
                  {activeDemoRole === selectedRole ? (
                    <>
                      <Loader2 size={14} className="spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      <span>⚡ 1-Click Demo Login ({roleConfig[selectedRole].demoLabel})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card Footer */}
            <div
              style={{
                backgroundColor: 'var(--bg-main)',
                padding: '12px 20px',
                textAlign: 'center',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Independent Student Pilot</span>
              <button
                onClick={() => setSelectedRole(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--eum-maroon)',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Switch Role
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
