import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { OwnerBulkImportModal } from '../components/OwnerBulkImportModal';
import { TimetableGrid } from '../components/TimetableGrid';
import { LectureCalendar } from '../components/LectureCalendar';
import { Shield, User, GraduationCap, UserPlus, CheckCircle2, BookOpen, Clock, Calendar, RefreshCw } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [generatingLectures, setGeneratingLectures] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

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

  const handleGenerateLectures = async () => {
    setGeneratingLectures(true);
    setActionMessage('');
    try {
      const res = await API.post('/lectures/generate-semester');
      setActionMessage(res.data.message || 'Semester lectures generated successfully!');
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Error generating semester lectures.');
    } finally {
      setGeneratingLectures(false);
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleGenerateLectures}
              disabled={generatingLectures}
              className="btn btn-secondary"
              style={{ padding: '10px 16px' }}
            >
              <RefreshCw size={16} className={generatingLectures ? 'spin' : ''} />
              <span>{generatingLectures ? 'Generating...' : 'Auto-Generate Lectures'}</span>
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="btn btn-primary"
              style={{ padding: '10px 18px' }}
            >
              <UserPlus size={18} />
              <span>Bulk Student Import</span>
            </button>
          </div>
        )}
      </div>

      {actionMessage && (
        <div style={{
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.88rem',
          marginBottom: '20px'
        }}>
          {actionMessage}
        </div>
      )}

      {/* Main Timetable Grid (Visible to All Roles) */}
      <TimetableGrid />

      {/* Semester Lecture Calendar (Visible to All Roles) */}
      <LectureCalendar />

      {/* Owner User Directory Card */}
      {user?.role === 'owner' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          marginTop: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--eum-maroon)' }}>
              Class Accounts Directory (54 Real Students + Teachers)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total Records: <strong>{usersList.length}</strong>
            </span>
          </div>

          {loadingUsers ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Loading account roster...</p>
          ) : (
            <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 1 }}>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
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
