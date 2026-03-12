import prisma from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import { BookOpen, GraduationCap, ArrowRight, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  // We'll look for posts in a "Guides" or "Wealth Building" category as a proxy for "Guides"
  // In a real app, this would be a specific category slug 'guides'
  const guides = await prisma.post.findMany({
    where: { 
        published: true,
        OR: [
            { category: { slug: "wealth-building" } },
            { category: { slug: "passive-income" } }
        ]
    },
    include: {
      author: {
        select: { name: true, image: true },
      },
      category: {
        select: { name: true, slug: true },
      },
      _count: {
        select: { bookmarkedBy: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="bg-primary rounded-[60px] p-8 md:p-16 mb-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent opacity-10 blur-[100px] -rotate-12 translate-x-12 translate-y-12 animate-pulse"></div>
          
          <div className="relative z-10 max-w-3xl">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-accent/20 backdrop-blur-md">
                <GraduationCap className="w-4 h-4" />
                <span>Step-by-Step Roadmaps</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
                Master Your <br />
                Financial destiny
             </h1>
             <p className="text-white/70 text-lg md:text-xl font-medium mb-10 max-w-2xl leading-relaxed">
                Comprehensive blueprints designed to take you from architectural planning to financial execution.
             </p>
             <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-accent text-primary font-bold rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Active Roadmaps</h2>
                   <p className="text-gray-500 text-sm font-medium">Curated guides for high-impact growth</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {guides.map((post: any) => (
                <div key={post.id} className="group relative">
                    <div className="absolute -inset-4 bg-primary/5 rounded-[40px] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <ArticleCard post={{
                    ...post,
                    readTime: post.readTime || "15 min read",
                    _count: { bookmarks: post._count.bookmarkedBy }
                    }} />
                    <div className="mt-4 flex items-center justify-between px-2">
                         <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-accent" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Practical Workshop</span>
                         </div>
                    </div>
                </div>
              ))}

              {guides.length === 0 && (
                <div className="col-span-full py-24 text-center rounded-[60px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-900 shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-black rounded-[30px] flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-8 h-8 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-display font-bold mb-2">Expanding Our Knowledge Base</h3>
                   <p className="text-gray-400 max-w-xs mx-auto">New blueprints are currently being peer-reviewed by our expert panel.</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
