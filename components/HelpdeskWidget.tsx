"use client";

import { useState } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";

export default function HelpdeskWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Salam! Wie können wir Ihnen bei Ihrem Sharia-konformen Investment helfen?" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = { id: Date.now(), sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate Agent Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: "bot", 
          text: "Vielen Dank für Ihre Anfrage. Ein Institutional Account Manager wird sich in Kürze mit Ihnen in Verbindung setzen. (Demo-Modus)" 
        }
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] p-4 rounded-full shadow-2xl transition-transform hover:scale-105 ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-[#03362a] border border-[#064e3b] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-[#022c22] border-b border-[#064e3b] px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#c5a059]/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#c5a059]" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Amanah Support</h4>
                <p className="text-[10px] text-green-400 font-medium">● Online (Institutional Team)</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-[#022c22]/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.sender === "user" 
                    ? "bg-[#064e3b] text-white rounded-tr-none" 
                    : "bg-[#03362a] border border-[#064e3b] text-gray-300 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#03362a] border-t border-[#064e3b] flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Schreiben Sie uns..."
              className="flex-1 bg-[#022c22] border border-[#064e3b] rounded-xl px-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
            />
            <button 
              onClick={handleSend}
              className="bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] p-2 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
