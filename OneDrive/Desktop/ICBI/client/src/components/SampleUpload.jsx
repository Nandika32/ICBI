import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import API_URL from '../config';

const SampleUpload = () => {
    const [formData, setFormData] = useState({
        cancerType: '',
        tissueType: 'Tumor',
        patientAge: '',
        patientGender: 'Female',
        preservationMethod: 'FFPE',
        collectionDate: '',
        quantityAvailable: '', // renamed from quantity to match backend
        ethicalClearance: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('You must be logged in.');

            const token = await user.getIdToken();

            // Format payload
            const payload = {
                ...formData,
                dateOfCollection: formData.collectionDate // backend expects dateOfCollection
            };

            await axios.post(`${API_URL}/api/samples`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: 'Sample Uploaded Successfully!' });
            // Reset form
            setFormData({
                cancerType: '',
                tissueType: 'Tumor',
                patientAge: '',
                patientGender: 'Female',
                preservationMethod: 'FFPE',
                collectionDate: '',
                quantityAvailable: '',
                ethicalClearance: false
            });

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Upload Failed.' });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-medic-200">
            <h2 className="text-2xl font-bold mb-6 text-medic-800">Upload New Sample</h2>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Cancer Type</label>
                        <input
                            type="text"
                            name="cancerType"
                            value={formData.cancerType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g. Breast Ductal Carcinoma"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Tissue Type</label>
                        <select
                            name="tissueType"
                            value={formData.tissueType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option>Tumor</option>
                            <option>Normal Adjacent</option>
                            <option>Blood / Serum</option>
                            <option>Lymph Node</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Patient Age</label>
                        <input
                            type="number"
                            name="patientAge"
                            value={formData.patientAge}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Patient Gender</label>
                        <select
                            name="patientGender"
                            value={formData.patientGender}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Preservation Method</label>
                        <select
                            name="preservationMethod"
                            value={formData.preservationMethod}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option>FFPE (Formalin-Fixed Paraffin-Embedded)</option>
                            <option>Fresh Frozen</option>
                            <option>Cryopreserved</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Collection Date</label>
                        <input
                            type="date"
                            name="collectionDate"
                            value={formData.collectionDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Quantity Available</label>
                        <input
                            type="number"
                            name="quantityAvailable"
                            value={formData.quantityAvailable}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="ethicalClearance"
                        checked={formData.ethicalClearance}
                        onChange={handleChange}
                        id="ethical"
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="ethical" className="text-sm text-medic-700">This sample has received necessary ethical clearances.</label>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow disabled:opacity-50">
                    {loading ? 'Uploading...' : 'Upload Sample Record'}
                </button>
            </form>
        </div>
    );
};

export default SampleUpload;
