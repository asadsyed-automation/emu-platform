import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('emu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('emu_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('emu_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await API.post('/auth/login', {
      rollNumber: identifier,
      password,
    });

    const { token: authToken, user: userData } = res.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('emu_token', authToken);
    localStorage.setItem('emu_user', JSON.stringify(userData));

    return res.data;
  };

  const verifyOtp = async (otp) => {
    const res = await API.post('/auth/verify-otp', { otp });
    if (res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('emu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const resendOtp = async () => {
    const res = await API.post('/auth/send-otp');
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('emu_token');
    localStorage.removeItem('emu_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        verifyOtp,
        resendOtp,
        logout,
        isAuthenticated: !!user && !!token,
        isOtpRequired: !!user && !user.otpVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
