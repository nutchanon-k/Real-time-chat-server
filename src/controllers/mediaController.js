// src/controllers/mediaController.js

const mediaService = require('../services/mediaService');

const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const username = req.user.username;
        const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const mediaType = req.file.mimetype;

        // ส่งข้อมูลไปยัง Socket.io เพื่อกระจายไฟล์ไปยังผู้ใช้ทั้งหมด
        mediaService.broadcastMedia(username, mediaUrl, mediaType);

        res.status(201).json({ message: 'Media uploaded successfully', mediaUrl, mediaType });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    uploadMedia
};
