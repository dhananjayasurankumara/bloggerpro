import prisma from "@/lib/prisma";
import { Mail, UserX, UserCheck, Calendar, Search } from "lucide-react";
import Link from "next/link";
import NewsletterBroadcast from "@/components/admin/NewsletterBroadcast";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Newsletter Management</h1>
          <p className="text-gray-500">View and manage your platform's mailing list.</p>
        </div>
        <div className="flex gap-4">
             <NewsletterBroadcast />
             <div className="px-6 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl flex items-center gap-3 shadow-sm">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-bold">{subscribers.length} Total Subscribers</span>
             </div>
        </div>
      </header>

      {/* List */}
      <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-zinc-950/50">
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by email..." 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-medium text-sm transition-all"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-8 py-6">Subscriber</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Joined Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {sub.active ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
                        <UserCheck className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
                        <UserX className="w-3 h-3" /> Unsubscribed
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest">Remove</button>
                  </td>
                </tr>
              ))}

              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-bold font-display text-xl">No Subscribers Yet</p>
                    <p className="text-gray-400 text-sm mt-1">Growth strategies take time. Keep publishing!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
