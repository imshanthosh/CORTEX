/**
 * Reports Page — Analysis History & Export
 * Shows user-specific reports and historical analyses.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PRODUCT_COLORS = {
    AEGIS: { text: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20' },
    Marine: { text: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20' },
    AquaCascade: { text: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/20' },
    AquaHear: { text: 'text-pink-400', badge: 'bg-pink-500/10 border-pink-500/20' },
};

export default function Reports() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const res = await axios.get('/api/user/history', { params: { userId: user.uid } });
                setHistory(res.data.history || []);
            } catch (err) {
                console.error('Failed to fetch history:', err);
            }
            setLoading(false);
        };
        fetchHistory();
    }, [user]);

    const filtered = filter === 'all' ? history : history.filter(r => r.product === filter);

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reports</h1>
                    <p className="text-sm text-slate-500 mt-1">Historical analyses and export capabilities</p>
                </div>
                <button className="btn-secondary px-5 py-2.5 text-sm" onClick={() => alert('CSV Export coming soon!')}>
                    📥 Export All (CSV)
                </button>
            </div>

            {/* ── Trend Summary Cards ──────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { label: 'Total Analyses', value: history.length, color: 'gradient-text', icon: '📊' },
                    { label: 'Critical Events', value: history.filter(h => h.summary?.toLowerCase().includes('critical') || h.summary?.toLowerCase().includes('distress')).length, color: 'text-red-400', icon: '🚨' },
                    { label: 'Active Coverage', value: '100%', color: 'text-cyan-400', icon: '🛡️' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-6 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                    >
                        <span className="text-3xl">{s.icon}</span>
                        <p className={`text-5xl font-bold mt-3 ${s.color}`}>{s.value}</p>
                        <p className="text-sm text-gray-500 mt-2 font-medium">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Filter Bar ───────────────────────────────────────── */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 px-5 py-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 font-medium mr-1">Module:</span>
                    {['all', 'AEGIS', 'Marine', 'AquaCascade', 'AquaHear'].map(p => (
                        <button
                            key={p}
                            onClick={() => setFilter(p)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === p
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'text-gray-400 hover:text-white bg-white/[0.02] border border-transparent hover:border-slate-700'
                                }`}
                        >
                            {p === 'all' ? 'All Modules' : p}
                        </button>
                    ))}
                    <span className="ml-auto text-xs text-slate-600">{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* ── Reports Table ────────────────────────────────────── */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/60">
                    <h2 className="text-sm font-semibold text-white">Analysis History</h2>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">⏳ Loading analysis history...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No analyses found. Run a scan/simulation to see results here.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500 border-b border-slate-800/60 bg-slate-900/30">
                                    <th className="px-6 py-4 font-medium">Module</th>
                                    <th className="px-6 py-4 font-medium">Analysis Type</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Summary</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((report, i) => {
                                    const pc = PRODUCT_COLORS[report.product] || { text: 'text-gray-400', badge: 'bg-gray-500/10 border-gray-500/20' };
                                    return (
                                        <motion.tr
                                            key={report.id}
                                            className="border-b border-slate-800/40 hover:bg-white/[0.02] transition-colors"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                        >
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${pc.badge} ${pc.text}`}>
                                                    {report.product}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">{report.analysisType}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-mono">{new Date(report.timestamp).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-slate-400 text-xs max-w-xs">
                                                <span className="line-clamp-2">{report.summary}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors mr-4"
                                                >
                                                    View
                                                </button>
                                                <button className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors">Export</button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── Report Modal ─────────────────────────────────────── */}
            <AnimatePresence>
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setSelectedReport(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedReport.product} Report</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">{selectedReport.analysisType} • {new Date(selectedReport.timestamp).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                <section>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Analysis Summary</h3>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-slate-800/60 text-slate-300 leading-relaxed">
                                        {selectedReport.summary}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Detailed Data</h3>
                                    <pre className="p-4 rounded-2xl bg-black/40 border border-slate-800/60 text-[11px] text-cyan-500/80 font-mono overflow-x-auto whitespace-pre-wrap">
                                        {JSON.stringify(selectedReport.data, null, 2)}
                                    </pre>
                                </section> section>
                            </div>

                            <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                                <button onClick={() => setSelectedReport(null)} className="btn-secondary px-6">Close</button>
                                <button className="btn-primary px-6">Download Full Data (JSON)</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
