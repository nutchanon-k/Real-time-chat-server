// src/services/messageService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fetchAllMessages = async () => {
    const messages = await prisma.message.findMany({
        where: { isPrivate: false },
        include: { sender: true },
        orderBy: { createdAt: 'asc' },
        take: 100
    });

    return messages.map(msg => ({
        username: msg.sender.username,
        message: msg.content,
        timestamp: msg.createdAt
    }));
};

const fetchPrivateMessages = async (userId, otherUserId) => {
    const messages = await prisma.message.findMany({
        where: {
            isPrivate: true,
            OR: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        },
        include: { sender: true },
        orderBy: { createdAt: 'asc' }
    });

    return messages.map(msg => ({
        username: msg.sender.username,
        message: msg.content,
        timestamp: msg.createdAt,
        fromSelf: msg.senderId === userId
    }));
};

const addMessage = async (senderUsername, receiverUsername, content, isPrivate = false) => {
    // หาผู้ใช้จาก username
    console.log("test add message", senderUsername,receiverUsername, content, isPrivate)
    const sender = await prisma.user.findUnique({
        where: { username: senderUsername }
    });

    if (!sender) {
        throw new Error('Sender not found');
    }

    let receiver = null;
    if (isPrivate) {
        receiver = await prisma.user.findUnique({
            where: { username: receiverUsername }
        });
        if (!receiver) {
            throw new Error('Receiver not found');
        }
    }

    const message = await prisma.message.create({
        data: {
            content,
            senderId: sender.id,
            receiverId: isPrivate ? receiver.id : null,
            isPrivate
        },
        include: {
            sender: true
        }
    });

    return {
        username: message.sender.username,
        message: message.content,
        timestamp: message.createdAt,
        isPrivate: message.isPrivate,
        fromSelf: true
    };
};

module.exports = {
    fetchAllMessages,
    fetchPrivateMessages,
    addMessage
};
