"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Bot, ShieldCheck, ExternalLink, Paperclip } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HelpdeskWidget() {
  const { t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: t('helpdesk_bot_welcome') }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = { id: Date.now(), sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate Institutional Agent Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: "bot", 
          text: t('helpdesk_bot_response')
        }
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-[100] bg-gradient-to-br from-[#c5a059] to-[#d4af37] text-[#022c22] p-5 rounded-2xl shadow-[0_20px_50px_rgba(197,160,89,0.3)] transition-all hover:scale-110 active:scale-95 group ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#022c22] rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-8 right-8 z-[100] w-[90vw] md:w-[420px] bg-[#03362a]/95 backdrop-blur-2xl border border-[#c5a059]/30 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-fade-in-up`}
          dir={dir}
        >
          {/* Header */}
          <div className="bg-[#022c22]/80 backdrop-blur-md border-b border-[#064e3b] px-6 py-5 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-2xl flex items-center justify-center border border-[#c5a059]/20 shadow-inner">
                  <Bot className="w-6 h-6 text-[#c5a059]" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#022c22] rounded-full" />
              </div>
              <div>
                <h4 className="font-black text-white text-base tracking-tight">{t('helpdesk_title')}</h4>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mt-1">{t('helpdesk_online')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
               {/* Telegram Shortcut (Urgent/Compliance) */}
               <a 
                 href="https://t.me/openclaw" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="p-2.5 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 rounded-xl text-[#0088cc] transition-colors group"
                 title="Telegram (Urgent Support)"
               >
                  <ExternalLink className="w-4 h-4" />
               </a>
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Chat Body */}
          <div 
            ref={scrollRef}
            className="flex-1 p-6 h-[450px] overflow-y-auto bg-gradient-to-b from-[#022c22]/40 to-transparent space-y-6 scrollbar-hide"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] rounded-[24px] p-4 text-sm leading-relaxed shadow-lg ${
                  msg.sender === "user" 
                    ? "bg-gradient-to-br from-[#c5a059] to-[#d4af37] text-[#022c22] font-semibold rounded-tr-none" 
                    : "bg-[#03362a] border border-[#064e3b]/60 text-gray-200 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-2 px-1">
                  {msg.sender === "user" ? "Investorendialog" : "Institutional Desk"} · 12:00
                </span>
              </div>
            ))}
          </div>

          {/* Compliance Badge */}
          <div className="px-6 py-2 bg-[#022c22]/30 flex items-center justify-center gap-2 border-y border-[#064e3b]/40">
             <ShieldCheck className="w-3 h-3 text-green-500/50" />
             <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">Encrypted Institutional Gateway</span>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[#022c22]/80 border-t border-[#064e3b] backdrop-blur-xl">
            <div className="flex gap-3 bg-[#03362a] border border-[#064e3b] rounded-[20px] p-2 pr-2 focus-within:border-[#c5a059]/40 transition-colors">
              <button className="p-2 text-gray-500 hover:text-[#c5a059] transition-colors">
                 <Paperclip className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('helpdesk_placeholder')}
                className="flex-1 bg-transparent border-none rounded-xl px-2 text-sm text-white focus:outline-none placeholder:text-gray-600 placeholder:font-bold"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-[#c5a059] hover:bg-white text-[#022c22] p-3 rounded-xl transition-all shadow-lg active:scale-90 disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
