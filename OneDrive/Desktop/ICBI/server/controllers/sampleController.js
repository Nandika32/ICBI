const { db, admin } = require('../config/firebase');
const { Sample } = require('../models/sampleModel');

const createSample = async (req, res) => {
    try {
        const { role, uid } = req.user || {}; // From auth middleware
        const sampleData = req.body;

        // 1. Role Validation
        if (role !== 'hospital') {
            return res.status(403).json({ error: 'Access denied: Only hospitals can create samples.' });
        }

        // 2. Fetch Hospital Details for denormalization
        const hospitalDoc = await db.collection('users').doc(uid).get();
        if (!hospitalDoc.exists) {
            return res.status(404).json({ error: 'Hospital profile not found.' });
        }
        const hospitalName = hospitalDoc.data().hospitalName;

        // 3. Data Validation
        const requiredFields = ['cancerType', 'tissueType', 'patientAge', 'quantityAvailable', 'preservationMethod'];
        for (const field of requiredFields) {
            if (!sampleData[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }
        if (sampleData.quantityAvailable <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0.' });
        }

        // 4. Create Model
        const newSample = new Sample(uid, hospitalName, sampleData);

        // 5. Write to Firestore
        const docRef = await db.collection('samples').add(newSample.toJSON());

        res.status(201).json({
            message: 'Sample created successfully',
            sampleId: docRef.id,
            data: newSample.toJSON()
        });

    } catch (error) {
        console.error('Create Sample Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getSamples = async (req, res) => {
    try {
        const { cancerType, ageMin, ageMax, availabilityStatus } = req.query;
        let query = db.collection('samples');

        if (cancerType) query = query.where('cancerType', '==', cancerType);
        if (availabilityStatus) {
            query = query.where('availabilityStatus', '==', availabilityStatus);
        } else {
            query = query.where('availabilityStatus', '==', 'Available'); // Default to Available
        }

        const snapshot = await query.get();
        const samples = [];
        snapshot.forEach(doc => {
            let data = doc.data();
            if (ageMin && data.patientAge < Number(ageMin)) return;
            if (ageMax && data.patientAge > Number(ageMax)) return;

            samples.push({ sampleId: doc.id, ...data });
        });

        res.json(samples);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSample = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { uid, role } = req.user || {};

        if (role !== 'hospital') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const docRef = db.collection('samples').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) return res.status(404).json({ error: 'Sample not found' });

        // Ensure hospital owns the sample logic (check hospitalId reference string)
        if (doc.data().hospitalId !== `users/${uid}`) {
            return res.status(403).json({ error: 'Unauthorized: You can only update your own samples.' });
        }

        updates.updatedAt = new Date();
        await docRef.update(updates);
        res.json({ message: 'Sample updated details' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createSample, getSamples, updateSample };
