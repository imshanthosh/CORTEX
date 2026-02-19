/**
 * ProtectedRoute — Guards authenticated routes.
 * Shows full-screen spinner while Firebase checks session.
 * Redirects to /login if unauthenticated.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Checking session...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
