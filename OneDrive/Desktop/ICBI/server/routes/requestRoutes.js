const express = require('express');
const { addToCart, getCart, submitRequest } = require('../controllers/requestController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/cart', verifyToken, addToCart);
router.get('/cart/:researcherId', verifyToken, getCart);
router.post('/submit', verifyToken, submitRequest);

module.exports = router;
