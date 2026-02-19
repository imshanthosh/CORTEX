/**
 * Marine Monitor — Oil Spill Early Detection
 * AIS vessel tracking, anomaly detection, oil spill analysis, authority alerts.
 */
import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

export default function MarineMonitor() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const { user } = useAuth();

    const runAnalysis = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/marine/analyze', {});
            setResult(res.data);

            // Save to history
            if (user) {
                await axios.post('/api/user/history', {
                    userId: user.uid,
                    product: 'Marine',
                    analysisType: 'Vessel Scan',
                    summary: `${res.data.summary.total} vessels scanned. ${res.data.summary.distress} in distress.`,
                    data: res.data
                });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Ensure backend services are running.');
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(runAnalysis, 10000);
        return () => clearInterval(interval);
    }, [autoRefresh, runAnalysis]);

    const getVesselColor = (status) => {
        switch (status) {
            case 'distress': return '#ef4444';
            case 'suspicious': return '#f59e0b';
            default: return '#10b981';
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            distress: 'bg-red-500/20 text-red-400 border-red-500/30',
            suspicious: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            normal: 'bg-green-500/20 text-green-400 border-green-500/30',
        };
        return styles[status] || styles.normal;
    };

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shrink-0">🚢</div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Marine Risk Monitor</h1>
                        <p className="text-sm text-slate-500 mt-0.5">AIS-Satellite Vessel Tracking &amp; Oil Spill Detection</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={e => setAutoRefresh(e.target.checked)}
                            className="accent-cyan-500 w-4 h-4"
                        />
                        Auto-refresh (10s)
                    </label>
                    <button onClick={runAnalysis} disabled={loading} className="btn-primary px-6 py-2.5">
                        {loading ? '⏳ Scanning...' : '🔍 Scan Vessels'}
                    </button>
                </div>
            </div>

            {error && <div className="alert-critical text-sm text-red-400 p-4 rounded-2xl">{error}</div>}

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* ── Summary Metrics ──────────────────────────────── */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                            {[
                                { label: 'Total Vessels', value: result.summary?.total || 0, color: 'text-cyan-400', icon: '🚢' },
                                { label: 'Normal', value: result.summary?.normal || 0, color: 'text-green-400', icon: '✅' },
                                { label: 'Suspicious', value: result.summary?.suspicious || 0, color: 'text-yellow-400', icon: '⚠️' },
                                { label: 'Distress', value: result.summary?.distress || 0, color: 'text-red-400', icon: '🚨' },
                            ].map((card, i) => (
                                <motion.div
                                    key={card.label}
                                    className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-6 text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <span className="text-2xl">{card.icon}</span>
                                    <p className={`text-4xl font-bold mt-2 ${card.color}`}>{card.value}</p>
                                    <p className="text-xs text-gray-500 mt-1.5 font-medium">{card.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Map ──────────────────────────────────────────── */}
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4">Live Vessel Map</h2>
                            <div className="rounded-2xl overflow-hidden border border-gray-800" style={{ height: 520 }}>
                                <MapContainer center={[19.0, 72.85]} zoom={11} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                    />
                                    {result.vessel_statuses?.map(vs => (
                                        <CircleMarker
                                            key={vs.imo}
                                            center={[vs.vessel?.lat || 0, vs.vessel?.lon || 0]}
                                            radius={vs.status === 'distress' ? 14 : vs.status === 'suspicious' ? 11 : 8}
                                            fillColor={getVesselColor(vs.status)}
                                            fillOpacity={0.85}
                                            color={getVesselColor(vs.status)}
                                            weight={vs.status === 'distress' ? 3 : 2}
                                        >
                                            <Popup>
                                                <div className="text-sm" style={{ color: '#333' }}>
                                                    <strong>{vs.name || vs.imo}</strong><br />
                                                    Type: {vs.vessel?.type}<br />
                                                    SOG: {vs.vessel?.sog} kn | COG: {vs.vessel?.cog}°<br />
                                                    Status: <span style={{ color: getVesselColor(vs.status), fontWeight: 'bold' }}>{vs.status?.toUpperCase()}</span><br />
                                                    {vs.anomalies?.map((a, i) => (
                                                        <span key={i}><br />⚠ {a.description}</span>
                                                    ))}
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    ))}
                                    {result.oil_spills?.map((spill, i) => (
                                        <Polygon
                                            key={i}
                                            positions={spill.spill_polygon?.map(p => [p[0], p[1]]) || []}
                                            color="#1a1a1a"
                                            fillColor="#1a1a1a"
                                            fillOpacity={0.6}
                                            weight={2}
                                        />
                                    ))}
                                </MapContainer>
                            </div>
                        </div>

                        {/* ── Vessel Status + Alerts ────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Vessel Status */}
                            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                                <div className="px-6 py-5 border-b border-slate-800/60">
                                    <h2 className="text-base font-semibold text-white">Vessel Status</h2>
                                </div>
                                <div className="flex-1 p-4 space-y-2 max-h-[420px] overflow-y-auto">
                                    {result.vessel_statuses?.map(vs => (
                                        <div key={vs.imo} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full shrink-0 ${vs.status === 'distress' ? 'bg-red-500 animate-pulse' : vs.status === 'suspicious' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                <div>
                                                    <p className="text-sm font-medium">{vs.name || vs.imo}</p>
                                                    <p className="text-[11px] text-gray-500">{vs.vessel?.type} • {vs.vessel?.sog} kn • {vs.vessel?.cog}°</p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-lg border ${getStatusBadge(vs.status)}`}>
                                                {vs.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Authority Alerts */}
                            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                                <div className="px-6 py-5 border-b border-slate-800/60">
                                    <h2 className="text-base font-semibold text-white">🚨 Authority Alerts</h2>
                                </div>
                                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                                    {result.alerts?.length > 0 ? (
                                        result.alerts.map((alert, i) => (
                                            <div key={i} className={`p-4 rounded-xl ${alert.severity === 'critical' ? 'alert-critical' : 'alert-warning'}`}>
                                                <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {alert.actions?.map((action, j) => (
                                                        <span key={j} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-gray-700 text-gray-400">
                                                            {action}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 p-2">No active alerts. All vessels operating normally.</p>
                                    )}

                                    {result.oil_spills?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-800/50">
                                            <h3 className="text-sm font-semibold mb-3 text-red-400">⛽ Oil Spill Detections</h3>
                                            {result.oil_spills.map((spill, i) => (
                                                <div key={i} className="alert-critical mb-2 p-3 rounded-xl">
                                                    <p className="text-sm">Probability: <strong>{(spill.probability * 100).toFixed(0)}%</strong></p>
                                                    <p className="text-xs text-gray-400 mt-1">Estimated area: {spill.area_km2} km²</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
