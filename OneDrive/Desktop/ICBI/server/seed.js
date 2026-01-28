const admin = require('firebase-admin');
const { db, auth } = require('./config/firebase'); // Re-using existing config which handles Auth/DB connection

// Data to Seed
const hospitals = [
    {
        email: 'admin@apollo.com',
        password: 'password123',
        role: 'hospital',
        profile: {
            hospitalName: 'Apollo Cancer Centre',
            specialists: ['Dr. Rajesh Mistry', 'Dr. S. Guha'],
            proName: 'Anita Roy',
            phone: '+91-22-5555-0101',
            location: { city: 'Mumbai', state: 'Maharashtra' }
        }
    },
    {
        email: 'contact@tmc.gov.in',
        password: 'password123',
        role: 'hospital',
        profile: {
            hospitalName: 'Tata Memorial Centre',
            specialists: ['Dr. RA Badwe', 'Dr. CS Pramesh'],
            proName: 'Vikram Singh',
            phone: '+91-22-2417-7000',
            location: { city: 'Mumbai', state: 'Maharashtra' }
        }
    },
    {
        email: 'oncology@aiims.edu',
        password: 'password123',
        role: 'hospital',
        profile: {
            hospitalName: 'AIIMS Delhi',
            specialists: ['Dr. GK Rath'],
            proName: 'Suman Gupta',
            phone: '+91-11-2658-8500',
            location: { city: 'New Delhi', state: 'Delhi' }
        }
    }
];

const researchers = [
    {
        email: 'researcher1@iisc.ac.in',
        password: 'password123',
        role: 'researcher',
        profile: {
            name: 'Dr. Aditi Sharma',
            institutionName: 'IISc Bangalore',
            department: 'Molecular Biology',
            phone: '+91-80-2293-2000',
            projectTitle: 'Genomic Markers in Breast Cancer',
            projectDescription: 'Study of BRCA1 mutations in Indian population.',
            researchFocus: ['Breast Cancer', 'Genomics']
        }
    },
    {
        email: 'rahul.verma@ncbs.res.in',
        password: 'password123',
        role: 'researcher',
        profile: {
            name: 'Rahul Verma',
            institutionName: 'NCBS',
            department: 'Cell Biology',
            phone: '+91-80-2366-6000',
            projectTitle: 'Tumor Microenvironment Analysis',
            projectDescription: 'Analyzing immune cell infiltration in lung tumors.',
            researchFocus: ['Lung Cancer', 'Immunology']
        }
    },
    {
        email: 'priya.k@iitb.ac.in',
        password: 'password123',
        role: 'researcher',
        profile: {
            name: 'Priya Kapoor',
            institutionName: 'IIT Bombay',
            department: 'Biosciences',
            phone: '+91-22-2576-7000',
            projectTitle: 'Oral Cancer Metabolomics',
            projectDescription: 'Metabolic profiling of oral squamous cell carcinoma.',
            researchFocus: ['Oral Cancer', 'Metabolomics']
        }
    },
    {
        email: 'arun.n@univ-madras.edu',
        password: 'password123',
        role: 'researcher',
        profile: {
            name: 'Arun Nair',
            institutionName: 'University of Madras',
            department: 'Pathology',
            phone: '+91-44-2539-9000',
            projectTitle: 'Cervical Cancer Screening',
            projectDescription: 'Evaluating new biomarkers for early detection.',
            researchFocus: ['Cervical Cancer', 'Biomarkers']
        }
    },
    {
        email: 'sara.khan@actrec.gov.in',
        password: 'password123',
        role: 'researcher',
        profile: {
            name: 'Sara Khan',
            institutionName: 'ACTREC',
            department: 'Clinical Research',
            phone: '+91-22-2740-5000',
            projectTitle: 'Pediatric Leukemia Registry',
            projectDescription: 'Longitudinal study of ALL outcomes.',
            researchFocus: ['Leukemia', 'Pediatrics']
        }
    }
];

const sampleTemplates = [
    { cancerType: 'Breast Ductal Carcinoma', tissueType: 'Tumor', preservationMethod: 'FFPE' },
    { cancerType: 'Lung Adenocarcinoma', tissueType: 'Fresh Frozen', preservationMethod: 'Fresh Frozen' },
    { cancerType: 'Oral Squamous Cell Carcinoma', tissueType: 'Tumor', preservationMethod: 'FFPE' },
    { cancerType: 'Cervical Cancer', tissueType: 'Biopsy', preservationMethod: 'FFPE' },
    { cancerType: 'Colorectal Cancer', tissueType: 'Normal Adjacent', preservationMethod: 'Frozen' }
];

