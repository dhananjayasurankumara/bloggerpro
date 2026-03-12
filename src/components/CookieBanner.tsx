"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-[400px] z-[100]"
        >
          <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Cookie className="w-6 h-6" />
                </div>
                <button 
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-full text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white">Cookie Preferences</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and serve personalized content. By clicking "Accept", you agree to our use of cookies.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={acceptCookies}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept All
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="px-6 bg-gray-50 dark:bg-zinc-900 text-gray-500 font-bold py-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white transition-all text-sm"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
