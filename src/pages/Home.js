import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-6">🌿 Welcome to Vegan Assistant</h1>
      <p className="text-lg mb-10 text-gray-700">Choose an option below:</p>

      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={() => navigate('/generator')}
          className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          🥗 Vegan Recipe Generator
        </button>

        <button
          onClick={() => navigate('/chatbot')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          🤖 Vegan Chatbot
        </button>
      </div>
    </div>
  );
}

export default Home;
