import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EmuLogo } from './EmuLogo';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  BookOpen,
  FlaskConical,
  Laptop,
  AlertCircle,
  Coffee,
  Layers,
  LayoutGrid,
  ListFilter,
  X,
  ChevronRight,
  Info,
  UserCheck,
} from 'lucide-react';

export const TimetableGrid = ({ onOpenAdminManager }) => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 'cards' : 'matrix'));
  const [selectedSlotModal, setSelectedSlotModal] = useState(null);
  const [activeDayFilter, setActiveDayFilter] = useState('All');
  const [teacherScope, setTeacherScope] = useState(user?.role === 'teacher' ? 'my_courses' : 'all');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Official Standard Time Slots
  const standardPeriods = [
    { id: 'p1', start: '01:30 PM', end: '02:20 PM', label: '01:30 – 02:20 PM' },
    { id: 'p2', start: '02:20 PM', end: '03:10 PM', label: '02:20 – 03:10 PM' },
    { id: 'p3', start: '03:10 PM', end: '04:00 PM', label: '03:10 – 04:00 PM' },
    { id: 'p4', start: '04:00 PM', end: '04:50 PM', label: '04:00 – 04:50 PM' },
    { id: 'p5', start: '04:50 PM', end: '05:40 PM', label: '04:50 – 05:40 PM' },
    { id: 'p6', start: '05:40 PM', end: '06:30 PM', label: '05:40 – 06:30 PM' },
    { id: 'p7', start: '06:30 PM', end: '07:20 PM', label: '06:30 – 07:20 PM' },
  ];

  // Official Courses Summary Data
  const coursesSummary = [
    { code: 'COSC-4113', title: 'Analysis of Algorithms', instructor: 'Qasim Niaz', crHrs: '3+0', rooms: 'CTB1-02', type: 'theory' },
    { code: 'COSE-4135', title: 'Compiler Construction', instructor: 'Rozina Riaz', crHrs: '2+1', rooms: 'CTB1-02 / CLab-06', type: 'lab' },
    { code: 'COSE-4150', title: 'Computer Graphics', instructor: 'TO BE ASSIGNED', crHrs: '2+1', rooms: 'CTB1-02 / CLab-06', type: 'tba' },
    { code: 'IT-404', title: 'Cyber Security', instructor: 'Samra Mushtaq', crHrs: '3+0', rooms: 'CTB1-02 / CLab-02', type: 'lab' },
    { code: 'FLNG-xxxx', title: 'Foreign Language', instructor: 'TO BE ASSIGNED', crHrs: '3+0', rooms: 'Online', type: 'online' },
    { code: 'ARAB-3101', title: 'Translation of the Holy Quran-V', instructor: 'TO BE ASSIGNED', crHrs: '3+0', rooms: 'Online', type: 'online' },
  ];

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await API.get('/timetable');
      setTimetable(res.data.timetable || {});
    } catch (err) {
      setError('Failed to load weekly timetable schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const getTodayDayName = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[new Date().getDay()];
  };

  const currentDay = getTodayDayName();
  const effectiveToday = days.includes(currentDay) ? currentDay : 'Monday';

  // Helper to filter slots based on teacher scope
  const isSlotVisibleForUser = (slot) => {
    if (!slot) return false;
    if (user?.role !== 'teacher' || teacherScope === 'all' || user?.rollNumber === 'DEMO-TCH-01') return true;
    const tId = slot.courseId?.teacherId?._id?.toString() || slot.courseId?.teacherId?.toString();
    const tRoll = slot.courseId?.teacherId?.rollNumber;
    return tId === user?._id?.toString() || tRoll === user?.rollNumber;
  };

  const getSlotForCell = (day, period) => {
    const daySlots = timetable[day] || [];
    return daySlots.find((s) => {
      if (!isSlotVisibleForUser(s)) return false;
      const sStart = (s.startTime || '').trim().toUpperCase();
      return sStart.includes(period.start) || sStart.includes(period.start.replace(' ', '')) || sStart.startsWith(period.start.slice(0, 5));
    });
  };

  const getSlotTypeDetails = (slot) => {
    if (!slot) return null;
    const isBreak = slot.slotType === 'break' || (typeof slot.customTitle === 'string' && slot.customTitle.toLowerCase().includes('break'));
    const isLab = slot.isLab || slot.slotType === 'lab';
    const isOnline = slot.isOnline || slot.slotType === 'online';
    const isTBA = slot.isTBA || slot.slotType === 'tba' || (slot.courseId?.teacherId?.name && slot.courseId.teacherId.name.includes('ASSIGNED'));

    let bgStyle = 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)';
    let cardBg = 'rgba(2, 132, 199, 0.08)';
    let borderCol = '#0284C7';
    let textColor = '#FFFFFF';
    let badgeText = 'Theory';
    let icon = <BookOpen size={13} />;

    if (isBreak) {
      bgStyle = 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)';
      cardBg = 'rgba(254, 215, 170, 0.25)';
      borderCol = '#F59E0B';
      textColor = '#7C2D12';
      badgeText = 'Jummah Break';
      icon = <Coffee size={13} />;
    } else if (isLab) {
      bgStyle = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      cardBg = 'rgba(245, 158, 11, 0.08)';
      borderCol = '#D97706';
      badgeText = 'Lab Class';
      icon = <FlaskConical size={13} />;
    } else if (isOnline) {
      bgStyle = 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)';
      cardBg = 'rgba(139, 92, 246, 0.08)';
      borderCol = '#8B5CF6';
      badgeText = 'Online LMS';
      icon = <Laptop size={13} />;
    } else if (isTBA) {
      bgStyle = 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)';
      cardBg = 'rgba(244, 63, 94, 0.08)';
      borderCol = '#F43F5E';
      badgeText = 'Instructor TBA';
      icon = <AlertCircle size={13} />;
    }

    return { bgStyle, cardBg, borderCol, textColor, badgeText, icon, isBreak, isLab, isOnline, isTBA };
  };

  const renderSlotCell = (slot, day, period) => {
    if (!slot) {
      return (
        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', opacity: 0.35, fontSize: '0.82rem' }}>
          —
        </div>
      );
    }

    const typeInfo = getSlotTypeDetails(slot);

    return (
      <div
        onClick={() => setSelectedSlotModal({ ...slot, day })}
        style={{
          background: typeInfo.bgStyle,
          color: typeInfo.textColor,
          borderRadius: '8px',
          padding: '8px 10px',
          height: '80px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        title="Tap to view full class details"
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: '800' }}>
            <span>{slot.courseId?.code || 'TBA'}</span>
            <span>{typeInfo.icon}</span>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', lineHeight: '1.2', marginTop: '2px', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {slot.courseId?.title || slot.customTitle || 'Class'}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.25)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', opacity: 0.9 }}>
          <MapPin size={10} /> {slot.room || 'TBA'}
        </div>
      </div>
    );
  };

  const renderSlotCard = (slot, day) => {
    const typeInfo = getSlotTypeDetails(slot);
    return (
      <div
        key={slot._id || `${day}-${slot.startTime}`}
        onClick={() => setSelectedSlotModal({ ...slot, day })}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderLeft: `5px solid ${typeInfo.borderCol}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          marginBottom: '10px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--eum-maroon)' }}>
              {slot.courseId?.code || (typeInfo.isBreak ? 'JUMMAH BREAK' : 'CLASS')}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '10px',
                backgroundColor: typeInfo.cardBg,
                color: typeInfo.borderCol,
                border: `1px solid ${typeInfo.borderCol}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {typeInfo.icon} {typeInfo.badgeText}
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dark)', backgroundColor: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px' }}>
            <Clock size={12} style={{ color: 'var(--eum-maroon)' }} />
            {slot.startTime} – {slot.endTime}
          </div>
        </div>

        <h4 style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--text-dark)', margin: '4px 0 8px' }}>
          {slot.courseId?.title || slot.customTitle || 'Scheduled Session'}
        </h4>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <User size={13} style={{ color: 'var(--eum-maroon)' }} />
            <span>{slot.courseId?.teacherId?.name || (typeInfo.isTBA ? 'Instructor TBA' : 'Faculty')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: 'var(--eum-green)' }}>
            <MapPin size={13} />
            <span>Room: {slot.room || 'CTB1-02'}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading BSCS 7th Semester weekly timetable...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '28px', maxWidth: '100%', overflow: 'hidden' }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '20px 22px',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <EmuLogo size={36} />
          </div>
          <div>
            <div style={{ color: '#38BDF8', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px' }}>
              FACULTY OF COMPUTING & IT
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '2px 0', color: '#FFFFFF' }}>
              BS COMPUTER SCIENCE
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
              7th SEMESTER (Evening) • Section 7A
            </div>
          </div>
        </div>

        {/* View Mode & Teacher Scope Switchers */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {user?.role === 'teacher' && (
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '4px',
                borderRadius: '24px',
                gap: '4px',
              }}
            >
              <button
                onClick={() => setTeacherScope('my_courses')}
                style={{
                  backgroundColor: teacherScope === 'my_courses' ? 'var(--eum-maroon)' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  transition: 'all 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UserCheck size={12} /> My Classes
              </button>
              <button
                onClick={() => setTeacherScope('all')}
                style={{
                  backgroundColor: teacherScope === 'all' ? 'var(--eum-maroon)' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  transition: 'all 0.18s ease',
                }}
              >
                All Section 7A
              </button>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '4px',
              borderRadius: '24px',
              gap: '4px',
            }}
          >
            {[
              { id: 'cards', label: 'Day Cards' },
              { id: 'today', label: 'Today' },
              { id: 'matrix', label: 'Full Week Grid' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                style={{
                  backgroundColor: viewMode === m.id ? '#0284C7' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  transition: 'all 0.18s ease',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '20px',
          border: '1px solid var(--border-color)',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* VIEW MODE 1: DAY-BY-DAY CARDS (Mobile-First) */}
        {viewMode === 'cards' && (
          <div>
            {/* Day Selector Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '12px',
                marginBottom: '16px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {['All', ...days].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDayFilter(d)}
                  style={{
                    backgroundColor: activeDayFilter === d ? 'var(--eum-maroon)' : 'var(--bg-main)',
                    color: activeDayFilter === d ? '#FFFFFF' : 'var(--text-dark)',
                    border: activeDayFilter === d ? '1px solid var(--eum-maroon)' : '1px solid var(--border-color)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {d === currentDay ? `✦ ${d} (Today)` : d}
                </button>
              ))}
            </div>

            {/* Render Day Sections */}
            {(activeDayFilter === 'All' ? days : [activeDayFilter]).map((day) => {
              const daySlots = timetable[day] || [];
              const isCurrent = day === currentDay;

              return (
                <div key={day} style={{ marginBottom: '22px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      paddingBottom: '6px',
                      borderBottom: '2px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} style={{ color: 'var(--eum-maroon)' }} />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: isCurrent ? 'var(--eum-maroon)' : 'var(--text-dark)', margin: 0 }}>
                        {day}
                      </h3>
                      {isCurrent && (
                        <span className="badge badge-student" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          Today
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {daySlots.length} Classes
                    </span>
                  </div>

                  {daySlots.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                      No classes scheduled for {day}.
                    </div>
                  ) : (
                    <div>{daySlots.map((slot) => renderSlotCard(slot, day))}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 2: TODAY ONLY */}
        {viewMode === 'today' && (
          <div>
            <div
              style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: '4px solid var(--eum-maroon)',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Active Schedule View
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--eum-maroon)', margin: '2px 0' }}>
                  {days.includes(currentDay) ? `Today is ${currentDay}` : `Weekend — Showing Upcoming Monday`}
                </h3>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.76rem' }}>
                {(timetable[effectiveToday] || []).length} Scheduled Sessions
              </span>
            </div>

            {(timetable[effectiveToday] || []).length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No classes scheduled for today.
              </div>
            ) : (
              <div>
                {(timetable[effectiveToday] || []).map((slot) => renderSlotCard(slot, effectiveToday))}
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 3: FULL WEEK MATRIX TABLE */}
        {viewMode === 'matrix' && (
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '8px' }}>
            <div
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Info size={14} style={{ color: 'var(--eum-maroon)' }} />
              <span>👉 On mobile screens, swipe table horizontally to view full schedule Monday through Friday.</span>
            </div>

            <table style={{ minWidth: '720px', width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#0B2038', color: '#FFFFFF' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'center', width: '110px', fontSize: '0.78rem' }}>TIME</th>
                  {days.map((d) => (
                    <th key={d} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                      {d.toUpperCase()} {d === currentDay ? '★' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standardPeriods.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td
                      style={{
                        padding: '8px 6px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '0.76rem',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRight: '1px solid var(--border-color)',
                      }}
                    >
                      {p.label}
                    </td>
                    {days.map((d) => (
                      <td key={d} style={{ padding: '4px', borderRight: '1px solid var(--border-color)', verticalAlign: 'top', width: '120px' }}>
                        {renderSlotCell(getSlotForCell(d, p), d, p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER PANELS: ROOM LOCATIONS & COLOUR KEY */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Room Locations Guide */}
          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--eum-maroon)' }}>
              <MapPin size={16} />
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ROOM LOCATIONS GUIDE
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>CTB1-01 to CTB1-08</strong>
                <span style={{ color: 'var(--text-muted)' }}>→ Old Building, Upper Floor</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>CTB2-09 to CTB2-15</strong>
                <span style={{ color: 'var(--text-muted)' }}>→ Old Building, Ground Floor</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>CTB3-16 to CTB3-23</strong>
                <span style={{ color: 'var(--text-muted)' }}>→ Botany Block, Upper Floor</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--text-dark)' }}>CLab-01 to CLab-06</strong>
                <span style={{ color: 'var(--text-muted)' }}>→ Lab Block</span>
              </div>
            </div>
          </div>

          {/* Colour Key */}
          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--eum-maroon)' }}>
              <Layers size={16} />
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                COLOUR KEY
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#0284C7', flexShrink: 0 }} />
                <span>= <strong>Theory</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#D97706', flexShrink: 0 }} />
                <span>= <strong>Lab</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#8B5CF6', flexShrink: 0 }} />
                <span>= <strong>Online</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#F43F5E', flexShrink: 0 }} />
                <span>= <strong>Instructor TBA</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#FFEDD5', border: '1px solid #FED7AA', flexShrink: 0 }} />
                <span>= <strong>Jummah Break</strong> (01:30 – 02:20 PM Fri)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Summary Table */}
        <div
          style={{
            marginTop: '16px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--eum-maroon)' }}>
            <BookOpen size={16} />
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              COURSES SUMMARY (BSCS 7th SEMESTER)
            </h4>
          </div>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ minWidth: '550px', width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '6px 8px' }}>Code</th>
                  <th style={{ padding: '6px 8px' }}>Course Title</th>
                  <th style={{ padding: '6px 8px' }}>Instructor</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>Cr Hrs</th>
                  <th style={{ padding: '6px 8px' }}>Rooms</th>
                </tr>
              </thead>
              <tbody>
                {coursesSummary.map((c) => (
                  <tr key={c.code} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '6px 8px', fontWeight: '700', color: 'var(--eum-maroon)' }}>{c.code}</td>
                    <td style={{ padding: '6px 8px', fontWeight: '600', color: 'var(--text-dark)' }}>{c.title}</td>
                    <td style={{ padding: '6px 8px', color: c.instructor.includes('ASSIGNED') ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                      {c.instructor}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: '700' }}>{c.crHrs}</td>
                    <td style={{ padding: '6px 8px', color: 'var(--eum-green)', fontWeight: '600' }}>{c.rooms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Selected Slot Modal */}
      {selectedSlotModal && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedSlotModal(null)}
          style={{ zIndex: 1200 }}
        >
          <div
            className="modal-card animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-student" style={{ marginBottom: '6px' }}>
                  {selectedSlotModal.day} • {selectedSlotModal.startTime} – {selectedSlotModal.endTime}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--eum-maroon)', marginTop: '4px' }}>
                  {selectedSlotModal.courseId?.title || selectedSlotModal.customTitle || 'Lecture'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Course Code:</span>
                <strong style={{ color: 'var(--eum-maroon)' }}>{selectedSlotModal.courseId?.code || 'N/A'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Instructor:</span>
                <strong style={{ color: 'var(--text-dark)' }}>{selectedSlotModal.courseId?.teacherId?.name || 'TO BE ASSIGNED'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Room / Venue:</span>
                <strong style={{ color: 'var(--eum-green)' }}>{selectedSlotModal.room || 'CTB1-02'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Session Type:</span>
                <strong>{selectedSlotModal.isLab ? 'Practical / Lab' : selectedSlotModal.isOnline ? 'Online Google Meet' : 'Theory Lecture'}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setSelectedSlotModal(null)} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

