'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        sender: 'bot',
        text: 'Hello! Welcome to High IQ Montessori School. I am your AI Admission Assistant. How can I help you today? You can ask about our admissions, fees, curriculum, or location!',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      let botResponse = '';
      const text = userMsg.toLowerCase();

      if (text.includes('fee') || text.includes('cost') || text.includes('price')) {
        botResponse = 'Our tuition fee structure is structured by academic grade (Creche, Nursery, Primary, and College). For example, Nursery tuition is approximately ₦250,000 per term. Instalment payment options and partial scholarships are available for high-performing students. Would you like to schedule a call with our finance officer?';
      } else if (text.includes('admissions') || text.includes('apply') || text.includes('register') || text.includes('admission')) {
        botResponse = 'Admissions for the 2025/2026 academic session are currently open! You can download the prospectus from the footer or submit an online application by clicking the "Apply Now" button on our home page or visiting /admissions.';
      } else if (text.includes('curriculum') || text.includes('british') || text.includes('nigerian') || text.includes('teach')) {
        botResponse = 'We run a hybrid integration of the Montessori Philosophy (for preschool/early years) combined with the British National Curriculum and the Nigerian NERDC Curriculum. We also teach Coding, Robotics, and active STEM subjects starting from Primary 1.';
      } else if (text.includes('location') || text.includes('where') || text.includes('address') || text.includes('ikorodu')) {
        botResponse = 'High IQ Montessori School is located in Ikorodu, Lagos, Nigeria. Our campus features state-of-the-art classrooms, coding labs, a school clinic, and extensive sports play areas. You can view our map on the Contact page!';
      } else if (text.includes('robotics') || text.includes('coding') || text.includes('stem')) {
        botResponse = 'High IQ Montessori School is a pioneer in technological education. Our students build and code functional robots, study Scratch and Python, and participate in global STEM science exhibitions.';
      } else if (text.includes('phone') || text.includes('contact') || text.includes('call') || text.includes('email')) {
        botResponse = 'You can reach our main admissions frontdesk at 0803 123 4567 or 0812 345 6789, or email us directly at info@highiqmontessori.edu.ng. We also have a Live WhatsApp chat button on our website contact page!';
      } else {
        botResponse = "I appreciate your question! High IQ Montessori School offers dedicated Montessori instruction, premium STEM courses, and world-class care. You can find detailed files in the 'Admissions' menu, or call our enrollment officer at 0803 123 4567 or 0812 345 6789.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-poppins">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-light text-white dark:bg-gold dark:text-slate-900 p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-gold/40"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Interface Panel */}
      {isOpen && (
        <div className="bg-white dark:bg-dark-card w-[340px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gold text-slate-900 p-1.5 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Admissions Bot</h4>
                <span className="block text-[10px] text-slate-300">High IQ School Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Logs */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-dark-bg/50">
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={index} className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
                  {isBot && (
                    <div className="bg-primary text-white p-1 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded-tl-none'
                        : 'bg-primary dark:bg-gold text-white dark:text-slate-900 rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {!isBot && (
                    <div className="bg-gold text-slate-900 p-1 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="bg-primary text-white p-1 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none p-3 text-xs flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card flex gap-2">
            <input
              type="text"
              placeholder="Ask about admissions, fees, location..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-transparent focus:border-gold outline-none text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 p-2.5 rounded-xl flex items-center justify-center transition-colors hover:scale-105 active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
export default AIChatbot;
