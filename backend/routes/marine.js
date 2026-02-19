/**
 * Marine Routes — Oil Spill Early Detection
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// POST /api/marine/analyze
router.post('/analyze', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_URL}/detect_vessel_anomaly`, {
            vessels: req.body.vessels || null
        });

        // For distressed vessels, also get oil spill data
        const statuses = response.data.vessel_statuses || [];
        const spillResults = [];

        for (const vs of statuses) {
            if (vs.status === 'distress' && vs.vessel) {
                try {
                    const spillRes = await axios.post(`${PYTHON_URL}/detect_oil_spill`, {
                        vessel: vs.vessel
                    });
                    spillResults.push({ ...spillRes.data, vessel_imo: vs.imo });
                } catch (e) {
                    console.error('Oil spill detection error:', e.message);
                }
            }
        }

        res.json({
            ...response.data,
            oil_spills: spillResults
        });
    } catch (error) {
        console.error('Marine analyze error:', error.message);
        res.status(500).json({ error: 'Failed to run marine analysis', detail: error.message });
    }
});

// GET /api/marine/vessels
router.get('/vessels', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_URL}/vessel_positions`);
        res.json(response.data);
    } catch (error) {
        console.error('Vessel positions error:', error.message);
        res.status(500).json({ error: 'Failed to get vessel positions' });
    }
});

module.exports = router;
