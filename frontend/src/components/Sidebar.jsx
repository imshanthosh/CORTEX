/**
 * Sidebar — Desktop fixed (280px) + mobile slide-over with overlay.
 */
import { NavLink } from 'react-router-dom';

const NAV_SECTIONS = [
    {
        title: 'Overview',
        items: [
            { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
        ],
    },
    {
        title: 'AI Modules',
        items: [
            { path: '/aegis', label: 'Urban Fragility', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { path: '/marine', label: 'Marine Risk', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
            { path: '/cascade', label: 'Contamination Sim', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { path: '/aquahear', label: 'AquaHear', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
        ],
    },
    {
        title: 'Operations',
        items: [
            { path: '/alerts', label: 'Alerts Center', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            { path: '/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        ],
    },
];

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Panel — 280px on desktop */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-[280px] flex flex-col
          bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#0b1120]
          border-r border-slate-800/50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Brand header */}
                <NavLink
                    to="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-6 h-16 border-b border-slate-800/50 shrink-0 hover:bg-white/[0.02] transition-colors"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-base shadow-lg shadow-cyan-500/20 shrink-0">
                        💧
                    </div>
                    <div>
                        <span className="text-sm font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            AquaShield AI
                        </span>
                        <p className="text-[9px] text-slate-600 tracking-[0.15em] uppercase leading-none mt-0.5">
                            Predict • Protect • Include
                        </p>
                    </div>
                </NavLink>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-2 px-3">
                                {section.title}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
                      ${isActive
                                                ? 'bg-cyan-500/12 text-cyan-300 shadow-sm shadow-cyan-500/5'
                                                : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {/* Active indicator */}
                                                <div className={`w-0.5 h-5 rounded-full shrink-0 transition-colors ${isActive ? 'bg-cyan-400' : 'bg-transparent group-hover:bg-slate-700'}`} />
                                                <svg
                                                    className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                                </svg>
                                                <span className="truncate">{item.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* SDG footer */}
                <div className="px-4 py-4 border-t border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/10">
                        <span className="text-xl">🌍</span>
                        <div>
                            <p className="text-[9px] text-slate-600 font-medium leading-none">Aligned with</p>
                            <p className="text-[11px] text-cyan-400 font-semibold leading-tight mt-0.5">UN SDG 6 — Clean Water</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
