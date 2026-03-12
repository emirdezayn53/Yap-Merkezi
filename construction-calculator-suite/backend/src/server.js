/**
 * Construction Calculator Suite - Main Server Entry Point
 * Express.js server with PostgreSQL database connection
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const calculationRoutes = require('./routes/calculation.routes');
const exportRoutes = require('./routes/export.routes');

const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------

// CORS - allow frontend origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Rate limiting - 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// --------------- Routes ---------------

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/export', exportRoutes);

// --------------- Error Handling ---------------

app.use(errorHandler);

// --------------- Start Server ---------------

app.listen(PORT, () => {
  console.log(`🏗️  Construction Calculator API running on port ${PORT}`);
});

module.exports = app;
