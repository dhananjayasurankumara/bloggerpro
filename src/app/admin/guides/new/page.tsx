"use client";

import { useState } from "react";
import { 
  Plus, 
  ArrowLeft, 
  Save, 
  GraduationCap, 
  ShieldAlert,
  Hash,
  FileText,
  Loader2
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewGuidePage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "0",
    isPremium: true
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSlugUpdate = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-0\s]/g, "")
      .replace(/\s+/g, "-");
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error("Title and Slug are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/admin/guides", formData);
      toast.success("Blueprint Draft Created!");
      router.push(`/admin/guides/${res.data.id}`);
    } catch (error) {
      toast.error("Failed to create roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-12 pb-32">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
            <Link href="/admin/guides" className="p-3 bg-zinc-900 text-zinc-400 hover:text-white rounded-2xl border border-zinc-800 transition-all">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-display font-bold">New Financial Roadmap</h1>
                <p className="text-zinc-500 font-medium italic">Begin a new "Step-by-Step" blueprint.</p>
            </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 p-12 rounded-[50px] border border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 blur-3xl -translate-y-48 translate-x-48"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Roadmap Title</label>
                    <div className="relative group">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="e.g., The Ultimate Passive Income Blueprint"
                            value={formData.title}
                            onChange={(e) => handleSlugUpdate(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-zinc-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Target URL / Slug</label>
                    <div className="relative group">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="url-friendly-slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary transition-all text-zinc-400"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Access Tier</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, isPremium: true})}
                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                                formData.isPremium 
                                ? "bg-primary/20 border-primary text-primary" 
                                : "bg-zinc-950 border-zinc-800 text-zinc-600"
                            }`}
                        >
                            Premium Blueprint
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, isPremium: false})}
                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                                !formData.isPremium 
                                ? "bg-white/10 border-white text-white" 
                                : "bg-zinc-950 border-zinc-800 text-zinc-600"
                            }`}
                        >
                            Free Access
                        </button>
                    </div>
                </div>

                <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Enrollment Fee (USD)</label>
                    <input 
                        type="number" 
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl font-black text-xl text-primary outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>

                <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Short Summary</label>
                    <textarea 
                        rows={3}
                        placeholder="Describe what users will achieve upon completing this roadmap..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-primary transition-all text-zinc-400 placeholder:italic"
                    />
                </div>
            </div>

            <div className="pt-8 flex flex-col items-center gap-6 relative z-10">
                <button
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-[30px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Initialize Blueprint Draft
                </button>
                <div className="flex items-center gap-2 text-zinc-600 font-bold text-[9px] uppercase tracking-[0.2em]">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Initializing draft will redirect to Step Architect
                </div>
            </div>
          </form>
      </div>
    </div>
  );
}
