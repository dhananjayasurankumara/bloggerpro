"use client";

import { useState } from "react";
import { Mail, Send, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function NewsletterBroadcast() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    subject: "",
    message: "",
  });

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.subject || !data.message) return;

    setLoading(true);
    try {
      await axios.post("/api/admin/newsletter/broadcast", data);
      toast.success("Broadcast sent to all subscribers!");
      setIsOpen(false);
      setData({ subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send broadcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
        <span>Send Broadcast</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold">New Broadcast</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Send to all active subscribers</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 font-bold">Close</button>
            </div>

            <form onSubmit={handleBroadcast} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-2">Email Subject</label>
                <input 
                  required
                  value={data.subject}
                  onChange={(e) => setData({...data, subject: e.target.value})}
                  placeholder="e.g., Weekly Alpha Drop: 3 New Passive Income Streams"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-2">Message Content (Markdown Supported)</label>
                <textarea 
                  required
                  rows={8}
                  value={data.message}
                  onChange={(e) => setData({...data, message: e.target.value})}
                  placeholder="Share your insights with the community..."
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-start gap-4">
                 <Sparkles className="w-5 h-5 text-blue-500 mt-1" />
                 <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed italic">
                   Note: This will send an email to all active newsletter subscribers. Make sure your message is high-value and spam-free to maintain community trust.
                 </p>
              </div>

              <button 
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <span>Launch Broadcast</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
