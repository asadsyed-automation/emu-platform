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

  const verifyStep1 = async (arg1, arg2, arg3) => {
    let role = null;
    let name = arg1;
    let password = arg2;
    if (arg3 !== undefined) {
      role = arg1;
      name = arg2;
      password = arg3;
    }
    const res = await API.post('/auth/verify-step1', { role, name, password });
    return res.data;
  };

  const verifyStep2Email = async (userId, email) => {
    const res = await API.post('/auth/verify-step2-email', { userId, email });
    return res.data;
  };

  const verifyStep3Otp = async (userId, otp) => {
    const res = await API.post('/auth/verify-step3-otp', { userId, otp });
    const { token: authToken, user: userData } = res.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('emu_token', authToken);
    localStorage.setItem('emu_user', JSON.stringify(userData));
    return res.data;
  };

  const login = async (identifier, password) => {
    const res = await API.post('/auth/login', {
      name: identifier,
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
        verifyStep1,
        verifyStep2Email,
        verifyStep3Otp,
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
