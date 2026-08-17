import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { DisputeModal } from './DisputeModal';
import { PeerVotingWidget } from './PeerVotingWidget';
import {
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const StudentDisputesView = () => {
  const { user } = useAuth();
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [selectedLectureForDispute, setSelectedLectureForDispute] = useState(null);
  const [recentLectures, setRecentLectures] = useState([]);
  const [disputesList, setDisputesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load lectures student was marked absent for raising disputes
  const fetchAbsentLectures = async () => {
    try {
      const res = await API.get('/attendance/student/my-summary');
      // Look for absent records
      const absentLectures = [];
      const summaries = res.data.coursesSummary || [];
      for (const summary of summaries) {
        for (const record of summary.records || []) {
          if (record.status === 'absent' && record.lectureId) {
            absentLectures.push({
              _id: record.lectureId._id || record.lectureId,
              date: record.lectureId.date || new Date(),
              courseCode: summary.courseCode,
              courseTitle: summary.courseTitle,
            });
          }
        }
      }
      setRecentLectures(absentLectures);
    } catch (err) {
      console.error('Error loading absent lectures:', err);
    }
  };

  useEffect(() => {
    fetchAbsentLectures();
  }, [user]);

  // Demo active disputes if none from server yet
  const displayDisputes = disputesList.length > 0 ? disputesList : [
    {
      id: 'disp-demo-1',
      courseCode: 'COSE-4149',
      courseTitle: 'Cloud Computing',
      lectureDate: '2026-08-14',
      status: 'peer-voting',
      reason: 'I was present in the second row during the Kubernetes demo. System marked absent.',
      peerVotes: { yes: 2, no: 0, required: 3 },
      createdAt: '2026-08-14T15:30:00Z',
    },
    {
      id: 'disp-demo-2',
      courseCode: 'COSE-3133',
      courseTitle: 'HCI & Computer Graphics',
      lectureDate: '2026-08-12',
      status: 'approved',
      reason: 'Joined class at 12:35 during lab setup. Teacher reviewed attendance log.',
      peerVotes: { yes: 3, no: 0, required: 3 },
      teacherDecision: 'Approved by Ms. Samia Nasir — Attendance record updated to Present.',
      createdAt: '2026-08-12T13:00:00Z',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(122, 31, 31, 0.1)',
              color: 'var(--eum-maroon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--eum-maroon)', marginBottom: '2px' }}>
              My Attendance Disputes & Peer Voting
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Raise 24-hour attendance correction claims with algorithmic 3-peer verification before teacher escalation.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (recentLectures.length > 0) {
              setSelectedLectureForDispute(recentLectures[0]);
              setShowRaiseModal(true);
            } else {
              // Create demo dispute trigger
              setSelectedLectureForDispute({
                _id: 'demo-lecture-id',
                date: new Date().toISOString(),
                courseCode: 'COSE-4149',
                courseTitle: 'Cloud Computing',
              });
              setShowRaiseModal(true);
            }
          }}
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.88rem' }}
        >
          <PlusCircle size={16} /> Raise New Dispute
        </button>
      </div>

      {/* Peer Validation Widget for Student peer duties */}
      <PeerVotingWidget />

      {/* Disputes History List */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>
            Track Your Submitted Disputes
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {displayDisputes.length} Registered Claims
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {displayDisputes.map((d) => (
            <div
              key={d.id}
              className="card-hover animate-fade-in-up"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      backgroundColor: 'var(--eum-maroon)',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {d.courseCode}
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                    {d.courseTitle}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                    <Calendar size={12} /> Lecture Date: {d.lectureDate}
                  </span>
                </div>

                <div>
                  {d.status === 'peer-voting' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        backgroundColor: 'var(--status-warning-bg)',
                        color: 'var(--status-warning)',
                        padding: '4px 10px',
                        borderRadius: '16px',
                      }}
                    >
                      <Clock size={12} /> Peer Voting in Progress ({d.peerVotes?.yes || 0}/3 Votes)
                    </span>
                  )}

                  {d.status === 'approved' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        backgroundColor: 'var(--status-success-bg)',
                        color: 'var(--status-success)',
                        padding: '4px 10px',
                        borderRadius: '16px',
                      }}
                    >
                      <CheckCircle2 size={12} /> Resolved & Attendance Corrected
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-main)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  color: 'var(--text-dark)',
                  lineHeight: 1.5,
                  marginBottom: '10px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Student Statement:
                </div>
                {d.reason}
              </div>

              {d.teacherDecision && (
                <div
                  style={{
                    backgroundColor: 'var(--status-success-bg)',
                    color: 'var(--status-success)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>{d.teacherDecision}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dispute Modal */}
      {showRaiseModal && selectedLectureForDispute && (
        <DisputeModal
          lecture={selectedLectureForDispute}
          onClose={() => setShowRaiseModal(false)}
          onSubmitted={() => {
            setShowRaiseModal(false);
            fetchAbsentLectures();
          }}
        />
      )}
    </div>
  );
};
