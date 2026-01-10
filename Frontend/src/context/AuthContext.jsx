import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(data || null);
      } catch {
        setUser(null);
      }
    }
  }, []);
  const login = ({ token, role, name, email }) => {
    localStorage.setItem('token', token);
    const data = { role, name, email };
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };
  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
