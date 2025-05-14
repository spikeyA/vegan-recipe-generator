import React from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function VoiceInput({ setInput, setOutput }) {
  const handleVoice = () => {
    if (!recognition) {
      alert('Speech recognition not supported.');
      return;
    }

    recognition.lang = 'en-US';
    recognition.start();

    recognition.onstart = () => setOutput('🎙️ Listening...');
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setOutput(`Heard: "${transcript}"`);
    };

    recognition.onerror = (e) => setOutput('Voice error: ' + e.error);
  };

  return <button onClick={handleVoice}>🎤 Use Voice</button>;
}

export default VoiceInput;
