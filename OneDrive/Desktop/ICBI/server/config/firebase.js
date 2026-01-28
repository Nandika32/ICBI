const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Check if credentials are provided in env vars, otherwise try to load serviceAccountKey.json
const serviceAccount = process.env.FIREBASE_PRIVATE_KEY
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }
    : null;

try {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
        });
        console.log('Firebase Admin Initialized with Environment Variables');
    } else {
        // Fallback to local file if available (for development)
        try {
            const serviceAccountFile = require('./serviceAccountKey.json');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountFile),
                storageBucket: `${serviceAccountFile.project_id}.appspot.com`
            });
            console.log('Firebase Admin Initialized with serviceAccountKey.json');
        } catch (fileError) {
            console.warn("⚠️ Firebase Warning: No 'serviceAccountKey.json' found in server/ and no env vars provided.");
            console.warn("   The backend will run in MOCK mode. Database operations will fail unless credentials are added.");
        }
    }
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
}

// Ensure exports defined even if init failed (prevents crash on require)
const db = admin.apps.length ? admin.firestore() : { collection: () => ({ doc: () => ({ set: async () => { }, get: async () => ({ exists: false }) }), add: async () => ({ id: 'mock-id' }) }) };
const auth = admin.apps.length ? admin.auth() : { createUser: async () => ({ uid: 'mock-uid' }), setCustomUserClaims: async () => { } };
const storage = admin.apps.length ? admin.storage() : {};

module.exports = { admin, db, auth, storage };
