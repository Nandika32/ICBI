const express = require('express');
const { registerUser, getUserProfile } = require('../controllers/authController');
// const { verifyToken } = require('../middleware/authMiddleware'); // To be implemented

const router = express.Router();

router.post('/register', registerUser);
// router.get('/profile', verifyToken, getUserProfile); // To be implemented

module.exports = router;
