import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Example icon usage
import AIAssistant from './AIAssistant';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-medic-50">
            {/* Navbar */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-medic-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary-700">ICB India</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-medic-600 hover:text-primary-600 font-medium">Home</Link>
                        <Link to="/about" className="text-medic-600 hover:text-primary-600 font-medium">About</Link>
                        <Link to="/contact" className="text-medic-600 hover:text-primary-600 font-medium">Contact</Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-md transition font-medium">Login</Link>
                        <Link to="/register" className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md shadow-sm transition font-medium">Desc</Link>
                    </div>

                    {/* Mobile menu button (placeholder) */}
                    <button className="md:hidden p-2 text-medic-600">
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-medic-900 text-medic-300 py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">ICB India</h3>
                        <p className="text-sm">Connecting researchers and hospitals to advance cancer research.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/search" className="hover:text-white">Search Samples</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <p className="text-sm">support@icbindia.org</p>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-8 pt-8 border-t border-medic-800 text-center text-xs">
                    © {new Date().getFullYear()} ICB India. All rights reserved.
                </div>
            </footer>
            <AIAssistant />
        </div>
    );
};

export default Layout;
