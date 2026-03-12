"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Trash2, Loader2, Zap, Package, Info } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminWhatsNewPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "UPDATE",
  });

  const fetchUpdates = async () => {
    try {
      const res = await axios.get("/api/admin/whats-new");
      setUpdates(res.data);
    } catch (error) {
      toast.error("Failed to fetch updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/admin/whats-new", formData);
      toast.success("Update published!");
      setIsAdding(false);
      setFormData({ title: "", content: "", type: "UPDATE" });
      fetchUpdates();
    } catch (error) {
      toast.error("Failed to publish update");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;
    try {
      await axios.delete(`/api/admin/whats-new?id=${id}`);
      toast.success("Deleted successfully");
      fetchUpdates();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold">What's New Management</h1>
          <p className="text-gray-500">Post announcements and feature updates to the community feed.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Post New Update</span>
        </button>
      </header>

      {isAdding && (
        <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[40px] shadow-2xl animate-in slide-in-from-top duration-500">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">Create Announcement</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
           </div>
           
           <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-2">Update Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Portfolio Tracker 2.0 is Here"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-2">Category Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all appearance-none cursor-pointer"
                >
                  <option value="UPDATE">UPDATE (Maintenance/News)</option>
                  <option value="FEATURE">FEATURE (New Functionality)</option>
                  <option value="PRODUCT">PRODUCT (New Launch/E-book)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-2">Update Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Describe the changes or details of the launch..."
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button 
                  disabled={loading}
                  className="px-12 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-opacity-90 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Publish Announcement</span>}
                </button>
              </div>
           </form>
        </div>
      )}

      {/* Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
        {updates.map((update: any) => (
          <div key={update.id} className="p-8 bg-zinc-950 border border-zinc-900 rounded-[40px] shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl -translate-y-16 translate-x-16"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-zinc-900 rounded-2xl text-primary">
                {update.type === 'FEATURE' ? <Zap className="w-5 h-5" /> : (update.type === 'PRODUCT' ? <Package className="w-5 h-5" /> : <Info className="w-5 h-5" />)}
              </div>
              <button 
                onClick={() => handleDelete(update.id)}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                title="Delete Update"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary italic">{update.type}</div>
              <h3 className="text-xl font-display font-bold line-clamp-2">{update.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3 font-medium">{update.content}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
               <span>ID: {update.id.substring(0, 8)}</span>
               <span>{new Date(update.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {updates.length === 0 && !loading && (
          <div className="col-span-full py-32 text-center text-white">
             <Sparkles className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
             <h3 className="text-xl font-display font-bold">The feed is empty</h3>
             <p className="text-zinc-500">Post your first platform update to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
