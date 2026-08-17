import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Calendar,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  X,
} from 'lucide-react';

export const AcademicScheduleManager = () => {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('mid-term');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [skipLectures, setSkipLectures] = useState(true);
  const [datesheetSlots, setDatesheetSlots] = useState([]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [eventsRes, coursesRes] = await Promise.all([
        API.get('/academic-events'),
        API.get('/courses'),
      ]);
      setEvents(eventsRes.data.events || []);
      setCourses(coursesRes.data.courses || []);
    } catch (err) {
      console.error('Error fetching academic events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddDatesheetRow = () => {
    if (courses.length === 0) return;
    setDatesheetSlots((prev) => [
      ...prev,
      {
        courseId: courses[0]._id,
        date: startDate || new Date().toISOString().split('T')[0],
        timeSlot: '02:00 PM - 04:30 PM',
        room: 'BOT-B1-F-102',
      },
    ]);
  };

  const handleRemoveDatesheetRow = (index) => {
    setDatesheetSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, field, value) => {
    setDatesheetSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!title.trim() || !startDate || !endDate) {
      setError('Please fill in title, start date, and end date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        type,
        startDate,
        endDate,
        description: description.trim(),
        skipLectures,
        examDatesheet: (type === 'mid-term' || type === 'final-term') ? datesheetSlots : [],
      };

      const res = await API.post('/academic-events', payload);
      setSuccessMsg(res.data.message || 'Event created successfully!');
      setShowModal(false);
      // Reset form
      setTitle('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setDatesheetSlots([]);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to remove this academic event?')) return;
    try {
      await API.delete(`/academic-events/${id}`);
      setEvents((prev) => prev.filter((ev) => ev._id !== id));
      setSuccessMsg('Academic event deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting event.');
    }
  };

  const formatDate = (dStr) => {
    if (!dStr) return 'N/A';
    const d = new Date(dStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeBadge = (eventType) => {
    switch (eventType) {
      case 'vacation':
      case 'holiday':
        return <span className="badge badge-warning">🏖️ Vacation / Holiday</span>;
      case 'mid-term':
        return <span className="badge badge-teacher">📝 Mid-Term Exam</span>;
      case 'final-term':
        return <span className="badge badge-owner">🎓 Final-Term Exam</span>;
      default:
        return <span className="badge badge-student">✦ {eventType}</span>;
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '26px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '30px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '22px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar style={{ color: 'var(--eum-maroon)' }} size={24} />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', margin: 0 }}>
              Academic Calendar & Schedule Governance
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Manage official gazetted holidays, vacations, mid-term & final-term datesheets with auto-adjusting lectures
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.86rem' }}
        >
          <Plus size={16} /> Schedule Vacation / Datesheet
        </button>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--eum-green)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'rgba(122, 31, 31, 0.1)',
            color: 'var(--eum-maroon)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading academic schedule...
        </div>
      ) : events.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No vacations or examination datesheets scheduled yet. Click "+ Schedule Vacation / Datesheet" to publish.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {events.map((ev) => (
            <div
              key={ev._id}
              style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {getTypeBadge(ev.type)}
                  {ev.isOngoing && (
                    <span className="badge badge-success">Active Now</span>
                  )}
                  {!ev.isPast && !ev.isOngoing && (
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--eum-maroon)' }}>
                      ⏳ {ev.daysLeft} Days Left
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)', margin: '4px 0' }}>
                  {ev.title}
                </h4>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span>📅 <strong>Period:</strong> {formatDate(ev.startDate)} — {formatDate(ev.endDate)}</span>
                  {ev.skipLectures && <span>⚡ <strong>Lectures:</strong> Auto-Skipped on Calendar</span>}
                </div>

                {ev.description && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.45 }}>
                    {ev.description}
                  </p>
                )}

                {/* Exam Datesheet Table Preview */}
                {ev.examDatesheet && ev.examDatesheet.length > 0 && (
                  <div style={{ marginTop: '12px', overflowX: 'auto' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--eum-maroon)', marginBottom: '4px' }}>
                      📋 Official Exam Datesheet ({ev.examDatesheet.length} Papers):
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', backgroundColor: 'var(--bg-surface)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(122, 31, 31, 0.05)', textAlign: 'left' }}>
                          <th style={{ padding: '6px 10px' }}>Date</th>
                          <th style={{ padding: '6px 10px' }}>Course</th>
                          <th style={{ padding: '6px 10px' }}>Time Slot</th>
                          <th style={{ padding: '6px 10px' }}>Room</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ev.examDatesheet.map((slot, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px 10px', fontWeight: '600' }}>{formatDate(slot.date)}</td>
                            <td style={{ padding: '6px 10px' }}>{slot.courseId?.code} — {slot.courseId?.title}</td>
                            <td style={{ padding: '6px 10px' }}>{slot.timeSlot}</td>
                            <td style={{ padding: '6px 10px' }}>{slot.room}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDeleteEvent(ev._id)}
                className="btn btn-outline"
                style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--status-danger)' }}
                title="Delete Event"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div
            className="modal-content animate-fade-in"
            style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', margin: 0 }}>
                Publish Academic Event / Datesheet
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Examination Fall 2026 or Winter Vacations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Event Category *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="form-input"
                  >
                    <option value="mid-term">📝 Mid-Term Examinations</option>
                    <option value="final-term">🎓 Final-Term Examinations</option>
                    <option value="vacation">🏖️ Vacation / Semester Break</option>
                    <option value="holiday">🏛️ Gazetted Public Holiday</option>
                    <option value="prep-leave">📖 Preparatory Leaves</option>
                    <option value="sports-week">🏆 Sports / Gala Week</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Auto-Adjust Calendar</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={skipLectures}
                      onChange={(e) => setSkipLectures(e.target.checked)}
                    />
                    <span>Skip Routine Lectures on Dates</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Official Memo / Description</label>
                <textarea
                  rows={2}
                  placeholder="Official notification details, room protocols, or holiday greetings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Datesheet Builder (For Mid / Final Exams) */}
              {(type === 'mid-term' || type === 'final-term') && (
                <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--eum-maroon)' }}>
                      📋 Exam Paper Datesheet Builder
                    </span>
                    <button
                      type="button"
                      onClick={handleAddDatesheetRow}
                      className="btn btn-outline"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      + Add Course Paper
                    </button>
                  </div>

                  {datesheetSlots.length === 0 ? (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      No individual papers added. Click "+ Add Course Paper" to map exam dates to courses.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {datesheetSlots.map((slot, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.2fr auto', gap: '6px', alignItems: 'center' }}>
                          <select
                            value={slot.courseId}
                            onChange={(e) => handleSlotChange(idx, 'courseId', e.target.value)}
                            className="form-input"
                            style={{ padding: '4px 6px', fontSize: '0.76rem' }}
                          >
                            {courses.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.code}
                              </option>
                            ))}
                          </select>

                          <input
                            type="date"
                            value={slot.date}
                            onChange={(e) => handleSlotChange(idx, 'date', e.target.value)}
                            className="form-input"
                            style={{ padding: '4px 6px', fontSize: '0.76rem' }}
                          />

                          <input
                            type="text"
                            placeholder="Time (02:00 PM)"
                            value={slot.timeSlot}
                            onChange={(e) => handleSlotChange(idx, 'timeSlot', e.target.value)}
                            className="form-input"
                            style={{ padding: '4px 6px', fontSize: '0.76rem' }}
                          />

                          <input
                            type="text"
                            placeholder="Room"
                            value={slot.room}
                            onChange={(e) => handleSlotChange(idx, 'room', e.target.value)}
                            className="form-input"
                            style={{ padding: '4px 6px', fontSize: '0.76rem' }}
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveDatesheetRow(idx)}
                            style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px' }}
                >
                  {submitting ? 'Publishing...' : 'Publish to Semester Portal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
