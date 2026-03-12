"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Menu, 
  X, 
  Zap, 
  ChevronDown, 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Shield,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const user = session?.user as any;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-display font-black tracking-tighter uppercase">
            <span className={isScrolled ? "text-primary dark:text-white" : "text-white"}>BLOGGER</span>
            <span className="text-accent">PRO</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link href="/blog" className="text-sm font-medium hover:text-accent transition-colors">Blog</Link>
          <Link href="/guides" className="text-sm font-medium hover:text-accent transition-colors">Guides</Link>
          <Link href="/shop" className="text-sm font-medium hover:text-accent transition-colors">Shop</Link>
          <Link href="/community" className="text-sm font-medium hover:text-accent transition-colors">Community</Link>
          <Link href="/whats-new" className="text-sm font-medium hover:text-accent transition-colors">What's New</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-accent transition-colors">Pricing</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {session && <NotificationDropdown />}
          
          <Link href="/checkout" className="relative p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full border-2 border-white dark:border-black flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden sm:flex items-center space-x-3">
            {!session ? (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/pricing" 
                  className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Go Pro Plus
                </Link>
              </>
            ) : (
                <>
                  {(user.role !== "ADMIN" && user.role !== "MODERATOR" && user.role !== "PRO" && user.role !== "BUSINESS") && (
                    <Link 
                      href="/pricing" 
                      className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg active:scale-95 mr-4"
                    >
                      Go Pro Plus
                    </Link>
                  )}
                  <div className="relative" ref={userMenuRef}>
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 p-1 pr-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-full hover:border-primary transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm overflow-hidden">
                            {user?.image ? (
                                <img src={user?.image} alt={user?.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || <User className="w-4 h-4" />
                            )}
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute right-0 mt-3 w-64 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-3xl shadow-2xl overflow-hidden py-4 z-[60]"
                            >
                                <div className="px-6 py-3 mb-2 border-b border-gray-50 dark:border-gray-900">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Authenticated Account</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                                    {(user.role === "PRO" || user.role === "BUSINESS" || user.role === "ADMIN" || user.role === "MODERATOR") && (
                                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-accent/20 text-accent text-[8px] font-bold rounded-full uppercase tracking-widest">
                                            PLATFORM PRO
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-y-1 px-2">
                                    <Link onClick={() => setIsUserMenuOpen(false)} href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-primary rounded-xl transition-all">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <Link onClick={() => setIsUserMenuOpen(false)} href={`/profile/${user.id}`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-primary rounded-xl transition-all">
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </Link>
                                    {user.role === "ADMIN" && (
                                        <Link onClick={() => setIsUserMenuOpen(false)} href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all">
                                            <Shield className="w-4 h-4" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link onClick={() => setIsUserMenuOpen(false)} href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-primary rounded-xl transition-all">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <hr className="my-2 border-gray-50 dark:border-gray-900" />
                                    <button 
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-t dark:border-gray-800 shadow-xl overflow-hidden"
            >
                <div className="py-6 px-4 flex flex-col space-y-4">
                    {session && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg uppercase overflow-hidden">
                                {user?.image ? (
                                    <img src={user?.image} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0)
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                    )}
                    
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/blog" className="text-lg font-medium border-b pb-2 dark:border-gray-800 flex justify-between items-center group">
                        <span>Blog</span>
                        <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-primary transition-all" />
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/guides" className="text-lg font-medium border-b pb-2 dark:border-gray-800 flex justify-between items-center group">
                        <span>Guides</span>
                        <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-primary transition-all" />
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/shop" className="text-lg font-medium border-b pb-2 dark:border-gray-800 flex justify-between items-center group">
                        <span>Shop</span>
                        <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-primary transition-all" />
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/community" className="text-lg font-medium border-b pb-2 dark:border-gray-800 flex justify-between items-center group">
                        <span>Community</span>
                        <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-primary transition-all" />
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/whats-new" className="text-lg font-medium border-b pb-2 dark:border-gray-800 flex justify-between items-center group text-primary">
                        <span>What's New</span>
                        <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-primary transition-all" />
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/pricing" className="text-lg font-medium border-b pb-2 dark:border-gray-800 flex justify-between items-center group">
                        <span>Pricing</span>
                        <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-primary transition-all" />
                    </Link>

                    {session ? (
                        <div className="flex flex-col space-y-3 pt-4">
                            <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="text-center py-3 bg-gray-50 dark:bg-zinc-900 font-bold rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-primary" />
                                Dashboard
                            </Link>
                            {user.role === "ADMIN" && (
                                <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin" className="text-center py-3 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Admin Panel
                                </Link>
                            )}
                            <button 
                                onClick={() => signOut()}
                                className="text-center py-3 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-3 pt-4">
                            <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-center py-3 font-medium border border-gray-200 rounded-xl">Sign In</Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} href="/pricing" className="text-center py-3 bg-primary text-white font-bold rounded-xl">Go Pro Plus</Link>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
