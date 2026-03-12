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
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
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
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{post.title}</h4>
                      <span className="text-xs text-gray-500">By {post.author.name} • Mar 11, 2026</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-xs text-gray-700 dark:text-gray-300">
                  {post.category?.name || "Uncategorized"}
                </td>
                <td className="px-6 py-6">
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-[10px] font-bold uppercase">
                    {post.published ? "Published" : "Draft"}
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
