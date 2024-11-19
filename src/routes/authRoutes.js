// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validation/authValidation');

// Route สำหรับการลงทะเบียน
router.post('/register', authController.registerUser(registerSchema));

// Route สำหรับการเข้าสู่ระบบ
router.post('/login', authController.loginUser(loginSchema));

module.exports = router;
