import React, { useState, useEffect } from 'react';
import { Hero3DElement } from '../components/Hero3DElement';
import { FaqAccordion } from '../components/FaqAccordion';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Users,
  Lock,
  Mail,
  Play,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const LandingPage = ({ onGoToApp }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      window.location.href = `mailto:asadraza5670@gmail.com?subject=EMU Platform Access Request&body=${encodeURIComponent(contactMessage)}`;
    }, 500);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-dark)', minHeight: '100vh' }}>
      {/* 1. HEADER / NAV */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          borderBottom: '1px solid var(--border-color)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Logo Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--eum-maroon)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1.25rem',
                letterSpacing: '1px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              EMU
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--eum-maroon)', lineHeight: 1.1 }}>
                EMU
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                Independent EUM Student Pilot
              </div>
            </div>
          </div>

          {/* Sparse Nav Links */}
          <nav className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#how-it-works" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500', fontSize: '0.92rem' }}>
              How it works
            </a>
            <a href="#features" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500', fontSize: '0.92rem' }}>
              Features
            </a>
            <a href="#why-emu" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500', fontSize: '0.92rem' }}>
              Why EMU
            </a>
            <a href="#faq" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500', fontSize: '0.92rem' }}>
              FAQ
            </a>
          </nav>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onGoToApp}
              className="btn btn-primary"
              style={{ padding: '9px 18px', fontSize: '0.9rem' }}
            >
              Log In to Portal
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO / HOOK */}
      <section style={{ padding: '80px 0 60px', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'var(--eum-gold-light)',
                color: '#795548',
                fontSize: '0.82rem',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              <ShieldCheck size={16} /> Active Pilot • BS(CS) Section at Emerson University Multan
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', color: 'var(--eum-maroon)', lineHeight: 1.15, marginBottom: '20px' }}>
              Stop Arguing About Attendance.
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '540px' }}>
              Every lecture, every percentage, every dispute — recorded, fair, and visible to you. Replaces manual Excel registers with transparent audit trails and 1-click semester reporting.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#contact" className="btn btn-primary" style={{ padding: '12px 26px', fontSize: '1rem' }}>
                Request Access <ArrowRight size={18} />
              </a>

              <a
                href="#demo"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--eum-green)',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                }}
              >
                <Play size={18} style={{ fill: 'var(--eum-green)' }} /> Watch how it works
              </a>
            </div>

            {/* Dashboard Screenshot Placeholder Box */}
            <div
              style={{
                marginTop: '40px',
                padding: '16px 20px',
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <FileSpreadsheet size={24} style={{ color: 'var(--eum-maroon)' }} />
              <div>
                <strong>[Live Product Preview Box]</strong>
                <div>Date-Wise Attendance Register & 54-Student Submission Matrix active in pilot portal.</div>
              </div>
            </div>
          </div>

          {/* 3D Interactive Hero Canvas */}
          <div>
            <Hero3DElement />
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM (3 Pain-Point Cards) */}
      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>
              The Attendance Bottleneck in University Classes
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Manual Excel workflows create friction for both teachers and students.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--status-danger)' }}>
              <AlertTriangle size={28} style={{ color: 'var(--status-danger)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Attendance disputes discovered too late</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Students only find out their attendance is below 75% right before exams when it is too late to verify or dispute.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--status-warning)' }}>
              <Clock size={28} style={{ color: 'var(--status-warning)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Teachers compiling Excel sheets manually</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Hours spent transferring paper register ticks into Excel and formatting semester reports before exams.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--eum-maroon)' }}>
              <Lock size={28} style={{ color: 'var(--eum-maroon)', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Students in the dark about their numbers</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                No central place to check current attendance %, assignment submission timestamps, or standing status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS / METHOD TO USE */}
      <section id="how-it-works" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>How EMU Works</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Designed for speed and clarity for both students and instructors.
            </p>

            {/* Audience Toggle */}
            <div style={{ display: 'inline-flex', gap: '8px', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '30px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
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
                { step: '1', title: 'Login with Roll Number', desc: 'Pre-created account. Verify email OTP on first login.' },
                { step: '2', title: 'View Attendance & Standing', desc: 'Check live attendance %, 75% target badge, and lecture log.' },
                { step: '3', title: 'Submit Google Drive Links', desc: 'Paste Drive URL for assignments; get on-time timestamp proof.' },
                { step: '4', title: 'Raise Fair Disputes', desc: '24h window + top 10 peer voting validation before teacher signoff.' },
              ].map((s) => (
                <div key={s.step} style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--eum-gold)', marginBottom: '8px' }}>{s.step}</div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--eum-maroon)', marginBottom: '6px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {[
                { step: '1', title: 'Mark Class in < 45s', desc: 'Default everyone present, tap absentees, submit in seconds.' },
                { step: '2', title: 'Track Submissions Live', desc: 'Launch Google Drive links in 1 click and enter grades inline.' },
                { step: '3', title: 'Generate Reports Instantly', desc: '1-click Date-Wise Attendance Register (PDF/CSV) ready for HOD.' },
                { step: '4', title: 'Resolve Disputes Fairly', desc: 'Review peer-supported disputes with full audit trail documentation.' },
              ].map((s) => (
                <div key={s.step} style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--eum-green)', marginBottom: '8px' }}>{s.step}</div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--eum-maroon)', marginBottom: '6px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. FEATURES (3-Column Desktop Grid) */}
      <section id="features" style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>Factual, Reliable Features</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Built specifically to eliminate friction, prevent fraud, and save instructor time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {[
              { icon: <Clock size={22} />, title: 'Real-Time Attendance Tracking', desc: 'Instant student attendance % calculations with 75% target threshold badges.' },
              { icon: <Calendar size={22} />, title: 'Timetable-Locked Lecture Dates', desc: 'Server-side date enforcement prevents marking attendance on wrong dates.' },
              { icon: <Users size={22} />, title: 'Peer-Verified Dispute Engine', desc: 'Top 10 present peers vote to validate requests before teacher escalation.' },
              { icon: <CheckCircle2 size={22} />, title: 'Google Drive Submission Proof', desc: 'External Drive link storage with automated on-time vs late timestamping.' },
              { icon: <FileSpreadsheet size={22} />, title: 'Auto-Generated Semester Register', desc: 'Page A Date-Wise Register ready for 1-click PDF printing or CSV export.' },
              { icon: <ShieldCheck size={22} />, title: 'Append-Only Audit Logging', desc: 'Every record change maintains an unalterable history of author, time, and reason.' },
            ].map((f, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-main)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--eum-maroon)', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY EMU (Before vs After) */}
      <section id="why-emu" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>Why EMU — Before & After</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              A direct comparison between traditional class management and the EMU workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', borderTop: '4px solid var(--status-danger)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--status-danger)', marginBottom: '16px' }}>The Old Way</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '10px' }}>❌ Paper registers transferred manually to Excel</li>
                <li style={{ marginBottom: '10px' }}>❌ Attendance disputes settled by memory weeks later</li>
                <li style={{ marginBottom: '10px' }}>❌ WhatsApp groups cluttered with submission links</li>
                <li style={{ marginBottom: '10px' }}>❌ Students blind to their attendance % until exam time</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', borderTop: '4px solid var(--eum-green)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-green)', marginBottom: '16px' }}>The EMU Way</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '10px' }}>✅ Fast 45-second marking with 1-click PDF/CSV reports</li>
                <li style={{ marginBottom: '10px' }}>✅ 24h dispute window + 2/3 peer voting validation</li>
                <li style={{ marginBottom: '10px' }}>✅ Drive links timestamped as on-time or late</li>
                <li style={{ marginBottom: '10px' }}>✅ Live 75% target threshold visible to every student</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEMO */}
      <section id="demo" style={{ padding: '60px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)', marginBottom: '12px' }}>Product Demonstration</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            See how the 45-second attendance marking sheet and date-wise register function in practice.
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              padding: '60px 20px',
              border: '2px dashed var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <Play size={48} style={{ color: 'var(--eum-maroon)' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>Demo Video Coming Soon</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '420px' }}>
              Real screen-recording walkthrough of the BS(CS) section pilot will be embedded here as pilot feedback is recorded.
            </p>
          </div>
        </div>
      </section>

      {/* 8. ONBOARDING */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <UserCheck size={36} style={{ color: 'var(--eum-green)', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '1.8rem', color: 'var(--eum-maroon)', marginBottom: '12px' }}>Zero-Friction Onboarding</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              There is no sign-up form to fill out. All 54 student accounts for the pilot class section are pre-created from the official roll list. Simply log in with your roll number (e.g. <code>COSC231122114</code>), verify your email once via OTP, and you're in.
            </p>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS (Clearly Marked Placeholders) */}
      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--eum-maroon)' }}>Pilot Feedback & Quotes</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Real feedback collected during the active BS(CS) section pilot.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              "[Placeholder — replace with real teacher quote once mid-semester pilot feedback is collected]"
              <div style={{ fontStyle: 'normal', fontWeight: '700', color: 'var(--eum-maroon)', marginTop: '12px' }}>
                — Instructor Pilot Placeholder
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              "[Placeholder — replace with real student quote regarding 2/3 peer dispute voting experience]"
              <div style={{ fontStyle: 'normal', fontWeight: '700', color: 'var(--eum-green)', marginTop: '12px' }}>
                — Student Pilot Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--eum-maroon)' }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Everything you need to know about the EMU platform pilot.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* CONTACT / REQUEST ACCESS FORM */}
      <section id="contact" style={{ padding: '60px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '560px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Mail size={32} style={{ color: 'var(--eum-maroon)', marginBottom: '8px' }} />
            <h2 style={{ fontSize: '1.8rem', color: 'var(--eum-maroon)' }}>Request Access or Contact Us</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Interested in piloting EMU for your course section? Send us a message.
            </p>
          </div>

          {contactSuccess ? (
            <div style={{ backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: '600' }}>
              Opening mail client to send request to Asad Syed (Shah G)...
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Your Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. instructor@emerson.edu.pk"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-msg">Message / Pilot Request Details</label>
                <textarea
                  id="contact-msg"
                  className="form-input"
                  rows={4}
                  placeholder="Tell us your course name and section size..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                Send Request via Email
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', padding: '40px 0 30px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--eum-maroon)', color: '#FFFFFF', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              EMU
            </div>
            <span style={{ fontWeight: '800', color: 'var(--eum-maroon)', fontSize: '1.1rem' }}>EMU Platform</span>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Attendance You Can Trust
          </div>

          {/* Prominent Ethical & Administrative Disclaimer */}
          <div style={{ maxWidth: '680px', margin: '0 auto', padding: '12px 16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            <strong>Disclaimer</strong>: EMU is an independent student-led initiative currently piloting with one class section and is not an official platform of Emerson University Multan.
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-light)' }}>
            Built for BS(CS) Section • Multan, Pakistan
          </div>
        </div>
      </footer>
    </div>
  );
};
