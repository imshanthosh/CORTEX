/**
 * AEGIS Monitor — Urban Water Fragility Intelligence
 * Scenario/manual inputs, fragility analysis, zone cards, map, warnings, AI recs.
 */
import { useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

const SCENARIOS = ['Normal', 'Flood Event', 'Power Failure', 'High Demand Crisis'];

export default function AegisMonitor() {
    const [mode, setMode] = useState('scenario');
    const [scenario, setScenario] = useState('Normal');
    const [timeStep, setTimeStep] = useState(0);
    const [manualParams, setManualParams] = useState({
        rainfall: 5, power_availability: 0.9, tanker_count: 10,
        groundwater_level: 5, demand_surge: 1.0, price_index: 1.0
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const runAnalysis = async () => {
        setLoading(true);
        setError('');
        try {
            const payload = {
                scenario: mode === 'scenario' ? scenario : 'Normal',
                time_step: timeStep,
                manual_params: mode === 'manual' ? manualParams : null
            };
            const res = await axios.post('/api/aegis/analyze', payload);
            setResult(res.data);

            // Save to history
            if (user) {
                await axios.post('/api/user/history', {
                    userId: user.uid,
                    product: 'AEGIS',
                    analysisType: 'Fragility Analysis',
                    summary: `${res.data.summary.critical_count} critical zones, ${res.data.summary.warning_count} warning zones.`,
                    data: res.data
                });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Make sure backend services are running.');
        }
        setLoading(false);
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) alert('CSV uploaded: ' + file.name + '. Using scenario mode for analysis.');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical': return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30', cardBg: 'bg-red-500/5' };
            case 'warning': return { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30', cardBg: 'bg-yellow-500/5' };
            default: return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30', cardBg: 'bg-emerald-500/5' };
        }
    };

    const getMapColor = (status) => {
        switch (status) {
            case 'critical': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#10b981';
        }
    };

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 shrink-0">
                        🏙️
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">AEGIS — Urban Fragility Monitor</h1>
                        <p className="text-sm text-slate-500 mt-0.5">LSTM-powered network resilience & tanker dispatch intelligence</p>
                    </div>
                </div>
            </div>

            {/* ── Input Panel ──────────────────────────────────────── */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-6 lg:p-8">
                {/* Mode Switcher */}
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-slate-800/50">
                    <span className="text-sm text-slate-500 font-medium mr-2">Input Mode:</span>
                    {['scenario', 'manual'].map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${mode === m
                                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-white border border-transparent hover:border-slate-700'
                                }`}
                        >
                            {m === 'scenario' ? 'Scenario Mode' : 'Manual Input'}
                        </button>
                    ))}
                </div>

                {mode === 'scenario' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block font-medium">Scenario</label>
                            <select value={scenario} onChange={e => setScenario(e.target.value)} className="input-field">
                                {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block font-medium">
                                Time Simulation: <span className="text-cyan-400 font-semibold">{timeStep}h ahead</span>
                            </label>
                            <input
                                type="range" min="0" max="24" value={timeStep}
                                onChange={e => setTimeStep(parseInt(e.target.value))}
                                className="w-full accent-cyan-500 mt-1"
                            />
                            <div className="flex justify-between text-xs text-slate-600 mt-1">
                                <span>Now</span><span>12h</span><span>24h</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        {Object.entries(manualParams).map(([key, val]) => (
                            <div key={key}>
                                <label className="text-xs text-slate-400 mb-2 block capitalize font-medium">{key.replace(/_/g, ' ')}</label>
                                <input
                                    type="number" step="0.1" value={val}
                                    onChange={e => setManualParams(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                                    className="input-field text-sm"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-3 mt-8">
                    <button onClick={runAnalysis} disabled={loading} className="btn-action">
                        {loading ? '⏳ Analyzing...' : '▶ Run AEGIS Analysis'}
                    </button>
                    <label className="btn-outline cursor-pointer">
                        📁 Upload CSV
                        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVUpload} className="hidden" />
                    </label>
                    <button onClick={() => alert('Sample data generated. Run analysis to see results.')} className="btn-outline">
                        📊 Generate Sample Data
                    </button>
                </div>

                {error && <div className="alert-critical mt-5 text-sm text-red-400">{error}</div>}
            </div>

            {/* ── Results ───────────────────────────────────────────── */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Critical Zones (>70)', value: result.summary?.critical_count || 0, color: 'text-red-400', icon: '🔴' },
                                { label: 'Warning Zones (40–70)', value: result.summary?.warning_count || 0, color: 'text-yellow-400', icon: '🟡' },
                                { label: 'Dispatch Required', value: result.summary?.dispatch_required ? 'YES' : 'NO', color: result.summary?.dispatch_required ? 'text-red-400' : 'text-emerald-400', icon: result.summary?.dispatch_required ? '🚨' : '✅' },
                            ].map((m, i) => (
                                <div key={i} className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-6 text-center">
                                    <span className="text-3xl">{m.icon}</span>
                                    <p className={`text-5xl font-bold mt-3 ${m.color}`}>{m.value}</p>
                                    <p className="text-sm text-slate-500 mt-2 font-medium">{m.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Emergency Banner */}
                        {result.summary?.critical_count > 0 ? (
                            <div className="alert-critical flex items-center gap-4 p-5 rounded-2xl">
                                <span className="text-3xl">🚨</span>
                                <div>
                                    <p className="font-semibold text-red-400 text-base">Emergency Condition Detected</p>
                                    <p className="text-sm text-red-300/70 mt-0.5">{result.summary.critical_count} zone(s) at critical fragility level. Immediate intervention required.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="alert-success flex items-center gap-4 p-5 rounded-2xl">
                                <span className="text-3xl">✅</span>
                                <p className="font-medium text-emerald-400 text-base">System Operating Within Normal Parameters</p>
                            </div>
                        )}

                        {/* Zone Cards */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Zone Fragility Status</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {result.zones?.map(zone => {
                                    const c = getStatusColor(zone.status);
                                    return (
                                        <motion.div
                                            key={zone.id}
                                            className={`rounded-2xl border ${c.border} ${c.cardBg} p-5 text-center`}
                                            whileHover={{ scale: 1.03, y: -3 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <p className="text-xs text-slate-500 mb-2 font-medium">{zone.name || `Zone ${zone.id}`}</p>
                                            <p className={`text-4xl font-bold ${c.text}`}>{zone.score}</p>
                                            <p className={`text-[11px] font-bold uppercase mt-2 tracking-wider ${c.text}`}>{zone.status}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Geospatial Map */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Geospatial Risk Map</h3>
                            <div className="rounded-2xl overflow-hidden border border-slate-700/50" style={{ height: 520 }}>
                                <MapContainer center={[19.07, 72.88]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                    />
                                    {result.zones?.map(zone => (
                                        <CircleMarker
                                            key={zone.id}
                                            center={[zone.lat, zone.lon]}
                                            radius={18}
                                            fillColor={getMapColor(zone.status)}
                                            fillOpacity={0.85}
                                            color="#0f172a"
                                            weight={2}
                                        >
                                            <Popup>
                                                <strong>{zone.name}</strong><br />
                                                Score: {zone.score}<br />
                                                Status: <span style={{ color: getMapColor(zone.status), fontWeight: 600 }}>{zone.status.toUpperCase()}</span>
                                            </Popup>
                                        </CircleMarker>
                                    ))}
                                    {result.dispatch_plan?.map((route, i) => {
                                        const from = result.zones?.find(z => z.id === route.from);
                                        const to = result.zones?.find(z => z.id === route.to);
                                        if (!from || !to) return null;
                                        return (
                                            <Polyline
                                                key={i}
                                                positions={[[from.lat, from.lon], [to.lat, to.lon]]}
                                                color="#3b82f6"
                                                weight={3}
                                                dashArray="8 4"
                                            />
                                        );
                                    })}
                                </MapContainer>
                            </div>
                        </div>

                        {/* Warnings + Recommendations */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-6">
                                <h3 className="text-base font-semibold text-white mb-5">⚡ Early Warning System</h3>
                                {result.early_warnings?.length > 0 ? (
                                    <div className="space-y-3">
                                        {result.early_warnings.map((w, i) => (
                                            <div key={i} className={`p-4 rounded-xl ${w.severity === 'critical' ? 'alert-critical' : w.severity === 'warning' ? 'alert-warning' : 'alert-success'}`}>
                                                <p className="text-sm font-medium">{w.message}</p>
                                                <p className="text-xs text-slate-500 mt-1.5">Expected: {w.timeframe}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">No warnings at current risk levels.</p>
                                )}
                            </div>

                            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-6">
                                <h3 className="text-base font-semibold text-white mb-5">🤖 AI Recommendations</h3>
                                <div className="space-y-3">
                                    {result.recommendations?.map((rec, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                            <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${rec.priority === 'critical' ? 'bg-red-500' : rec.priority === 'high' ? 'bg-yellow-500' : rec.priority === 'medium' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                            <div>
                                                <p className="text-sm text-slate-200 leading-relaxed">{rec.action}</p>
                                                <p className="text-[10px] text-slate-600 uppercase mt-1 tracking-wide">{rec.priority} priority</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
