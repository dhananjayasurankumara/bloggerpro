"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Zap,
  Mail,
  Calendar,
  Loader2,
  ChevronDown,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await axios.patch(`/api/users/${userId}/role`, { role: newRole });
      toast.success(`User promoted to ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">User Management</h1>
          <p className="text-gray-500">Manage memberships, roles, and community access.</p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span>All Roles</span>
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role & Permissions</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {loading ? (
                <tr>
                    <td colSpan={5} className="p-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing User Database...</span>
                    </td>
                </tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{u.name || "Unnamed"}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{u.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="relative group inline-block">
                    <select 
                      disabled={updatingId === u.id}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all cursor-pointer outline-none ${
                        u.role === "ADMIN" 
                          ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:border-red-900/30" 
                          : u.role === "MODERATOR"
                            ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30"
                            : u.role === "BANNED"
                              ? "bg-black text-white border-zinc-800"
                              : u.role === "PRO" || u.role === "BUSINESS"
                                ? "bg-accent/10 text-accent border-accent/20" 
                                : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-zinc-800 dark:border-gray-700"
                      }`}
                    >
                      <option value="FREE">Free Member</option>
                      <option value="PRO">Pro Plus</option>
                      <option value="BUSINESS">Business Elite</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="ADMIN">System Admin</option>
                      <option value="BANNED">Terminated / Banned</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-50" />
                    {updatingId === u.id && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center rounded-lg">
                            <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-6 font-bold text-xs text-gray-700 dark:text-gray-300">
                    {u._count.posts} Posts • {u._count.forumTopics} Topics
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right space-x-2">
                  <Link 
                    href={`/admin/users/${u.id}`}
                    className="inline-flex p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
