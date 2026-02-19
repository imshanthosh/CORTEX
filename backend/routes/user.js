/**
 * User Routes — History and profile management
 * Uses Firebase Admin SDK for Firestore operations.
 */
const express = require('express');
const router = express.Router();

// In-memory store (replace with Firestore in production)
// When Firebase is configured, swap this for Firestore calls
let analysisHistory = [];

// GET /api/user/history
router.get('/history', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'userId query param required' });
        }

        const userHistory = analysisHistory
            .filter(h => h.userId === userId)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 50);

        res.json({ history: userHistory });
    } catch (error) {
        console.error('History fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// POST /api/user/history
router.post('/history', async (req, res) => {
    try {
        const { userId, product, analysisType, data, summary } = req.body;

        if (!userId || !product) {
            return res.status(400).json({ error: 'userId and product are required' });
        }

        const entry = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            userId,
            product,
            analysisType: analysisType || 'general',
            summary: summary || '',
            data,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };

        analysisHistory.push(entry);

        // Keep only last 500 entries in memory
        if (analysisHistory.length > 500) {
            analysisHistory = analysisHistory.slice(-500);
        }

        res.json({ success: true, entry });
    } catch (error) {
        console.error('History save error:', error.message);
        res.status(500).json({ error: 'Failed to save analysis' });
    }
});

module.exports = router;
