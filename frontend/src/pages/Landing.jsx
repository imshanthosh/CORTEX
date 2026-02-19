/**
 * Landing Page
 * Hero section with product showcases, SDG 6 mission, and CTA buttons.
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const products = [
    {
        title: "AEGIS",
        subtitle: "Urban Water Fragility Intelligence",
        description: "LSTM-powered prediction of network fragility. Identifies critical zones, optimizes tanker routing, and generates early warnings for informal water systems.",
        icon: "🏙️",
        features: ["AI Fragility Scoring", "Graph-based Route Optimization", "Early Warning System", "Zone-level Risk Cards"],
        gradient: "from-cyan-500 to-blue-600"
    },
    {
        title: "Marine Oil Spill Detection",
        subtitle: "AIS-Satellite Marine Risk Monitor",
        description: "Real-time vessel monitoring with AIS anomaly detection. Identifies suspicious behavior, distress signals, and potential oil spill zones with probabilistic analysis.",
        icon: "🚢",
        features: ["Vessel Anomaly Detection", "Oil Spill Probability Analysis", "Coast Guard Alert System", "Real-time AIS Tracking"],
        gradient: "from-blue-500 to-purple-600"
    },
    {
        title: "AquaCascade",
        subtitle: "Contamination Propagation Intelligence",
        description: "Predictive contamination spread simulation. Models plume dynamics, assesses infrastructure risk, and estimates population exposure over time.",
        icon: "🌊",
        features: ["Spread Simulation Engine", "Infrastructure Risk Assessment", "Population Exposure Modeling", "Time-series Plume Animation"],
        gradient: "from-purple-500 to-pink-600"
    }
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" }
    })
};

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0a0f1a]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg shrink-0">💧</div>
                        <span className="text-lg font-bold gradient-text">AquaShield AI</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">Sign In</Link>
                        <Link to="/login" className="btn-primary text-sm">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
                {/* Background gradient effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-[100px]" />
                </div>

                <div className="relative w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                            Supporting SDG 6 — Clean Water &amp; Sanitation
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="gradient-text">AquaShield AI</span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-3xl text-gray-400 font-light mb-4 tracking-wide"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                    >
                        Predict &bull; Protect &bull; Include
                    </motion.p>

                    <motion.p
                        className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        National-level water risk intelligence platform. AI-powered resilience for urban water systems, marine environments, and contamination response.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.65 }}
                    >
                        <Link to="/login" className="btn-primary text-base px-8 py-3">
                            Launch Platform →
                        </Link>
                        <a href="#products" className="btn-secondary text-base px-8 py-3">
                            Explore Products
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-3 gap-6 mt-20 max-w-sm mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        {[
                            { value: "3", label: "AI Modules" },
                            { value: "24/7", label: "Monitoring" },
                            { value: "5+", label: "Zone Coverage" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-24 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        custom={0}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Integrated Intelligence Suite</h2>
                        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">Three purpose-built AI modules working together for comprehensive water risk management.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, i) => (
                            <motion.div
                                key={product.title}
                                className="glass-card group cursor-pointer flex flex-col"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                custom={i + 1}
                                whileHover={{ y: -4 }}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl mb-5 shrink-0`}>
                                    {product.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-1">{product.title}</h3>
                                <p className="text-sm text-cyan-400 mb-3">{product.subtitle}</p>
                                <p className="text-sm text-gray-400 mb-5 leading-relaxed flex-1">{product.description}</p>
                                <div className="space-y-2">
                                    {product.features.map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SDG Section */}
            <section className="py-20 border-t border-gray-800/50">
                <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        custom={0}
                    >
                        <h2 className="text-3xl font-bold mb-6">Aligned with SDG 6</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed text-base md:text-lg">
                            AquaShield AI is built to support the United Nations Sustainable Development Goal 6 — ensuring availability and sustainable management of water and sanitation for all. Our platform prioritizes inclusive access, covering informal water networks that serve the most vulnerable communities.
                        </p>
                        <Link to="/login" className="btn-primary">
                            Join the Mission →
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800/50 py-8">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">💧</span>
                        <span className="text-sm text-gray-500">AquaShield AI — Predict • Protect • Include</span>
                    </div>
                    <p className="text-xs text-gray-600">Built for resilience. Powered by AI.</p>
                </div>
            </footer>
        </div>
    );
}
