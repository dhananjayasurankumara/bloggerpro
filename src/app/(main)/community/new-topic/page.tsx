"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowLeft, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

const categories = [
  { name: "General Wealth", slug: "general-wealth" },
  { name: "Real Estate Hub", slug: "real-estate" },
  { name: "Passive Income Lab", slug: "passive-income" },
  { name: "AI & Fintech", slug: "ai-fintech" },
];

export default function NewTopicPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "general-wealth",
    content: "",
    isPremiumOnly: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/community/topic", formData);
      toast.success("Discussion Launched!");
      router.push(`/community/${formData.category}/${res.data.id}`);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.details || error.response?.data?.error || "Failed to launch topic";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link href="/community" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">Launch New Discussion</h1>
            <p className="text-gray-500">Share your thoughts, ask questions, or start a debate with the community.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[40px] space-y-6 shadow-xl">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-2">Discussion Title</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="What's on your mind?"
                className="w-full px-6 py-4 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all text-lg font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-2">Board Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-6 py-4 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer font-bold"
                >
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-2">Access Control</label>
                <div 
                  onClick={() => setFormData({...formData, isPremiumOnly: !formData.isPremiumOnly})}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all cursor-pointer ${
                    formData.isPremiumOnly 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">Premium Only</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-all relative ${formData.isPremiumOnly ? "bg-primary" : "bg-gray-200"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPremiumOnly ? "right-1" : "left-1"}`}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-2">Content</label>
              <textarea 
                required
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Provide details for your discussion..."
                className="w-full px-6 py-4 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all resize-none leading-relaxed"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Launch Discussion</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
