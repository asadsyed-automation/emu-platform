import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { OtpModal } from './components/OtpModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { Globe, LogIn } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, isOtpRequired, loading } = useAuth();
  const [viewMode, setViewMode] = useState('landing'); // 'landing' or 'app'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onGoToApp={() => setViewMode('app')}
        isLoggedIn={isAuthenticated}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage onBackToLanding={() => setViewMode('landing')} />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onGoHome={() => setViewMode('landing')}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />
      
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
        <DashboardPage
          mobileSidebarOpen={mobileSidebarOpen}
          onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
        />
      </main>
      {isOtpRequired && <OtpModal />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

