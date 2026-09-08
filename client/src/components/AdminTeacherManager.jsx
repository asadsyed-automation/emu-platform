import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  UserCheck,
  PlusCircle,
  Edit2,
  Trash2,
  Mail,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  X,
} from 'lucide-react';

export const AdminTeacherManager = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/admin/users?role=teacher');
      setTeachers(res.data.users || []);
    } catch (err) {
      setError('Failed to load faculty directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const openAddModal = () => {
    setEditingTeacher(null);
    setName('');
    setEmail('');
    setEmployeeId('');
    setPassword('');
    setShowModal(true);
  };

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setEmail(teacher.email);
    setEmployeeId(teacher.rollNumber);
    setPassword('');
    setShowModal(true);
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage('');
    setError('');

    try {
      if (editingTeacher) {
        await API.put(`/admin/teachers/${editingTeacher._id}`, {
          name,
          email,
          rollNumber: employeeId,
          password: password || undefined,
        });
        setMessage(`Teacher "${name}" updated successfully!`);
      } else {
        await API.post('/admin/create-teacher', {
          name,
          email,
          employeeId,
          password: password || employeeId || 'TCH@2026',
        });
        setMessage(`New Faculty account created for "${name}"!`);
      }
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving faculty member.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTeacher = async (id, teacherName) => {
    if (!window.confirm(`Are you sure you want to remove instructor "${teacherName}"?`)) return;

    setActionLoading(true);
    try {
      await API.delete(`/admin/teachers/${id}`);
      setMessage(`Instructor "${teacherName}" removed.`);
      fetchTeachers();
    } catch (err) {
      setError('Error deleting teacher.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
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
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(122, 31, 31, 0.1)',
              color: 'var(--eum-maroon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserCheck size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              Faculty & Teacher Directory Management
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Create teacher accounts, configure instructor credentials, and manage department faculty.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={openAddModal}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={15} /> Add Faculty Member
          </button>
          <button
            onClick={fetchTeachers}
            className="btn btn-outline"
            style={{ padding: '8px 12px', fontSize: '0.86rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div
          style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Faculty Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ fontSize: '1.1rem', color: 'var(--eum-maroon)', marginBottom: '14px' }}>
          Registered Instructors ({teachers.length})
        </h3>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading faculty members...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px 14px' }}>Employee / Roll ID</th>
                  <th style={{ padding: '10px 14px' }}>Faculty Name</th>
                  <th style={{ padding: '10px 14px' }}>Official Email</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--eum-maroon)' }}>
                      {t.rollNumber}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '600' }}>
                      {t.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {t.email}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-success">Pre-Verified</span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(t)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(t._id, t.name)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.74rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Faculty Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '26px 28px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', margin: 0 }}>
                {editingTeacher ? `Edit Faculty (${editingTeacher.name})` : 'Create Faculty Account'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Qasim Niaz"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="qasim.niaz@emerson.edu.pk"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Employee ID / Roll (e.g. TCH-AOA01)
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="TCH-AOA01"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Password {editingTeacher ? '(Leave blank to keep current)' : ''}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingTeacher ? '••••••••' : 'Defaults to Employee ID'}
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.86rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.86rem' }}
                >
                  {actionLoading ? 'Saving...' : editingTeacher ? 'Update Faculty' : 'Create Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
