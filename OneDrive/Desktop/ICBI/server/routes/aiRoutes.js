const express = require('express');
const { chatWithAI } = require('../controllers/aiController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/chat', verifyToken, chatWithAI);

module.exports = router;
