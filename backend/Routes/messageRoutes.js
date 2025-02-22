const express = require('express');
const { protect } = require('../Middleware/authMiddleware');
const { sendMessage, allMessages } = require('../Controllers/messageController');

const router = express.Router();

// Route to send a message (protected route)
router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect,allMessages)

// Uncomment if needed: Route to get all messages for a chat
// const { allMessages } = require('../Controllers/messageController');
// router.route('/:chatId').get(protect, allMessages);

module.exports = router;
