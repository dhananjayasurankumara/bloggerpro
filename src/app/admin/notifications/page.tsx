import prisma from "@/lib/prisma";
import { 
  Bell, 
  Send, 
  History, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Megaphone,
  UserPlus,
  ShieldAlert
} from "lucide-react";
import BroadcastForm from "./BroadcastForm";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } }
  });

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Broadcast System</h1>
          <p className="text-gray-500">Communicate with your entire community in real-time.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Composer */}
        <div className="lg:col-span-2 space-y-8">
            <BroadcastForm />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-gray-900 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Alerts</p>
                        <h4 className="text-2xl font-bold">12</h4>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-gray-900 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Rate</p>
                        <h4 className="text-2xl font-bold">99.2%</h4>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>

        {/* Audit Log / History */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-gray-50 dark:border-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Broadcast History</h3>
                </div>
                <div className="p-4 flex-1 overflow-y-auto max-h-[600px] space-y-4">
                    {notifications.map((notif, i) => (
                        <div key={notif.id} className="p-5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-3xl space-y-3 relative group">
                            <div className="flex justify-between items-start">
                                <span className={`px-3 py-1 text-[8px] font-bold rounded-full uppercase tracking-widest ${
                                    notif.type === 'SYSTEM' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {notif.type}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                                    <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                                {notif.content}
                            </p>
                            <div className="pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-primary font-bold">Resend</span>
                                <span className="text-[10px] text-red-500 font-bold">Delete</span>
                            </div>
                        </div>
                    ))}
                    
                    {notifications.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <Bell className="w-12 h-12 text-gray-200 mx-auto" />
                            <p className="text-gray-400 font-bold text-sm">No recent broadcasts.</p>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-zinc-950/50">
                    <button className="w-full py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-gray-500 font-bold rounded-xl text-xs hover:border-primary transition-all">
                        View Complete Audit Trail
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
