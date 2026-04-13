import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — authentication hook.
 * Now uses the central AuthContext to ensure session persistence across components.
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

