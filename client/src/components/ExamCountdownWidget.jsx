import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Clock, AlertCircle, Sparkles, BookOpen, ChevronRight, FileText } from 'lucide-react';

export const ExamCountdownWidget = ({ onOpenDatesheet }) => {
  const [countdownData, setCountdownData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const res = await API.get('/academic-events/countdown');
        if (res.data.hasUpcoming) {
          setCountdownData(res.data.exam);
        }
      } catch (err) {
        console.warn('Countdown fetch warning:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountdown();
  }, []);

  if (loading || !countdownData) return null;

  const { title, type, startDate, daysLeft, isOngoing, datesheet } = countdownData;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        border: '1px solid var(--border-color)',
        borderLeft: isOngoing ? '5px solid var(--eum-green)' : '5px solid var(--eum-maroon)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '20px',
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
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: isOngoing ? 'var(--status-success-bg)' : 'rgba(122, 31, 31, 0.09)',
            color: isOngoing ? 'var(--eum-green)' : 'var(--eum-maroon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isOngoing ? <Sparkles size={22} /> : <Calendar size={22} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '8px',
                backgroundColor: isOngoing ? 'var(--status-success-bg)' : 'rgba(122, 31, 31, 0.1)',
                color: isOngoing ? 'var(--eum-green)' : 'var(--eum-maroon)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {isOngoing ? 'Exams Currently Active' : `${type.toUpperCase()} SCHEDULE`}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Starts {formatDate(startDate)}
            </span>
          </div>

          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '2px' }}>
            {title}
          </div>
        </div>
      </div>

      {/* Right Side: Days Left Badge & Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            textAlign: 'right',
            paddingRight: '12px',
            borderRight: '1px solid var(--border-color)',
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: '900', color: isOngoing ? 'var(--eum-green)' : 'var(--eum-maroon)', lineHeight: 1.1 }}>
            {isOngoing ? 'Active Now' : `${daysLeft} Days Left`}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {isOngoing ? 'Check Room Allocations' : 'Prepare Semester Dossier'}
          </div>
        </div>

        {datesheet && datesheet.length > 0 && onOpenDatesheet && (
          <button
            onClick={onOpenDatesheet}
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.82rem' }}
          >
            <FileText size={14} /> View Datesheet
          </button>
        )}
      </div>
    </div>
  );
};
