import React from 'react';
import { X, ShoppingCart } from 'lucide-react';

const CartSample = ({ open, setOpen }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingCart size={24} />
                        Request Cart
                    </h2>
                    <button onClick={() => setOpen(false)} className="p-2 hover:bg-medic-100 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4 mb-8">
                    {/* Simulated Items */}
                    <div className="border border-medic-200 rounded-lg p-4 flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-medic-800">Lung Adenocarcinoma</h4>
                            <p className="text-sm text-medic-500">Sample ID: #ICB-9281</p>
                        </div>
                        <button className="text-red-500 text-sm hover:underline">Remove</button>
                    </div>
                    <div className="border border-medic-200 rounded-lg p-4 flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-medic-800">Breast Ductal Carcinoma</h4>
                            <p className="text-sm text-medic-500">Sample ID: #ICB-1029</p>
                        </div>
                        <button className="text-red-500 text-sm hover:underline">Remove</button>
                    </div>
                </div>

                <div className="border-t border-medic-200 pt-6">
                    <p className="text-sm text-medic-600 mb-4">
                        By submitting this request, you agree to the Material Transfer Agreement (MTA) and ethical usage policy.
                    </p>
                    <button className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition">
                        Submit Request to Hospitals
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSample;
