"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyTipSection() {
  const [tip, setTip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await axios.get("/api/tips");
        setTip(res.data);
      } catch (error) {
        // Silently fail to fallback tip if API is still synchronizing with database
      } finally {
        setIsLoading(false);
      }
    };
    fetchTip();
  }, []);

  if (isLoading) {
    return (
        <section className="bg-white dark:bg-black py-12 border-b border-gray-100 dark:border-gray-900">
            <div className="container mx-auto px-4 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary opacity-20" />
            </div>
        </section>
    );
  }

  return (
    <section className="bg-white dark:bg-black py-12 border-b border-gray-100 dark:border-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary relative">
                            <Lightbulb className="w-6 h-6" />
                            <motion.div 
                                animate={{ opacity: [0.2, 0.5, 0.2] }} 
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"
                            />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Daily Pro Tip</span>
                            <span className="text-xs font-bold text-gray-400">Smart Financial Moves</span>
                        </div>
                    </div>

                    <div className="h-[1px] w-12 md:h-12 md:w-[1px] bg-gray-100 dark:bg-zinc-800" />

                    <div className="flex-1 text-center md:text-left relative group">
                        <p className="text-lg md:text-xl font-display font-bold text-gray-800 dark:text-gray-200 leading-tight">
                            {tip?.content}
                        </p>
                        <motion.div 
                            className="absolute -right-4 -top-4 text-accent/30"
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Sparkles className="w-6 h-6" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
