"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Zap, Bot, User, Loader2 } from "lucide-react";
import axios from "axios";

export default function BlogBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([
    { role: "assistant", content: "Welcome to the ProBot Knowledge Base. Ask me about wealth building, passive income, or my elite financial guides." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response.data.content }]);
    } catch (error: any) {
      const fallbackContent = error.response?.data?.content || "I'm having a brief sync issue, but I'm still here! Feel free to explore our wealth guides while I recalibrate.";
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: fallbackContent 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white dark:bg-black rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-900 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">ProBot Knowledge Base</h4>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-white/60">Expert Pre-Loaded Knowledge</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/50 scroll-smooth"
            >
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user" 
                      ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                      : "bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-none shadow-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-black border-t dark:border-gray-900">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about wealth building..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Questions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                    "How to build passive income?",
                    "What are the best AI tools?",
                    "Real estate basics",
                    "Stock market for beginners"
                ].map((q) => (
                    <button 
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="px-3 py-1 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-lg text-[10px] font-bold text-gray-500 hover:border-primary hover:text-primary transition-all active:scale-95"
                    >
                        {q}
                    </button>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                    Financial Freedom Starts Here
                  </p>
                  <p className="text-[8px] text-center text-gray-400/60 leading-tight">
                      Disclaimer: This bot provides pre-loaded financial insights and does not constitute professional financial advice.
                  </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-opacity-90 transition-all z-50 group border-b-4 border-primary/40"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-primary"></span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
