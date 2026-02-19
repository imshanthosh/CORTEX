/**
 * AquaCascade — Contamination Propagation Simulator
 * Event inputs, map click source location, propagation simulation, animated plume, risk intelligence.
 */
import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SOURCE_TYPES = ['Oil Spill', 'Sewage Overflow', 'Industrial Discharge'];

const sourceIcon = new L.DivIcon({
    className: '',
    html: '<div style="width:22px;height:22px;background:red;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(255,0,0,0.6)"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

function MapClickHandler({ onMapClick }) {
    useMapEvents({ click(e) { onMapClick(e.latlng); } });
    return null;
}

export default function CascadeSimulator() {
    const [sourceType, setSourceType] = useState('Oil Spill');
    const [sourceLocation, setSourceLocation] = useState(null);
    const [flowDirection, setFlowDirection] = useState(180);
    const [flowSpeed, setFlowSpeed] = useState(2.0);
    const [simHours, setSimHours] = useState(12);
    const [currentHour, setCurrentHour] = useState(0);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const runSimulation = async () => {
        if (!sourceLocation) { setError('Please click on the map to set contamination source location.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/cascade/simulate', {
                source_lat: sourceLocation.lat,
                source_lon: sourceLocation.lng,
                source_type: sourceType,
                flow_direction: flowDirection,
                flow_speed: flowSpeed,
                simulation_hours: simHours,
            });
            setResult(res.data);
            setCurrentHour(0);
        } catch (err) {
            setError(err.response?.data?.error || 'Simulation failed. Ensure backend services are running.');
        }
        setLoading(false);
    };

    const handleMapClick = useCallback((latlng) => setSourceLocation(latlng), []);
    const currentStep = result?.time_steps?.[currentHour] || null;

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800/60">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl shrink-0">🌊</div>
                <div>
                    <h1 className="text-2xl font-bold text-white">AquaCascade — Contamination Simulator</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Predictive contamination spread intelligence</p>
                </div>
            </div>

            {/* ── Input Panel ──────────────────────────────────────── */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">Source Type</label>
                        <select value={sourceType} onChange={e => setSourceType(e.target.value)} className="input-field">
                            {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">
                            Flow Direction: <span className="text-purple-400 font-semibold">{flowDirection}°</span>
                        </label>
                        <input type="range" min="0" max="360" value={flowDirection} onChange={e => setFlowDirection(parseInt(e.target.value))} className="w-full accent-purple-500 mt-1" />
                        <div className="flex justify-between text-xs text-slate-600 mt-1"><span>0°</span><span>180°</span><span>360°</span></div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">
                            Flow Speed: <span className="text-purple-400 font-semibold">{flowSpeed} m/s</span>
                        </label>
                        <input type="range" min="0.5" max="5" step="0.1" value={flowSpeed} onChange={e => setFlowSpeed(parseFloat(e.target.value))} className="w-full accent-purple-500 mt-1" />
                        <div className="flex justify-between text-xs text-slate-600 mt-1"><span>0.5</span><span>2.5</span><span>5</span></div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block font-medium">
                            Duration: <span className="text-purple-400 font-semibold">{simHours}h</span>
                        </label>
                        <input type="range" min="6" max="24" value={simHours} onChange={e => setSimHours(parseInt(e.target.value))} className="w-full accent-purple-500 mt-1" />
                        <div className="flex justify-between text-xs text-slate-600 mt-1"><span>6h</span><span>15h</span><span>24h</span></div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button onClick={runSimulation} disabled={loading} className="btn-primary px-6 py-2.5">
                        {loading ? '⏳ Simulating...' : '▶ Run Simulation'}
                    </button>
                    {sourceLocation ? (
                        <span className="text-sm text-gray-400">📍 Source: {sourceLocation.lat.toFixed(4)}, {sourceLocation.lng.toFixed(4)}</span>
                    ) : (
                        <span className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 rounded-lg">
                            👆 Click on the map below to set contamination source
                        </span>
                    )}
                </div>
                {error && <div className="alert-critical mt-5 text-sm text-red-400 p-4 rounded-xl">{error}</div>}
            </div>

            {/* ── Interactive Map ───────────────────────────────────── */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Propagation Map
                    <span className="text-sm text-slate-500 font-normal ml-2">— Click to set source location</span>
                </h2>
                <div className="rounded-2xl overflow-hidden border border-slate-700/50" style={{ height: 540 }}>
                    <MapContainer center={[19.07, 72.88]} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        />
                        <MapClickHandler onMapClick={handleMapClick} />
                        {sourceLocation && (
                            <Marker position={[sourceLocation.lat, sourceLocation.lng]} icon={sourceIcon}>
                                <Popup><strong>Contamination Source</strong><br />{sourceType}</Popup>
                            </Marker>
                        )}
                        {currentStep?.plume_polygon && (
                            <Polygon
                                positions={currentStep.plume_polygon.map(p => [p[0], p[1]])}
                                color="#9333ea" fillColor="#9333ea"
                                fillOpacity={0.3 * (currentStep.intensity || 0.5)} weight={2}
                            />
                        )}
                        {currentStep?.risk_grid?.map((point, i) => (
                            <Circle
                                key={i}
                                center={[point.lat, point.lon]} radius={200}
                                fillColor={point.intensity > 0.7 ? '#ef4444' : point.intensity > 0.4 ? '#f59e0b' : '#10b981'}
                                fillOpacity={point.intensity * 0.6} stroke={false}
                            />
                        ))}
                    </MapContainer>
                </div>

                {/* Time Slider */}
                {result && (
                    <div className="mt-4 rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 p-5">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 font-medium shrink-0">Timeline:</span>
                            <input
                                type="range" min="0" max={result.time_steps.length - 1} value={currentHour}
                                onChange={e => setCurrentHour(parseInt(e.target.value))}
                                className="flex-1 accent-purple-500"
                            />
                            <span className="text-sm font-mono text-purple-400 w-20 text-right shrink-0">
                                T+{(result.time_steps[currentHour]?.hour || 0)}h
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                            <span>Start</span>
                            <span>Area: <strong className="text-purple-400">{currentStep?.area_km2 || 0} km²</strong></span>
                            <span>Pop. exposed: <strong className="text-orange-400">{(currentStep?.estimated_population_exposure || 0).toLocaleString()}</strong></span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Results Panel ─────────────────────────────────────── */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* Risk Intelligence */}
                        <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-800/60">
                                <h2 className="text-base font-semibold text-white">📊 Risk Intelligence</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {[
                                    { label: 'Treatment Plants at Risk', value: result.risk_summary?.treatment_plants_at_risk || 0, color: 'text-red-400' },
                                    { label: 'Coastal Intakes at Risk', value: result.risk_summary?.intakes_at_risk || 0, color: 'text-yellow-400' },
                                    { label: 'Max Population Exposure', value: (result.risk_summary?.max_population_exposure || 0).toLocaleString(), color: 'text-orange-400' },
                                    { label: 'Max Affected Area', value: `${result.risk_summary?.max_area_km2 || 0} km²`, color: 'text-purple-400' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02]">
                                        <span className="text-sm text-gray-400">{row.label}</span>
                                        <span className={`text-lg font-bold ${row.color}`}>{row.value}</span>
                                    </div>
                                ))}

                                {currentStep?.infrastructure_at_risk?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-800/50">
                                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Infrastructure Affected at T+{currentStep.hour}h</h3>
                                        {currentStep.infrastructure_at_risk.map((infra, i) => (
                                            <div key={i} className={`text-xs p-2.5 rounded-lg mb-1.5 ${infra.risk_level === 'critical' ? 'alert-critical' : 'alert-warning'}`}>
                                                {infra.name} — {infra.distance_km} km away
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Predictive Alerts */}
                        <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-800/60">
                                <h2 className="text-base font-semibold text-white">🚨 Predictive Alerts</h2>
                            </div>
                            <div className="flex-1 p-4 space-y-3 max-h-[400px] overflow-y-auto">
                                {result.alerts?.length > 0 ? (
                                    result.alerts.map((alert, i) => (
                                        <div key={i} className={`p-4 rounded-xl ${alert.severity === 'critical' ? 'alert-critical' : 'alert-warning'}`}>
                                            <p className="text-sm leading-relaxed">{alert.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 p-2">No alerts generated for this simulation.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
