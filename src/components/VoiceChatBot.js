import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react';

// Mock API function - replace with your actual implementation
const callOpenAI = async (userInput) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response with vegan-focused content
  const responses = [
    `🌱 That's a great question about plant-based living! Here's what I think: ${userInput.includes('recipe') ? 'For delicious vegan recipes, try incorporating more legumes, whole grains, and seasonal vegetables. They provide amazing flavors and nutrition!' : userInput.includes('health') ? 'A well-planned vegan diet can provide all the nutrients your body needs while supporting environmental sustainability.' : 'Living a vegan lifestyle is not just about food - it\'s about compassion, health, and environmental consciousness. Every small step makes a difference!'}`,
    
    `🌿 I love discussing vegan topics! ${userInput.includes('protein') ? 'Plant-based proteins like lentils, quinoa, tofu, and hemp seeds are fantastic sources that can easily meet your daily needs.' : userInput.includes('cooking') ? 'Vegan cooking is so creative! Try experimenting with nutritional yeast for cheesy flavors, or cashews for creamy textures.' : 'The vegan community is incredibly supportive and innovative. There are so many resources available to help you on your journey!'}`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const VoiceChatBot = () => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  const recognitionRef = useRef(null);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }
  }, [SpeechRecognition]);

  const speak = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text.replace(/🌱|🌿|💚|🎤|🗣️/g, ''));
    utter.lang = 'en-US';
    utter.rate = 0.9;
    utter.pitch = 1.1;
    
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    
    synth.speak(utter);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const handleVoiceInput = async () => {
    if (!recognitionRef.current) {
      alert('🎤 Speech recognition not supported in this browser. Please try Chrome or Safari.');
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    try {
      setListening(true);
      setTranscript('');
      
      recognitionRef.current.onstart = () => {
        setTranscript('🎤 Listening... speak now!');
      };

      recognitionRef.current.onresult = async (event) => {
        const userSpeech = event.results[0][0].transcript;
        setTranscript(userSpeech);
        setListening(false);
        setLoading(true);
        
        try {
          const botResponse = await callOpenAI(userSpeech);
          setResponse(botResponse);
          
          // Add to chat history
          setChatHistory(prev => [...prev, 
            { type: 'user', content: userSpeech, timestamp: new Date() },
            { type: 'bot', content: botResponse, timestamp: new Date() }
          ]);
          
          // Speak the response
          speak(botResponse);
        } catch (error) {
          const errorMsg = '❌ Sorry, I had trouble processing that. Please try again!';
          setResponse(errorMsg);
          speak(errorMsg);
        } finally {
          setLoading(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setListening(false);
        setTranscript(`Voice error: ${event.error}. Please try again.`);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      setListening(false);
      alert('Error starting voice recognition. Please try again.');
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setTranscript('');
    setResponse('');
    stopSpeaking();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 relative">
            <button 
              onClick={() => window.history.back()}
              className="absolute left-0 p-2 hover:bg-green-200 rounded-full transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-green-800 flex items-center gap-3">
              🌿 Vegan Voice Assistant
            </h1>
          </div>
          <p className="text-green-600 text-lg">
            Have a conversation about plant-based living, recipes, and lifestyle tips!
          </p>
        </div>

        {/* Voice Controls */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={handleVoiceInput}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-4 rounded-full text-white font-semibold transition-all transform hover:scale-105 ${
                listening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {listening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop Listening
                </>
              ) : loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Start Voice Chat
                </>
              )}
            </button>

            <button 
              onClick={speaking ? stopSpeaking : () => response && speak(response)}
              disabled={!response}
              className="flex items-center gap-2 px-4 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button 
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Clear
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            {listening && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span className="ml-2">Listening for your voice...</span>
              </div>
            )}
            {!listening && !loading && (
              <span>💚 Click the microphone to start a voice conversation about vegan living!</span>
            )}
          </div>
        </div>

        {/* Current Conversation */}
        {(transcript || response) && (
          <div className="space-y-4 mb-6">
            {transcript && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
                  🗣️ You said:
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-800 font-medium">{transcript}</p>
                </div>
              </div>
            )}

            {response && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                  🌱 Assistant Response:
                  {speaking && <span className="text-sm text-green-600 ml-2">(Speaking...)</span>}
                </h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{response}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
              💬 Conversation History
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'bg-green-50 border-l-4 border-green-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">
                      {message.type === 'user' ? '🗣️ You' : '🌱 Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
            💡 How to Use
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p><strong>🎤 Voice Chat:</strong> Click the microphone to start speaking</p>
              <p><strong>🔊 Audio:</strong> The assistant will speak responses back to you</p>
              <p><strong>🗂️ History:</strong> View your conversation history below</p>
            </div>
            <div className="space-y-2">
              <p><strong>🌱 Topics:</strong> Ask about vegan recipes, nutrition, lifestyle</p>
              <p><strong>🥗 Examples:</strong> "How do I get protein on a vegan diet?"</p>
              <p><strong>🍳 Cooking:</strong> "What's a quick vegan dinner idea?"</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>🌿 Your friendly voice assistant for all things plant-based!</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceChatBot;