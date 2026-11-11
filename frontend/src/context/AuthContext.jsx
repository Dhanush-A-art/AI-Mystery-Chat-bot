import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guestSessionId, setGuestSessionId] = useState(localStorage.getItem('mystery_guest_session_id') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on initial mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('mystery_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          console.warn('[Auth] Session expired or invalid:', err.message);
          localStorage.removeItem('mystery_token');
          setUser(null);
        }
      }

      // If no user and no guest session, automatically generate one for seamless exploration
      if (!token && !localStorage.getItem('mystery_guest_session_id')) {
        await initGuestSession();
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const initGuestSession = async () => {
    try {
      const res = await api.post('/auth/guest');
      if (res.success && res.data.guestSessionId) {
        localStorage.setItem('mystery_guest_session_id', res.data.guestSessionId);
        setGuestSessionId(res.data.guestSessionId);
        return res.data.guestSessionId;
      }
    } catch (err) {
      // Local fallback ID
      const fallbackId = 'guest_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('mystery_guest_session_id', fallbackId);
      setGuestSessionId(fallbackId);
      return fallbackId;
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('mystery_token', res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.success) {
      localStorage.setItem('mystery_token', res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('mystery_token');
    setUser(null);
    initGuestSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guestSessionId,
        isGuest: !user && !!guestSessionId,
        loading,
        login,
        register,
        logout,
        initGuestSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

