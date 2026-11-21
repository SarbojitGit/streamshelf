import { useState, type ReactNode } from 'react';
import { api } from './api';
import { AuthContext } from './auth-context';

interface TokenResponse {
  accessToken: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  );
  const [email, setEmail] = useState<string | null>(() =>
    localStorage.getItem('email'),
  );

  const save = (newToken: string, newEmail: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('email', newEmail);
    setToken(newToken);
    setEmail(newEmail);
  };

  const login = async (emailInput: string, password: string) => {
    const res = await api<TokenResponse>('/auth/login', {
      method: 'POST',
      body: { email: emailInput, password },
    });
    save(res.accessToken, emailInput);
  };

  const register = async (emailInput: string, password: string) => {
    const res = await api<TokenResponse>('/auth/register', {
      method: 'POST',
      body: { email: emailInput, password },
    });
    save(res.accessToken, emailInput);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}