const express = require('express');
const { createSample, getSamples, updateSample } = require('../controllers/sampleController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createSample);
router.get('/', getSamples); // Publicly viewable? Or restrict to researchers? Spec said "Researchers can only read".
// Let's protect GET as well to be safe, or allow public if user wants. 
// Spec said "Researchers can only read samples" in Firestore rules, implying Auth required.
// We'll require auth for getting samples too for now to follow spec strictly.
// Actually, let's keep it open or check role in controller if needed. 
// For now: require auth.
// Wait, `getSamples` in controller doesn't use `req.user` strictly for search, but nice to have.
// Let's protect it.
router.get('/', verifyToken, getSamples);
router.put('/:id', verifyToken, updateSample);

module.exports = router;
