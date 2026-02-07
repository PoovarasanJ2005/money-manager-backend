const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Money Manager API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/money-manager';

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});
