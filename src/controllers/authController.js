// src/controllers/authController.js

const authService = require('../services/authService');

const createController = (schema) => {
    return async (req, res) => {
        // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            // เรียกใช้ Service ที่เกี่ยวข้อง
            const result = await authService.executeAction({
                action: schema === require('../validation/authValidation').registerSchema ? 'register' : 'login',
                ...value
            });
            res.status(result.status).json(result.data);
        } catch (err) {
            console.error(`Error in ${schema === require('../validation/authValidation').registerSchema ? 'register' : 'login'}:`, err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};

// ฟังก์ชันเพื่อลงทะเบียนผู้ใช้
const registerUser = (schema) => {
    return createController(schema);
};

// ฟังก์ชันเพื่อเข้าสู่ระบบผู้ใช้
const loginUser = (schema) => {
    return createController(schema);
};

module.exports = {
    registerUser,
    loginUser
};
