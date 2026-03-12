"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Shield, Trash2, Flag, User, Loader2, Calendar, Activity } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCommunityPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("/api/admin/community/topic");
      setTopics(res.data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      toast.error("Moderation logs inaccessible");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discussion? All associated posts will be purged.")) return;
    
    setDeletingId(id);
    try {
      await axios.delete(`/api/admin/community/topic/${id}`);
      setTopics(topics.filter(t => t.id !== id));
      toast.success("Discussion purged from database");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Cleanup command failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Decrypting Community Pulse...</p>
      </div>
    );
  }

  return (
    <div className="p-12">
      <header className="mb-12 space-y-2">
        <h1 className="text-3xl font-display font-bold">Forum Moderation</h1>
        <p className="text-gray-500">Monitor community discussions and maintain platform integrity.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/50">
            <div className="flex items-center gap-3">
               <Shield className="w-5 h-5 text-primary" />
               <h2 className="text-lg font-bold font-display uppercase tracking-tight">Active Discussions</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-inter">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50 dark:bg-zinc-950/50">
                <tr>
                  <th className="px-8 py-4">Discussion</th>
                  <th className="px-8 py-4">Intelligence</th>
                  <th className="px-8 py-4">Engagement</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                {topics.map((topic: any) => (
                  <tr key={topic.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-xl mt-1">
                             <MessageSquare className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                              <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{topic.title}</p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                                 <span className="text-primary">{topic.category}</span>
                                 <span>•</span>
                                 <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                              </div>
                          </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-gray-800">
                              {topic.author.name?.charAt(0)}
                          </div>
                          <span className="text-xs font-bold">{topic.author.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 font-bold text-gray-600 dark:text-gray-400">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs">{topic._count.posts} Replies</span>
                         </div>
                      </div>
                    </td>
                     <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center gap-2">
                          <a 
                            href={`/community/${topic.category}/${topic.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                            title="View Discussion"
                          >
                              <Activity className="w-4 h-4" />
                          </a>
                          <button 
                            disabled={deletingId === topic.id}
                            onClick={() => handleDelete(topic.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            title="Delete Discussion"
                          >
                              {deletingId === topic.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {topics.length === 0 && (
            <div className="p-32 text-center flex flex-col items-center gap-4">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                   <MessageSquare className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                   <h3 className="font-bold text-gray-400">Comms Log Empty</h3>
                   <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">No active discussions detected on the layer.</p>
                </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-[40px] flex flex-col items-center justify-center text-center gap-4">
             <div className="w-16 h-16 bg-white dark:bg-black rounded-3xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-900">
                <Flag className="w-8 h-8 text-emerald-500" />
             </div>
             <div>
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">Governance Queue</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed italic">Content reported by community members will appear here for high-priority review and moderation action.</p>
             </div>
        </div>
      </div>
    </div>
  );
}
