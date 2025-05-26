import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, MessageCircle, Zap, Leaf } from 'lucide-react';

const VoiceChatBot = () => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const conversationRef = useRef(null);

  // Mock API configuration for demo (process.env not available in Claude artifacts)
  const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;
  const VOICE_ID = process.env.REACT_APP_ELEVENLABS_VOICE_ID ;

  console.log("ELEVENLABS_API_KEY:", ELEVENLABS_API_KEY);
  console.log("VOICE_ID:", VOICE_ID);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Mock OpenAI call for demo
  const callOpenAI = async (prompt) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      "Here's a delicious vegan recipe you might enjoy! Try making a colorful Buddha bowl with quinoa, roasted vegetables, and tahini dressing.",
      "For a quick vegan meal, I recommend chickpea curry with coconut milk, served over rice with fresh cilantro.",
      "How about some vegan chocolate avocado mousse? It's surprisingly creamy and healthy!",
      "A great vegan breakfast option is overnight oats with almond milk, chia seeds, and fresh berries.",
      "Try making vegan tacos with seasoned lentils, fresh salsa, and cashew cream!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  // Mock audio level animation
  useEffect(() => {
    let interval;
    if (listening) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [listening]);

   // ElevenLabs text-to-speech function
  const speakWithElevenLabs = async (text) => {
    if (!ELEVENLABS_API_KEY) {
      console.warn('ElevenLabs API key not found, falling back to browser TTS');
      speakWithBrowser(text);
      return;
    }

    try {
      setSpeaking(true);
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      };
      
      audio.onerror = () => {
        setSpeaking(false);
        console.error('Audio playback error');
        setCurrentAudio(null);
      };

      await audio.play();
      
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      setSpeaking(false);
      // Fallback to browser TTS
      speakWithBrowser(text);
    }
  };
   // Fallback browser TTS function
  const speakWithBrowser = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    utter.pitch = 1;
    
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    
    synth.speak(utter);
  };
  const stopSpeaking = () => {
    setSpeaking(false);
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    window.speechSynthesis.cancel();
  };

  const addToConversation = (type, message) => {
    const newMessage = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversation(prev => [...prev, newMessage]);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    stopSpeaking();

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const userSpeech = event.results[0][0].transcript;
      setTranscript(userSpeech);
      setListening(false);
      
      addToConversation('user', userSpeech);

      try {
        const prompt = `You are a helpful vegan recipe assistant. Answer this question: "${userSpeech}"`;
        const answer = await callOpenAI(prompt);
        setResponse(answer);
        
        addToConversation('bot', answer);
        
        await speakWithElevenLabs(answer);
        
      } catch (error) {
        console.error('Error processing voice input:', error);
        const errorMessage = "Sorry, I couldn't process your request. Please try again.";
        setResponse(errorMessage);
        addToConversation('bot', errorMessage);
        await speakWithElevenLabs(errorMessage);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
      
      let errorMessage = "Sorry, I couldn't understand that. Please try again.";
      if (event.error === 'no-speech') {
        errorMessage = "I didn't hear anything. Please try speaking again.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Microphone access denied. Please check your permissions.";
      }
      
      setResponse(errorMessage);
      addToConversation('bot', errorMessage);
      speakWithElevenLabs(errorMessage);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const clearConversation = () => {
    setConversation([]);
    setResponse('');
    setTranscript('');
  };

  const Button = ({ onClick, children, className = '', disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  const Card = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300 ${className}`}>
      {title && <h3 className="text-xl font-bold text-green-800 mb-4 text-center">{title}</h3>}
      {children}
    </div>
  );

  return (
    <div 
      className="vegan-gradient-bg"
      style={{ 
        minHeight: "100vh", 
        padding: "2rem 0",
        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }}
    >
      {/* Header at the very top center */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#166534",
          margin: "0 0 4rem 0",
          textAlign: "center",
          textShadow: "0 2px 8px #bbf7d0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.7rem",
          width: "100%",
        }}
      >
        <Leaf style={{ color: "#22c55e", fontSize: "2.2rem" }} />
        🎤 Voice-Activated Vegan Assistant
      </h1>

      {/* Main content below header, centered horizontally */}
      <div style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6rem",
        padding: "0 1.5rem"
      }}>
        {/* Voice Control Card */}
        <Card title="Voice Controls" className="w-full">
           {/* BUTTONS FLEX CONTAINER */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "2rem",
      marginBottom: "1.5rem"
    }}
  >
            {/* Main Voice Button */}
             {/* Start Talking / Listening Button */}
  <button
    onClick={handleVoiceInput}
    disabled={listening || speaking}
    style={{
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      border: "none",
      background: listening
        ? "linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
        : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      color: "#fff",
      fontSize: "1.2rem",
      fontWeight: "bold",
      boxShadow: listening
        ? "0 0 0 6px #fecaca, 0 4px 24px #f87171"
        : "0 0 0 6px #bbf7d0, 0 4px 24px #22c55e",
      transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
      transform: listening ? "scale(1.08)" : "scale(1)",
      cursor: listening || speaking ? "not-allowed" : "pointer",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
    onMouseOver={e => {
      if (!listening && !speaking) e.currentTarget.style.background = "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)";
    }}
    onMouseOut={e => {
      if (!listening && !speaking) e.currentTarget.style.background = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
    }}
  >
    {listening ? "🎤 Listening..." : "🎤 Start Talking"}
  </button>

  {/* Stop Speaking Button */}
  <button
    onClick={stopSpeaking}
    disabled={!speaking}
    style={{
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      border: "none",
      background: speaking
        ? "linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
        : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
      color: speaking ? "#fff" : "#9ca3af",
      fontSize: "1.5rem",
      fontWeight: "bold",
      boxShadow: speaking
        ? "0 0 0 4px #fecaca, 0 2px 12px #f87171"
        : "0 0 0 4px #e5e7eb, 0 2px 12px #d1d5db",
      transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
      transform: speaking ? "scale(1.05)" : "scale(1)",
      cursor: speaking ? "pointer" : "not-allowed",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
    onMouseOver={e => {
      if (speaking) e.currentTarget.style.background = "linear-gradient(135deg, #dc2626 0%, #f87171 100%)";
    }}
    onMouseOut={e => {
      if (speaking) e.currentTarget.style.background = "linear-gradient(135deg, #ef4444 0%, #f87171 100%)";
    }}
  >
    🛑
  </button>
          </div>

          {/* Status Text */}
          <div className="text-center">
            {listening && (
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span className="ml-2 font-semibold">🎧 Listening for your voice...</span>
              </div>
            )}
            {speaking && (
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">🗣️ Speaking response...</span>
              </div>
            )}
            {!listening && !speaking && (
              <p className="text-green-700 font-semibold text-lg">Tap the microphone to start talking</p>
            )}
          </div>
        </Card>

        {/* Conversation Card */}
        <Card title="Conversation" className="w-full">
          <div 
            ref={conversationRef}
            className="h-80 overflow-y-auto p-4 bg-green-50 rounded-lg border border-green-200"
          >
            {conversation.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <p className="text-green-600 text-lg font-semibold mb-4">Start a conversation about vegan recipes!</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Buddha bowls', 'Vegan desserts', 'Quick meals', 'Protein sources'].map((topic) => (
                    <span key={topic} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                        msg.type === 'user'
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : 'bg-white text-green-800 rounded-bl-sm border border-green-200'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-green-100' : 'text-green-500'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {conversation.length > 0 && (
            <div className="mt-4 text-center">
              <Button onClick={clearConversation} className="bg-red-500 hover:bg-red-600">
                Clear Conversation
              </Button>
            </div>
          )}
        </Card>

        {/* Stats and Setup Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Quick Stats */}
          <Card title="Session Stats">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-medium">Messages</span>
                <span className="font-bold text-green-600 text-xl">{conversation.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-medium">Voice Status</span>
                <span className={`font-bold text-lg ${listening ? 'text-red-500' : speaking ? 'text-blue-500' : 'text-green-500'}`}>
                  {listening ? 'Listening' : speaking ? 'Speaking' : 'Ready'}
                </span>
              </div>
            </div>
          </Card>

          {/* Setup Instructions */}
          <Card title="Setup Guide">
            <button
              onClick={() => setIsSetupOpen(!isSetupOpen)}
              className="w-full text-left hover:bg-green-50 p-2 rounded transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">ElevenLabs Setup</span>
                </div>
                <div className={`transform transition-transform duration-200 text-green-600 ${isSetupOpen ? 'rotate-180' : ''}`}>
                  ↓
                </div>
              </div>
            </button>
            
            {isSetupOpen && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                  <li>Get API key from <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-semibold">ElevenLabs</a></li>
                  <li>Add to your .env file:</li>
                </ol>
                <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                  <code className="text-xs text-gray-800">
                    REACT_APP_ELEVENLABS_API_KEY = ELEVENLABS_API_KEY<br/>
                    REACT_APP_ELEVENLABS_VOICE_ID = VOICE_ID
                  </code>
                </div>
                <p className="text-xs text-green-600 mt-2 font-medium">
                  Without API key, browser TTS will be used as fallback.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Tips Card */}
        <Card title="💡 Usage Tips" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-center"><span className="mr-2">🎯</span> Speak clearly and wait for the beep</li>
              <li className="flex items-center"><span className="mr-2">🥗</span> Ask about ingredients, recipes, or cooking tips</li>
            </ul>
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-center"><span className="mr-2">⏹️</span> You can interrupt the bot by tapping stop</li>
              <li className="flex items-center"><span className="mr-2">💬</span> Try: "What's a good vegan breakfast?"</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VoiceChatBot;