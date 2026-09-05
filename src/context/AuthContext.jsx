import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'token';
const MOBILE_KEY = 'mobile';
const USER_KEY = 'user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [mobileNumber, setMobileNumber] = useState(() => localStorage.getItem(MOBILE_KEY) || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
     token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); 
    }, [token]);

  useEffect(() => {
     if (mobileNumber) localStorage.setItem(MOBILE_KEY, mobileNumber); 
    }, [mobileNumber]);

  useEffect(() => {
     user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY);
     }, [user]);

  // profile = res.data.data from POST /validateOTP: { token, user_id, user_name, roles }
  const login = (profile, mobile) => {
    setToken(profile.token);
    setUser({ userId: profile.user_id, userName: profile.user_name, roles: profile.roles || [] });
    setMobileNumber(mobile);
  };

  const logout = () => {
    setToken(null); 
    setUser(null); 
    setMobileNumber('');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MOBILE_KEY); 
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(() => ({
    token, mobileNumber, user,
    userId: user?.userId || mobileNumber,
    userName: user?.userName || '',
    isAuthenticated: Boolean(token),
    login, 
    logout,
  }), [token, mobileNumber, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}