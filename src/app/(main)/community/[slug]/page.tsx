import prisma from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, Users, ChevronRight, Plus, Search, Filter } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ForumBoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // In a real app, these boards would be in the DB. For now, we mock based on the slug.
  const boardNames: Record<string, string> = {
    "general-wealth": "General Wealth",
    "real-estate": "Real Estate Hub",
    "passive-income": "Passive Income Lab",
    "ai-fintech": "AI & Fintech",
  };

  const boardName = boardNames[slug];
  if (!boardName) notFound();

  // Fetch topics for this board
  const topics = await prisma.forumTopic.findMany({
    where: { category: slug },
    include: {
      author: { select: { name: true, image: true } },
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          <Link href="/community" className="hover:text-primary">Community</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary">{boardName}</span>
        </div>

        {/* Board Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">{boardName}</h1>
            <p className="text-gray-500">Share insights and ask questions about {boardName.toLowerCase()}.</p>
          </div>
          <Link 
            href="/community/new-topic"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>New Discussion</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:border-primary transition-all">
            <Filter className="w-4 h-4" />
            <span>Latest</span>
          </button>
        </div>

        {/* Topics List */}
        <div className="bg-white dark:bg-zinc-950 rounded-[40px] border border-gray-100 dark:border-gray-900 overflow-hidden shadow-sm">
          {topics.length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-900">
              {topics.map((topic: any) => (
                <Link 
                  key={topic.id}
                  href={`/community/${slug}/${topic.id}`}
                  className="flex items-center p-6 gap-6 hover:bg-gray-50 dark:hover:bg-black/40 transition-colors group"
                >
                  <div className="hidden md:flex flex-col items-center justify-center w-14 shrink-0">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{topic.votes}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Votes</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                          {topic.author.name?.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{topic.author.name}</span>
                      </div>
                      <span>•</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{topic._count.posts}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Replies</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 dark:bg-black rounded-3xl mx-auto flex items-center justify-center border border-gray-100 dark:border-gray-900">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">No discussions yet</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">Be the first to start a conversation in the {boardName} board.</p>
              </div>
              <Link 
                href="/community/new-topic"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl"
              >
                Start Discussion
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
