/**
 * AquaShield AI — Node.js Express Backend
 * API Gateway that proxies requests to Python microservices
 * and handles Firebase authentication & Firestore operations.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Import routes
const aegisRoutes = require('./routes/aegis');
const marineRoutes = require('./routes/marine');
const cascadeRoutes = require('./routes/cascade');
const aquahearRoutes = require('./routes/aquahear');
const userRoutes = require('./routes/user');

// Routes
app.use('/api/aegis', aegisRoutes);
app.use('/api/marine', marineRoutes);
app.use('/api/cascade', cascadeRoutes);
app.use('/api/aquahear', aquahearRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AquaShield AI Backend' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AquaShield AI Backend running on port ${PORT}`);
  console.log(`Python microservice URL: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}`);
});
