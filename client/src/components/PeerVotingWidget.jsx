import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Vote, Check, X, ShieldCheck, AlertCircle } from 'lucide-react';

export const PeerVotingWidget = () => {
  const [ballots, setBallots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingMap, setVotingMap] = useState({});
  const [msgMap, setMsgMap] = useState({});

  const fetchBallots = async () => {
    try {
      const res = await API.get('/disputes/peer-ballots');
      setBallots(res.data.ballots || []);
    } catch (err) {
      console.error('Error fetching peer ballots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBallots();
  }, []);

  const handleVote = async (disputeId, vote) => {
    setVotingMap((prev) => ({ ...prev, [disputeId]: true }));
    try {
      const res = await API.post(`/disputes/vote/${disputeId}`, { vote });
      setMsgMap((prev) => ({ ...prev, [disputeId]: res.data.message || 'Vote cast!' }));
      setTimeout(() => fetchBallots(), 1500);
    } catch (err) {
      setMsgMap((prev) => ({ ...prev, [disputeId]: err.response?.data?.message || 'Vote error' }));
    } finally {
      setVotingMap((prev) => ({ ...prev, [disputeId]: false }));
    }
  };

  if (loading) return null;
  if (ballots.length === 0) return null; // Hide if no active ballots

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      borderLeft: '5px solid var(--eum-gold)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <Vote style={{ color: 'var(--eum-gold)' }} size={22} />
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--eum-maroon)' }}>Peer Validation Ballots Requiring Your Vote</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            You were selected as a trusted peer (high attendance standing) to validate peer attendance disputes.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
        {ballots.map((b) => (
          <div
            key={b._id}
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--eum-maroon)' }}>
                {b.studentId?.name} ({b.studentId?.rollNumber})
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {b.courseId?.code}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
              Lecture Date: <strong>{new Date(b.lectureId?.date).toDateString()}</strong>
            </div>

            <div style={{
              fontSize: '0.82rem',
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              backgroundColor: '#FFFFFF',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '12px',
              border: '1px solid var(--border-color)'
            }}>
              "{b.reason}"
            </div>

            {msgMap[b._id] ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--eum-green)', fontWeight: '600', textAlign: 'center' }}>
                {msgMap[b._id]}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleVote(b._id, 'yes')}
                  disabled={votingMap[b._id]}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '6px', fontSize: '0.82rem' }}
                >
                  <Check size={14} /> Confirm Present
                </button>
                <button
                  onClick={() => handleVote(b._id, 'no')}
                  disabled={votingMap[b._id]}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '6px', fontSize: '0.82rem', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                >
                  <X size={14} /> Was Absent
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
