import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { TimetableGrid } from './TimetableGrid';
import {
  BookOpen,
  User,
  Clock,
  MapPin,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const EnrolledCoursesView = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTimetable, setViewTimetable] = useState(false);

  // Official Emerson BS(CS) 7th Semester Course Definitions
  const defaultCourses = [
    {
      _id: 'c-1',
      code: 'COSC-4113',
      title: 'Analysis of Algorithms',
      creditHours: '3 (3+0)',
      teacherName: 'Mr. Qasim Niaz',
      teacherEmail: 'qasim.niaz@emerson.edu.pk',
      room: 'CTB1-02',
      schedule: 'Tue (15:00-15:50), Wed (15:00-15:50), Thu (15:00-15:50)',
      color: '#1B5E20',
    },
    {
      _id: 'c-2',
      code: 'COSE-4135',
      title: 'Compiler Construction',
      creditHours: '3 (2+1)',
      teacherName: 'Ms. Rozina Riaz',
      teacherEmail: 'rozina.riaz@emerson.edu.pk',
      room: 'CTB1-02 (Theory) / CLab-06 (Lab)',
      schedule: 'Mon (13:30-14:20), Tue (13:30-14:20), Wed Lab (17:40-19:20)',
      color: '#0D47A1',
    },
    {
      _id: 'c-3',
      code: 'COSE-4150',
      title: 'Computer Graphics',
      creditHours: '3 (2+1)',
      teacherName: 'TO BE ASSIGNED (TBA)',
      teacherEmail: 'tba.graphics@emerson.edu.pk',
      room: 'CTB1-02 (Theory) / CLab-06 (Lab)',
      schedule: 'Wed (14:20-15:10), Thu (14:20-15:10), Thu Lab (17:40-19:20)',
      color: '#C2185B',
    },
    {
      _id: 'c-4',
      code: 'IT-404',
      title: 'Cyber Security',
      creditHours: '3 (3+0)',
      teacherName: 'Ms. Samra Mushtaq',
      teacherEmail: 'samra.mushtaq@emerson.edu.pk',
      room: 'CTB1-02 / CLab-02',
      schedule: 'Wed (13:30-14:20), Thu (13:30-14:20), Fri (16:50-18:30)',
      color: '#D84315',
    },
    {
      _id: 'c-5',
      code: 'FLNG-xxxx',
      title: 'Foreign Language',
      creditHours: '3 (3+0)',
      teacherName: 'TO BE ASSIGNED (TBA)',
      teacherEmail: 'tba.flng@emerson.edu.pk',
      room: 'Online (MS Teams / Portal)',
      schedule: 'Mon (15:50-16:40), Wed (15:50-16:40), Fri (15:00-15:50)',
      color: '#6A1B9A',
    },
    {
      _id: 'c-6',
      code: 'ARAB-3101',
      title: 'Translation of the Holy Quran-V',
      creditHours: '3 (3+0)',
      teacherName: 'TO BE ASSIGNED (TBA)',
      teacherEmail: 'tba.quran@emerson.edu.pk',
      room: 'Online (MS Teams / Portal)',
      schedule: 'Mon (15:00-15:50), Tue (15:50-16:40), Fri (15:50-16:40)',
      color: '#00695C',
    },
  ];

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      if (res.data.courses && res.data.courses.length > 0) {
        const formatted = res.data.courses.map((c) => ({
          _id: c._id,
          code: c.code,
          title: c.title,
          creditHours: c.creditHours || '3 (3+0)',
          teacherName: c.teacherId?.name || (c.code.includes('COSE-4150') || c.code.includes('FLNG') || c.code.includes('ARAB') ? 'TO BE ASSIGNED' : 'Faculty Member'),
          teacherEmail: c.teacherId?.email || 'department@emerson.edu.pk',
          room: c.defaultRoom || (c.isOnline ? 'Online' : 'CTB1-02'),
          schedule: c.isOnline ? 'Online Slots Scheduled' : 'Weekly Timetable Slots Scheduled',
          color: c.color || 'var(--eum-maroon)',
        }));
        setCourses(formatted);
      } else {
        setCourses(defaultCourses);
      }
    } catch (err) {
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
              backgroundColor: 'rgba(28, 92, 52, 0.1)',
              color: 'var(--eum-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              Enrolled Courses & Faculty Directory
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              BS(CS) 7th Semester (Fall 2026) • 6 Academic Courses & 15 Timetable Slots
            </p>
          </div>
        </div>

        <button
          onClick={() => setViewTimetable(!viewTimetable)}
          className="btn btn-outline"
          style={{ padding: '8px 16px', fontSize: '0.86rem' }}
        >
          <Calendar size={15} />
          <span>{viewTimetable ? 'View Course Cards' : 'View Timetable Grid'}</span>
        </button>
      </div>

      {viewTimetable ? (
        <TimetableGrid />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '16px',
          }}
        >
          {(courses.length > 0 ? courses : defaultCourses).map((c) => (
            <div
              key={c._id}
              className="card-hover animate-fade-in-up"
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
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: c.color,
                }}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--eum-maroon)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {c.code}
                  </span>
                  <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    Credit Hours: <strong>{c.creditHours}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '12px' }}>
                  {c.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={15} style={{ color: 'var(--eum-maroon)', flexShrink: 0 }} />
                    <span><strong>{c.teacherName}</strong> ({c.teacherEmail})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} style={{ color: 'var(--eum-green)', flexShrink: 0 }} />
                    <span>{c.room}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Clock size={15} style={{ color: 'var(--eum-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{c.schedule}</span>
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
                  fontSize: '0.78rem',
                  color: 'var(--text-light)',
                }}
              >
                <span>Department of Computer Science</span>
                <span style={{ fontWeight: '600', color: 'var(--eum-green)' }}>● Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
