import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Send,
  Calendar,
  User,
  Tag,
  CheckCircle,
  Pin,
  Sparkles,
  Info,
} from 'lucide-react';

export const AnnouncementsBoard = () => {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'owner';

  // Seeded class announcements with persistent state
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Midterm Evaluation & Date-Wise Attendance Register Audit',
      content:
        'All students must maintain at least 75% attendance across all 6 courses before the upcoming Midterm examinations. Students below 75% will be flagged for review.',
      author: 'Pilot Administrator',
      role: 'owner',
      courseCode: 'All Courses',
      date: '2026-08-16',
      pinned: true,
      tag: 'Academic Notice',
    },
    {
      id: 'ann-2',
      title: 'Cloud Computing Lab 03 Assignment Link Submission',
      content:
        'Please submit your GitHub repository and Google Drive execution video link for Lab 03 (Kubernetes Cluster deployment) before Friday 11:59 PM.',
      author: 'Dr. Wasif Akbar',
      role: 'teacher',
      courseCode: 'COSE-4149',
      date: '2026-08-15',
      pinned: false,
      tag: 'Assignment',
    },
    {
      id: 'ann-3',
      title: 'HCI & Computer Graphics Usability Testing Report Guidelines',
      content:
        'Guidelines for the heuristics evaluation report have been updated. Teams of 2 must conduct evaluation tests on 3 distinct peer prototypes.',
      author: 'Ms. Samia Nasir',
      role: 'teacher',
      courseCode: 'COSE-3133',
      date: '2026-08-14',
      pinned: false,
      tag: 'Project',
    },
  ]);

  // Teacher / Admin Broadcast Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [courseCode, setCourseCode] = useState('All Courses');
  const [tag, setTag] = useState('General');
  const [pinned, setPinned] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: user?.name || 'Faculty Member',
      role: user?.role || 'teacher',
      courseCode,
      date: new Date().toISOString().split('T')[0],
      pinned,
      tag,
    };

    setAnnouncements([newAnn, ...announcements]);
    setTitle('');
    setContent('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(201, 162, 39, 0.12)',
              color: 'var(--eum-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              Academic Announcements & Bulletins
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Official class broadcast channel • BS(CS) 7th Semester (Evening Section A)
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
          }}
        >
          {announcements.length} Active Bulletins
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTeacherOrAdmin ? '1fr 340px' : '1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Announcements Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="card-hover animate-fade-in-up"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '22px 24px',
                border: ann.pinned ? '2px solid var(--eum-gold)' : '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
              }}
            >
              {ann.pinned && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#8C6800',
                    backgroundColor: 'rgba(201, 162, 39, 0.14)',
                    padding: '3px 8px',
                    borderRadius: '12px',
                  }}
                >
                  <Pin size={11} /> Pinned
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    backgroundColor: 'var(--eum-maroon)',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {ann.courseCode}
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {ann.tag}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                  <Calendar size={12} /> {ann.date}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {ann.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                {ann.content}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '10px',
                }}
              >
                <User size={13} style={{ color: 'var(--eum-maroon)' }} />
                <span>Posted by <strong>{ann.author}</strong> ({ann.role.toUpperCase()})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Teacher / Admin Broadcast Publisher */}
        {isTeacherOrAdmin && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '22px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '80px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Send size={18} style={{ color: 'var(--eum-maroon)' }} />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--eum-maroon)' }}>Post New Announcement</h3>
            </div>

            {broadcastSuccess && (
              <div
                style={{
                  backgroundColor: 'var(--status-success-bg)',
                  color: 'var(--status-success)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={14} /> Bulletin broadcasted to class!
              </div>
            )}

            <form onSubmit={handlePostAnnouncement}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Target Course</label>
                <select
                  className="form-input"
                  style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                >
                  <option value="All Courses">All Courses (Class-wide)</option>
                  <option value="COSE-4149">COSE-4149 — Cloud Computing</option>
                  <option value="COSE-3133">COSE-3133 — HCI & Computer Graphics</option>
                  <option value="MATH-3181">MATH-3181 — Multivariable Calculus</option>
                  <option value="COSE-3136">COSE-3136 — Parallel & Distributed Computing</option>
                  <option value="BUAD-2123">BUAD-2123 — Principles of Marketing</option>
                  <option value="ENGL-3184">ENGL-3184 — Technical Writing</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Bulletin Title</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                  placeholder="e.g. Lab 04 Submission Extended"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Bulletin Content</label>
                <textarea
                  className="form-input"
                  rows={4}
                  style={{ fontSize: '0.88rem', padding: '8px 12px', resize: 'vertical' }}
                  placeholder="Write announcement details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Tag</label>
                  <select
                    className="form-input"
                    style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Exam">Exam / Midterm</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '16px' }}>
                  <input
                    type="checkbox"
                    id="pin-ann"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="pin-ann" style={{ fontSize: '0.82rem', cursor: 'pointer', fontWeight: '500' }}>
                    Pin to top
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
              >
                <Send size={14} /> Broadcast Announcement
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
