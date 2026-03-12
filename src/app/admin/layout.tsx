"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { 
  FileText, 
  Users, 
  Settings, 
  MessageSquare, 
  LayoutDashboard, 
  ShieldAlert,
  Tag,
  Menu,
  X as XIcon,
  ShoppingBag,
  Mail,
  Bell,
  CreditCard,
  Settings2,
  Layers,
  Sparkles,
  Zap,
  Inbox
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verifying Admin Credentials...</span>
              </div>
          </div>
      );
  }

  if (!session) {
    redirect("/login");
    return null;
  }

  const userRole = (session.user as any).role;
  const isAdmin = userRole === "ADMIN";
  const isModerator = userRole === "MODERATOR";

  if (!isAdmin && !isModerator) {
    redirect("/dashboard");
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col lg:flex-row font-inter overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 p-4 flex items-center justify-between sticky top-0 z-[100]">
          <div className="flex items-center space-x-2 text-primary font-display font-bold text-lg">
             <ShieldAlert className="w-6 h-6" />
             <span>AdminPanel</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 transition-all hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl"
          >
            {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[90] h-screen w-72 bg-white dark:bg-black border-r border-gray-100 dark:border-gray-900 p-8 flex flex-col justify-between overflow-y-auto transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
      `}>
        <div className="space-y-12">
          <div className="hidden lg:flex items-center space-x-3 text-primary">
            <ShieldAlert className="w-8 h-8" />
            <span className="font-display font-bold text-xl tracking-tight">AdminPanel</span>
          </div>

          <nav className="space-y-8">
            {/* Overview */}
            <Link onClick={() => setIsSidebarOpen(false)} href="/admin" className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </Link>

            {/* Content Group */}
            <div className="space-y-2">
                <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content Management</h4>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/articles" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Articles & Posts</span>
                </Link>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/categories" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <Tag className="w-4 h-4" />
                  <span>Categories</span>
                </Link>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/pages" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Static Pages</span>
                </Link>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/whats-new" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span>What's New</span>
                </Link>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/bot-commands" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Bot Commands</span>
                </Link>
            </div>

            {/* Commerce Group */}
            <div className="space-y-2">
                <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Digital Commerce</h4>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/products" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Product Inventory</span>
                </Link>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/orders" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>Order History</span>
                </Link>
            </div>

            {/* Audience & Support */}
            <div className="space-y-2">
                <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audience & Support</h4>
                {isAdmin && (
                  <Link onClick={() => setIsSidebarOpen(false)} href="/admin/users" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                    <Users className="w-4 h-4" />
                    <span>Member Directory</span>
                  </Link>
                )}
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/newsletter" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Subscribers</span>
                </Link>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/messages" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <Inbox className="w-4 h-4" />
                  <span>Contact Inbox</span>
                </Link>
                <Link onClick={() => setIsSidebarOpen(false)} href="/admin/community" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                  <MessageSquare className="w-4 h-4" />
                  <span>Forum Hub</span>
                </Link>
            </div>

            {/* System Configuration */}
            {isAdmin && (
              <div className="space-y-2 pb-8">
                  <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Architecture</h4>
                  <Link onClick={() => setIsSidebarOpen(false)} href="/admin/notifications" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                    <Bell className="w-4 h-4" />
                    <span>Broadcast System</span>
                  </Link>
                  <Link onClick={() => setIsSidebarOpen(false)} href="/admin/chatbot" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Handling</span>
                  </Link>
                  <Link onClick={() => setIsSidebarOpen(false)} href="/admin/settings" className="flex items-center space-x-3 px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-xl font-bold transition-colors text-sm">
                    <Settings2 className="w-4 h-4" />
                    <span>Global Config</span>
                  </Link>
              </div>
            )}
          </nav>
        </div>

        <div className="space-y-6 pt-12">
          <Link href="/" className="flex items-center justify-center gap-2 py-3 border border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all text-sm">
            Exit to Live Site
          </Link>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
            BloggerPro Master CMS v1.2
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] lg:hidden"
          ></div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
