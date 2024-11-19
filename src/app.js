// src/app.js

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// เสิร์ฟไฟล์สแตติกจากโฟลเดอร์ uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/media', mediaRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('Real-Time Chat Backend is running.');
});

module.exports = app;
