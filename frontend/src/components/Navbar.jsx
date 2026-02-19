/**
 * Navbar — Top bar with Home button, page title, status, and profile dropdown.
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PAGE_TITLES = {
    '/dashboard': 'Command Center',
    '/aegis': 'AEGIS — Urban Fragility Monitor',
    '/marine': 'Marine Risk Monitor',
    '/cascade': 'Contamination Simulator',
    '/aquahear': 'AquaHear — Voice Alerts',
    '/alerts': 'Alerts Center',
    '/reports': 'Reports',
};

export default function Navbar({ onMenuToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const pageTitle = PAGE_TITLES[location.pathname] || 'AquaShield AI';
    const isHome = location.pathname === '/dashboard';

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate('/');
    };

    const initials = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || '?';

    return (
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-6 bg-[#0b1120]/85 backdrop-blur-xl border-b border-slate-800/50">
            {/* Left group */}
            <div className="flex items-center gap-2">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Home button — always visible, highlighted when NOT on dashboard */}
                {!isHome && (
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        title="Back to Dashboard"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                        </svg>
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                )}

                {/* Divider */}
                {!isHome && <div className="w-px h-5 bg-slate-800 hidden sm:block" />}

                {/* Page title */}
                <h1 className="text-sm lg:text-base font-semibold text-white truncate">{pageTitle}</h1>
            </div>

            {/* Right group */}
            <div className="flex items-center gap-2.5">
                {/* Status indicator */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium tracking-wide">Online</span>
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
                            {initials}
                        </div>
                        <span className="hidden md:block text-sm text-slate-300 max-w-[100px] truncate">
                            {user?.displayName || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <svg className={`hidden md:block w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1e293b] border border-slate-700 shadow-2xl shadow-black/60 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-slate-700/60">
                                <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                            <div className="py-1">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setDropdownOpen(false)}
                                    className="w-full px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-2.5"
                                >
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                                    </svg>
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
