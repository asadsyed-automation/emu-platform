import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Award, Clock, Users } from 'lucide-react';

export const Hero3DElement = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    setRotate({ x: -y / 15, y: x / 15 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F7F7F5 100%)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(122, 31, 31, 0.25), 0 0 0 1px rgba(122, 31, 31, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle EUM Monogram Backdrop Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '12rem',
            fontWeight: '900',
            fontFamily: 'var(--font-heading)',
            color: 'rgba(122, 31, 31, 0.04)',
            userSelect: 'none',
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          EMU
        </div>

        {/* 3D Glass Floating Badge 1 */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            backgroundColor: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(122, 31, 31, 0.1)',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--eum-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)' }}>
              100% Audit-Trail Trust
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Server-enforced timetable dates
            </div>
          </div>
        </div>

        {/* Mock Live Card Widget */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'var(--eum-maroon)',
            color: '#FFFFFF',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(122, 31, 31, 0.3)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--eum-gold)' }}>
              Live Section Dashboard
            </span>
            <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px' }}>
              BS(CS) 7th Sem
            </span>
          </div>

          <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>
            Advanced Web Engineering
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
            Instructor: Dr. Wasif Akbar • Room: BOT-B1-F-102
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Section Attendance</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--eum-gold)' }}>94.2%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Dispute Resolution</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF' }}>2/3 Peer Verified</div>
            </div>
          </div>
        </div>

        {/* 3D Glass Floating Badge 2 */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} style={{ color: 'var(--eum-green)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-dark)' }}>
              54 Registered Class Accounts
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--eum-green)', fontWeight: '700', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '10px' }}>
            Zero-Friction
          </span>
        </div>
      </div>
    </div>
  );
};
