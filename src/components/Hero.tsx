"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Mesh/Gradient */}
      <div className="absolute inset-0 premium-gradient -z-10"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mesh.png')] opacity-20 -z-10"></div>
      
      {/* Animated Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -z-10"></div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-accent text-sm font-semibold mb-2"
          >
            <Star className="w-4 h-4 fill-accent" />
            <span>Trusted by 12,000+ Monthly Readers</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight"
          >
            FINANCIAL FREEDOM <span className="text-accent">STARTS HERE</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            We reveal the strategies used by the top 1% to save $47,000+ and generate $5,000/month from simple side hustles.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link 
              href="/blog" 
              className="w-full sm:w-auto px-8 py-4 bg-accent text-primary font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-white transition-all shadow-xl hover:shadow-accent/20 active:scale-95"
            >
              <span>Browse 8 Guides</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/pricing" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white/30 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center active:scale-95"
            >
              Go Pro Plus
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-16 border-t border-white/10 mt-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">47k+</div>
              <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">Articles Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">12k+</div>
              <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">Monthly Readers</div>
            </div>
            <div className="text-center hidden md:block">
              <div className="text-3xl font-bold text-white mb-1">8+</div>
              <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">Expert Guides</div>
            </div>
          </motion.div>

          {/* Email Subscription Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto mt-12 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-3 items-center"
          >
            <div className="flex-1 text-left px-4">
              <span className="text-white font-medium block">Get weekly money tips — Free</span>
              <span className="text-white/40 text-xs">Join 5,000+ subscribers</span>
            </div>
            <div className="flex w-full sm:w-auto gap-2 p-1">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className="w-full sm:w-48 bg-white/10 border-0 focus:ring-0 text-white placeholder-white/30 rounded-lg px-4 py-2"
              />
              <button className="bg-white text-primary px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors shrink-0">
                Join
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
