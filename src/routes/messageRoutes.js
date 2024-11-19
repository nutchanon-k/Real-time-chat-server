// src/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const Joi = require('joi');
const authMiddleware = require('../middleware/authMiddleware');

// Schema สำหรับการส่งข้อความ
const messageSchema = Joi.object({
    message: Joi.string().min(1).required(),
    to: Joi.string().optional() // ชื่อผู้ใช้ที่ต้องการส่งข้อความส่วนตัว
});

// Route สำหรับดึงข้อความทั้งหมด (ต้องมีการยืนยันตัวตน)
router.get('/', authMiddleware, messageController.getAllMessages);

// Route สำหรับดึงข้อความส่วนตัวกับผู้ใช้คนอื่น
router.get('/private/:otherUsername', authMiddleware, messageController.getPrivateMessages);

router.get('/private/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const currentUser = req.user.username; // username ของผู้ใช้ที่ล็อกอินอยู่

        // ดึงข้อความที่เกี่ยวข้องกับผู้ใช้ทั้งสอง
        const messages = await Message.find({
            $or: [
                { sender: currentUser, receiver: username },
                { sender: username, receiver: currentUser },
            ],
        }).sort({ timestamp: 1 }); // เรียงตามเวลา

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
// Route สำหรับส่งข้อความใหม่ (ต้องมีการยืนยันตัวตน)
router.post('/', authMiddleware, async (req, res, next) => {
    const { error } = messageSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}, messageController.createMessage);

module.exports = router;
