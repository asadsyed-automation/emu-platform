import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  PlusCircle,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  X,
  RotateCcw,
} from 'lucide-react';

export const AdminTimetableManager = () => {
  const [timetable, setTimetable] = useState({});
  const [allSlots, setAllSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Form State
  const [formDay, setFormDay] = useState('Monday');
  const [formCourseId, setFormCourseId] = useState('');
  const [formStartTime, setFormStartTime] = useState('01:30 PM');
  const [formEndTime, setFormEndTime] = useState('02:20 PM');
  const [formRoom, setFormRoom] = useState('CTB1-02');
  const [formSlotType, setFormSlotType] = useState('theory');
  const [formCustomTitle, setFormCustomTitle] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const standardTimeOptions = [
    { start: '01:30 PM', end: '02:20 PM' },
    { start: '02:20 PM', end: '03:10 PM' },
    { start: '03:10 PM', end: '04:00 PM' },
    { start: '04:00 PM', end: '04:50 PM' },
    { start: '04:50 PM', end: '05:40 PM' },
    { start: '05:40 PM', end: '06:30 PM' },
    { start: '06:30 PM', end: '07:20 PM' },
  ];

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tRes, cRes] = await Promise.all([
        API.get('/timetable'),
        API.get('/courses'),
      ]);
      setTimetable(tRes.data.timetable || {});
      setAllSlots(tRes.data.allSlots || []);
      setCourses(cRes.data.courses || []);
    } catch (err) {
      setError('Failed to load timetable and courses list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openAddModal = (defaultDay = 'Monday') => {
    setEditingSlot(null);
    setFormDay(defaultDay);
    setFormCourseId(courses.length > 0 ? courses[0]._id : '');
    setFormStartTime('01:30 PM');
    setFormEndTime('02:20 PM');
    setFormRoom('CTB1-02');
    setFormSlotType('theory');
    setFormCustomTitle('');
    setShowModal(true);
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setFormDay(slot.dayOfWeek);
    setFormCourseId(slot.courseId?._id || slot.courseId || '');
    setFormStartTime(slot.startTime);
    setFormEndTime(slot.endTime);
    setFormRoom(slot.room);
    setFormSlotType(slot.slotType || (slot.isLab ? 'lab' : slot.isOnline ? 'online' : slot.isTBA ? 'tba' : 'theory'));
    setFormCustomTitle(slot.customTitle || '');
    setShowModal(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage('');
    setError('');

    const payload = {
      dayOfWeek: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      room: formRoom,
      courseId: formSlotType === 'break' ? null : formCourseId || null,
      isLab: formSlotType === 'lab',
      isOnline: formSlotType === 'online',
      isTBA: formSlotType === 'tba',
      slotType: formSlotType,
      customTitle: formSlotType === 'break' ? (formCustomTitle || 'Jummah Break') : formCustomTitle,
    };

    try {
      if (editingSlot) {
        await API.put(`/admin/timetable-slots/${editingSlot._id}`, payload);
        setMessage('Timetable slot updated successfully!');
      } else {
        await API.post('/admin/timetable-slots', payload);
        setMessage('New timetable slot added successfully!');
      }
      setShowModal(false);
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving timetable slot.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this timetable slot?')) return;

    setActionLoading(true);
    try {
      await API.delete(`/admin/timetable-slots/${slotId}`);
      setMessage('Timetable slot deleted.');
      fetchInitialData();
    } catch (err) {
      setError('Error deleting timetable slot.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDefault = async () => {
    if (!window.confirm('This will reset the entire timetable to the Official 7th Semester flyer schedule. Proceed?')) return;

    setActionLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await API.post('/admin/timetable-slots/reset-default');
      setMessage(res.data.message || 'Timetable reset to official 7th semester schedule.');
      fetchInitialData();
    } catch (err) {
      setError('Failed to reset default timetable.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSyncLectures = async () => {
    setActionLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await API.post('/admin/sync-lectures');
      setMessage(res.data.message || 'Semester lectures generated and synchronized!');
    } catch (err) {
      setError('Failed to sync semester lectures.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header Panel */}
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
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              Timetable Schedule Manager (Admin Controls)
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Add, edit, rearrange, or delete timetable slots for BSCS 7th Semester (Section 7A).
            </p>
          </div>
        </div>

        {/* Global Admin Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => openAddModal()}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={15} /> Add New Slot
          </button>

          <button
            onClick={handleSyncLectures}
            disabled={actionLoading}
            className="btn btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.86rem' }}
            title="Auto-generates 16-week dated lecture entries matching current slots"
          >
            <RefreshCw size={14} className={actionLoading ? 'spin' : ''} /> Sync 16-Week Lectures
          </button>

          <button
            onClick={handleResetDefault}
            disabled={actionLoading}
            className="btn btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.86rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
            title="Restore exact official 7th semester schedule from university flyer"
          >
            <RotateCcw size={14} /> Reset Official 7th Sem Grid
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

      {/* Timetable Slots by Day */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {days.map((day) => {
          const daySlots = timetable[day] || [];

          return (
            <div
              key={day}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-maroon)', margin: 0 }}>
                    {day}
                  </h3>
                  <span className="badge badge-student">
                    {daySlots.length} Classes
                  </span>
                </div>

                <button
                  onClick={() => openAddModal(day)}
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  <PlusCircle size={13} /> Add {day} Slot
                </button>
              </div>

              {daySlots.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem', fontStyle: 'italic', padding: '12px 0' }}>
                  No timetable slots configured for {day}.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {daySlots.map((slot) => {
                    const isBreak = slot.slotType === 'break';
                    const isLab = slot.isLab;
                    const isOnline = slot.isOnline;
                    const isTBA = slot.isTBA || slot.courseId?.teacherId?.name?.includes('ASSIGNED');

                    let borderTop = '3px solid #0284C7';
                    if (isBreak) borderTop = '3px solid #D97706';
                    else if (isLab) borderTop = '3px solid #EA580C';
                    else if (isOnline) borderTop = '3px solid #8B5CF6';
                    else if (isTBA) borderTop = '3px solid #E11D48';

                    return (
                      <div
                        key={slot._id}
                        style={{
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '14px 16px',
                          border: '1px solid var(--border-color)',
                          borderTop,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--eum-maroon)' }}>
                              {slot.courseId?.code || (isBreak ? 'JUMMAH BREAK' : 'CLASS')}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                              <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                              {slot.startTime} – {slot.endTime}
                            </span>
                          </div>

                          <h4 style={{ fontSize: '0.96rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                            {slot.courseId?.title || slot.customTitle || 'Lecture'} {isLab ? '(Lab)' : ''}
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <User size={13} style={{ color: 'var(--eum-maroon)' }} />
                              <span>{slot.courseId?.teacherId?.name || (isTBA ? 'TO BE ASSIGNED' : '—')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={13} style={{ color: 'var(--eum-green)' }} />
                              <span><strong>{slot.room}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '12px' }}>
                          <button
                            onClick={() => openEditModal(slot)}
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot._id)}
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.76rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Slot */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '26px 28px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', margin: 0 }}>
                {editingSlot ? 'Edit Timetable Slot' : 'Add New Timetable Slot'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Day of Week */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Day of Week
                </label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Slot Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Slot Type & Format
                </label>
                <select
                  value={formSlotType}
                  onChange={(e) => setFormSlotType(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                >
                  <option value="theory">Theory Class (Blue)</option>
                  <option value="lab">Lab Session (Orange)</option>
                  <option value="online">Online Distance Class (Purple)</option>
                  <option value="tba">Instructor TBA (Pink/Red)</option>
                  <option value="break">Break / Free Slot (Jummah Break)</option>
                </select>
              </div>

              {/* Course Selector (if not Break) */}
              {formSlotType !== 'break' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Course Subject
                  </label>
                  <select
                    value={formCourseId}
                    onChange={(e) => {
                      setFormCourseId(e.target.value);
                      const sel = courses.find((c) => c._id === e.target.value);
                      if (sel?.defaultRoom) setFormRoom(sel.defaultRoom.split('/')[0].trim());
                    }}
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  >
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.code} — {c.title} ({c.teacherId?.name || 'TBA'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Break Title / Note
                  </label>
                  <input
                    type="text"
                    value={formCustomTitle}
                    onChange={(e) => setFormCustomTitle(e.target.value)}
                    placeholder="e.g. Jummah Break"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>
              )}

              {/* Time Window (Quick Preset vs Custom) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    placeholder="01:30 PM"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                    End Time
                  </label>
                  <input
                    type="text"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    placeholder="02:20 PM"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Room Location */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Room / Location
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="CTB1-02 or CLab-06 or Online"
                    className="form-input"
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.88rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormRoom('CTB1-02')}
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                  >
                    CTB1-02
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormRoom('CLab-06')}
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                  >
                    CLab-06
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormRoom('Online')}
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                  >
                    Online
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {actionLoading ? 'Saving...' : editingSlot ? 'Update Slot' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
