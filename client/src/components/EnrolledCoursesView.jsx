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

  // Official Emerson BS(CS) Course Definitions
  const defaultCourses = [
    {
      _id: 'c-1',
      code: 'COSE-4149',
      title: 'Cloud Computing',
      creditHours: '3 (2+1)',
      teacherName: 'Dr. Wasif Akbar',
      teacherEmail: 'wasif.akbar@emerson.edu.pk',
      room: 'BOT-B1-F-102 / LAB BLOCK',
      schedule: 'Mon (14:20-15:10), Tue (14:20-15:10), Wed Lab (12:30-13:30)',
      color: 'var(--eum-maroon)',
    },
    {
      _id: 'c-2',
      code: 'COSE-3133',
      title: 'HCI & Computer Graphics',
      creditHours: '3 (2+1)',
      teacherName: 'Ms. Samia Nasir',
      teacherEmail: 'samia.nasir@emerson.edu.pk',
      room: 'BOT-B1-F-102 / LAB BLOCK',
      schedule: 'Mon (15:10-16:00), Tue (15:10-16:00), Thu Lab (12:30-13:30)',
      color: 'var(--eum-green)',
    },
    {
      _id: 'c-3',
      code: 'MATH-3181',
      title: 'Multivariable Calculus',
      creditHours: '3 (3+0)',
      teacherName: 'Mr. Muhammad Farhan',
      teacherEmail: 'muhammad.farhan@emerson.edu.pk',
      room: 'BOT-B1-F-102',
      schedule: 'Wed (14:45-16:00), Thu (13:30-14:45)',
      color: '#9E7700',
    },
    {
      _id: 'c-4',
      code: 'COSE-3136',
      title: 'Parallel & Distributed Computing',
      creditHours: '3 (2+1)',
      teacherName: 'Mr. Usman Mohyuddin',
      teacherEmail: 'usman.mohyuddin@emerson.edu.pk',
      room: 'BOT-B1-F-102 / LAB BLOCK',
      schedule: 'Mon (13:30-14:20), Tue (13:30-14:20), Fri Lab (12:30-13:30)',
      color: '#673AB7',
    },
    {
      _id: 'c-5',
      code: 'BUAD-2123',
      title: 'Principles of Marketing',
      creditHours: '3 (3+0)',
      teacherName: 'Mr. Ammar Haider',
      teacherEmail: 'ammar.haider@emerson.edu.pk',
      room: 'BOT-B1-F-102',
      schedule: 'Thu (14:45-16:00), Fri (13:30-14:45)',
      color: '#00838F',
    },
    {
      _id: 'c-6',
      code: 'ENGL-3184',
      title: 'Technical & Business Writing',
      creditHours: '3 (3+0)',
      teacherName: 'Ms. Faeza Ayub',
      teacherEmail: 'faezaayub134@gmail.com',
      room: 'BOT-B1-F-102',
      schedule: 'Wed (13:30-14:45), Fri (14:45-16:00)',
      color: '#D84315',
    },
  ];

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      if (res.data.courses && res.data.courses.length > 0) {
        setCourses(res.data.courses);
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {defaultCourses.map((c) => (
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
