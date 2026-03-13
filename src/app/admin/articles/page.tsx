"use client";

import { useState, useEffect } from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Loader2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminArticlesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/admin/articles"); // I'll need to create this GET route if not available
        setPosts(res.data);
      } catch (error) {
        // Fallback or handle error
        toast.error("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Article Management</h1>
          <p className="text-gray-500">Create, edit, and moderate all blog content.</p>
        </div>
        <Link 
          href="/admin/articles/new" 
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Write New Article</span>
        </Link>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "PENDING", "PUBLISHED", "REJECTED"].map((status) => (
            <button
              key={status}
              className="px-4 py-2 bg-gray-50 dark:bg-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-primary/30 transition-all"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-6 py-4">Article Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Visibility</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {posts.map((post: any) => (
              <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-6 font-medium">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 shrink-0 overflow-hidden border border-gray-200 dark:border-zinc-700">
                      {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{post.title}</h4>
                      <span className="text-xs text-gray-500">By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                  {post.category?.name || "Uncategorized"}
                </td>
                <td className="px-6 py-6">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                    post.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    post.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 
                    post.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {post.status || (post.published ? 'PUBLISHED' : 'DRAFT')}
                  </span>
                </td>
                <td className="px-6 py-6">
                  {post.isPremium ? (
                    <div className="flex items-center gap-1.5 text-accent font-bold text-[10px] uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 fill-accent" />
                      <span>Premium</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Free</span>
                  )}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="inline-flex items-center gap-2">
                    {post.status === "PENDING" && (
                      <div className="flex gap-2 mr-4 pr-4 border-r border-gray-100 dark:border-gray-900">
                        <button
                          onClick={async () => {
                             try {
                                await axios.patch(`/api/admin/articles/${post.id}/status`, { status: "PUBLISHED" });
                                toast.success("Article Published!");
                                window.location.reload();
                             } catch(e) { toast.error("Approval failed"); }
                          }}
                          className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={async () => {
                             try {
                                await axios.patch(`/api/admin/articles/${post.id}/status`, { status: "REJECTED" });
                                toast.success("Article Rejected");
                                window.location.reload();
                             } catch(e) { toast.error("Rejection failed"); }
                          }}
                          className="px-3 py-1.5 bg-zinc-900 text-zinc-400 text-[10px] font-bold rounded-lg hover:text-white transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                     <Link href={`/blog/${post.category?.slug}/${post.slug}`} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/articles/${post.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={async () => {
                        if (confirm("Purge this article?")) {
                          try {
                            await axios.delete(`/api/admin/articles/${post.id}`);
                            toast.success("Article deleted");
                            window.location.reload();
                          } catch (e) {
                            toast.error("Failed to delete");
                          }
                        }
                      }}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {posts.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            No articles found. Start writing your first masterpiece!
          </div>
        )}
      </div>
    </div>
  );
}
