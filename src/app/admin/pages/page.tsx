import prisma from "@/lib/prisma";
import { 
  Layers, 
  Plus, 
  FileText, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Eye, 
  Globe, 
  Lock,
  Search,
  MoreVertical,
  Calendar
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPagesManagement() {
  const pages = await prisma.staticPage.findMany({
    orderBy: { updatedAt: "desc" }
  });

  // Predefined system pages that can't be deleted but can be edited
  const systemPages = [
    { title: "Privacy Policy", slug: "privacy-policy", status: "Published", lastUpdate: "Mar 11, 2026" },
    { title: "Terms of Service", slug: "terms", status: "Published", lastUpdate: "Mar 11, 2026" },
  ];

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Custom Page CMS</h1>
          <p className="text-gray-500">Manage auxiliary pages, legal documents, and site info.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all">
          <Plus className="w-5 h-5" />
          <span>Create New Page</span>
        </button>
      </header>

      <div className="space-y-12">
        {/* Main List */}
        <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search pages by title or slug..." 
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-medium text-sm transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <tr>
                            <th className="px-8 py-6">Page Title</th>
                            <th className="px-8 py-6">URL Slug</th>
                            <th className="px-8 py-6">Visibility</th>
                            <th className="px-8 py-6">Last Modified</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                        {/* Dynamic Pages */}
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">{page.title}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs font-mono text-gray-500 bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded">/{page.slug}</span>
                                </td>
                                <td className="px-8 py-6">
                                    {page.published ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                            <Globe className="w-3 h-3" /> Public
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                            <Lock className="w-3 h-3" /> Draft
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(page.updatedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-primary transition-all">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-all">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-red-500 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {/* System Pages */}
                        {systemPages.map((page, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group italic border-l-4 border-l-amber-400">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 dark:text-white">{page.title}</span>
                                            <span className="text-[8px] font-bold uppercase text-amber-600 tracking-tighter">System Core</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs font-mono text-gray-400 bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded">/{page.slug}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                        <Globe className="w-3 h-3" /> Public
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-gray-400 text-sm">{page.lastUpdate}</td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-primary transition-all">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <Link href={`/${page.slug}`} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Info Card */}
        <div className="p-8 bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-[30px] flex items-start gap-6">
            <div className="w-12 h-12 bg-amber-400 text-white rounded-2xl flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-100">About System Pages</h4>
                <p className="text-sm text-amber-800/70 leading-relaxed">
                    System pages like "Privacy Policy" and "Terms of Service" are protected from deletion because they are essential for site compliance. However, you can freely edit their content to match your brand's legal requirements.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
