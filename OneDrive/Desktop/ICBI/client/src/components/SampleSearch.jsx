import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SampleSearch = () => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: Implement Search
        console.log("Searching for:", query);
    };

    return (
        <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medic-400" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search samples by cancer type, tissue, etc... (AI Enabled)"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-medic-300 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                    />
                </div>
                <button type="button" className="px-4 py-3 bg-white border border-medic-300 rounded-lg text-medic-600 hover:bg-medic-50 shadow-sm flex items-center gap-2">
                    <Filter size={20} />
                    <span className="hidden md:inline">Filters</span>
                </button>
                <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm font-medium">
                    Search
                </button>
            </form>

            {/* AI Assistant Hint */}
            <div className="mt-2 text-xs text-medic-500 flex items-center gap-2">
                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">New</span>
                Try searching naturally like "Show me lung cancer samples from female patients under 50"
            </div>
        </div>
    );
};

export default SampleSearch;
