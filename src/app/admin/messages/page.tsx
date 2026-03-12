import prisma from "@/lib/prisma";
import { 
  Inbox, 
  Mail, 
  MailOpen, 
  User, 
  Calendar, 
  Trash2, 
  Reply,
  Search,
  CheckCircle,
  Clock,
  MessageSquare
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Message Center</h1>
          <p className="text-gray-500">Manage user inquiries, feedback, and support tickets.</p>
        </div>
        <div className="flex gap-4">
             <div className="px-6 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl flex items-center gap-3 shadow-sm">
                <Inbox className="w-5 h-5 text-primary" />
                <span className="font-bold">{messages.length} Total Messages</span>
             </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Messages List */}
        <div className="lg:col-span-12">
            <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Filter by name, email, or subject..." 
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-medium text-sm transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Unread</button>
                        <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Archived</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <tr>
                                <th className="px-8 py-6">Sender</th>
                                <th className="px-8 py-6">Message Preview</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                            {messages.map((msg) => (
                                <tr key={msg.id} className={`hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group ${!msg.isRead ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-500">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-gray-900 dark:text-white">{msg.name}</span>
                                                <span className="text-[10px] font-medium text-gray-400">{msg.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 max-w-md">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm line-clamp-1">{msg.subject || "No Subject"}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{msg.message}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {!msg.isRead ? (
                                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                                <Mail className="w-3 h-3" /> New
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                                <MailOpen className="w-3 h-3" /> Read
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-gray-500 text-xs font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-primary transition-all" title="Reply">
                                                <Reply className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-red-500 transition-all" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                            <MessageSquare className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <h3 className="text-2xl font-display font-bold mb-2">Inbox is Empty</h3>
                                        <p className="text-gray-400 max-w-xs mx-auto text-sm">When users contact you through the site, their messages will appear here for management.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
