import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import axios from 'axios';
import { auth } from '../firebase';
import API_URL from '../config';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm your ICBI Research Assistant. How can I help you find tissue samples today?" }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Call Backend AI
        try {
            const user = auth.currentUser;
            let token = '';
            if (user) {
                token = await user.getIdToken();
            }

            // Show typing indicator or just wait
            // We'll just wait for response for now, optimistically

            const res = await axios.post(`${API_URL}/api/ai/chat`, {
                message: userMsg.text
            }, {
                headers: user ? { Authorization: `Bearer ${token}` } : {}
            });

            setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);

        } catch (error) {
            console.error("AI Error:", error);
            let errorMsg = "Sorry, I'm having trouble connecting to the server.";
            if (error.response?.status === 401 || error.response?.status === 403) {
                errorMsg = "Please log in to chat with the assistant.";
            } else if (error.response?.data?.error) {
                errorMsg = `Error: ${error.response.data.error}`;
            }
            setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-medic-200 overflow-hidden mb-4 flex flex-col h-[500px] transition-all duration-300 ease-in-out">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <MessageSquare size={18} />
                            </div>
                            <span className="font-bold">ICBI AI Assistant</span>
                        </div>
                        <button onClick={toggleChat} className="hover:bg-white/10 p-1 rounded transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-medic-50 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-white text-medic-800 border border-medic-200 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-medic-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about samples, protocols..."
                            className="flex-grow px-4 py-2 rounded-full border border-medic-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                        />
                        <button type="submit" className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition shadow-sm disabled:opacity-50">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="group flex items-center gap-2 bg-primary-600 text-white pl-4 pr-2 py-3 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    <span className="font-bold text-sm">Need help? Click me</span>
                    <div className="bg-white/20 p-2 rounded-full">
                        <MessageSquare size={20} />
                    </div>
                </button>
            )}
        </div>
    );
};

export default AIAssistant;
