/**
 * User Routes — History and profile management
 * Uses Firebase Admin SDK for Firestore operations.
 */
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Initialize Firestore if not already initialized
let db;
try {
    if (admin.apps.length === 0) {
        // Try to initialize using service account if path exists
        const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
        if (saPath) {
            const serviceAccount = require(saPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('Firebase Admin initialized via Service Account');
        } else {
            // Fallback for Vercel/Production using individual ENV variables if path missing
            // Or use default credentials
            admin.initializeApp();
            console.log('Firebase Admin initialized via Default Credentials');
        }
    }
    db = admin.firestore();
} catch (error) {
    console.warn('Firestore initialization failed. Falling back to in-memory store.', error.message);
}

// In-memory fallback
let analysisHistory = [];

// GET /api/user/history
router.get('/history', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'userId query param required' });
        }

        if (db) {
            const snapshot = await db.collection('history')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();

            const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.json({ history });
        }

        // Fallback
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
            userId,
            product,
            analysisType: analysisType || 'general',
            summary: summary || '',
            data,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };

        if (db) {
            const docRef = await db.collection('history').add(entry);
            return res.json({ success: true, id: docRef.id, entry });
        }

        // Fallback
        const localEntry = { id: Date.now().toString(36), ...entry };
        analysisHistory.push(localEntry);
        if (analysisHistory.length > 500) analysisHistory = analysisHistory.slice(-500);

        res.json({ success: true, entry: localEntry });
    } catch (error) {
        console.error('History save error:', error.message);
        res.status(500).json({ error: 'Failed to save analysis' });
    }
});

module.exports = router;
