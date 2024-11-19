// src/controllers/messageController.js

const messageService = require('../services/messageService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllMessages = async (req, res) => {
    try {
        const messages = await messageService.fetchAllMessages();
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getPrivateMessages = async (req, res) => {
    const { otherUsername } = req.params;
    const userId = req.user.id;

    try {
        const otherUser = await prisma.user.findUnique({
            where: { username: otherUsername }
        });
        // console.log(otherUser, "xxxxxxxxxxxxxxxxxx")
        if (!otherUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const messages = await messageService.fetchPrivateMessages(userId, otherUser.id);
        // console.log(messages)
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching private messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createMessage = async (req, res) => {
    const { message, to } = req.body;
    const senderUsername = req.user.username;
    console.log(message, to, senderUsername)
    try {
        if (to) {
            // ส่งข้อความส่วนตัว
            const newMessage = await messageService.addMessage(senderUsername, to, message, true);
            res.status(201).json(newMessage);
        } else {
            // ส่งข้อความสาธารณะ
            const newMessage = await messageService.addMessage(senderUsername, null, message, false);
            res.status(201).json(newMessage);
        }
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllMessages,
    getPrivateMessages,
    createMessage
};
