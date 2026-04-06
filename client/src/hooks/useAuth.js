import { useState, useCallback } from 'react';

/**
 * useAuth — authentication hook.
 * Returns mock responses until wired to real backend.
 */
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with fetch('/api/auth/login', { method: 'POST', ... })
      await new Promise((r) => setTimeout(r, 500)); // simulate network
      const mockUser = { id: 'mock_user_id', name: 'Demo User', email };
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      setError('Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with fetch('/api/auth/register', { method: 'POST', ... })
      await new Promise((r) => setTimeout(r, 500));
      const mockUser = { id: 'mock_user_id', name, email };
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      setError('Registration failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // TODO: Replace with fetch('/api/auth/logout', { method: 'POST' })
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout };
}

// Ready for: wiring to real /api/auth endpoints
