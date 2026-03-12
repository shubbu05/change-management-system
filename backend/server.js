require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { pool } = require('./db');

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const crRoutes = require('./routes/cr');
const implementRoutes = require('./routes/implement');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('AAI Change Management Backend Running 🚀');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cr', crRoutes);
app.use('/api/implement', implementRoutes);
app.use('/api/reports', reportRoutes);

// Database connection test
pool.connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Backend Server running on port ${PORT}`);
    });
}

// Export the Express API for Vercel
module.exports = app;