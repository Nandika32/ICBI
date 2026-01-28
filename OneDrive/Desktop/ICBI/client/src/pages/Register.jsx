import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import API_URL from '../config';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('researcher');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        // Researcher fields
        institutionName: '',
        researchFocus: '',
        // Hospital fields
        hospitalName: '',
        city: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Prepare payload for backend
            const payload = {
                email: formData.email,
                password: formData.password,
                role,
                profileData: {
                    phone: formData.phone,
                    ...(role === 'researcher' ? {
                        name: formData.name,
                        institutionName: formData.institutionName,
                        researchFocus: formData.researchFocus.split(',').map(s => s.trim()) // Convert CSV string to array
                    } : {
                        hospitalName: formData.hospitalName,
                        location: { city: formData.city, state: '' }, // keeping state empty for simple form
                        specialists: [], // empty for now
                        proName: formData.name // Using name field as PRO Name
                    })
                }
            };

            // Call Backend
            await axios.post(`${API_URL}/api/auth/register`, payload);

            // Auto-login on success
            await signInWithEmailAndPassword(auth, formData.email, formData.password);

            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-medic-200">
                <h2 className="text-2xl font-bold text-center mb-6 text-medic-800">Create Account</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <div className="flex bg-medic-100 rounded-lg p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('researcher')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'researcher' ? 'bg-white text-primary-600 shadow-sm' : 'text-medic-600 hover:text-medic-800'}`}
                    >
                        Researcher
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('hospital')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'hospital' ? 'bg-white text-primary-600 shadow-sm' : 'text-medic-600 hover:text-medic-800'}`}
                    >
                        Hospital
                    </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-medic-700 mb-1">Full Name</label>
                            <input name="name" onChange={handleChange} type="text" required className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-medic-700 mb-1">Phone</label>
                            <input name="phone" onChange={handleChange} type="tel" required className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
                        </div>
                    </div>

                    {role === 'researcher' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-medic-700 mb-1">Institution Name</label>
                                <input name="institutionName" onChange={handleChange} type="text" required className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-medic-700 mb-1">Research Focus (Keywords)</label>
                                <input name="researchFocus" onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" placeholder="e.g., Breast Cancer, Genomics" />
                            </div>
                        </>
                    )}

                    {role === 'hospital' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-medic-700 mb-1">Hospital Name</label>
                                <input name="hospitalName" onChange={handleChange} type="text" required className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-medic-700 mb-1">City</label>
                                <input name="city" onChange={handleChange} type="text" required className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Email Address</label>
                        <input name="email" onChange={handleChange} type="email" required className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-medic-700 mb-1">Password</label>
                        <input name="password" onChange={handleChange} type="password" required className="w-full px-4 py-2 rounded-lg border border-medic-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-50">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-medic-500">
                    Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
