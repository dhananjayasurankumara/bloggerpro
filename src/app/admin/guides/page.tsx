import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  GraduationCap, 
  MoreVertical, 
  Eye, 
  Heart, 
  Clock, 
  Edit,
  ArrowUpRight,
  ShieldCheck,
  Plus
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const guides = await prisma.guide.findMany({
    include: {
      _count: {
        select: { steps: true, enrollments: true }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8 md:p-12 space-y-12 pb-24">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-950 p-10 rounded-[40px] border border-zinc-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 blur-3xl -translate-y-48 translate-x-48"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-xl">
                <GraduationCap className="w-5 h-5 text-primary" />
             </div>
             <h1 className="text-4xl font-display font-bold text-white tracking-tight">Financial Roadmaps</h1>
          </div>
          <p className="text-zinc-400 font-medium italic">High-impact "Step-by-Step" content management.</p>
        </div>

        <Link 
          href="/admin/guides/new" 
          className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Blueprint</span>
        </Link>
      </header>

      {/* Guides Management Table */}
      <div className="bg-zinc-950 rounded-[40px] border border-zinc-900 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-black/40">
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold font-display text-white">Active Catalog</h2>
            </div>
            <div className="px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {guides.length} blueprinted units
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-8 py-6">Blueprint Title</th>
                <th className="px-8 py-6">Journey Structure</th>
                <th className="px-8 py-6">Enrollment</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Deployment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {guides.map((guide: any) => (
                <tr key={guide.id} className="hover:bg-zinc-900/40 transition-colors group">
                  <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                          {guide.image ? (
                            <img src={guide.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <GraduationCap className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-white group-hover:text-primary transition-colors text-sm">{guide.title}</p>
                            <p className="text-[10px] text-zinc-500 italic">/{guide.slug}</p>
                        </div>
                      </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-zinc-300">
                        <div className="p-1.5 bg-zinc-900 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="font-bold text-xs">{guide._count?.steps || 0} Lessons</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-zinc-300">
                        <div className="p-1.5 bg-zinc-900 rounded-lg">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="font-bold text-xs">{guide._count?.enrollments || 0} Students</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                        guide.published 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                        {guide.published ? 'LIVE' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/guides/${guide.id}`} className="p-3 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-primary rounded-xl transition-all border border-zinc-800">
                           <Edit className="w-4 h-4" />
                        </Link>
                        <Link href={`/guides/${guide.slug}`} target="_blank" className="p-3 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800">
                           <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {guides.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-zinc-600 italic text-sm">
                        No financial blueprints found in the current library.
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
