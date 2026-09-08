import React, { useState, useEffect } from 'react';
import API from '../services/api';
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
} from 'lucide-react';

export const TimetableGrid = ({ onOpenAdminManager }) => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' | 'cards' | 'today'
  const [selectedSlotModal, setSelectedSlotModal] = useState(null);

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

  const getSlotForCell = (day, period) => {
    const daySlots = timetable[day] || [];
    return daySlots.find((s) => {
      const sStart = (s.startTime || '').trim().toUpperCase();
      return sStart.includes(period.start) || sStart.includes(period.start.replace(' ', '')) || sStart.startsWith(period.start.slice(0, 5));
    });
  };

  const getRoomLocationDesc = (roomCode) => {
    if (!roomCode || typeof roomCode !== 'string' || roomCode === '—') return 'Break Session / Common';
    const rc = roomCode.toLowerCase();
    if (rc.includes('online')) return 'Google Meet / Online LMS Class';
    if (roomCode.startsWith('CTB1')) return 'Old Building, Upper Floor (CTB1-01 to CTB1-08)';
    if (roomCode.startsWith('CTB2')) return 'Old Building, Ground Floor (CTB2-09 to CTB2-15)';
    if (roomCode.startsWith('CTB3')) return 'Botany Block, Upper Floor (CTB3-16 to CTB3-23)';
    if (roomCode.startsWith('CLab') || rc.includes('lab')) return 'Lab Block (CLab-01 to CLab-06)';
    return 'University Main Campus Block';
  };

  const renderSlotCell = (slot, day, period) => {
    if (!slot) return <div style={{ height: '84px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', opacity: 0.4 }}>—</div>;

    const isBreak = slot.slotType === 'break' || (typeof slot.customTitle === 'string' && slot.customTitle.toLowerCase().includes('break'));
    const isLab = slot.isLab || slot.slotType === 'lab';
    const isOnline = slot.isOnline || slot.slotType === 'online';
    const isTBA = slot.isTBA || slot.slotType === 'tba' || (slot.courseId?.teacherId?.name && slot.courseId.teacherId.name.includes('ASSIGNED'));

    let bgStyle = 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)';
    let textColor = '#FFFFFF';
    let icon = <BookOpen size={13} />;

    if (isBreak) { bgStyle = 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)'; textColor = '#7C2D12'; icon = <Coffee size={13} />; }
    else if (isLab) { bgStyle = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'; icon = <FlaskConical size={13} />; }
    else if (isOnline) { bgStyle = 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'; icon = <Laptop size={13} />; }
    else if (isTBA) { bgStyle = 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)'; icon = <AlertCircle size={13} />; }

    return (
      <div onClick={() => setSelectedSlotModal({ ...slot, day })} style={{ background: bgStyle, color: textColor, borderRadius: '8px', padding: '8px 10px', height: '84px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '800' }}>{slot.courseId?.code || 'TBA'} <span>{icon}</span></div>
          <div style={{ fontSize: '0.76rem', fontWeight: '600', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{slot.courseId?.title || slot.customTitle || 'Class'}</div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}><MapPin size={10} /> {slot.room || 'TBA'}</div>
      </div>
    );
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading schedule...</div>;

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '24px 28px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', backgroundColor: '#FFFFFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmuLogo size={42} />
          </div>
          <div>
            <div style={{ color: '#38BDF8', fontSize: '0.78rem', fontWeight: '800' }}>FACULTY OF COMPUTING</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '2px 0' }}>BS COMPUTER SCIENCE</h2>
            <div style={{ fontSize: '0.86rem', color: '#CBD5E1' }}>7th SEMESTER (Evening) • Section 7A</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['matrix', 'cards', 'today'].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{ backgroundColor: viewMode === m ? '#0284C7' : 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', border: '1px solid var(--border-color)', borderRadius: '0 0 16px 16px' }}>
        {viewMode === 'matrix' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0B2038', color: '#FFFFFF' }}>
                <th style={{ padding: '12px' }}>TIME</th>
                {days.map(d => <th key={d} style={{ padding: '12px' }}>{d.toUpperCase()}</th>)}
              </tr>
            </thead>
            <tbody>
              {standardPeriods.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: '700' }}>{p.label}</td>
                  {days.map(d => <td key={d} style={{ padding: '6px' }}>{renderSlotCell(getSlotForCell(d, p), d, p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* FOOTER PANELS: ROOM LOCATIONS & COLOUR KEY */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {/* Room Locations Guide */}
          <div style={{
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--eum-maroon)' }}>
              <MapPin size={16} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ROOM LOCATIONS
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
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
          <div style={{
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--eum-maroon)' }}>
              <Layers size={16} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                COLOUR KEY
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#0284C7', flexShrink: 0 }} />
                <span>= <strong>Theory</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#D97706', flexShrink: 0 }} />
                <span>= <strong>Lab</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#8B5CF6', flexShrink: 0 }} />
                <span>= <strong>Online</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#F43F5E', flexShrink: 0 }} />
                <span>= <strong>Instructor TBA</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#FFEDD5', border: '1px solid #FED7AA', flexShrink: 0 }} />
                <span>= <strong>Jummah Break</strong> (01:30 – 02:20 PM Friday)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Summary Table */}
        <div style={{
          marginTop: '20px',
          backgroundColor: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 18px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--eum-maroon)' }}>
            <BookOpen size={16} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              COURSES SUMMARY (BSCS 7th SEMESTER)
            </h4>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
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


      {selectedSlotModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '400px' }}>
            <h3>{selectedSlotModal.courseId?.title || 'Class Details'}</h3>
            <p>Room: {selectedSlotModal.room}</p>
            <p>Time: {selectedSlotModal.startTime} - {selectedSlotModal.endTime}</p>
            <button onClick={() => setSelectedSlotModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
