import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, name?: string, phone?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gurucraft_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, name?: string, phone?: string) => {
    const profile: UserProfile = {
      id: 'usr_' + Date.now(),
      name: name || email.split('@')[0],
      email,
      phone: phone || '',
      role: 'user', // Standard user registration/sign-in ALWAYS gets 'user' role
    };
    setUser(profile);
    localStorage.setItem('gurucraft_user', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gurucraft_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
