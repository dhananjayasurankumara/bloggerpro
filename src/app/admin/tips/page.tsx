"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, XCircle, Loader2, Lightbulb } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminTipsPage() {
  const [tips, setTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTip, setNewTip] = useState("");

  const fetchTips = async () => {
    try {
      const res = await axios.get("/api/admin/tips");
      setTips(res.data);
    } catch (error) {
      toast.error("Failed to fetch tips");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTip.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await axios.post("/api/admin/tips", { content: newTip });
      setNewTip("");
      fetchTips();
      toast.success("Tip created successfully");
    } catch (error) {
      toast.error("Failed to create tip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await axios.post("/api/admin/tips", { id, active: !active });
      fetchTips();
      toast.success("Tip updated");
    } catch (error) {
      toast.error("Failed to update tip");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tip?")) return;
    try {
      await axios.delete(`/api/admin/tips?id=${id}`);
      fetchTips();
      toast.success("Tip deleted");
    } catch (error) {
      toast.error("Failed to delete tip");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Daily Tips & Tricks</h1>
          <p className="text-gray-500">Manage the daily insights displayed on the home page.</p>
        </div>
      </div>

      {/* Create Tip */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">New Daily Tip</label>
            <textarea
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              placeholder="Enter a valuable insight or financial tip..."
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all min-h-[100px]"
            />
          </div>
          <button
            type="submit"
            disabled={!newTip.trim() || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Publish Tip
          </button>
        </form>
      </div>

      {/* Tips List */}
      <div className="grid gap-4">
        {tips.map((tip) => (
          <div 
            key={tip.id} 
            className="group bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-900 flex items-start justify-between gap-6 hover:border-primary/20 transition-all"
          >
            <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-2xl ${tip.active ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"} shrink-0`}>
                    <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{tip.content}</p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Published {new Date(tip.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleToggle(tip.id, tip.active)}
                    className={`p-2 rounded-xl transition-all ${
                        tip.active 
                        ? "bg-green-50 text-green-600 hover:bg-green-100" 
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                    title={tip.active ? "Deactivate" : "Activate"}
                >
                    {tip.active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </button>
                <button
                    onClick={() => handleDelete(tip.id)}
                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                    title="Delete"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
          </div>
        ))}
        {tips.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-gray-400 font-medium">No tips created yet. Start by adding one above!</p>
            </div>
        )}
      </div>
    </div>
  );
}
