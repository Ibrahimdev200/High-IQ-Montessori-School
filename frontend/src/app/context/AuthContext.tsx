'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('hiq_token');
    const storedUser = localStorage.getItem('hiq_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Verify token with backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Session expired');
        }
        return res.json();
      })
      .then(data => {
        if (data.user) {
          const freshUser = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            avatar: data.user.avatar,
            phone: data.user.phone
          };
          setUser(freshUser);
          localStorage.setItem('hiq_user', JSON.stringify(freshUser));
        }
      })
      .catch(() => {
        // Token invalid, clear session
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('hiq_token', newToken);
    localStorage.setItem('hiq_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hiq_token');
    localStorage.removeItem('hiq_user');
    router.push('/portal/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
