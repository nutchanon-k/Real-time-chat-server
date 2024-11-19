// src/services/mediaService.js

let ioInstance = null;

// ฟังก์ชันเพื่อเก็บ instance ของ Socket.io
const setIO = (io) => {
    ioInstance = io;
};

// ฟังก์ชันเพื่อกระจายไฟล์ไปยังผู้ใช้ทั้งหมด
const broadcastMedia = (username, mediaUrl, mediaType) => {
    if (ioInstance) {
        ioInstance.emit('share media', {
            username,
            mediaUrl,
            mediaType,
            timestamp: new Date()
        });
    }
};

module.exports = {
    setIO,
    broadcastMedia
};
