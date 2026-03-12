"use client";

import { useEffect, useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  Megaphone, 
  History, 
  Clock, 
  Trash2,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  content: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success("Marked all as read");
      }
    } catch (err) {
      toast.error("Failed to update notifications");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "COMMENT": return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "REPLY": return <Zap className="w-4 h-4 text-accent" />;
      case "SYSTEM": return <Megaphone className="w-4 h-4 text-emerald-500" />;
      default: return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            ></div>
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-[32px] shadow-2xl overflow-hidden z-50 flex flex-col max-h-[500px]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/50">
                <div>
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    {unreadCount} Unread Alerts
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-primary hover:text-accent uppercase tracking-widest transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                    className={`p-4 rounded-3xl transition-all cursor-pointer group relative ${
                      notif.read 
                        ? "bg-transparent opacity-60 hover:opacity-100" 
                        : "bg-primary/5 dark:bg-zinc-900 border border-primary/10 shadow-sm"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        notif.read ? "bg-gray-100 dark:bg-zinc-800" : "bg-white dark:bg-black shadow-sm"
                      }`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-relaxed">
                          {notif.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(notif.createdAt).toLocaleDateString() === new Date().toLocaleDateString() 
                              ? "Today" 
                              : new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && notifications.length === 0 && (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-[24px] flex items-center justify-center mx-auto">
                      <Bell className="w-8 h-8 text-gray-200" />
                    </div>
                    <p className="text-xs font-bold text-gray-400">All caught up!</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-zinc-950/50">
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 text-center bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-2xl text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                >
                  View All Activity
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
