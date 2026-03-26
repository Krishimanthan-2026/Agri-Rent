import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Mic, MicOff } from 'lucide-react';
import { useAuth } from '../context';

export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! I am your AI assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Cleanup if component unmounts while listening
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!user) return null; // Only show for logged in users

  const startListening = (e) => {
    if (e) e.preventDefault();
    if (isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (err) {}
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript) {
        setInput(prev => (prev.trim() + " " + currentTranscript.trim()).trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = (e) => {
    if (e) e.preventDefault();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: input }];
    setMessages(newMsgs);
    setInput('');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=AIzaSyAxFio0a_lFHhMSpaGaaxpSqywLxZoCLQU`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: "You are an AI assistant for AgriRent, a platform for renting agricultural equipment (tractors, harvesters, etc.). Answer the following query concisely: " + input }]
            }
          ]
        })
      });
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't understand that.";
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I am having trouble connecting right now." }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999,
            backgroundColor: 'var(--color-primary)', color: 'white', border: 'none',
            borderRadius: '50%', width: '60px', height: '60px',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)', cursor: 'pointer'
          }}
          title="AI Suggestion"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
          width: '350px', height: '500px', backgroundColor: 'white',
          borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>AI Suggestion</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f9f9f9' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? 'var(--color-secondary)' : '#e0e0e0',
                color: msg.sender === 'user' ? 'white' : 'black',
                padding: '0.8rem 1rem', borderRadius: '15px', maxWidth: '80%', fontSize: '0.9rem'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form style={{ padding: '1rem', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem', backgroundColor: 'white', alignItems: 'center' }} onSubmit={handleSend}>
            <button 
              type="button"
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onMouseLeave={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: isListening ? '#dc3545' : '#666',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.2rem',
                transform: isListening ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.1s ease, color 0.1s ease'
              }}
              title="Hold to speak"
            >
              <Mic size={24} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={{ flex: 1, padding: '0.6rem', border: '1px solid #ccc', borderRadius: '20px', outline: 'none' }}
            />
            <button type="submit" style={{
              backgroundColor: 'var(--color-primary)', color: 'white', border: 'none',
              borderRadius: '50%', width: '40px', height: '40px', display: 'flex',
              justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
            }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
