// src/routes/mediaRoutes.js

const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// กำหนดการเก็บไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // โฟลเดอร์สำหรับเก็บไฟล์
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route สำหรับอัปโหลดไฟล์ (ต้องมีการยืนยันตัวตน)
router.post('/', authMiddleware, upload.single('media'), mediaController.uploadMedia);

module.exports = router;
