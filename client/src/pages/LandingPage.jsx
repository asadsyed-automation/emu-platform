import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Hero3DElement } from '../components/Hero3DElement';
import { FaqAccordion } from '../components/FaqAccordion';
import { EmuLogo } from '../components/EmuLogo';
import { AnimatedCounter } from '../components/AnimatedCounter';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  UserCheck,
  GraduationCap,
  Users,
  Lock,
  Mail,
  Play,
  XCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Check,
  Download,
  Printer,
  Sparkles,
  Zap,
  MessageSquare,
  Send,
  MapPin,
  FileText,
} from 'lucide-react';

export const LandingPage = ({ onGoToApp }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('students');
  const [demoTab, setDemoTab] = useState('register'); // 'register' or 'matrix'
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Dynamic scroll-reveal observer for bottom-to-up animations on each box
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-card');
    elements.forEach((el) => observer.observe(el));

    // Initial check for viewport-visible elements
    setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-card').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('is-revealed');
        }
      });
    }, 40);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [activeTab]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      window.location.href = `mailto:asadraza5670@gmail.com?subject=EMU Platform Pilot Inquiry&body=${encodeURIComponent(contactMessage)}`;
    }, 500);
  };

  const realCourses = [
    { code: 'COSE-4149', title: 'Cloud Computing', teacher: 'Dr. Wasif Akbar', room: 'BOT-B1-F-102' },
    { code: 'COSE-3133', title: 'HCI & Computer Graphics', teacher: 'Ms. Samia Nasir', room: 'BOT-B1-F-102' },
    { code: 'MATH-3181', title: 'Multivariable Calculus', teacher: 'Mr. Muhammad Farhan', room: 'BOT-B1-F-102' },
    { code: 'COSE-3136', title: 'Parallel & Distributed Computing', teacher: 'Mr. Usman Mohyuddin', room: 'LAB BLOCK' },
    { code: 'BUAD-2123', title: 'Principles of Marketing', teacher: 'Mr. Ammar Haider', room: 'BOT-B1-F-102' },
    { code: 'ENGL-3184', title: 'Technical & Business Writing', teacher: 'Ms. Faeza Ayub', room: 'BOT-B1-F-102' },
  ];

  const sampleRegisterStudents = [
    { sr: 1, roll: 'COSC231122114', name: 'Syed Asad Ali Raza Shah', marks: ['P', 'P', 'P', 'P', 'P'], pct: 100 },
    { sr: 2, roll: 'COSC231122122', name: 'Muhammad Aqeel', marks: ['P', 'P', 'P', 'A', 'P'], pct: 80 },
    { sr: 3, roll: 'COSC231122134', name: 'Muhammad Amman', marks: ['P', 'P', 'P', 'P', 'P'], pct: 100 },
    { sr: 4, roll: 'COSC231122139', name: 'Muhammad Zohaib', marks: ['P', 'A', 'P', 'P', 'P'], pct: 80 },
    { sr: 5, roll: 'COSC231122156', name: 'Mubashir Mehmood', marks: ['P', 'P', 'P', 'P', 'P'], pct: 100 },
  ];

  const sampleSubmissionStudents = [
    { sr: 1, roll: 'COSC231122114', name: 'Syed Asad Ali Raza Shah', a1: { score: '10/10', status: 'Graded', onTime: true }, a2: { score: '10/10', status: 'Graded', onTime: true }, q1: { score: '9/10', status: 'Graded', onTime: true }, q2: { score: '10/10', status: 'Graded', onTime: true }, total: '39 / 40' },
    { sr: 2, roll: 'COSC231122122', name: 'Muhammad Aqeel', a1: { score: '9/10', status: 'Graded', onTime: true }, a2: { score: '9/10', status: 'Graded', onTime: true }, q1: { score: '8/10', status: 'Graded', onTime: true }, q2: { score: '9/10', status: 'Graded', onTime: true }, total: '35 / 40' },
    { sr: 3, roll: 'COSC231122134', name: 'Muhammad Amman', a1: { score: '10/10', status: 'Graded', onTime: true }, a2: { score: '9/10', status: 'Graded', onTime: true }, q1: { score: '9/10', status: 'Graded', onTime: true }, q2: { score: '10/10', status: 'Graded', onTime: true }, total: '38 / 40' },
    { sr: 4, roll: 'COSC231122139', name: 'Muhammad Zohaib', a1: { score: '8/10', status: 'Graded', onTime: true }, a2: { score: '8/10', status: 'Graded', onTime: true }, q1: { score: '8/10', status: 'Graded', onTime: true }, q2: { score: '8/10', status: 'Graded', onTime: true }, total: '32 / 40' },
    { sr: 5, roll: 'COSC231122156', name: 'Mubashir Mehmood', a1: { score: '9/10', status: 'Graded', onTime: true }, a2: { score: '10/10', status: 'Graded', onTime: true }, q1: { score: '9/10', status: 'Graded', onTime: true }, q2: { score: '9/10', status: 'Graded', onTime: true }, total: '37 / 40' },
  ];

  const marqueeItems = [
    'Attendance Transparency & Real-Time 75% Threshold Alerts',
    'Algorithmic 3-Peer Dispute Verification Before Faculty Review',
    'Fast 45-Second Lecture Attendance Marking for Faculty',
    'HOD-Ready Date-Wise Attendance Register (Page A) & Submission Matrix (Page B)',
    'Pre-Created Section Roll List with 3-Step Name & Roll Security',
    'Built for BS(CS) Semester 7th, Shift Evening, Section A, Session 2023-27',
    'Continuous Assessment & Google Drive Coursework Submissions',
    'Zero Manual Excel Frustration • Permanent Append-Only Audit Trails',
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-dark)', minHeight: '100vh' }}>
      {/* Universal Sticky Navbar */}
      <Navbar
        variant="landing"
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onGoToLogin={onGoToApp}
      />

      {/* 2. HERO / HOOK */}
      <section style={{ padding: '48px 0 36px', overflow: 'hidden' }}>
        <div className="container hero-grid">
          <div className="reveal is-revealed">
            {/* Value Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(122, 31, 31, 0.08)',
                color: 'var(--eum-maroon)',
                fontSize: '0.78rem',
                fontWeight: '700',
                marginBottom: '14px',
                border: '1px solid rgba(122, 31, 31, 0.16)',
              }}
            >
              <Sparkles size={14} /> Official Academic & Coursework Portal
            </div>

            {/* Clean 2-Line, 2-Color Pro Headline */}
            <h1 className="hero-heading">
              <span className="hero-heading-line1">Autonomous Attendance &</span>
              <span className="hero-heading-line2">Coursework Management.</span>
            </h1>

            {/* Pro Subtext with Clean Spacing */}
            <p className="hero-subtext">
              A unified academic governance portal engineered for university semesters: fast 45-second faculty attendance, timestamped Google Drive coursework submissions, 3-peer cryptographic disputes, and 1-click HOD register automation.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={onGoToApp}
                className="btn btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.92rem' }}
              >
                Log In with Roll Number <ArrowRight size={16} />
              </button>

              <a
                href="#demo"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--eum-green)',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                <FileSpreadsheet size={16} /> Preview Semester Reports
              </a>
            </div>

            {/* Real Section Live Pilot Metrics Card */}
            <div
              className="card-hover reveal-card delay-200"
              style={{
                marginTop: '24px',
                padding: '14px 18px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-sm)',
                maxWidth: '460px',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                  <CheckCircle2 size={11} /> Active Semester Pilot
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  BS(CS) 7th Semester Evening Section A
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--eum-maroon)' }}>
                    <AnimatedCounter target={54} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enrolled Students</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--eum-green)' }}>
                    <AnimatedCounter target={6} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Core Courses</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#B38600' }}>
                    <AnimatedCounter target={24} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Coursework Modules</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Interactive Hero Canvas */}
          <div className="reveal-card delay-100" style={{ display: 'flex', justifyContent: 'center' }}>
            <Hero3DElement />
          </div>
        </div>
      </section>

      {/* CONTINUOUS ANIMATED HEADLINE MARQUEE STRIP */}
      <div className="marquee-strip no-print">
        <div className="marquee-track">
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <span key={idx} className="marquee-item">
              <span className="marquee-dot" />
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. THE PROBLEM (3 Pain-Point Cards) */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }} className="reveal">
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>
              The Attendance Bottleneck in University Classes
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Manual Excel registers create friction, errors, and zero mid-term transparency.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card-hover reveal-card delay-100" style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--status-danger)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              <AlertTriangle size={28} style={{ color: 'var(--status-danger)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-dark)' }}>Attendance shortages discovered too late</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Students often discover their attendance is below the mandatory 75% threshold right before final exams, with no time to dispute inaccurate records.
              </p>
            </div>

            <div className="card-hover reveal-card delay-200" style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--status-warning)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              <Clock size={28} style={{ color: 'var(--status-warning)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-dark)' }}>Teachers compiling paper registers</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Instructors spend hours each semester transferring paper ticks into Excel spreadsheets and formatting submission matrices for the HOD.
              </p>
            </div>

            <div className="card-hover reveal-card delay-300" style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--eum-maroon)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              <Lock size={28} style={{ color: 'var(--eum-maroon)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-dark)' }}>Informal WhatsApp disputes</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Disputes settled verbally or in WhatsApp group chats leave no audit trail and create friction between students and teachers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }} className="reveal">
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>How EMU Works</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Designed for speed and clarity for both students and instructors.
            </p>

            {/* Audience Toggle */}
            <div style={{ display: 'inline-flex', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '6px', borderRadius: '30px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setActiveTab('students')}
                className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', padding: '6px 18px', fontSize: '0.85rem' }}
              >
                <GraduationCap size={16} /> For Students
              </button>
              <button
                onClick={() => setActiveTab('teachers')}
                className={`btn ${activeTab === 'teachers' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', padding: '6px 18px', fontSize: '0.85rem' }}
              >
                <UserCheck size={16} /> For Teachers
              </button>
            </div>
          </div>

          {activeTab === 'students' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {[
                { step: '1', title: 'Login with Name & Roll Number', desc: 'Pre-created student account. Your Roll Number acts as your password; confirm OTP on your registered email.' },
                { step: '2', title: 'Live 75% Target Badge', desc: 'Check your real-time attendance percentage in each of your 6 courses with standing alerts.' },
                { step: '3', title: 'Google Drive Link Submissions', desc: 'Paste your coursework Drive link directly; EMU timestamps the exact second of submission as proof.' },
                { step: '4', title: 'Peer-Verified Disputes', desc: 'Raise an absent dispute within 24h. Top 10 present peers vote to support before teacher approval.' },
              ].map((s, idx) => (
                <div key={s.step} className={`card-hover reveal-card delay-${(idx + 1) * 100}`} style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--eum-gold)', marginBottom: '8px' }}>{s.step}</div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--eum-maroon)', marginBottom: '6px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {[
                { step: '1', title: 'Mark Class in < 45 Seconds', desc: 'All 54 students are default-present. Tap absentees quickly and submit without manual roll calls.' },
                { step: '2', title: 'Review Drive Submissions', desc: 'Launch student Google Drive links in 1 click and record grades directly into the portal matrix.' },
                { step: '3', title: '1-Click Semester Registers', desc: 'Auto-generate Page A Date-Wise Register and Page B Submission Matrix ready for HOD PDF/CSV export.' },
                { step: '4', title: 'Peer-Filtered Dispute Queue', desc: 'Review only disputes that received at least 2/3 peer approval with full audit history attached.' },
              ].map((s, idx) => (
                <div key={s.step} className={`card-hover reveal-card delay-${(idx + 1) * 100}`} style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--eum-green)', marginBottom: '8px' }}>{s.step}</div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--eum-maroon)', marginBottom: '6px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. PILOT COURSES SHOWCASE */}
      <section id="courses" style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }} className="reveal">
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>
              Active Pilot Courses
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Configured specifically for the BS(CS) 7th Semester section at Emerson University Multan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {realCourses.map((c, i) => (
              <div
                key={c.code}
                className={`card-hover reveal-card delay-${((i % 3) + 1) * 100}`}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  padding: '20px 24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--eum-maroon)', backgroundColor: 'var(--status-danger-bg)', padding: '2px 8px', borderRadius: '6px' }}>
                      {c.code}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Room: {c.room}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {c.title}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Instructor: <strong>{c.teacher}</strong>
                  </div>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--eum-green)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Timetable Slots Active
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURES */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }} className="reveal">
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>Factual, Reliable Features</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Engineered to eliminate friction, prevent attendance disputes, and automate reports.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              { icon: <Clock size={22} />, title: 'Real-Time Attendance % & Badges', desc: 'Instant percentage calculation across all 6 courses with ≥75% Good Standing, 65-74% At Risk, and <65% Critical badges.' },
              { icon: <Calendar size={22} />, title: 'Timetable-Locked Lecture Dates', desc: 'Server-side date enforcement ensures attendance can only be marked on the actual scheduled lecture date.' },
              { icon: <Users size={22} />, title: 'Peer-Verified Dispute Engine', desc: 'Automated 24h dispute window selecting top 10 verified peers present that day; requires 2/3 peer support to escalate.' },
              { icon: <CheckCircle2 size={22} />, title: 'Google Drive Submission Proof', desc: 'Students paste their own Drive links. Server records exact timestamp to evaluate on-time vs late submissions.' },
              { icon: <FileSpreadsheet size={22} />, title: 'Auto-Compiled Page A Register', desc: 'Full date-wise attendance grid formatted for official Emerson University requirements with 1-click CSV & print.' },
              { icon: <ShieldCheck size={22} />, title: 'Append-Only Audit History', desc: 'Every record change maintains an immutable audit log recording author, timestamp, and justification reason.' },
            ].map((f, i) => (
              <div key={i} className={`card-hover reveal-card delay-${((i % 3) + 1) * 100}`} style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--eum-maroon)', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LIVE SEMESTER REPORTS PREVIEW */}
      <section id="demo" style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }} className="reveal">
            <span className="badge badge-success" style={{ marginBottom: '12px' }}>
              <FileSpreadsheet size={12} /> High-Priority Pitch Feature
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>
              1-Click Official Semester Reports
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Auto-compiled directly from daily lecture data. Ready for department submission and PDF printing without touching Excel.
            </p>

            <div style={{ display: 'inline-flex', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '6px', borderRadius: '24px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setDemoTab('register')}
                className={`btn ${demoTab === 'register' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '0.82rem' }}
              >
                Page A: Date-Wise Register
              </button>
              <button
                onClick={() => setDemoTab('matrix')}
                className={`btn ${demoTab === 'matrix' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '20px', padding: '6px 16px', fontSize: '0.82rem' }}
              >
                Page B: Coursework Submission Matrix
              </button>
            </div>
          </div>

          {/* Interactive Report Sample Box */}
          <div
            className="reveal-card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              overflowX: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--eum-maroon)' }}>
                  {demoTab === 'register' ? 'Course: Cloud Computing (COSE-4149) • Dr. Wasif Akbar' : 'Coursework Matrix: Cloud Computing • 3 Assignments & 3 Quizzes'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Faculty of Computing & Emerging Technologies • BS(CS) 7th Semester
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onGoToApp} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                  <Printer size={13} /> Print Full 54-Student Register
                </button>
                <button onClick={onGoToApp} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                  <Download size={13} /> Export CSV
                </button>
              </div>
            </div>

            {demoTab === 'register' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--eum-maroon)', color: '#FFFFFF', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>SR #</th>
                    <th style={{ padding: '10px 12px' }}>Roll Number</th>
                    <th style={{ padding: '10px 12px' }}>Student Name</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Aug 10</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Aug 11</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Aug 12</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Aug 17</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Aug 18</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Attendance %</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRegisterStudents.map((s) => (
                    <tr key={s.roll} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '600' }}>{s.sr}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: '700' }}>{s.roll}</td>
                      <td style={{ padding: '10px 12px' }}>{s.name}</td>
                      {s.marks.map((m, idx) => (
                        <td
                          key={idx}
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            fontWeight: '700',
                            color: m === 'P' ? 'var(--eum-green)' : 'var(--status-danger)',
                            backgroundColor: m === 'P' ? 'rgba(28, 92, 52, 0.05)' : 'rgba(179, 55, 44, 0.08)',
                          }}
                        >
                          {m}
                        </td>
                      ))}
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '800', color: s.pct >= 75 ? 'var(--eum-green)' : 'var(--status-danger)' }}>
                        {s.pct}%
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span className={`badge ${s.pct >= 75 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                          {s.pct >= 75 ? 'Good Standing' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--eum-green-dark)', color: '#FFFFFF', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>SR #</th>
                      <th style={{ padding: '10px 12px' }}>Roll Number</th>
                      <th style={{ padding: '10px 12px' }}>Student Name</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>Assignment 1</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>Assignment 2</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>Quiz 1</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>Quiz 2</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Total Score</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Google Drive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleSubmissionStudents.map((s) => (
                      <tr key={s.roll} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: '600' }}>{s.sr}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--eum-maroon)' }}>{s.roll}</td>
                        <td style={{ padding: '10px 12px', fontWeight: '600' }}>{s.name}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--eum-green)' }}>{s.a1.score}</span>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.a1.status}</div>
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--eum-green)' }}>{s.a2.score}</span>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.a2.status}</div>
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--eum-green)' }}>{s.q1.score}</span>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.q1.status}</div>
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--eum-green)' }}>{s.q2.score}</span>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.q2.status}</div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '800', color: 'var(--eum-maroon)' }}>
                          {s.total}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            onClick={onGoToApp}
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.72rem', color: 'var(--eum-green)', borderColor: 'var(--eum-green)' }}
                          >
                            <ExternalLink size={11} /> Drive Folder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. RESTRUCTURED FAQ (TWO COLUMN LAYOUT - ITEM 11) */}
      <section id="faq" style={{ padding: '80px 0', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Context & Category Breakdown */}
            <div className="reveal">
              <span className="badge badge-student" style={{ marginBottom: '12px' }}>
                Pilot Documentation
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--eum-maroon)', marginBottom: '14px', lineHeight: 1.2 }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                Everything you need to know about the Emerson University Multan student-led pilot, algorithmic peer verification, 75% attendance calculations, and official HOD registers.
              </p>

              {/* Categorization Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-dark)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--eum-maroon)', flexShrink: 0 }} />
                  <span><strong>Attendance Policy</strong>: Real-time 75% threshold tracking & leaves calculator.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-dark)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--eum-green)', flexShrink: 0 }} />
                  <span><strong>Disputes Engine</strong>: 24h timer with 3-peer cryptographic voting.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text-dark)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--eum-gold)', flexShrink: 0 }} />
                  <span><strong>Coursework & Labs</strong>: Google Drive submission links with on-time badges.</span>
                </div>
              </div>

              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>
                  Have an unlisted question?
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Our pilot lead is available to address questions from classmates and faculty.
                </p>
                <a
                  href="#contact"
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Contact Pilot Lead →
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Accordion */}
            <div className="reveal-card delay-200">
              <FaqAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* 8. RESTRUCTURED FEEDBACK & INQUIRY (TWO COLUMN LAYOUT - ITEM 11) */}
      <section id="contact" style={{ padding: '80px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Trust-Building & Direct Contact Information */}
            <div className="reveal">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--eum-gold-light)',
                  color: '#795548',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  marginBottom: '14px',
                }}
              >
                <Sparkles size={14} /> Open Pilot Channel
              </div>

              <h2 style={{ fontSize: '2.2rem', color: 'var(--eum-maroon)', marginBottom: '14px', lineHeight: 1.2 }}>
                Direct Pilot Channel & Feedback
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                Your feedback directly shapes our class portal. Whether you are suggesting a timetable adjustment, reporting an attendance glitch, or proposing a grading feature, your voice is heard.
              </p>

              {/* Official Academic Pilot Card */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 22px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GraduationCap size={18} style={{ color: 'var(--eum-maroon)' }} />
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>Academic Unit</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      BS(CS) Semester 7th • Shift Evening • Section A (Session 2023-27)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} style={{ color: 'var(--eum-green)' }} />
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>Department & Campus</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Department of Computer Science, Emerson University Multan
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserCheck size={18} style={{ color: 'var(--eum-gold)' }} />
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>Student Pilot Lead</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Syed Asad Ali Raza Shah (Shah G) • Roll: COSC231122114
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} style={{ color: 'var(--eum-maroon)' }} />
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>Lead Contact Email</div>
                    <div style={{ color: 'var(--eum-maroon)', fontSize: '0.8rem', fontWeight: '600' }}>
                      asadraza5670@gmail.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Feedback Submission Form */}
            <div
              className="reveal-card delay-200"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 30px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <MessageSquare size={22} style={{ color: 'var(--eum-maroon)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-maroon)', margin: 0 }}>
                  Share Your Thoughts or Bug Report
                </h3>
              </div>

              {contactSuccess ? (
                <div
                  style={{
                    backgroundColor: 'var(--status-success-bg)',
                    color: 'var(--status-success)',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                  }}
                >
                  <CheckCircle2 size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                  Thank you! Opening email client to dispatch feedback to Syed Asad Ali Raza Shah...
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Your Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. yourname@gmail.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-msg">Message / Suggestion</label>
                    <textarea
                      id="contact-msg"
                      className="form-input"
                      rows={5}
                      placeholder="Write your feedback, feature suggestion, or report an issue..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '0.96rem' }}
                  >
                    <Send size={16} /> Send Feedback to Pilot Lead
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom-Right Back-to-Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="back-to-top-btn"
          title="Back to Top"
          aria-label="Back to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* 9. MINIMALIST & PROFESSIONAL FOOTER */}
      <footer
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-color)',
          padding: '48px 0 28px',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '36px',
              marginBottom: '36px',
            }}
          >
            {/* Column 1: Identity & Cohort */}
            <div>
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                }}
                title="Return to top"
              >
                <EmuLogo size={32} />
                <span style={{ fontWeight: '800', color: 'var(--eum-maroon)', fontSize: '1.15rem' }}>
                  EMU Platform
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '12px' }}>
                Academic management & attendance transparency portal for the Department of Computer Science, Emerson University Multan.
              </p>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Pilot Cohort:</strong> BS(CS) 7th Semester Evening Section A (Session 2023-27)
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div>
              <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--eum-maroon)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
                Navigation
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <li>
                  <a href="#how-it-works" className="nav-link-underline">How It Works</a>
                </li>
                <li>
                  <a href="#courses" className="nav-link-underline">Courses & Timetable</a>
                </li>
                <li>
                  <a href="#demo" className="nav-link-underline">Official Semester Registers</a>
                </li>
                <li>
                  <a href="#faq" className="nav-link-underline">FAQ & Attendance Rules</a>
                </li>
                <li>
                  <a href="#contact" className="nav-link-underline">Feedback & Suggestions</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Academic Pilot Desk & Standard Disclaimer */}
            <div>
              <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--eum-gold)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
                Academic Pilot Desk
              </h4>

              <div style={{ fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Pilot Lead: </span>
                  <strong style={{ color: 'var(--text-dark)' }}>Syed Asad Ali Raza Shah (Shah G)</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Inquiries: </span>
                  <a href="mailto:asadraza5670@gmail.com" style={{ color: 'var(--eum-maroon)', textDecoration: 'underline', fontWeight: '600' }}>
                    asadraza5670@gmail.com
                  </a>
                </div>

                <div style={{ marginTop: '2px' }}>
                  <button
                    onClick={onGoToApp}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    Sign In with Roll No →
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0, fontStyle: 'italic' }}>
                Disclaimer: EMU Platform is a student-initiated academic management pilot developed for classroom evaluation and attendance transparency.
              </p>
            </div>
          </div>

          {/* Bottom Copyright and Meta Bar */}
          <div
            style={{
              paddingTop: '18px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <div>
              © 2026 EMU Platform • Emerson University Multan.
            </div>

            <div>
              Version <strong>2.4.0</strong> • Fall 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
