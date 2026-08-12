import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { OwnerBulkImportModal } from '../components/OwnerBulkImportModal';
import { Shield, User, GraduationCap, UserPlus, CheckCircle2, BookOpen, Clock, Calendar } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    if (user?.role !== 'owner') return;
    setLoadingUsers(true);
    try {
      const res = await API.get('/admin/users');
      setUsersList(res.data.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  return (
    <div className="container" style={{ padding: '30px 20px 60px' }}>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--eum-maroon)' }}>
              Welcome, {user?.name}!
            </h2>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> OTP Verified
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Logged in as <strong>{user?.rollNumber}</strong> ({user?.role?.toUpperCase()}) • Emerson University Multan
          </p>
        </div>

        {user?.role === 'owner' && (
          <button
            onClick={() => setShowBulkModal(true)}
            className="btn btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <UserPlus size={18} />
            <span>Bulk Student Import</span>
          </button>
        )}
      </div>

      {/* Owner Dashboard Content */}
      {user?.role === 'owner' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* System Status Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--eum-maroon)', marginBottom: '12px' }}>
              <Shield size={20} />
              <h3 style={{ fontSize: '1.1rem' }}>Phase 0 Foundation Active</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Auth pipeline, JWT sessions, Resend OTP verification, and Owner Bulk Account Creation are fully operational.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.85rem' }}>
              Total Registered Users: <strong>{usersList.length}</strong>
            </div>
          </div>

          {/* User Roster Table Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--border-color)',
            gridColumn: '1 / -1'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--eum-maroon)', marginBottom: '14px' }}>
              Class Accounts Directory
            </h3>
            {loadingUsers ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Loading account roster...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '10px 12px' }}>Roll / ID</th>
                      <th style={{ padding: '10px 12px' }}>Name</th>
                      <th style={{ padding: '10px 12px' }}>Email</th>
                      <th style={{ padding: '10px 12px' }}>Role</th>
                      <th style={{ padding: '10px 12px' }}>OTP Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: '600' }}>{u.rollNumber}</td>
                        <td style={{ padding: '10px 12px' }}>{u.name}</td>
                        <td style={{ padding: '10px 12px' }}>{u.email}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className={`badge badge-${u.role}`}>{u.role}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {u.otpVerified ? (
                            <span className="badge badge-success">Verified</span>
                          ) : (
                            <span className="badge badge-warning">Pending First Login</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teacher Dashboard Content */}
      {user?.role === 'teacher' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--eum-maroon)', marginBottom: '12px' }}>
              <User size={22} />
              <h3 style={{ fontSize: '1.2rem' }}>Teacher Portal — Assigned Courses</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              You are assigned to <strong>Advanced Web Engineering (CS-701)</strong> for Fall 2026.
            </p>
            <div style={{
              backgroundColor: 'var(--bg-main)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '4px solid var(--eum-green)',
              fontSize: '0.88rem'
            }}>
              <strong>Phase 1 Preview:</strong> Timetable slots and recurring dated lectures will populate here once configured.
            </div>
          </div>
        </div>
      )}

      {/* Student Dashboard Content */}
      {user?.role === 'student' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--eum-maroon)', marginBottom: '12px' }}>
              <GraduationCap size={24} />
              <h3 style={{ fontSize: '1.2rem' }}>Student Coursework Overview</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Your account <strong>{user?.rollNumber}</strong> is enrolled in BS(CS) 7th semester section.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginTop: '16px'
            }}>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', uppercase: true }}>Attendance Threshold</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--eum-green)' }}>75% Target</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', uppercase: true }}>Active Disputes Allowed</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--eum-gold)' }}>3 per course</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <OwnerBulkImportModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};
