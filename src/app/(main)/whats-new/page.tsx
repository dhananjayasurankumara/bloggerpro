import prisma from "@/lib/prisma";
import { Sparkles, Zap, Package, Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WhatsNewPage() {
  const updates = await prisma.whatsNew.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-20 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Platform Updates</span>
          </div>
          <h1 className="text-6xl font-display font-bold text-gray-900 dark:text-white">What's New?</h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Stay ahead of the curve with our latest features, tools, and financial tech breakthroughs.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800 hidden md:block"></div>

          <div className="space-y-24 relative">
            {updates.length > 0 ? updates.map((update: any, idx: number) => {
              const date = new Date(update.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              });
              const isEven = idx % 2 === 0;

              return (
                <div key={update.id} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content Container */}
                  <div className={`flex-1 w-full ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 space-y-4 relative group overflow-hidden`}>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>
                       
                       <div className={`flex items-center gap-3 mb-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                            {update.type}
                          </span>
                       </div>

                       <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white line-clamp-2">
                        {update.title}
                       </h3>
                       <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {update.content}
                       </p>
                       
                       <div className={`flex items-center gap-2 pt-4 text-xs font-bold text-gray-400 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                         <Calendar className="w-3.5 h-3.5" />
                         <span>{date}</span>
                       </div>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-white dark:bg-black border-4 border-primary z-10 items-center justify-center shadow-xl shadow-primary/20">
                     {update.type === 'FEATURE' ? <Zap className="w-5 h-5 text-primary" /> : <Package className="w-5 h-5 text-primary" />}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              );
            }) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">No updates yet</h2>
                <p className="text-gray-500 mb-8">We're busy building the future of financial blogging.</p>
                <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Blog</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-32 p-12 bg-zinc-950 rounded-[60px] text-white text-center space-y-8 relative overflow-hidden group shadow-2xl border border-zinc-900">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 blur-[120px] -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl font-display font-bold font-italic">Want to get these updates first?</h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
              Join 12k+ other wealth builders who receive our weekly platform digest and early alpha drops.
            </p>
          </div>

          <div className="relative z-10 pt-4">
             <Link 
               href="/#newsletter" 
               className="px-12 py-5 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 mx-auto w-fit"
             >
               <span>Subscribe to Newsletter</span>
               <ChevronRight className="w-5 h-5" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
