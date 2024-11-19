// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // รับ token จาก header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    // ตรวจสอบว่า token มีอยู่หรือไม่
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // ตรวจสอบและถอดรหัส token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
