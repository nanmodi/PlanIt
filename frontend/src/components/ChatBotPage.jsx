import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
const ChatBotPage = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = async () => {
    if (!prompt.trim()) return;
    
    const userMessage = prompt.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setPrompt('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:3000/ai/chat', { prompt: userMessage },{withCredentials:true});
      setMessages(prev => [...prev, { type: 'bot', content: res.data.response }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getResponse();
    }
  };

  const formatBotMessage = (content) => {
    if (!content) return null;
    
    return content.split("\n").map((paragraph, idx) => {
      // Check if paragraph is a code block
      if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
        return (
          <div key={idx} className="bg-gray-800 p-3 rounded-md my-2 font-mono text-sm overflow-x-auto">
            {paragraph.slice(3, -3)}
          </div>
        );
      }
      
      // Regular paragraph
      return paragraph ? (
        <p key={idx} className="mb-2">
          {paragraph}
        </p>
      ) : <br key={idx} />;
    });
  };

  return (
    <>
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white p-4 md:p-6">
      <div className="w-full max-w-4xl flex flex-col h-[90vh] bg-gray-800 bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">AI Chat Assistant</h1>
          </div>
          <div className="text-xs bg-blue-600 px-2 py-1 rounded-full">Online</div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-light">Ask me anything!</p>
              <p className="text-sm mt-2">Type your question below to get started</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : message.type === 'error'
                        ? 'bg-red-600 text-white rounded-tl-none'
                        : 'bg-gray-800 text-white border border-gray-700 rounded-tl-none'
                  }`}
                >
                  {message.type === 'bot' || message.type === 'error' 
                    ? formatBotMessage(message.content)
                    : message.content
                  }
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700 flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 px-4 py-3 text-white bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ minHeight: '50px', maxHeight: '120px' }}
            />
            <button 
              onClick={getResponse}
              disabled={isLoading || !prompt.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div></>
  );
};

export default ChatBotPage;