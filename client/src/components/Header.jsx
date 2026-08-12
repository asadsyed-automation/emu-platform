import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, GraduationCap, Shield, User as UserIcon } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return <span className="badge badge-owner"><Shield size={12} /> Owner</span>;
      case 'teacher':
        return <span className="badge badge-teacher"><UserIcon size={12} /> Teacher</span>;
      case 'student':
        return <span className="badge badge-student"><GraduationCap size={12} /> Student</span>;
      default:
        return null;
    }
  };

  return (
    <header style={{
      backgroundColor: 'var(--eum-maroon)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px'
      }}>
        {/* Left: Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--eum-gold)',
            color: 'var(--eum-maroon-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.2rem',
            border: '2px solid #FFFFFF'
          }}>
            EMU
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0, letterSpacing: '0.3px' }}>
              EMU Platform
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
              Emerson University Multan • BS(CS) 7th Sem
            </p>
          </div>
        </div>

        {/* Right: User profile & logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                <span style={{ fontWeight: '600', fontSize: '0.92rem' }}>{user.name}</span>
                {getRoleBadge(user.role)}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                {user.rollNumber} {user.email ? `• ${user.email}` : ''}
              </span>
            </div>

            <button
              onClick={logout}
              className="btn btn-outline"
              style={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                padding: '6px 12px',
                fontSize: '0.85rem'
              }}
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
