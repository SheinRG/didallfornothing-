import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-r-2 border-[#E8563B] rounded-full animate-spin"></div>
          <div className="text-white text-xs tracking-widest font-bold uppercase opacity-50">
            Verifying Session...
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

