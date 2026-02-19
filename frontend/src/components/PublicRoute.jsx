/**
 * PublicRoute — Redirects logged-in users away from login/register.
 * Sends authenticated users to /dashboard.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a]">
                <div className="w-10 h-10 border-3 border-gray-700 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
