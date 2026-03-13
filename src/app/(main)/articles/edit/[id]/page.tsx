"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import imageCompression from "browser-image-compression";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { 
  Save, 
  Image as ImageIcon, 
  FileText, 
  Tag, 
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
  History,
  ChevronDown,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Shield
} from "lucide-react";

export default function EditArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    categoryId: "",
    featuredImage: "",
    content: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get(`/api/user/articles/${id}`)
        ]);
        
        setCategories(catRes.data);
        const post = postRes.data;
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          categoryId: post.categoryId,
          featuredImage: post.featuredImage || "",
          content: post.content
        });
      } catch (e) {
        toast.error("Failed to load article data");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchData();
  }, [status, router, id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setFormData({ ...formData, featuredImage: reader.result as string });
        toast.success("Cover image processed!");
      };
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await axios.patch(`/api/user/articles/${id}`, formData);
      toast.success("Changes saved! Re-review pending.");
      router.push(`/profile/${(session?.user as any).id}`);
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      {/* specialized Elite Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-display font-black tracking-tighter uppercase">
                <span className="text-primary dark:text-white">BLOGGER</span>
                <span className="text-accent">PRO</span>
              </span>
            </Link>
            
            <div className="h-6 w-[1.5px] bg-gray-100 dark:bg-zinc-800 hidden md:block" />

            <div className="flex items-center gap-4">
              <Link 
                href={`/profile/${(session?.user as any)?.id}`}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-sm md:text-base font-display font-bold">Refine Your Insight</h1>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-1">
                  <History className="w-3 h-3" /> Editing Submission
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-4 md:px-8 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs md:text-sm font-bold rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">Update Content</span>
              <span className="sm:hidden">Update</span>
            </button>

            {/* User Dropdown Sync */}
            <div className="relative" ref={userMenuRef}>
              <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-full hover:border-primary transition-all overflow-hidden"
              >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm overflow-hidden">
                      {(session?.user as any)?.image ? (
                          <img src={(session?.user as any)?.image} alt={(session?.user as any)?.name} className="w-full h-full object-cover" />
                      ) : (
                          (session?.user as any)?.name?.charAt(0) || <User className="w-4 h-4" />
                      )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 mr-2 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                  {isUserMenuOpen && (
                      <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-64 bg-white dark:bg-black border border-gray-100 dark:border-zinc-900 rounded-3xl shadow-2xl overflow-hidden py-4 z-[60]"
                      >
                          <div className="px-6 py-3 mb-2 border-b border-gray-50 dark:border-gray-900">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Author Identity</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{(session?.user as any)?.email}</p>
                          </div>
                          
                          <div className="space-y-1 px-2">
                              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-primary rounded-xl transition-all">
                                  <LayoutDashboard className="w-4 h-4" />
                                  Dashboard
                              </Link>
                              {(session?.user as any)?.role === "ADMIN" && (
                                  <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all">
                                      <Shield className="w-4 h-4" />
                                      Admin Panel
                                  </Link>
                              )}
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
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="space-y-12">
          {/* Moderation Warning */}
          <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[40px] border border-amber-100 dark:border-amber-900/40 relative overflow-hidden group">
            <div className="relative z-10 flex items-start gap-6">
              <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-display font-bold text-amber-700 dark:text-amber-400">Editorial Review Required</h2>
                <p className="text-amber-600/70 dark:text-amber-400/60 text-sm leading-relaxed max-w-lg">
                  To maintain the elite standard of BLOGGERPRO, updates to published articles will briefly return them to a "Pending" state for a quick sanity check by our editors.
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Title Section */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Professional Heading
              </label>
              <input 
                type="text"
                placeholder="Enter a compelling title..."
                className="w-full text-4xl md:text-5xl font-display font-bold bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-200 dark:placeholder:text-zinc-800"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") })}
              />
            </div>

            {/* Meta Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100 dark:border-zinc-900">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Category
                  </label>
                  <select 
                    className="w-full p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-primary transition-all"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select Domain</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Cover Image
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 md:h-40 bg-gray-50 dark:bg-zinc-950 border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-all group relative overflow-hidden"
                  >
                    {formData.featuredImage ? (
                      <img src={formData.featuredImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                        <span className="text-[10px] font-black uppercase text-gray-400">Upload High-Res Cover</span>
                      </>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-xl">Change Image</span>
                    </div>

                    {compressing && (
                       <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                       </div>
                    )}

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
               </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">The Content Library</label>
              <RichTextEditor 
                content={formData.content} 
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full py-6 bg-primary text-white font-black rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Finalize & Update Article
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
