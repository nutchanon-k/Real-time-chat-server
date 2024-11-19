// src/server.js

const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');
const app = require('./app');
const socketHandler = require('./socket/socketHandler');
const mediaService = require('./services/mediaService');

dotenv.config();

// สร้าง HTTP server จาก Express app
const server = http.createServer(app);

// ตั้งค่า Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // ปรับ origin ตามความเหมาะสมในโปรเจกต์จริง
        methods: ["GET", "POST"]
    }
});

// เก็บ instance ของ Socket.io ใน mediaService
mediaService.setIO(io);

// จัดการการเชื่อมต่อของ Socket.io
io.on('connection', (socket) => {
    socketHandler(io, socket);
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
