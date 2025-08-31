// Simple Pirate Bomb Server for Render Deployment
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🎮 Pirate Bomb Server starting...');
console.log('🌍 Environment:', NODE_ENV);
console.log('🔌 Port:', PORT);

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Basic middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Static file serving - serve all files from current directory
app.use(express.static('.', {
    maxAge: NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
    lastModified: true
}));

// Basic API routes
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: NODE_ENV,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

app.get('/api/players', (req, res) => {
    res.json({ success: true, data: [] });
});

app.get('/api/dashboard/stats', (req, res) => {
    res.json({ 
        success: true, 
        data: { 
            totalPlayers: { count: 0 }, 
            totalTokens: { total: 0 }, 
            totalScore: { total: 0 }, 
            topPlayer: null 
        } 
    });
});

// Catch all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 Pirate Bomb Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`💊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎯 Game: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server shutdown completed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server shutdown completed');
        process.exit(0);
    });
});