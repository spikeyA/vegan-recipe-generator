import React, { useState } from 'react';
import { callOpenAI } from '../utils/api';

const VoiceChatBot = () => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [listening, setListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    synth.speak(utter);
  };

  const stopSpeaking = () => {
   window.speechSynthesis.cancel(); // stops any ongoing speech
 };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition not supported.');
      return;
    }

    recognition.lang = 'en-US';
    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const userSpeech = event.results[0][0].transcript;
      setTranscript(userSpeech);
      setListening(false);

      // Call OpenAI with voice input
      const prompt = `You are a helpful vegan recipe assistant. Answer this question: "${userSpeech}"`;
      const answer = await callOpenAI(prompt);
      setResponse(answer);
      speak(answer);
    };

    recognition.onerror = (err) => {
      console.error('Voice error:', err);
      setListening(false);
    };
  };

  return (
    <div className="voice-chatbot">
      <h2>🎤 Voice-Activated Vegan Chatbot</h2>
      <button onClick={handleVoiceInput}>
        {listening ? 'Listening...' : 'Start Talking'}
      </button>
      <button onClick={stopSpeaking}>
        🛑 Stop Speaking
        </button>
    
      <div className="voice-display">
        <p><strong>You said:</strong> {transcript}</p>
        <p><strong>Bot:</strong> {response}</p>
      </div>
    </div>
  );
};

export default VoiceChatBot;
