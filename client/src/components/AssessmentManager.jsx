import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { PlusCircle, FileText, CheckCircle2, AlertCircle, Calendar, Tag } from 'lucide-react';

export const AssessmentManager = ({ onCreated }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [type, setType] = useState('assignment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxMarks, setMaxMarks] = useState(10);
  const [examPeriod, setExamPeriod] = useState('before Mids');
  const [sequenceIndex, setSequenceIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        const list = res.data.courses || [];
        setCourses(list);
        if (list.length > 0) setSelectedCourse(list[0]._id);
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedCourse || !title || !deadline) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/assessments', {
        courseId: selectedCourse,
        type,
        title: title.trim(),
        description: description.trim(),
        deadline,
        maxMarks: Number(maxMarks),
        examPeriod,
        sequenceIndex: Number(sequenceIndex),
      });
      setSuccessMsg(res.data.message || 'Coursework entry created successfully!');
      setTitle('');
      setDescription('');
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assessment entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <PlusCircle style={{ color: 'var(--eum-maroon)' }} size={24} />
        <div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-maroon)' }}>Create Coursework Assignment / Quiz</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Tag sequence (1-3) against exam periods (before Mids / before Finals)
          </p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '14px' }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '14px' }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="form-input"
            required
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.code} — {c.title}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Entry Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Exam Period Tag</label>
          <select value={examPeriod} onChange={(e) => setExamPeriod(e.target.value)} className="form-input">
            <option value="before Mids">before Mids</option>
            <option value="before Finals">before Finals</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Sequence Index (1 to 3)</label>
          <select value={sequenceIndex} onChange={(e) => setSequenceIndex(Number(e.target.value))} className="form-input">
            <option value={1}>#1</option>
            <option value={2}>#2</option>
            <option value={3}>#3</option>
          </select>
        </div>

        <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Assignment 1: Distributed Hash Tables Implementation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Deadline (Date & Time)</label>
          <input
            type="datetime-local"
            className="form-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Max Marks</label>
          <input
            type="number"
            className="form-input"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            min={1}
            max={100}
            required
          />
        </div>

        <div style={{ gridColumn: '1 / -1', textAlign: 'right', marginTop: '10px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Publish Coursework Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};
