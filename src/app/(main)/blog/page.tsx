import prisma from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import { ArticleGridSkeleton } from "@/components/ArticleGrid";
import { Search, TrendingUp, Filter } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, image: true },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>The Wealth Journal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
            Insider Insights for the <br />
            <span className="text-primary italic">Modern Investor</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Expert analysis, market trends, and actionable strategies delivered directly to your dashboard.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative group mt-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search articles, keywords, or authors..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-[30px] shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {["All Articles", "Wealth Building", "AI Tools", "Passive Income", "Real Estate"].map((label, i) => (
                    <button 
                        key={label}
                        className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            i === 0 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-gray-50 dark:bg-zinc-900 text-gray-500 hover:text-primary border border-gray-100 dark:border-gray-800"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full text-sm font-bold hover:border-primary transition-all">
                <Filter className="w-4 h-4" />
                <span>Sort by: Latest</span>
            </button>
        </div>

        {/* Grid */}
          {posts.length > 0 ? (
            <Suspense fallback={<ArticleGridSkeleton />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                  <ArticleCard key={post.id} post={{
                    ...post,
                    excerpt: post.excerpt || "",
                    readTime: post.readTime || "10 min read",
                    featuredImage: post.featuredImage || undefined,
                    createdAt: post.createdAt.toISOString(),
                    author: {
                      name: post.author.name || "Anonymous",
                      image: post.author.image || undefined
                    },
                    votes: (post as any).votes || 0
                  }} />
                ))}
              </div>
            </Suspense>
          ) : (
            <div className="col-span-full py-20 text-center rounded-[40px] bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-gray-800">
               <p className="text-gray-400 font-medium">Coming soon! Our editors are preparing new insights.</p>
            </div>
          )}
      </div>
    </div>
  );
}
