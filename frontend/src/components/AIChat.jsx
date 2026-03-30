import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import './AIChat.css';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your AI financial advisor. Ask me anything about improving your finances, managing debt, or reaching your financial goals.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { question: inputValue });

      if (data.success) {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: data.message,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get response');
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: 'Sorry, I encountered an error processing your question. Please try again.',
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h3>💬 AI Financial Advisor</h3>
        <p className="chat-subtitle">Ask questions about your finances</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type} ${msg.isError ? 'error' : ''}`}>
            <div className="message-avatar">{msg.type === 'user' ? '👤' : '🤖'}</div>
            <div className="message-content">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot typing">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chat-error-msg">{error}</div>}

      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything... (e.g., How can I improve my score?)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
          minLength={5}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? '...' : '→'}
        </button>
      </form>

      <div className="chat-suggestions">
        <p className="suggestions-label">Suggested Questions:</p>
        <div className="suggestion-btn-group">
          {[
            'How can I improve my score?',
            'Can I afford a new loan?',
            'How should I build my emergency fund?',
          ].map((suggestion, idx) => (
            <button
              key={idx}
              className="suggestion-btn"
              onClick={() => {
                setInputValue(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
