import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Users,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UploadCloud,
  X,
  ShieldAlert,
} from 'lucide-react';

export const AdminStudentManager = ({ onOpenBulkImport }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/admin/users?role=student');
      setStudents(res.data.users || []);
    } catch (err) {
      setError('Failed to load student accounts list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.rollNumber || '').toLowerCase().includes(q) ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q)
    );
  });

  const openAddModal = () => {
    setEditingStudent(null);
    setName('');
    setRollNumber('');
    setEmail('');
    setOtpVerified(false);
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setName(student.name);
    setRollNumber(student.rollNumber);
    setEmail(student.email);
    setOtpVerified(student.otpVerified || false);
    setShowModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage('');
    setError('');

    try {
      if (editingStudent) {
        await API.put(`/admin/students/${editingStudent._id}`, {
          name,
          rollNumber,
          email,
          otpVerified,
        });
        setMessage(`Student account "${rollNumber}" updated!`);
      } else {
        await API.post('/admin/create-student', {
          name,
          rollNumber,
          email,
          otpVerified,
        });
        setMessage(`New student "${rollNumber}" created and enrolled in all 7th sem courses!`);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving student account.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (studentId, roll) => {
    if (!window.confirm(`Reset password for student ${roll} to their Roll Number (${roll})?`)) return;

    setActionLoading(true);
    try {
      const res = await API.post(`/admin/students/${studentId}/reset-password`, { newPassword: roll });
      setMessage(res.data.message || `Password for ${roll} reset successfully.`);
    } catch (err) {
      setError('Error resetting password.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId, roll) => {
    if (!window.confirm(`Are you sure you want to permanently delete student account ${roll}?`)) return;

    setActionLoading(true);
    try {
      await API.delete(`/admin/students/${studentId}`);
      setMessage(`Student account ${roll} removed.`);
      fetchStudents();
    } catch (err) {
      setError('Error deleting student.');
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
              backgroundColor: 'rgba(28, 92, 52, 0.1)',
              color: 'var(--eum-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              Student Roster & Credentials Manager
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Manage Section 7A student enrollments, OTP credentials, and password resets.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={openAddModal}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={15} /> Add Student
          </button>

          {onOpenBulkImport && (
            <button
              onClick={onOpenBulkImport}
              className="btn btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.86rem' }}
            >
              <UploadCloud size={15} /> Bulk CSV Import
            </button>
          )}

          <button
            onClick={fetchStudents}
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

      {/* Search Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid var(--border-color)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Roll Number, Student Name, or Email..."
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            width: '100%',
            fontSize: '0.92rem',
            color: 'var(--text-dark)',
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Students Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--eum-maroon)', margin: 0 }}>
            Section 7A Roster ({filteredStudents.length} of {students.length} Students)
          </h3>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading student accounts...
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxHeight: '520px' }}>
            <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-subtle)', zIndex: 1 }}>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px 14px' }}>Roll Number</th>
                  <th style={{ padding: '10px 14px' }}>Student Name</th>
                  <th style={{ padding: '10px 14px' }}>Registered Email</th>
                  <th style={{ padding: '10px 14px' }}>OTP Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--eum-maroon)' }}>
                      {s.rollNumber}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '600' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                      {s.email}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {s.otpVerified ? (
                        <span className="badge badge-success">Verified</span>
                      ) : (
                        <span className="badge badge-warning">Pending 1st Login</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleResetPassword(s._id, s.rollNumber)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                          title="Reset Password to Roll Number"
                        >
                          <KeyRound size={12} /> Reset Pass
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s._id, s.rollNumber)}
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.74rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                        >
                          <Trash2 size={12} />
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

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '12px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 'min(480px, 95vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              width: '100%',
              padding: '20px 18px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--eum-maroon)', margin: 0 }}>
                {editingStudent ? `Edit Student (${editingStudent.rollNumber})` : 'Add Single Student'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. COSC231122114"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Syed Asad Ali Raza Shah"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>
                  Registered Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="form-input"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem' }}>
                  <input
                    type="checkbox"
                    checked={otpVerified}
                    onChange={(e) => setOtpVerified(e.target.checked)}
                  />
                  <span>Pre-verify OTP (Student won't be prompted for email OTP on first login)</span>
                </label>
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
                  {actionLoading ? 'Saving...' : editingStudent ? 'Save Student' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
