// src/socket/socketHandler.js

const socketHandler = (io, socket) => {
    console.log('User connected:', socket.id);

    // เมื่อผู้ใช้เพิ่มชื่อ
    socket.on('add user', (username) => {
        socket.username = username; // บันทึก username ลงใน socket
        io.emit('user list', Array.from(io.sockets.sockets.values()).map((s) => s.username));
    });

    // รับข้อความสาธารณะ
    socket.on('chat message', (msg) => {
        const message = {
            username: socket.username,
            message: msg.message,
            timestamp: new Date(),
        };
        io.emit('chat message', message); // กระจายข้อความไปยังทุกคน
    });

    // รับข้อความส่วนตัว
    socket.on('private message', ({ content, to }) => {
        const message = {
            username: socket.username,
            message: content,
            timestamp: new Date(),
        };

        // ค้นหา socket ของผู้รับ
        const targetSocket = Array.from(io.sockets.sockets.values()).find((s) => s.username === to);

        if (targetSocket) {
            // ส่งข้อความไปยังผู้รับ
            targetSocket.emit('private message', message);
        }

        // ส่งข้อความกลับไปยังผู้ส่ง เพื่อแสดงใน UI
        socket.emit('private message', message);
    });

    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit('user list', Array.from(io.sockets.sockets.values()).map((s) => s.username));
    });
};

module.exports = socketHandler;
