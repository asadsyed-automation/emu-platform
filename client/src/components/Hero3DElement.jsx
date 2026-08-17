import React, { useState } from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export const Hero3DElement = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    setRotate({ x: -y / 20, y: x / 20 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '900px',
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.18s ease-out',
          transformStyle: 'preserve-3d',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '18px',
          padding: '20px',
          boxShadow: '0 16px 36px -10px rgba(122, 31, 31, 0.18), 0 0 0 1px var(--border-color)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle EMU Monogram Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            fontSize: '9rem',
            fontWeight: '900',
            fontFamily: 'var(--font-heading)',
            color: 'var(--eum-maroon)',
            opacity: 0.04,
            userSelect: 'none',
            lineHeight: 1,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          EMU
        </div>

        {/* Floating Trust Badge */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            backgroundColor: 'var(--bg-main)',
            padding: '9px 13px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--eum-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)' }}>
              100% Audit-Trail Trust
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Server-enforced timetable lectures
            </div>
          </div>
        </div>

        {/* Live Section Widget Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'var(--eum-maroon)',
            color: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: '0 8px 22px rgba(122, 31, 31, 0.25)',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--eum-gold)' }}>
              Live Section Hub
            </span>
            <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(255,255,255,0.18)', padding: '2px 7px', borderRadius: '8px' }}>
              BS(CS) 7th Sem
            </span>
          </div>

          <div style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '2px' }}>
            Advanced Web Engineering
          </div>
          <div style={{ fontSize: '0.74rem', opacity: 0.88 }}>
            Instructor: Dr. Wasif Akbar • Room: BOT-B1-F-102
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.66rem', opacity: 0.8 }}>Section Attendance</div>
              <div style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--eum-gold)' }}>
                <AnimatedCounter target={94.2} decimals={1} suffix="%" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', opacity: 0.8 }}>Dispute Resolution</div>
              <div style={{ fontSize: '1.18rem', fontWeight: '800', color: '#FFFFFF' }}>2/3 Peer Votes</div>
            </div>
          </div>
        </div>

        {/* Registered Class Counter Badge */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-main)',
            padding: '9px 13px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} style={{ color: 'var(--eum-green)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-dark)' }}>
              <AnimatedCounter target={54} suffix=" Pre-Created Student Accounts" />
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--eum-green)', fontWeight: '700', backgroundColor: 'var(--status-success-bg)', padding: '2px 7px', borderRadius: '8px' }}>
            Active
          </span>
        </div>
      </div>
    </div>
  );
};
