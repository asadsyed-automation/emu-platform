import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Layers,
  X,
  GraduationCap,
} from 'lucide-react';

export const AdminCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [creditHours, setCreditHours] = useState('3+0');
  const [semesterLabel, setSemesterLabel] = useState('7th Semester (Fall 2026)');
  const [section, setSection] = useState('7A');
  const [defaultRoom, setDefaultRoom] = useState('CTB1-02');
  const [isOnline, setIsOnline] = useState(false);
  const [color, setColor] = useState('#1E88E5');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [cRes, uRes] = await Promise.all([
        API.get('/courses'),
        API.get('/admin/users?role=teacher'),
      ]);
      setCourses(cRes.data.courses || []);
      setTeachers(uRes.data.users || []);
    } catch (err) {
      setError('Failed to load courses or faculty list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setTitle('');
    setCode('');
    setTeacherId('');
    setCreditHours('3+0');
    setSemesterLabel('7th Semester (Fall 2026)');
    setSection('7A');
    setDefaultRoom('CTB1-02');
    setIsOnline(false);
    setColor('#1E88E5');
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCode(course.code);
    setTeacherId(course.teacherId?._id || course.teacherId || '');
    setCreditHours(course.creditHours || '3+0');
    setSemesterLabel(course.semesterLabel || '7th Semester (Fall 2026)');
    setSection(course.section || '7A');
    setDefaultRoom(course.defaultRoom || 'CTB1-02');
    setIsOnline(course.isOnline || false);
    setColor(course.color || '#1E88E5');
    setShowModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage('');
    setError('');

    const payload = {
      title,
      code,
      teacherId: teacherId || null,
      creditHours,
      semesterLabel,
      section,
      defaultRoom,
      isOnline,
      color,
    };

    try {
      if (editingCourse) {
        await API.put(`/admin/courses/${editingCourse._id}`, payload);
        setMessage(`Course "${code}" updated successfully!`);
      } else {
        await API.post('/admin/courses', payload);
        setMessage(`New Course "${code}" created and auto-enrolled for all students!`);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseCode) => {
    if (!window.confirm(`Are you sure you want to delete course ${courseCode}? This will remove all timetable slots, enrollments, and lectures for this subject.`)) {
      return;
    }

    setActionLoading(true);
    try {
      await API.delete(`/admin/courses/${courseId}`);
      setMessage(`Course ${courseCode} deleted.`);
      fetchData();
    } catch (err) {
      setError('Error deleting course.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
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
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(28, 92, 52, 0.1)',
              color: 'var(--eum-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              Academic Courses Manager
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Configure subjects, assign faculty, adjust credit hours and room allocations.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={openAddModal}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={15} /> Add New Course
          </button>
          <button
            onClick={fetchData}
            className="btn btn-outline"
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div
          style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Courses Cards Grid */}
      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading academic courses...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {courses.map((c) => {
            const hasTeacher = c.teacherId && c.teacherId.name;
            const isTBA = !hasTeacher || c.teacherId?.name?.includes('ASSIGNED');

            return (
              <div
                key={c._id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '22px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="card-hover"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: c.color || 'var(--eum-maroon)',
                  }}
                />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        color: 'var(--eum-maroon)',
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {c.code}
                    </span>

                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                      Cr: {c.creditHours || '3+0'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '12px' }}>
                    {c.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={15} style={{ color: 'var(--eum-maroon)', flexShrink: 0 }} />
                      <span>
                        Instructor: <strong style={{ color: isTBA ? 'var(--status-danger)' : 'var(--text-dark)' }}>
                          {hasTeacher ? c.teacherId.name : 'TO BE ASSIGNED'}
                        </strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} style={{ color: 'var(--eum-green)', flexShrink: 0 }} />
                      <span>Default Room: <strong>{c.defaultRoom || 'CTB1-02'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GraduationCap size={15} style={{ color: 'var(--eum-gold)', flexShrink: 0 }} />
                      <span>{c.semesterLabel || '7th Semester'} • Section {c.section || '7A'}</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span className={`badge ${c.isOnline ? 'badge-info' : 'badge-success'}`}>
                    {c.isOnline ? 'Online Course' : 'Campus Class'}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(c)}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c._id, c.code)}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.76rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '12px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 'min(540px, 95vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              width: '100%',
              padding: '20px 18px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', margin: 0 }}>
                {editingCourse ? `Edit Course (${editingCourse.code})` : 'Create New Academic Course'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. COSC-4113"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Analysis of Algorithms"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Teacher Assignment Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Assigned Teacher / Faculty Member
                </label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                >
                  <option value="">-- TO BE ASSIGNED (TBA) --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 100px), 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Credit Hours
                  </label>
                  <input
                    type="text"
                    value={creditHours}
                    onChange={(e) => setCreditHours(e.target.value)}
                    placeholder="3+0 or 2+1"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Default Room
                  </label>
                  <input
                    type="text"
                    value={defaultRoom}
                    onChange={(e) => setDefaultRoom(e.target.value)}
                    placeholder="CTB1-02"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Section
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="7A"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Semester Label
                  </label>
                  <input
                    type="text"
                    value={semesterLabel}
                    onChange={(e) => setSemesterLabel(e.target.value)}
                    placeholder="7th Semester (Fall 2026)"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: '100%', height: '38px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem' }}>
                  <input
                    type="checkbox"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                  />
                  <span>This is an Online Distance Course (e.g. Translation of Holy Quran, Foreign Language)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.86rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.86rem' }}
                >
                  {actionLoading ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create & Enroll Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
