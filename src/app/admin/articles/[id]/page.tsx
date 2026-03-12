"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Lock, 
  Globe, 
  ChevronDown,
  Clock,
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [isPremium, setIsPremium] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    readTime: "10 min read",
    published: false,
    featuredImage: "",
  });

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

      const uploadData = new FormData();
      uploadData.append("file", compressedFile);

      const res = await axios.post("/api/admin/upload", uploadData);
      setFormData({ ...formData, featuredImage: res.data.url });
      toast.success("Cover image updated!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setCompressing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, catRes] = await Promise.all([
          axios.get(`/api/admin/articles/${id}`),
          axios.get("/api/categories")
        ]);
        
        const post = postRes.data;
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          categoryId: post.categoryId,
          readTime: post.readTime,
          published: post.published,
          featuredImage: post.featuredImage || ""
        });
        setIsPremium(post.isPremium);
        setCategories(catRes.data);
      } catch (error) {
        toast.error("Failed to load article data");
        router.push("/admin/articles");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (published = formData.published) => {
    if (!formData.title || !formData.content) {
      return toast.error("Please fill in the title and content");
    }

    setSaving(true);
    try {
      await axios.patch(`/api/admin/articles/${id}`, {
        ...formData,
        isPremium,
        published,
      });
      toast.success("Article updated successfully!");
      router.push("/admin/articles");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
              <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Editorial Data...</span>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Editorial Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-900 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/articles" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-gray-100 dark:bg-gray-800"></div>
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Master Editor</span>
          </div>

          <div className="flex items-center gap-3">
             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${formData.published ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                {formData.published ? "Live" : "Draft"}
             </span>
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`px-6 py-2.5 text-sm font-bold transition-all flex items-center gap-2 rounded-xl border ${
                showPreview 
                  ? "bg-primary/10 border-primary/20 text-primary" 
                  : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-500"
              }`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Back to Editor" : "Live Preview"}
            </button>
            <button 
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-primary transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {formData.published ? "Revert to Draft" : "Save Changes"}
            </button>
            <button 
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {formData.published ? "Update Live Site" : "Publish to Site"}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Editor Body */}
          <div className="lg:col-span-8 space-y-12">
            <textarea
              placeholder="Article Title..."
              rows={2}
              className="w-full text-5xl md:text-6xl font-display font-bold bg-transparent border-none outline-none placeholder:text-gray-200 dark:placeholder:text-zinc-800 resize-none leading-tight"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />

            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-gray-50 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Read Time</label>
                    <input 
                        type="text" 
                        className="bg-transparent border-none outline-none font-bold text-sm"
                        value={formData.readTime}
                        onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                    />
                </div>
              </div>
              <div className="h-10 w-px bg-gray-50 dark:bg-zinc-900"></div>
              <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isPremium ? "bg-accent/10" : "bg-gray-100"}`} onClick={() => setIsPremium(!isPremium)}>
                  <Zap className={`w-5 h-5 ${isPremium ? "text-accent fill-accent" : "text-gray-400"}`} />
                </div>
                <div onClick={() => setIsPremium(!isPremium)} className="cursor-pointer">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest">Visibility</label>
                    <span className="font-bold text-sm">{isPremium ? "Premium Access" : "Free Content"}</span>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-4">
               <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Article Excerpt</label>
               <textarea
                placeholder="Hook your readers with a compelling introduction..."
                rows={3}
                className="w-full p-6 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[32px] text-lg text-gray-600 outline-none focus:ring-2 focus:ring-primary transition-all"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              />
            </div>

            <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Content Body</label>
                {showPreview ? (
                    <div className="w-full min-h-[600px] p-10 bg-white dark:bg-black border border-gray-100 dark:border-zinc-900 rounded-[40px] shadow-sm">
                         <div 
                            className="prose prose-lg dark:prose-invert prose-primary max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: formData.content }} 
                         />
                    </div>
                ) : (
                    <RichTextEditor 
                        content={formData.content} 
                        onChange={(html) => setFormData({...formData, content: html})}
                    />
                )}
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[40px] space-y-8">
              <h3 className="font-display font-bold text-xl">Article Settings</h3>
              
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category Selection</label>
                <select 
                    className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-zinc-900 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Featured Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[16/10] border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer overflow-hidden group relative"
                >
                  {formData.featuredImage ? (
                    <>
                      <img src={formData.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs font-bold">Upload High-Res Image</span>
                    </>
                  )}
                  {compressing && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                         <span className="text-[10px] font-black uppercase text-primary">Processing...</span>
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">SEO Slug</label>
                <input 
                  type="text" 
                  placeholder="how-to-save-47k"
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-zinc-900 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-zinc-900 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Last Saved:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1.5 uppercase text-[10px]">
                        <CheckCircle2 className="w-4 h-4" /> Just Now
                    </span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-900 text-white rounded-[40px] space-y-4 relative overflow-hidden group">
               <h4 className="font-display font-bold text-xl relative z-10 text-red-500">Danger Zone</h4>
               <p className="text-zinc-500 text-xs leading-relaxed relative z-10">Permanently remove this article and all associated engagement data from the BLOGGERPRO network.</p>
               <button 
                onClick={async () => {
                    if (confirm("Are you absolutely sure you want to purge this content?")) {
                        try {
                            await axios.delete(`/api/admin/articles/${id}`);
                            toast.success("Article purged successfully");
                            router.push("/admin/articles");
                        } catch (e) {
                            toast.error("Failed to delete article");
                        }
                    }
                }}
                className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-xl text-sm relative z-10 hover:bg-red-500 hover:text-white transition-all"
               >
                Delete Article Forever
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
