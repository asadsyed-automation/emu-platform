import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { EmuLogo } from './EmuLogo';
import {
  LayoutDashboard,
  CalendarCheck,
  AlertCircle,
  FileCheck,
  BookOpen,
  Bell,
  CheckSquare,
  FileSpreadsheet,
  Users,
  CalendarDays,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  GraduationCap,
  Shield,
  User as UserIcon,
} from 'lucide-react';

export const DashboardSidebar = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Navigation Items per Role
  const getNavItems = () => {
    if (user?.role === 'student') {
      return [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} />, badge: 'Live' },
        { id: 'attendance', label: 'My Attendance', icon: <CalendarCheck size={18} /> },
        { id: 'disputes', label: 'My Disputes', icon: <AlertCircle size={18} /> },
        { id: 'coursework', label: 'Assignments & Quizzes', icon: <FileCheck size={18} /> },
        { id: 'datesheet', label: 'Datesheet & Schedule', icon: <CalendarDays size={18} /> },
        { id: 'courses', label: 'Courses', icon: <BookOpen size={18} /> },
        { id: 'announcements', label: 'Announcements', icon: <Bell size={18} /> },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} />, badge: 'Today' },
        { id: 'attendance', label: 'Attendance', icon: <CheckSquare size={18} /> },
        { id: 'disputes', label: 'Disputes', icon: <AlertCircle size={18} /> },
        { id: 'coursework', label: 'Assignments & Quizzes', icon: <FileCheck size={18} /> },
        { id: 'reports', label: 'Semester Reports', icon: <FileSpreadsheet size={18} /> },
        { id: 'schedule', label: 'Academic Schedule', icon: <CalendarDays size={18} /> },
        { id: 'announcements', label: 'Announcements', icon: <Bell size={18} /> },
      ];
    }

    // Owner / Administrator
    return [
      { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
      { id: 'accounts', label: 'Accounts', icon: <Users size={18} /> },
      { id: 'courses_timetable', label: 'Courses & Timetable', icon: <CalendarDays size={18} /> },
      { id: 'academic_schedule', label: 'Vacations & Datesheets', icon: <CalendarDays size={18} />, badge: 'New' },
      { id: 'results_import', label: 'Results Import', icon: <UploadCloud size={18} /> },
    ];
  };

  const navItems = getNavItems();

  const handleTabClick = (tabId) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const getRoleIcon = () => {
    if (user?.role === 'owner') return <Shield size={16} />;
    if (user?.role === 'teacher') return <UserIcon size={16} />;
    return <GraduationCap size={16} />;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

      <aside
        className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Top Sidebar Header / Role Summary */}
        <div
          style={{
            padding: collapsed ? '18px 10px' : '20px 18px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: '10px',
          }}
        >
          {!collapsed ? (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: 'var(--eum-maroon)',
                  letterSpacing: '0.5px',
                  marginBottom: '2px',
                }}
              >
                {getRoleIcon()}
                <span>{user?.role === 'owner' ? 'Admin Portal' : user?.role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}</span>
              </div>
              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: 'var(--text-dark)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={user?.name}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {user?.rollNumber}
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={`${user?.name} (${user?.role})`}
            >
              <EmuLogo size={32} />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '5px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Menu Tabs */}
        <div style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
          <div
            style={{
              padding: collapsed ? '0 8px 8px' : '0 18px 8px',
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: 'var(--text-light)',
              letterSpacing: '0.6px',
              textAlign: collapsed ? 'center' : 'left',
            }}
          >
            {collapsed ? '—' : 'Navigation'}
          </div>

          <nav>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                  style={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '11px 0' : '11px 16px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span
                      style={{
                        flex: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        backgroundColor: 'var(--eum-gold)',
                        color: '#5C1616',
                        padding: '2px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
