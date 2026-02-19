/**
 * Dashboard — Central Risk Command Center
 * Risk summary, live alerts, module quick-access, SDG Impact Panel.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const moduleCards = [
    { path: '/aegis', title: 'AEGIS', subtitle: 'Urban Fragility Monitor', icon: '🏙️', gradient: 'from-cyan-500 to-blue-600' },
    { path: '/marine', title: 'Marine Risk', subtitle: 'Oil Spill Detection', icon: '🚢', gradient: 'from-blue-500 to-purple-600' },
    { path: '/cascade', title: 'AquaCascade', subtitle: 'Contamination Simulator', icon: '🌊', gradient: 'from-purple-500 to-pink-600' },
    { path: '/aquahear', title: 'AquaHear', subtitle: 'Voice Alerts', icon: '🔊', gradient: 'from-emerald-500 to-cyan-600' },
];

const sdgMetrics = [
    { label: 'People Protected', value: '2.4M+', icon: '👥' },
    { label: 'Water Sources Secured', value: '847', icon: '💧' },
    { label: 'Incidents Prevented', value: '156', icon: '🛡️' },
];

export default function Dashboard() {
    const [alerts, setAlerts] = useState([]);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        setAlerts([
            { id: 1, severity: 'critical', product: 'AEGIS', message: 'Zone 2 fragility score exceeded critical threshold (85.3)', time: '2 min ago' },
            { id: 2, severity: 'warning', product: 'Marine', message: 'Vessel MV Sagarmala showing anomalous speed drop near coast', time: '5 min ago' },
            { id: 3, severity: 'warning', product: 'AquaCascade', message: 'Simulated contamination reaching treatment plant in 8 hours', time: '12 min ago' },
            { id: 4, severity: 'info', product: 'AEGIS', message: 'Tanker dispatch optimized for Zone 3 — Route updated', time: '18 min ago' },
            { id: 5, severity: 'info', product: 'Marine', message: 'All vessels in sector B operating normally', time: '25 min ago' },
        ]);
        return () => clearInterval(timer);
    }, []);

    const getAlertStyles = (severity) => {
        switch (severity) {
            case 'critical': return { bg: 'bg-red-500/10 border-red-500/30', dot: 'bg-red-500', text: 'text-red-400', label: 'CRITICAL' };
            case 'warning': return { bg: 'bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-500', text: 'text-yellow-400', label: 'WARNING' };
            default: return { bg: 'bg-cyan-500/10 border-cyan-500/30', dot: 'bg-cyan-500', text: 'text-cyan-400', label: 'INFO' };
        }
    };

    return (
        <div className="space-y-6">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Real-time risk monitoring across all modules</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium">All Systems Online</span>
                    </div>
                    <span className="text-xs text-gray-600 font-mono">{time.toLocaleTimeString()}</span>
                </div>
            </div>

            {/* ── Risk Summary Cards ───────────────────────────────── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Overall Risk', value: 'MODERATE', color: 'text-yellow-400', sub: '1 critical, 2 warnings' },
                    { label: 'Active Alerts', value: '3', color: 'text-red-400', sub: 'Across all modules' },
                    { label: 'Zones Monitored', value: '5', color: 'text-cyan-400', sub: 'Urban water network' },
                    { label: 'Vessels Tracked', value: '8', color: 'text-blue-400', sub: 'AIS monitoring' },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 px-5 py-4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.4 }}
                    >
                        <p className="text-xs text-gray-500 mb-1.5 font-medium">{card.label}</p>
                        <p className={`text-2xl xl:text-3xl font-bold leading-none ${card.color}`}>{card.value}</p>
                        <p className="text-[11px] text-gray-600 mt-2">{card.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Main Content Grid ────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Live Alerts Feed — spans 2 cols on large screens */}
                <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                    <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-800/60">
                        <h2 className="text-sm font-semibold text-white">Live Alerts</h2>
                        <Link to="/alerts" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                            View All →
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                        {alerts.map((alert, i) => {
                            const s = getAlertStyles(alert.severity);
                            return (
                                <motion.div
                                    key={alert.id}
                                    className={`flex items-start gap-3 p-3.5 rounded-xl border ${s.bg}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.08 }}
                                >
                                    <span className={`w-2 h-2 rounded-full ${s.dot} mt-1.5 shrink-0 ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold tracking-wider ${s.text}`}>{s.label}</span>
                                            <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded bg-slate-800/80 font-medium">{alert.product}</span>
                                            <span className="text-[10px] text-gray-600 ml-auto">{alert.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-snug">{alert.message}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Module Quick Access — 1 col */}
                <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                    <div className="px-5 pt-5 pb-4 border-b border-slate-800/60">
                        <h2 className="text-sm font-semibold text-white">Quick Access</h2>
                    </div>
                    <div className="flex-1 p-4 space-y-2.5">
                        {moduleCards.map((mod, i) => (
                            <motion.div
                                key={mod.path}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + i * 0.08 }}
                            >
                                <Link
                                    to={mod.path}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 hover:bg-slate-800/70 transition-all group no-underline"
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.gradient} flex items-center justify-center text-lg shrink-0 shadow-sm`}>
                                        {mod.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">{mod.title}</p>
                                        <p className="text-[11px] text-gray-500 truncate">{mod.subtitle}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── SDG Impact Panel ─────────────────────────────────── */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/60">
                    <span className="text-xl">🌍</span>
                    <div>
                        <h2 className="text-sm font-semibold text-white">SDG 6 Impact Panel</h2>
                        <p className="text-[11px] text-gray-500">Estimated platform impact on clean water &amp; sanitation</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/60">
                    {sdgMetrics.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            className="flex flex-col items-center justify-center py-8 px-6 text-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.08 }}
                        >
                            <span className="text-3xl mb-2">{metric.icon}</span>
                            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{metric.value}</p>
                            <p className="text-xs text-gray-500 mt-1.5 font-medium">{metric.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
