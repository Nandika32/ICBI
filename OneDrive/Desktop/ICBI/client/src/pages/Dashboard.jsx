import { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import API_URL from '../config';
import { ShoppingCart } from 'lucide-react';

const Dashboard = () => {
    // Simulated role state - in real app would come from Auth Context
    // We'll keep the toggle for demo purposes, but fetching should use real token if possible
    // or just fetch public data if we allowed public read.
    // We protected GET /api/samples, so we need token.
    const [role, setRole] = useState('researcher');
    const [cartOpen, setCartOpen] = useState(false);
    const [samples, setSamples] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (role === 'researcher') {
            fetchSamples();
        }
    }, [role]);

    const fetchSamples = async () => {
        try {
            setLoading(true);
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                const res = await axios.get(`${API_URL}/api/samples`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSamples(res.data);
            }
        } catch (error) {
            console.error("Error fetching samples:", error);
        }
        setLoading(false);
    };

    const addToCart = async (sampleId) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("Please login to add to cart");
                return;
            }
            const token = await user.getIdToken();
            await axios.post(`${API_URL}/api/requests/cart`, {
                researcherId: user.uid, // user.uid matches researcherId in our schema
                sampleId: sampleId,
                quantityRequested: 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Added to cart!");
            // Optionally update UI/Cart count here
        } catch (error) {
            console.error("Add to cart error:", error);
            alert(error.response?.data?.error || "Failed to add to cart");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm bg-medic-200 px-3 py-1 rounded-full">
                        Viewing as: <button onClick={() => setRole(role === 'researcher' ? 'hospital' : 'researcher')} className="font-bold underline text-primary-700">{role.charAt(0).toUpperCase() + role.slice(1)}</button>
                    </div>
                    {role === 'researcher' && (
                        <button onClick={() => setCartOpen(true)} className="relative p-2 bg-white border border-medic-200 rounded-full shadow-sm hover:bg-medic-50 transition">
                            <ShoppingCart size={20} className="text-medic-700" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">2</span>
                        </button>
                    )}
                </div>
            </div>

            {role === 'hospital' && (
                <div className="mb-8">
                    <SampleUpload />
                </div>
            )}

            {role === 'researcher' && (
                <div>
                    <SampleSearch />

                    <h2 className="text-xl font-bold mb-4">Marketplace Preview</h2>

                    {loading ? (
                        <p>Loading samples...</p>
                    ) : samples.length === 0 ? (
                        <p className="text-medic-500 italic">No samples available matching your criteria.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {samples.map((sample) => (
                                <div key={sample.sampleId} className="bg-white rounded-xl shadow-sm border border-medic-200 p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded">{sample.tissueType}</span>
                                        <span className="text-xs text-medic-500">{new Date(sample.createdAt?._seconds * 1000).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-medic-800 mb-1">{sample.cancerType}</h3>
                                    <p className="text-sm text-medic-600 mb-4">Age: {sample.patientAge} | {sample.patientGender} | {sample.preservationMethod}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-medic-700 truncate max-w-[120px]" title={sample.hospitalName}>{sample.hospitalName}</span>
                                        <button
                                            onClick={() => addToCart(sample.sampleId)}
                                            className="text-sm bg-medic-800 text-white px-3 py-1.5 rounded hover:bg-medic-900 transition"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-medic-200">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="text-medic-500 text-sm italic">No recent activity</div>
            </div>

            <CartSample open={cartOpen} setOpen={setCartOpen} />
        </div>
    );
};

export default Dashboard;
