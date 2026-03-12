"use client";

import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RestrictedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-[40px] flex items-center justify-center text-red-500">
            <ShieldAlert className="w-12 h-12" />
          </div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
            Access Restricted
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Unauthorized attempt to access developer tools or source code has been detected. For security reasons, this action is prohibited on BLOGGERPRO.
          </p>
        </div>

        <div className="pt-6 flex flex-col gap-3">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            Close Dev and Go Back Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous Page
          </button>
        </div>

        <div className="pt-12">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">
            BloggerPro Security Engine
          </p>
        </div>
      </div>
    </div>
  );
}
