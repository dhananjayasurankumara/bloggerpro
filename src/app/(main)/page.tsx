import Hero from "@/components/Hero";
import ArticleGrid, { ArticleGridSkeleton } from "@/components/ArticleGrid";
import { ArrowRight, BookOpen, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import AdUnit from "@/components/ads/AdUnit";
import DailyTipSection from "@/components/DailyTipSection";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Daily Tips Section (Dynamic Admin Controlled) */}
      <DailyTipSection />

      <div className="container mx-auto px-4">
        <AdUnit slot="leaderboard-1" format="leaderboard" />
      </div>

      {/* Main Content Sections */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">Latest Insights</h2>
              <p className="text-gray-600 dark:text-gray-400">Discover the newest strategies for wealth building, real estate, and passive income from our expert contributors.</p>
            </div>
            <Link href="/blog" className="flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors group">
              <span>View All Articles</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Real Article Grid with categories - Server side fetch categories here later or pass mock */}
          <Suspense fallback={<ArticleGridSkeleton />}>
            <ArticleGrid limit={6} />
          </Suspense>
        </div>
      </section>

      {/* "Turn Knowledge Into Wealth" Section */}
      <section className="py-24 premium-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">Turn Knowledge Into Wealth</h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Access our exclusive collection of 8+ expert-written guides designed to take you from beginner to financial pro.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/guides" className="px-8 py-4 bg-accent text-primary font-bold rounded-xl shadow-lg hover:bg-white transition-all active:scale-95">
                Explore Premium Guides
              </Link>
              <Link href="/pricing" className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all active:scale-95">
                Compare Plans
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-mesh.png')] opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/40 rounded-full blur-[100px]"></div>
      </section>
    </div>
  );
}
