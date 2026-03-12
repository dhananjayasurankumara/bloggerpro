"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Package, 
  DollarSign, 
  AlignLeft, 
  Link as LinkIcon,
  Sparkles,
  Tag,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "e-book",
    image: "",
    downloadUrl: "",
    isFeatured: false,
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
      setFormData({ ...formData, image: res.data.url });
      toast.success("Product image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/products", {
        ...formData,
        price: parseFloat(formData.price)
      });
      toast.success("Product created successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 max-w-5xl mx-auto">
      <Link 
        href="/admin/products" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-8 group transition-all"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Inventory
      </Link>

      <div className="flex justify-between items-end mb-12">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                 <Package className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-display font-bold">New Digital Product</h1>
           </div>
           <p className="text-gray-500">Configure your premium digital asset for the marketplace.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Info */}
            <div className="md:col-span-2 p-10 bg-white dark:bg-zinc-950 rounded-[50px] border border-gray-100 dark:border-gray-900 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">Core Details</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Title</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. Master Passive Income 2026"
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                        <textarea 
                            required
                            rows={4}
                            placeholder="Tell customers what's inside the digital package..."
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium resize-none transition-all"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Category */}
            <div className="p-10 bg-white dark:bg-zinc-950 rounded-[50px] border border-gray-100 dark:border-gray-900 shadow-sm space-y-8">
                 <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">Commercials</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price (USD)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                            <input 
                                required
                                type="number" 
                                step="0.01"
                                placeholder="0.00"
                                className="w-full pl-10 pr-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                        <select 
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold appearance-none transition-all"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="e-book">E-Book</option>
                            <option value="template">Spreadsheet Template</option>
                            <option value="coaching">1-on-1 Coaching</option>
                            <option value="course">Video Course</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Assets */}
            <div className="p-10 bg-white dark:bg-zinc-950 rounded-[50px] border border-gray-100 dark:border-gray-900 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                    <LinkIcon className="w-5 h-5 text-blue-500" />
                    <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">Digital Assets</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Image</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer overflow-hidden group relative"
                        >
                            {formData.image ? (
                                <>
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-xs font-bold">Upload Product Photo</span>
                                </>
                            )}
                            {compressing && (
                                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
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

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Download/Access Link</label>
                        <input 
                            required
                            type="url" 
                            placeholder="https://drive.google.com/..."
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                            value={formData.downloadUrl}
                            onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
                type="submit"
                disabled={loading}
                className="px-10 py-5 bg-primary text-white font-display font-bold rounded-[30px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:scale-100"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Publish Digital Product
            </button>
        </div>
      </form>
    </div>
  );
}
