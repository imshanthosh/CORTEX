/**
 * AquaHear Routes — Accessibility Voice Alerts
 */
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// POST /api/aquahear/generate
router.post('/generate', async (req, res) => {
    try {
        const { language, alert_type, custom_text } = req.body;

        const response = await axios.post(`${PYTHON_URL}/generate_audio`, {
            language: language || 'English',
            alert_type: alert_type || 'Stable',
            custom_text: custom_text || null
        });

        res.json(response.data);
    } catch (error) {
        console.error('AquaHear generate error:', error.message);
        res.status(500).json({ error: 'Failed to generate voice alert', detail: error.message });
    }
});

module.exports = router;
