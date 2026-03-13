import Link from "next/link";
import { MessageSquare, TrendingUp, Users, ShieldCheck, ArrowRight, Zap, Gavel, Plus } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  // Fetch real stats
  const [totalUsers, forumPostsCount, forumTopicsCount] = await Promise.all([
    prisma.user.count(),
    prisma.forumPost.count(),
    prisma.forumTopic.count()
  ]);

  const totalPosts = forumPostsCount + forumTopicsCount;

  // Defensive rules fetch
  let rules: any[] = [];
  try {
    rules = await prisma.communityRule.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("Rules fetch failed:", e);
  }

  const forumCategories = [
    {
      name: "General Wealth",
      slug: "general-wealth",
      description: "The main hub for all wealth building discussions, tips, and personal wins.",
      icon: TrendingUp,
      color: "bg-blue-500"
    },
    {
      name: "Real Estate Hub",
      slug: "real-estate",
      description: "Rental properties, REITs, wholesaling, and local market analysis.",
      icon: Zap,
      color: "bg-emerald-500"
    },
    {
      name: "Passive Income Lab",
      slug: "passive-income",
      description: "Building automated revenue streams that work while you sleep.",
      icon: ShieldCheck,
      color: "bg-purple-500"
    },
    {
      name: "AI & Fintech",
      slug: "ai-fintech",
      description: "Leveraging the latest technology to optimize your financial portfolio.",
      icon: MessageSquare,
      color: "bg-amber-500"
    }
  ];

  // Fetch counts for each category
  const categoryStats = await Promise.all(
    forumCategories.map(async (cat) => {
      const [topics, replies] = await Promise.all([
        prisma.forumTopic.count({ where: { category: cat.slug } }),
        prisma.forumPost.count({ where: { topic: { category: cat.slug } } })
      ]);
      return { ...cat, topics, replies };
    })
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Forum Header */}
        <div className="max-w-4xl mx-auto mb-16 space-y-4">
          <h1 className="text-5xl font-display font-bold text-gray-900 dark:text-white text-center">Community Boards</h1>
          <p className="text-xl text-gray-500 leading-relaxed text-center">
            The exclusive hub for the BLOGGERPRO community. Connect with our expanding network of wealth builders.
          </p>
          <div className="flex justify-center pt-6">
            <Link 
              href="/community/new-topic"
              className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-opacity-90 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Start Discussion</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 pt-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 text-2xl font-bold text-primary">
                <Users className="w-6 h-6" />
                <span>{totalUsers.toLocaleString()}</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total Members</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 text-2xl font-bold text-accent">
                <MessageSquare className="w-6 h-6" />
                <span>{totalPosts.toLocaleString()}</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Community Posts</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {categoryStats.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/community/${cat.slug}`}
              className="group p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[40px] hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-6 items-center md:items-start"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-6 pt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-1.5 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4" /> {cat.topics} Topics
                  </span>
                  <span className="flex items-center gap-1.5 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" /> {cat.replies} Replies
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-white dark:bg-black rounded-full border border-gray-100 dark:border-gray-800 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Community Rules Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[40px] p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center dark:text-gray-900 text-white">
                <Gavel className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold">Community Rules</h2>
                <p className="text-gray-500 text-sm">Ensuring a high-signal environment for everyone.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rules.length > 0 ? rules.map((rule: any, idx: number) => (
                <div key={rule.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary/40">0{rule.order || idx + 1}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white">{rule.title}</h4>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed pl-8">
                    {rule.content}
                  </p>
                </div>
              )) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary/40">01</span>
                      <h4 className="font-bold text-gray-900 dark:text-white">Respect the Hustle</h4>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed pl-8">
                      No spam, self-promotion, or low-effort posts. We value high-quality financial insights.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary/40">02</span>
                      <h4 className="font-bold text-gray-900 dark:text-white">Confidentiality First</h4>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed pl-8">
                      What happens in the Pro boards stays in the Pro boards. No sharing sensitive community alpha.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Create Discussion CTA */}
        <div className="mt-20 p-12 bg-primary rounded-[50px] text-white text-center space-y-6 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          <h2 className="text-4xl font-display font-bold relative z-10">Start Your Own Discussion</h2>
          <p className="text-white/70 max-w-xl mx-auto relative z-10">
            Got a question about a specific side hustle or stock? Pro members can start unlimited threads and get direct feedback from experts.
          </p>
          <div className="pt-4 relative z-10">
            <Link 
              href="/community/new-topic"
              className="px-10 py-4 bg-accent text-primary font-bold rounded-2xl hover:bg-white transition-all shadow-xl active:scale-95 inline-flex items-center gap-3"
            >
              <span>Launch New Topic</span>
              <MessageSquare className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
