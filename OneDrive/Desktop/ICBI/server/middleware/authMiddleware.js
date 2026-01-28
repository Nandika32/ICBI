const { admin } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = header.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        // decodedToken contains: uid, email, and custom claims (role)
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ error: 'Unauthorized' });
    }
};

module.exports = verifyToken;
