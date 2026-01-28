const { db, auth } = require('../config/firebase');
const { User, ResearcherProfile, HospitalProfile } = require('../models/userModel');

const registerUser = async (req, res) => {
    const { email, password, role, profileData } = req.body;

    try {
        // 1. Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
        });

        // 2. Set Custom User Claims (for RBAC)
        await auth.setCustomUserClaims(userRecord.uid, { role });

        // 3. Prepare Firestore Data
        let profile;
        if (role === 'researcher') {
            profile = new ResearcherProfile(profileData);
        } else if (role === 'hospital') {
            profile = new HospitalProfile(profileData);
        } else {
            // Basic admin or other
            profile = profileData;
        }

        const newUser = new User(userRecord.uid, email, role, { ...profile });

        // 4. Save to Firestore
        await db.collection('users').doc(userRecord.uid).set(newUser.toJSON());

        res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid, role });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    // Assuming middleware adds user to req (to be implemented)
    const uid = req.user.uid;
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { registerUser, getUserProfile };