const seedDatabase = async () => {
    console.log('🌱 Starting Database Seed...');

    try {
        // --- 1. Seed Hospitals ---
        console.log('\n🏥 Seeding Hospitals...');
        const hospitalIds = [];

        for (const h of hospitals) {
            let uid;
            try {
                // Check if user exists
                const userRecord = await auth.getUserByEmail(h.email);
                uid = userRecord.uid;
                console.log(`   User ${h.email} already exists. Skipping Auth creation.`);
            } catch (e) {
                if (e.code === 'auth/user-not-found') {
                    const newUser = await auth.createUser({
                        email: h.email,
                        password: h.password,
                        displayName: h.profile.hospitalName
                    });
                    uid = newUser.uid;
                    await auth.setCustomUserClaims(uid, { role: h.role });
                    console.log(`   Created Auth User: ${h.email}`);
                } else {
                    throw e;
                }
            }

            // Create/Update Firestore Document
            const userData = {
                role: h.role,
                name: h.profile.hospitalName, // specific mapping as per spec
                hospitalName: h.profile.hospitalName,
                specialists: h.profile.specialists,
                proName: h.profile.proName,
                email: h.email,
                phone: h.profile.phone,
                location: h.profile.location,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('users').doc(uid).set(userData, { merge: true });
            hospitalIds.push({ uid: uid, name: h.profile.hospitalName });
        }

        // --- 2. Seed Researchers ---
        console.log('\n🔬 Seeding Researchers...');
        for (const r of researchers) {
            let uid;
            try {
                const userRecord = await auth.getUserByEmail(r.email);
                uid = userRecord.uid;
                console.log(`   User ${r.email} already exists. Skipping Auth creation.`);
            } catch (e) {
                if (e.code === 'auth/user-not-found') {
                    const newUser = await auth.createUser({
                        email: r.email,
                        password: r.password,
                        displayName: r.profile.name
                    });
                    uid = newUser.uid;
                    await auth.setCustomUserClaims(uid, { role: r.role });
                    console.log(`   Created Auth User: ${r.email}`);
                } else {
                    throw e;
                }
            }

            // Create/Update Firestore Document
            const userData = {
                role: r.role,
                name: r.profile.name,
                institutionName: r.profile.institutionName,
                department: r.profile.department,
                projectTitle: r.profile.projectTitle,
                projectDescription: r.profile.projectDescription,
                researchFocus: r.profile.researchFocus,
                email: r.email,
                phone: r.profile.phone,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await db.collection('users').doc(uid).set(userData, { merge: true });
        }

        // --- 3. Seed Samples ---
        console.log('\n🧪 Seeding Samples...');

        let sampleCount = 0;
        const totalSamplesTarget = 15;

        // Distribute samples among hospitals
        for (let i = 0; i < totalSamplesTarget; i++) {
            const hospital = hospitalIds[i % hospitalIds.length]; // Round robin
            const template = sampleTemplates[i % sampleTemplates.length];

            // Randomize fields
            const patientAge = Math.floor(Math.random() * (70 - 20) + 20);
            const genders = ['Male', 'Female', 'Other'];
            const gender = genders[Math.floor(Math.random() * genders.length)];
            const quantity = Math.floor(Math.random() * 20) + 1;

            const sampleData = {
                hospitalId: `users/${hospital.uid}`,
                hospitalName: hospital.name,
                cancerType: template.cancerType,
                tissueType: template.tissueType,
                patientAge: patientAge,
                patientGender: gender,
                preservationMethod: template.preservationMethod,
                dateOfCollection: admin.firestore.Timestamp.fromDate(new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28))),
                quantityAvailable: quantity,
                ethicalClearance: true,
                availabilityStatus: 'Available',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            // Check if similar sample exists to avoid duplicate spam on re-runs (optional but nice)
            // Just simple add here as samples are usually unique instances
            await db.collection('samples').add(sampleData);
            sampleCount++;
        }
        console.log(`   Added ${sampleCount} new samples.`);

        console.log('\n✅ Database Seed Completed Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedDatabase();
