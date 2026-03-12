"use client";

import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

interface AnimatedArticleHeaderProps {
  title: string;
  authorName: string;
  createdAt: string;
  readTime: string;
  isPaywalled: boolean;
}

export default function AnimatedArticleHeader({
  title,
  authorName,
  createdAt,
  readTime,
  isPaywalled,
}: AnimatedArticleHeaderProps) {
  return (
    <div className="max-w-4xl mx-auto text-center mb-12 space-y-6">
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight"
      >
        {title}
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 text-[10px] font-bold text-primary">
            {authorName.charAt(0)}
          </div>
          <span className="text-gray-900 dark:text-gray-100 font-bold">{authorName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{createdAt}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{readTime}</span>
        </div>
        {isPaywalled && (
          <div className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black rounded-full uppercase tracking-tighter">
            Preview Mode
          </div>
        )}
      </motion.div>
    </div>
  );
}
