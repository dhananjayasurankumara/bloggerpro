"use client";

import { ShoppingCart, Download, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  isFeatured: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image || undefined,
      quantity: 1,
      type: 'product'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Section */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-zinc-800">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
          {product.category}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-6 right-6 px-6 py-2 bg-primary text-white text-lg font-display font-bold rounded-2xl shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
          ${product.price.toFixed(2)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className="w-3 h-3 text-accent fill-accent" />
          ))}
          <span className="text-[10px] font-bold text-gray-400 ml-2 uppercase tracking-tight">Top Rated</span>
        </div>
        
        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Download className="w-3.5 h-3.5" />
            Instant Download
          </div>
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-gray-50 dark:bg-zinc-800 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
          >
             <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
