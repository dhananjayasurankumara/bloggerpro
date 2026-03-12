"use client";

import { Edit, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface StaffControlPanelProps {
  postId: string;
}

export default function StaffControlPanel({ postId }: StaffControlPanelProps) {
  const handlePurge = async () => {
    if (confirm("NODE DELETION PROTOCOL: Are you sure? This action is permanent.")) {
      try {
        await axios.delete(`/api/admin/articles/${postId}`);
        toast.success("Content purged from ledger");
        window.location.href = "/blog";
      } catch (error) {
        toast.error("Deletion rejected");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8 p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-3xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-6 h-6 text-red-500" />
        <div>
          <p className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">Staff Control Panel</p>
          <p className="text-xs text-red-600/60 dark:text-red-400/60">You have global authority over this content element.</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link 
          href={`/admin/articles/${postId}`} 
          className="px-6 py-2.5 bg-white dark:bg-black text-xs font-black uppercase text-gray-900 dark:text-white rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Edit Content
        </Link>
        <button 
          onClick={handlePurge}
          className="px-6 py-2.5 bg-red-500 text-white text-xs font-black uppercase rounded-xl shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Purge Article
        </button>
      </div>
    </div>
  );
}
