import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { OtpModal } from './components/OtpModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { Globe, LogIn } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, isOtpRequired, loading } = useAuth();
  const [viewMode, setViewMode] = useState('landing'); // 'landing' or 'app'

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--eum-maroon)',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        Loading EMU Platform...
      </div>
    );
  }

  // If user clicks "Log In to Portal" or is already authenticated
  if (viewMode === 'landing' && !isAuthenticated) {
    return <LandingPage onGoToApp={() => setViewMode('app')} />;
  }

  if (!isAuthenticated) {
    return (
      <div>
        {/* Banner to switch back to landing page */}
        <div style={{
          backgroundColor: 'var(--eum-green)',
          color: '#FFFFFF',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '0.82rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>Viewing EMU Login Portal.</span>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--eum-gold)',
              cursor: 'pointer',
              fontWeight: '700',
              textDecoration: 'underline'
            }}
          >
            ← View Landing Page
          </button>
        </div>
        <LoginPage />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Top Banner allowing logged in user to preview landing page */}
      <div className="no-print" style={{
        backgroundColor: 'var(--bg-main)',
        borderBottom: '1px solid var(--border-color)',
        padding: '6px 20px',
        fontSize: '0.78rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>EMU Portal Active Session</span>
        <button
          onClick={() => setViewMode('landing')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--eum-maroon)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Globe size={14} /> Preview Marketing Landing Page
        </button>
      </div>

      <main style={{ flex: 1 }}>
        <DashboardPage />
      </main>
      {isOtpRequired && <OtpModal />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
