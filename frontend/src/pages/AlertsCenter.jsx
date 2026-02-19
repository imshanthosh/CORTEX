/**
 * Alerts Center — Unified Alert Feed
 * Chronological alerts from all modules with filtering.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_ALERTS = [
    { id: 1, severity: 'critical', product: 'AEGIS', message: 'Zone 2 fragility score exceeded critical threshold (85.3)', time: Date.now() - 120000, details: 'Immediate tanker dispatch recommended' },
    { id: 2, severity: 'critical', product: 'Marine', message: 'Vessel MV Sagarmala in DISTRESS — Possible oil leakage detected', time: Date.now() - 300000, details: 'Coast Guard notification sent' },
    { id: 3, severity: 'warning', product: 'AquaCascade', message: 'Simulated contamination reaching Bhandup Treatment Plant in 8 hours', time: Date.now() - 720000, details: 'Based on Oil Spill simulation' },
    { id: 4, severity: 'warning', product: 'AEGIS', message: 'Zone 3 entering warning state. Score: 58.7', time: Date.now() - 900000, details: 'Monitoring recommended' },
    { id: 5, severity: 'warning', product: 'Marine', message: 'Vessel FV Matsya showing anomalous course deviation (67°)', time: Date.now() - 1200000, details: 'Monitoring vessel closely' },
    { id: 6, severity: 'info', product: 'AEGIS', message: 'Tanker dispatch optimized — Route Zone 0 → Zone 2 confirmed', time: Date.now() - 1800000, details: 'Shortest path algorithm applied' },
    { id: 7, severity: 'info', product: 'Marine', message: 'Sector A scan complete — All vessels operating normally', time: Date.now() - 2400000, details: '5 vessels scanned' },
    { id: 8, severity: 'info', product: 'AquaCascade', message: 'Propagation simulation completed for sewage overflow scenario', time: Date.now() - 3600000, details: 'Max area: 2.3 km²' },
    { id: 9, severity: 'critical', product: 'AEGIS', message: 'Emergency condition: Power failure affecting Zone 1 (Score: 82.1)', time: Date.now() - 5400000, details: 'Backup pumps activation recommended' },
    { id: 10, severity: 'warning', product: 'AquaCascade', message: 'Industrial discharge detected upstream of Panjrapur Intake', time: Date.now() - 7200000, details: 'Contamination ETA: 14 hours' },
];

const SEVERITY_STYLES = {
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500', text: 'text-red-400', badge: 'bg-red-500/15 text-red-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-500/15 text-yellow-400' },
    info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', dot: 'bg-cyan-500', text: 'text-cyan-400', badge: 'bg-cyan-500/15 text-cyan-400' },
};

export default function AlertsCenter() {
    const [alerts] = useState(MOCK_ALERTS);
    const [filter, setFilter] = useState('all');

    const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => filter === 'critical' || filter === 'warning' || filter === 'info' ? a.severity === filter : a.product === filter);

    const formatTime = (ts) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return new Date(ts).toLocaleDateString();
    };

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;
    const infoCount = alerts.filter(a => a.severity === 'info').length;

    const FILTERS = [
        { key: 'all', label: 'All Modules' },
        { key: 'critical', label: 'Critical' },
        { key: 'warning', label: 'Warning' },
        { key: 'AEGIS', label: 'AEGIS' },
        { key: 'Marine', label: 'Marine' },
        { key: 'AquaCascade', label: 'AquaCascade' },
    ];

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="pb-6 border-b border-slate-800/60">
                <h1 className="text-2xl font-bold text-white">Alerts Center</h1>
                <p className="text-sm text-slate-500 mt-1">Unified real-time alert feed from all monitoring modules</p>
            </div>

            {/* ── Summary Cards ────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-5">
                {[
                    { label: 'Critical', count: criticalCount, color: 'text-red-400', dot: 'bg-red-500', bg: 'bg-red-500/5 border-red-500/15' },
                    { label: 'Warnings', count: warningCount, color: 'text-yellow-400', dot: 'bg-yellow-500', bg: 'bg-yellow-500/5 border-yellow-500/15' },
                    { label: 'Info', count: infoCount, color: 'text-cyan-400', dot: 'bg-cyan-500', bg: 'bg-cyan-500/5 border-cyan-500/15' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        className={`rounded-2xl border p-6 text-center ${s.bg}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${s.dot} ${s.label === 'Critical' ? 'animate-pulse' : ''}`} />
                            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                        </div>
                        <p className={`text-4xl font-bold ${s.color}`}>{s.count}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Filters ──────────────────────────────────────────── */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 px-5 py-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 font-medium mr-1">Filter:</span>
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f.key
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'text-gray-400 hover:text-white bg-white/[0.02] border border-transparent hover:border-slate-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                    <span className="ml-auto text-xs text-slate-600">{filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* ── Alert Feed ───────────────────────────────────────── */}
            <div className="space-y-3">
                {filteredAlerts.map((alert, i) => {
                    const s = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
                    return (
                        <motion.div
                            key={alert.id}
                            className={`${s.bg} border ${s.border} rounded-2xl p-5`}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <div className="flex items-start gap-4">
                                <span className={`w-3 h-3 rounded-full mt-0.5 shrink-0 ${s.dot} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`text-xs font-bold uppercase tracking-wide ${s.text}`}>{alert.severity}</span>
                                        <span className="text-[11px] text-gray-500 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">{alert.product}</span>
                                        <span className="text-[11px] text-gray-600 ml-auto">{formatTime(alert.time)}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 leading-relaxed">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-1.5">{alert.details}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
