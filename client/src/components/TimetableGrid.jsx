import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';

export const TimetableGrid = () => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await API.get('/timetable');
        setTimetable(res.data.timetable || {});
      } catch (err) {
        setError('Failed to load weekly timetable.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const getTodayDayName = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[new Date().getDay()];
  };

  const currentDay = getTodayDayName();

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading section timetable schedule...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '16px', color: 'var(--status-danger)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-sm)' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '24px'
    }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(122, 31, 31, 0.1)',
            color: 'var(--eum-maroon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)' }}>Weekly Lecture Timetable</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              BSCS-6th/7th Semester Evening Section-A • Main Room: <strong>BOT-B1-F-102</strong> & <strong>LAB BLOCK</strong>
            </p>
          </div>
        </div>

        <div style={{
          fontSize: '0.82rem',
          backgroundColor: 'var(--bg-main)',
          padding: '6px 14px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid var(--border-color)'
        }}>
          <Sparkles size={14} style={{ color: 'var(--eum-gold)' }} />
          <span>Today is <strong>{currentDay}</strong></span>
        </div>
      </div>

      {/* Timetable Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontSize: '0.88rem'
        }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '8px 14px', width: '120px' }}>Day</th>
              <th style={{ padding: '8px 14px' }}>Scheduled Classes & Rooms</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const daySlots = timetable[day] || [];
              const isToday = day === currentDay;

              return (
                <tr
                  key={day}
                  style={{
                    backgroundColor: isToday ? 'rgba(28, 92, 52, 0.05)' : 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: isToday ? '4px solid var(--eum-green)' : '4px solid transparent'
                  }}
                >
                  {/* Day Label */}
                  <td style={{
                    padding: '16px 14px',
                    fontWeight: '700',
                    color: isToday ? 'var(--eum-green)' : 'var(--text-dark)',
                    verticalAlign: 'top'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{day}</span>
                      {isToday && (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                          Today
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Class Slots */}
                  <td style={{ padding: '12px 14px' }}>
                    {daySlots.length === 0 ? (
                      <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No classes scheduled</span>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '12px'
                      }}>
                        {daySlots.map((slot) => {
                          const course = slot.courseId;
                          return (
                            <div
                              key={slot._id}
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 'var(--radius-sm)',
                                padding: '12px 14px',
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'transform 0.15s ease',
                                borderTop: slot.isLab ? '3px solid var(--eum-gold)' : '3px solid var(--eum-maroon)'
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '6px'
                              }}>
                                <span style={{
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  color: 'var(--eum-maroon)'
                                }}>
                                  {course?.code || 'CS'}
                                </span>

                                <span style={{
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  color: slot.isLab ? '#795548' : 'var(--eum-green)',
                                  backgroundColor: slot.isLab ? 'var(--eum-gold-light)' : 'var(--status-success-bg)',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <MapPin size={10} />
                                  {slot.room} {slot.isLab ? '(Lab)' : ''}
                                </span>
                              </div>

                              <h4 style={{
                                fontSize: '0.95rem',
                                fontWeight: '700',
                                color: 'var(--text-dark)',
                                marginBottom: '8px'
                              }}>
                                {course?.title || 'Course'}
                              </h4>

                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                borderTop: '1px dashed var(--border-color)',
                                paddingTop: '6px',
                                marginTop: '4px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={12} />
                                  <span>{slot.startTime} - {slot.endTime}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <User size={12} />
                                  <span>{course?.teacherId?.name || 'Instructor'}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
