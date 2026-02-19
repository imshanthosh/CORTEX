/**
 * AEGIS Routes — Urban Water Fragility Intelligence
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// POST /api/aegis/analyze
router.post('/analyze', async (req, res) => {
    try {
        const { scenario, time_step, manual_params } = req.body;

        const response = await axios.post(`${PYTHON_URL}/predict_fragility`, {
            scenario: scenario || 'Normal',
            time_step: time_step || 0,
            manual_params: manual_params || null
        });

        res.json(response.data);
    } catch (error) {
        console.error('AEGIS analyze error:', error.message);
        res.status(500).json({ error: 'Failed to run AEGIS analysis', detail: error.message });
    }
});

// GET /api/aegis/sample-data
router.get('/sample-data', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_URL}/sample_data`);
        res.json(response.data);
    } catch (error) {
        console.error('Sample data error:', error.message);
        res.status(500).json({ error: 'Failed to generate sample data' });
    }
});

module.exports = router;
