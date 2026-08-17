import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { EmuLogo } from './EmuLogo';
import {
  Sun,
  Moon,
  LogOut,
  GraduationCap,
  Shield,
  User as UserIcon,
  Menu,
  X,
  ArrowLeft,
  LogIn,
  LayoutDashboard,
  Globe,
} from 'lucide-react';

export const Navbar = ({
  variant = 'dashboard', // 'landing' | 'login' | 'dashboard'
  onGoHome,
  onGoToLogin,
  onBackToLanding,
  onToggleSidebar,
  selectedRole,
  onSwitchRole,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return <span className="badge badge-owner"><Shield size={12} /> Admin</span>;
      case 'teacher':
        return <span className="badge badge-teacher"><UserIcon size={12} /> Faculty</span>;
      case 'student':
        return <span className="badge badge-student"><GraduationCap size={12} /> Student</span>;
      default:
        return null;
    }
  };

  const handleLogoClick = () => {
    if (onGoHome) {
      onGoHome();
    } else if (onBackToLanding) {
      onBackToLanding();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
          padding: '0 20px',
        }}
      >
        {/* Left: Brand Identity (Clickable to Home) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={handleLogoClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogoClick(); }}
            title="Return to EMU Homepage"
          >
            <EmuLogo size={38} />
            <div>
              <div
                style={{
                  fontSize: '1.18rem',
                  fontWeight: '800',
                  color: 'var(--eum-maroon)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.3px',
                }}
              >
                EMU Platform
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: '500',
                }}
              >
                BS(CS) • Emerson University Multan
              </div>
            </div>
          </div>
        </div>

        {/* Center: Landing Navigation Links (Only on Landing Page) */}
        {variant === 'landing' && (
          <nav
            className="no-print desktop-nav"
            style={{ display: 'flex', alignItems: 'center', gap: '26px' }}
          >
            <a href="#how-it-works" className="nav-link-underline">
              How it works
            </a>
            <a href="#courses" className="nav-link-underline">
              Section Courses
            </a>
            <a href="#demo" className="nav-link-underline">
              Official Reports
            </a>
            <a href="#faq" className="nav-link-underline">
              FAQ
            </a>
            <a href="#contact" className="nav-link-underline">
              Pilot Lead Desk
            </a>
          </nav>
        )}

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Universal Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{
              padding: '6px 10px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-sm)',
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={16} style={{ color: 'var(--eum-gold)' }} />
            ) : (
              <Moon size={16} />
            )}
          </button>

          {/* Landing Page Action: Login Button & Mobile Menu Toggle */}
          {variant === 'landing' && (
            <>
              {user ? (
                <button
                  onClick={onGoToLogin}
                  className="btn btn-primary desktop-nav"
                  style={{ padding: '8px 18px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <LayoutDashboard size={15} /> Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={onGoToLogin}
                  className="btn btn-primary desktop-nav"
                  style={{ padding: '8px 18px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <LogIn size={15} /> Log In to Portal
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn btn-outline mobile-menu-btn"
                aria-label="Toggle navigation menu"
                style={{ padding: '7px 10px', display: 'none' }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          )}

          {/* Login Page Actions: Switch Role & Back to Home */}
          {variant === 'login' && (
            <>
              {selectedRole && onSwitchRole && (
                <button
                  onClick={onSwitchRole}
                  className="btn btn-outline"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  ← <span className="hide-on-mobile">Switch </span>Role
                </button>
              )}

              {onBackToLanding && (
                <button
                  onClick={onBackToLanding}
                  className="btn btn-outline"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  <ArrowLeft size={14} /> <span className="hide-on-mobile">Back to </span>Home
                </button>
              )}
            </>
          )}

          {/* Dashboard Actions: Profile & Logout */}
          {variant === 'dashboard' && user && (
            <>
              <div className="user-profile-header" style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-dark)' }}>
                    {user.name}
                  </span>
                  {getRoleBadge(user.role)}
                </div>
              </div>

              {/* Mobile Role Badge */}
              <div className="mobile-only" style={{ display: 'none' }}>
                {getRoleBadge(user.role)}
              </div>

              <button
                onClick={logout}
                className="btn btn-outline"
                style={{
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                }}
                title="Logout"
              >
                <LogOut size={15} />
                <span className="logout-text">Logout</span>
              </button>

              {/* Mobile Sidebar Hamburger on Top Right */}
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="btn btn-outline mobile-menu-btn"
                  aria-label="Toggle navigation drawer"
                  title="Toggle Navigation Menu"
                  style={{
                    padding: '6px 10px',
                    display: 'none',
                    alignItems: 'center',
                  }}
                >
                  <Menu size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Landing Mobile Drawer */}
      {variant === 'landing' && mobileMenuOpen && (
        <div
          className="mobile-nav-drawer animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '2px solid var(--border-color)',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.94rem',
              padding: '4px 0',
            }}
          >
            ✦ How it works
          </a>
          <a
            href="#courses"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.94rem',
              padding: '4px 0',
            }}
          >
            ✦ Section Courses
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.94rem',
              padding: '4px 0',
            }}
          >
            ✦ Live Reports (Page A & B)
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.94rem',
              padding: '4px 0',
            }}
          >
            ✦ Frequently Asked Questions
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.94rem',
              padding: '4px 0',
            }}
          >
            ✦ Feedback & Pilot Desk
          </a>

          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoToLogin) onGoToLogin();
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                marginTop: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <LayoutDashboard size={16} /> Open Dashboard ({user.name})
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoToLogin) onGoToLogin();
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                marginTop: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <LogIn size={16} /> Log In to Portal
            </button>
          )}
        </div>
      )}
    </header>
  );
};

// Also export as Header for backwards compatibility
export const Header = Navbar;
