const { db, admin } = require('../config/firebase');

// --- Cart Logic ---

const addToCart = async (req, res) => {
    const { researcherId, sampleId, quantityRequested } = req.body;
    // In real implementation, researcherId comes from req.user.uid

    // NOTE: For MVP/Simplicity, we might create the document ID as the researcherId so valid one cart per user
    const cartRef = db.collection('carts').doc(researcherId);

    try {
        // Validation: Check duplicate sample
        const cartDoc = await cartRef.get();
        let items = [];
        if (cartDoc.exists) {
            items = cartDoc.data().items || [];
            const existingItem = items.find(item => item.sampleId === `samples/${sampleId}`);
            if (existingItem) {
                return res.status(400).json({ error: 'Sample already in cart' });
            }
        }

        // Fetch sample details to cache important info in cart
        const sampleDoc = await db.collection('samples').doc(sampleId).get();
        if (!sampleDoc.exists) return res.status(404).json({ error: 'Sample not found' });
        const sampleData = sampleDoc.data();

        if (sampleData.availabilityStatus !== 'Available') {
            return res.status(400).json({ error: 'Sample is not available' });
        }

        const newItem = {
            sampleId: `samples/${sampleId}`,
            cancerType: sampleData.cancerType,
            hospitalName: sampleData.hospitalName,
            quantityRequested: Number(quantityRequested || 1)
        };

        // Atomic update
        if (cartDoc.exists) {
            await cartRef.update({
                items: admin.firestore.FieldValue.arrayUnion(newItem),
                updatedAt: new Date()
            });
        } else {
            await cartRef.set({
                researcherId: `users/${researcherId}`,
                items: [newItem],
                updatedAt: new Date()
            });
        }

        res.json({ message: 'Added to cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCart = async (req, res) => {
    const { researcherId } = req.params; // or req.user.uid
    try {
        const cartDoc = await db.collection('carts').doc(researcherId).get();
        if (!cartDoc.exists) {
            return res.json({ items: [] });
        }
        res.json(cartDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// --- Request Logic ---

const submitRequest = async (req, res) => {
    const { researcherId } = req.body;
    const cartRef = db.collection('carts').doc(researcherId);

    try {
        await db.runTransaction(async (t) => {
            const cartDoc = await t.get(cartRef);
            if (!cartDoc.exists || !cartDoc.data().items.length) {
                throw new Error("Cart is empty");
            }

            const items = cartDoc.data().items;

            // Group by Hospital to create separate requests per hospital map
            const requestMap = {}; // hospitalUID -> [items]

            for (const item of items) {
                const sampleRefId = item.sampleId.split('/')[1];
                const sampleDocRef = db.collection('samples').doc(sampleRefId);
                const sampleSnap = await t.get(sampleDocRef);

                if (!sampleSnap.exists) throw new Error(`Sample ${sampleRefId} not found`);
                const sampleData = sampleSnap.data();

                if (sampleData.availabilityStatus !== 'Available') {
                    throw new Error(`Sample ${sampleData.cancerType} is no longer available`);
                }

                const hospitalRefString = sampleData.hospitalId; // "users/{uid}"
                const hospitalUID = hospitalRefString.split('/')[1];

                if (!requestMap[hospitalUID]) requestMap[hospitalUID] = [];
                requestMap[hospitalUID].push({
                    sampleId: item.sampleId,
                    quantityRequested: item.quantityRequested
                });

                // Update Sample Status to Reserved
                t.update(sampleDocRef, { availabilityStatus: 'Reserved' });
            }

            // Create Request Documents
            for (const [hospitalUID, requestItems] of Object.entries(requestMap)) {
                const newRequestRef = db.collection('requests').doc();
                t.set(newRequestRef, {
                    requestId: newRequestRef.id,
                    researcherId: `users/${researcherId}`,
                    hospitalId: `users/${hospitalUID}`,
                    samples: requestItems,
                    status: 'Pending',
                    createdAt: new Date()
                });
            }

            // Clear Cart
            // t.delete(cartRef); // Or set items to empty if you prefer
            t.update(cartRef, { items: [] });
        });

        res.json({ message: 'Requests submitted successfully' });

    } catch (error) {
        console.error('Submit Request Error:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addToCart, getCart, submitRequest };
