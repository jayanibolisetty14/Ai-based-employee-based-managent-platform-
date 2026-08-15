import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  authMode: 'demo' | 'user' | null;
  user: { name: string; email: string; createdAt?: string } | null;
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  demoLogin: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (updates: Partial<{ name: string; email: string }>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    authMode: null,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage and session storage
    const localSession = localStorage.getItem('mood-mentor-auth');
    const tempSession = sessionStorage.getItem('mood-mentor-auth');
    
    if (localSession) {
      setAuthState(JSON.parse(localSession));
    } else if (tempSession) {
      setAuthState(JSON.parse(tempSession));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Missing fields'));
          return;
        }
        
        if (!email.includes('@')) {
          reject(new Error('Invalid email'));
          return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const accounts = JSON.parse(localStorage.getItem('mood-mentor-accounts') || '[]');
        const existing = accounts.find((a: any) => a.email.toLowerCase() === normalizedEmail);
        
        const createdAt = existing?.createdAt || new Date().toISOString();
        const name = existing ? existing.name : normalizedEmail.split('@')[0];

        if (!existing) {
          accounts.push({ name, email: normalizedEmail, password, createdAt });
          localStorage.setItem('mood-mentor-accounts', JSON.stringify(accounts));
        }
        
        const newState = {
          isAuthenticated: true,
          authMode: 'user' as const,
          user: { name, email: normalizedEmail, createdAt },
        };
        
        setAuthState(newState);
        
        if (remember) {
          localStorage.setItem('mood-mentor-auth', JSON.stringify(newState));
        } else {
          sessionStorage.setItem('mood-mentor-auth', JSON.stringify(newState));
        }
        resolve();
      }, 800);
    });
  };

  const demoLogin = () => {
    const newState = {
      isAuthenticated: true,
      authMode: 'demo' as const,
      user: { name: 'Demo User', email: 'demo@moodmentor.ai', createdAt: new Date().toISOString() },
    };
    setAuthState(newState);
    localStorage.setItem('mood-mentor-auth', JSON.stringify(newState));
  };

  const register = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error('Missing fields'));
          return;
        }
        if (!email.includes('@')) {
          reject(new Error('Invalid email'));
          return;
        }
        
        const normalizedEmail = email.trim().toLowerCase();
        const accounts = JSON.parse(localStorage.getItem('mood-mentor-accounts') || '[]');
        if (accounts.some((a: any) => a.email.toLowerCase() === normalizedEmail)) {
          reject(new Error('Email already exists'));
          return;
        }
        
        const createdAt = new Date().toISOString();
        accounts.push({ name, email: normalizedEmail, password, createdAt });
        localStorage.setItem('mood-mentor-accounts', JSON.stringify(accounts));
        
        const newState = {
          isAuthenticated: true,
          authMode: 'user' as const,
          user: { name, email: normalizedEmail, createdAt },
        };
        
        setAuthState(newState);
        localStorage.setItem('mood-mentor-auth', JSON.stringify(newState));
        resolve();
      }, 800);
    });
  };

  const updateUser = (updates: Partial<{ name: string; email: string }>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates };
      const newState = { ...prev, user: updatedUser };

      if (localStorage.getItem('mood-mentor-auth')) {
        localStorage.setItem('mood-mentor-auth', JSON.stringify(newState));
      } else if (sessionStorage.getItem('mood-mentor-auth')) {
        sessionStorage.setItem('mood-mentor-auth', JSON.stringify(newState));
      }

      const accounts = JSON.parse(localStorage.getItem('mood-mentor-accounts') || '[]');
      const updatedAccounts = accounts.map((a: any) => 
        a.email.toLowerCase() === updatedUser.email.toLowerCase() ? { ...a, name: updatedUser.name } : a
      );
      localStorage.setItem('mood-mentor-accounts', JSON.stringify(updatedAccounts));

      return newState;
    });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, authMode: null, user: null });
    localStorage.removeItem('mood-mentor-auth');
    sessionStorage.removeItem('mood-mentor-auth');
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, demoLogin, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
