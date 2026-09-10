import React, { useState, useEffect } from 'react';
import API from '../services/api';
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
  Trash2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

export const AnnouncementsBoard = () => {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'owner';

  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [courseCode, setCourseCode] = useState('All Courses');
  const [tag, setTag] = useState('General');
  const [pinned, setPinned] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await API.get('/announcements');
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setCourses(res.data.courses || []);
      if (user?.role === 'teacher' && res.data.courses?.length > 0) {
        setCourseCode(res.data.courses[0].code);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    if (isTeacherOrAdmin) {
      fetchCourses();
    }
  }, [user]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await API.post('/announcements', {
        title: title.trim(),
        content: content.trim(),
        courseCode,
        tag,
        pinned,
      });

      setAnnouncements([res.data.announcement, ...announcements]);
      setTitle('');
      setContent('');
      setPinned(false);
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error publishing announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bulletin?')) return;
    try {
      await API.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err) {
      alert('Error deleting announcement.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 26px',
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
          gridTemplateColumns: isTeacherOrAdmin ? 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' : '1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Announcements Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '40px 24px',
                textAlign: 'center',
                border: '1px dashed var(--border-color)',
              }}
            >
              <Megaphone size={36} style={{ color: 'var(--text-light)', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '6px' }}>
                No Announcements Yet
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                {isTeacherOrAdmin
                  ? 'No notices have been published yet for BSCS 7th Semester. Use the broadcast form to send important updates to your students.'
                  : 'There are no active bulletins at the moment. Official notices from faculty will appear here.'}
              </p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann._id}
                className="card-hover animate-fade-in-up"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 22px',
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

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-light)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginLeft: 'auto',
                    }}
                  >
                    <Calendar size={12} /> {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.12rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  {ann.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px', whiteSpace: 'pre-wrap' }}>
                  {ann.content}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '10px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} style={{ color: 'var(--eum-maroon)' }} />
                    <span>Posted by <strong>{ann.author?.name || 'Faculty Member'}</strong> ({ann.author?.role?.toUpperCase() || 'FACULTY'})</span>
                  </div>

                  {(user?.role === 'owner' || user?._id === ann.author?._id) && (
                    <button
                      onClick={() => handleDeleteAnnouncement(ann._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--status-danger)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.74rem',
                      }}
                      title="Delete Bulletin"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
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

            {errorMessage && (
              <div
                style={{
                  backgroundColor: 'var(--status-danger-bg)',
                  color: 'var(--status-danger)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <AlertCircle size={14} /> {errorMessage}
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
                  {user?.role === 'owner' && (
                    <option value="All Courses">All Courses (Class-wide)</option>
                  )}
                  {courses.map((c) => (
                    <option key={c._id} value={c.code}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                  {user?.role !== 'owner' && courses.length === 0 && (
                    <option value="All Courses">All Courses</option>
                  )}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Bulletin Title</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                  placeholder="e.g. Lab Guidelines / Schedule Update"
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

              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '130px' }}>
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
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
              >
                <Send size={14} /> {submitting ? 'Broadcasting...' : 'Broadcast Announcement'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
