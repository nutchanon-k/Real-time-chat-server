// src/validation/authValidation.js

const Joi = require('joi');

// Schema สำหรับการลงทะเบียน
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Schema สำหรับการเข้าสู่ระบบ
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
