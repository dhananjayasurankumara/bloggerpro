"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  Zap, 
  Shield, 
  ShieldAlert, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Ban,
  TrendingUp,
  History
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { use } from "react";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`/api/admin/users/${id}`);
      setUser(res.data);
    } catch (error) {
      toast.error("User profile not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const handleRoleUpdate = async (newRole: string) => {
    try {
      await axios.patch(`/api/users/${id}/role`, { role: newRole });
      toast.success(`Account status updated to ${newRole}`);
      fetchUserDetails();
    } catch (error) {
      toast.error("Protocol violation: Update rejected");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compiling Intelligence Report...</span>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
      <h1 className="text-2xl font-display font-bold mb-4">Node Disconnected</h1>
      <p className="text-gray-500 mb-8">The requested user profile does not exist in the decentralized ledger.</p>
      <Link href="/admin/users" className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg">Return to Directory</Link>
    </div>
  );

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <Link href="/admin/users" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Member Directory</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl font-display font-black text-primary">
              {user.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight">{user.name || "Anonymous User"}</h1>
              <p className="text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 h-fit">
          {user.role !== "BANNED" ? (
            <button 
              onClick={() => handleRoleUpdate("BANNED")}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-500 font-bold rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <Ban className="w-4 h-4" />
              <span>Terminate Node</span>
            </button>
          ) : (
            <button 
              onClick={() => handleRoleUpdate("FREE")}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500 font-bold rounded-xl border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Restore Access</span>
            </button>
          )}
          
          <select 
            value={user.role}
            onChange={(e) => handleRoleUpdate(e.target.value)}
            className="px-6 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 font-bold rounded-xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-primary appearance-none pr-12 relative"
          >
            <option value="FREE">Free Member</option>
            <option value="PRO">Pro Plus</option>
            <option value="BUSINESS">Business Elite</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">System Admin</option>
          </select>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[32px] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <FileText className="w-5 h-5" />
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-display font-black">{user._count.posts}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Blog Articles</p>
            </div>
            <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[32px] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <MessageSquare className="w-5 h-5" />
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-display font-black">{user._count.forumTopics + user._count.forumPosts}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Community Engagement</p>
            </div>
            <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[32px] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <ShoppingBag className="w-5 h-5" />
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <p className="text-3xl font-display font-black">{user._count.orders}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Acquisitions</p>
            </div>
          </div>

          {/* User Biography & Info */}
          <div className="p-10 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[40px] shadow-sm space-y-8">
            <h3 className="text-xl font-display font-bold flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" /> Intelligence Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bio & Perspective</p>
                  <p className="text-sm font-medium leading-relaxed">{user.bio || "No biography established."}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{user.location || "Undisclosed Location"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{user.website || "No link established"}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Node Identification</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500">Node ID</span>
                      <span className="font-mono">{user.id}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500">Established</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-primary">
                      <span>Authority Tier</span>
                      <span>{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Left - Activity & History */}
        <div className="space-y-8">
           <div className="p-8 bg-zinc-950 text-white rounded-[40px] shadow-xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 relative z-10">
                <History className="w-5 h-5 text-primary" /> Active Ledger
              </h3>
              
              <div className="space-y-6 relative z-10">
                 {/* Acquisition History Mockup - In real app, map over user.orders */}
                 {user.orders?.length > 0 ? user.orders.map((order: any) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold leading-tight">{order.product.title}</p>
                            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">${order.amount.toFixed(2)}</p>
                        </div>
                    </div>
                 )) : (
                    <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                            <History className="w-8 h-8 text-gray-700" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No transaction history detected</p>
                    </div>
                 )}
              </div>
              
              <Link href="#" className="flex items-center justify-center gap-2 py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all relative z-10 shadow-2xl shadow-primary/20">
                 Synchronize Billing Data
              </Link>
           </div>
           
           <div className="p-8 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[40px] shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent fill-accent" /> Engagement Points
              </h3>
              <div className="flex items-end gap-3 px-4">
                <span className="text-5xl font-display font-black leading-none">{user.points}</span>
                <span className="text-xs font-bold text-gray-400 uppercase pb-1 tracking-[0.2em]">Social Equity</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
