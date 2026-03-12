"use client";

import { useState } from "react";
import { Send, Megaphone } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BroadcastForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState("");
    const [type, setType] = useState("SYSTEM");
    const [target, setTarget] = useState("ALL");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return toast.error("Please enter a message");

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/notifications/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, type, target })
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Successfully dispatched to ${data.count} members!`);
                setContent("");
                router.refresh();
            } else {
                toast.error("Failed to dispatch broadcast");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-black p-8 rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm space-y-8">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                    <Megaphone className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Broadcast Composer</h4>
                    <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest">Send to your community members</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message Content</label>
                    <textarea 
                        rows={4} 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What do you want to tell your community?" 
                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary resize-none"
                    ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Target Audience</label>
                        <select 
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none appearance-none cursor-pointer"
                        >
                            <option value="ALL">All Members (FREE & PRO)</option>
                            <option value="PRO">Pro Plus Members Only</option>
                            <option value="NEW">New Members (Last 24h)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Notification Type</label>
                        <select 
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none appearance-none cursor-pointer"
                        >
                            <option value="SYSTEM">SYSTEM (Announcement)</option>
                            <option value="COMMENT">COMMENT (Alert)</option>
                            <option value="REPLY">REPLY (Thread Update)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-50 dark:border-gray-900 flex justify-between items-center">
                <p className="text-xs text-gray-400 italic">Push notifications and dashboard alerts will be triggered.</p>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                    <Send className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`} />
                    <span>{isSubmitting ? "Dispatching..." : "Dispatch Broadcast"}</span>
                </button>
            </div>
        </form>
    );
}
