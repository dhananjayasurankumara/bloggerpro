"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DeleteButtonProps {
  itemId: string;
  deleteUrl: string;
  confirmMessage?: string;
  className?: string;
  onSuccess?: () => void;
}

export default function DeleteButton({
  itemId,
  deleteUrl,
  confirmMessage = "Are you sure you want to delete this item?",
  className = "p-2 bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-lg text-gray-400 hover:text-rose-500 transition-all",
  onSuccess
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const res = await fetch(deleteUrl, { method: "DELETE" });
      if (res.ok) {
        toast.success("Item deleted successfully");
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Delete failed");
      }
    } catch (e) {
      toast.error("An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={className}
      title="Delete"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
