// src/services/authService.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const register = async ({ username, email, password }) => {
    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    });

    if (existingUser) {
        return {
            status: 400,
            data: { error: 'User with given email or username already exists' }
        };
    }

    // เข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล
    await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });

    return {
        status: 201,
        data: { message: 'User registered successfully' }
    };
};

const login = async ({ email, password }) => {
    // หาผู้ใช้จากอีเมล
    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        return {
            status: 400,
            data: { error: 'Invalid Credentials' }
        };
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return {
            status: 400,
            data: { error: 'Invalid Credentials' }
        };
    }

    // สร้าง JWT
    const payload = {
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
        status: 200,
        data: { token }
    };
};

// เพิ่มการทำงานตาม action
const executeAction = async ({ action, ...data }) => {
    switch (action) {
        case 'register':
            return await register(data);
        case 'login':
            return await login(data);
        default:
            throw new Error('Invalid action');
    }
};

module.exports = {
    register,
    login,
    executeAction
};
