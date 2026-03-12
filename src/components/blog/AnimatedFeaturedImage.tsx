"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

interface AnimatedFeaturedImageProps {
  src?: string | null;
  title: string;
  isPremium: boolean;
}

export default function AnimatedFeaturedImage({
  src,
  title,
  isPremium,
}: AnimatedFeaturedImageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="max-w-6xl mx-auto mb-16 rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] relative bg-gray-100 dark:bg-zinc-900"
    >
      {src ? (
        <Image 
          src={src} 
          alt={title}
          fill
          priority
          className="object-cover" 
          sizes="(max-width: 1536px) 100vw, 1536px"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      {isPremium && (
        <div className="absolute top-8 right-8 z-10 px-6 py-2 bg-accent text-primary font-bold rounded-xl shadow-2xl flex items-center gap-2 transform hover:scale-105 transition-transform">
          <ShieldCheck className="w-5 h-5" />
          <span>PREMIUM ARTICLE</span>
        </div>
      )}
    </motion.div>
  );
}
