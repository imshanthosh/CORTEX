/**
 * Cascade Routes — Contamination Propagation
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// POST /api/cascade/simulate
router.post('/simulate', async (req, res) => {
    try {
        const { source_lat, source_lon, source_type, flow_direction, flow_speed, simulation_hours } = req.body;

        const response = await axios.post(`${PYTHON_URL}/simulate_propagation`, {
            source_lat,
            source_lon,
            source_type: source_type || 'Oil Spill',
            flow_direction: flow_direction || 180,
            flow_speed: flow_speed || 2.0,
            simulation_hours: simulation_hours || 12
        });

        res.json(response.data);
    } catch (error) {
        console.error('Cascade simulate error:', error.message);
        res.status(500).json({ error: 'Failed to run propagation simulation', detail: error.message });
    }
});

module.exports = router;
