"use client";

import { useCart } from "@/context/CartContext";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CreditCard, 
  Lock,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      // For now, we'll simulate a checkout or use the existing Stripe flow for the first item
      // In a full implementation, we'd send the entire cart to a POST /api/checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Link href="/shop" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors group">
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Shop
              </Link>
              <h1 className="text-4xl md:text-5xl font-display font-bold">Secure Checkout</h1>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-3xl shrink-0">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ShoppingBag className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cart Summary</p>
                  <p className="text-lg font-bold">{totalItems} Items Selected</p>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group bg-white dark:bg-zinc-950 p-6 rounded-[32px] border border-gray-100 dark:border-gray-900 flex flex-col sm:flex-row items-center gap-8 hover:shadow-xl transition-all"
                    >
                      <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-10 h-10" />
                          </div>
                        )}
                      </div>

                      <div className="flex-grow space-y-1 text-center sm:text-left">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.type}</p>
                        <h3 className="text-xl font-display font-bold">{item.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-gray-50 dark:bg-zinc-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all text-gray-400 hover:text-primary"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all text-gray-400 hover:text-primary"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-zinc-950 p-20 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-800 text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-900 rounded-[32px] flex items-center justify-center mx-auto text-gray-200">
                       <ShoppingBag className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold">Your cart is empty</h3>
                      <p className="text-gray-400 font-medium">Add some premium tools and guides to get started.</p>
                    </div>
                    <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-opacity-90 transition-all">
                      Browse Shop
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-zinc-950 p-8 rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-xl space-y-8 sticky top-32">
                <h3 className="text-2xl font-display font-bold border-b border-gray-50 dark:border-gray-900 pb-6 uppercase tracking-tight">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                    <span>Taxes</span>
                    <span className="text-gray-900 dark:text-white">$0.00</span>
                  </div>
                  <div className="pt-6 border-t border-gray-50 dark:border-gray-900 flex justify-between items-center">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-3xl font-display font-bold text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl space-y-1 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                       <Lock className="w-3 h-3" /> Secure Transaction
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">BloggerPro uses enterprise-level encryption to protect your financial data.</p>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || isProcessing}
                    className="w-full py-5 bg-primary text-white font-display font-bold rounded-[24px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                  >
                    {isProcessing ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                         <CreditCard className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <CreditCard className="w-6 h-6" />
                    )}
                    {isProcessing ? "Processing..." : "Complete Purchase"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
