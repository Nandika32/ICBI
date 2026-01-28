import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medic-700 to-primary-600 mb-6">
                ICB India
            </h1>
            <p className="text-xl text-medic-600 max-w-2xl mb-8">
                India's Premier Cancer Biobank Platform. Connecting researchers with biorepositories for ethical tissue sample discovery.
            </p>

            <div className="flex gap-4">
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition">
                    I'm a Researcher
                </button>
                <button className="px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg shadow hover:bg-medic-50 transition">
                    I'm a Hospital
                </button>
            </div>
        </div>
    );
};

export default Home;
