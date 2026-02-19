/**
 * AquaHear — Voice Alert Generator
 * Multilingual voice alerts for water risk notifications.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ALERT_TYPES = ['Stable', 'Warning', 'High Risk'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu'];

export default function AquaHear() {
    const [alertType, setAlertType] = useState('Stable');
    const [language, setLanguage] = useState('English');
    const [customMessage, setCustomMessage] = useState('');
    const [audioSrc, setAudioSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateAlert = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/aquahear/generate', {
                alert_type: alertType,
                language: language,
                custom_message: customMessage || undefined,
            });
            if (res.data.audio_base64) {
                setAudioSrc(`data:audio/mp3;base64,${res.data.audio_base64}`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate voice alert. Ensure backend is running.');
        }
        setLoading(false);
    };

    const getAlertStyle = (type) => {
        switch (type) {
            case 'High Risk': return 'text-red-400 border-red-500/30 bg-red-500/10';
            case 'Warning': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
            default: return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        }
    };

    return (
        <div className="space-y-8">

            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="pb-6 border-b border-slate-800/60">
                <h1 className="text-2xl font-bold text-white">AquaHear — Voice Alert Generator</h1>
                <p className="text-sm text-slate-500 mt-1">Generate multilingual audio alerts for inclusive risk communication</p>
            </div>

            {/* ── Main Two-Column Layout ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Controls */}
                <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-800/60">
                        <h2 className="text-sm font-semibold text-white">Alert Configuration</h2>
                    </div>
                    <div className="flex-1 p-6 space-y-6">
                        {/* Alert Type */}
                        <div>
                            <label className="text-sm text-gray-400 mb-3 block font-medium">Alert Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {ALERT_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setAlertType(type)}
                                        className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all ${alertType === type ? getAlertStyle(type) : 'text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="text-sm text-gray-400 mb-3 block font-medium">Language</label>
                            <div className="grid grid-cols-2 gap-3">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={`px-3 py-3 rounded-xl text-sm font-medium border transition-all ${language === lang
                                            ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                                            : 'text-gray-500 border-gray-800 hover:border-gray-700 hover:text-gray-300'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block font-medium">Custom Message <span className="text-gray-600">(optional)</span></label>
                            <textarea
                                value={customMessage}
                                onChange={e => setCustomMessage(e.target.value)}
                                rows={4}
                                placeholder="Enter a custom alert message..."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                            />
                        </div>

                        <button
                            onClick={generateAlert}
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? '⏳ Generating...' : '🔊 Generate Voice Alert'}
                        </button>

                        {error && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Output */}
                <div className="rounded-2xl bg-slate-900/60 backdrop-blur border border-slate-800/60 flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-800/60">
                        <h2 className="text-sm font-semibold text-white">Audio Output</h2>
                    </div>
                    <div className="flex-1 p-6 space-y-5">
                        {audioSrc ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-5"
                            >
                                <div className="flex items-center gap-4 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                    <span className="text-4xl">🔊</span>
                                    <div>
                                        <p className="text-base font-semibold text-white">{alertType} Alert</p>
                                        <p className="text-sm text-gray-500 mt-0.5">Language: {language}</p>
                                    </div>
                                </div>
                                <audio controls src={audioSrc} className="w-full rounded-xl" />
                                <a
                                    href={audioSrc}
                                    download={`aquahear_${alertType.toLowerCase().replace(' ', '_')}_${language.toLowerCase()}.mp3`}
                                    className="block w-full py-3 rounded-xl text-center text-sm font-medium text-gray-300 border border-gray-700 hover:bg-white/5 transition-colors"
                                >
                                    📥 Download Audio
                                </a>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                                <span className="text-6xl mb-5">🎙️</span>
                                <p className="text-sm font-medium">Configure and generate an alert</p>
                                <p className="text-xs text-gray-700 mt-1">Audio will appear here</p>
                            </div>
                        )}

                        {/* Info */}
                        <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span>♿</span>
                                <p className="text-xs font-semibold text-blue-400">Accessibility Feature</p>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                AquaHear generates audio alerts in multiple Indian languages to ensure water risk
                                information reaches communities with low literacy or visual impairments.
                                Aligned with UN SDG 6 inclusion principles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
