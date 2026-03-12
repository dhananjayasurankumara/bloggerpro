import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import TopicView from "@/components/TopicView";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicId: string }>;
}): Promise<Metadata> {
  const { slug, topicId } = await params;
  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId }
  });

  if (!topic) return { title: "Topic Not Found" };

  const baseUrl = process.env.NEXTAUTH_URL || "https://bloggerpro.com";
  const url = `${baseUrl}/community/${slug}/${topicId}`;

  return {
    title: `${topic.title} | BloggerPro Community`,
    description: topic.content.substring(0, 160),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: topic.title,
      description: topic.content.substring(0, 160),
      url: url,
    }
  };
}

export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; topicId: string }>;
}) {
  const { slug, topicId } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const includes: any = {
    author: { select: { id: true, name: true, role: true } },
    posts: {
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    },
  };

  // Add voting relations only if they exist in the client
  if (userId) {
    if ((prisma.forumTopic as any).fields?.topicVotes) {
        includes.topicVotes = { where: { userId } };
    }
    if ((prisma.forumPost as any).fields?.forumPostVotes) {
        includes.posts.include.forumPostVotes = { where: { userId } };
    }
  }

  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
    include: includes,
  });

  if (!topic || topic.category !== slug) {
    notFound();
  }

  // Premium Gating
  const isPremiumTopic = (topic as any).isPremiumOnly;
  const isProUser = session?.user && ((session.user as any).role === "PRO" || (session.user as any).role === "ADMIN");

  if (isPremiumTopic && !isProUser) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 text-center">
        <div className="container mx-auto px-4 max-w-2xl space-y-8 p-12 bg-zinc-950 border border-zinc-900 rounded-[50px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 blur-[100px] -translate-y-24 translate-x-24"></div>
          <div className="w-20 h-20 bg-primary/20 rounded-3xl mx-auto flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
             <Zap className="w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-white">Pro Member Exclusive</h2>
            <p className="text-zinc-400 leading-relaxed capitalize">
              this topic is exclusive to bloggerpro plus members. upgrade your account to join the discussion and unlock expert financial alpha.
            </p>
          </div>
          <Link 
            href="/pricing" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/30"
          >
            <span>Upgrade to Unlock</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const initialUserVote = userId ? ((topic as any).topicVotes?.[0]?.type || 0) : 0;

  // Pre-process for TopicView
  const processedTopic = {
    ...topic,
    votes: topic.votes || 0,
    initialUserVote,
    author: {
        name: (topic as any).author?.name || "Anonymous",
        role: (topic as any).author?.role === "PRO" ? "PRO MEMBER" : (topic as any).author?.role
    },
    posts: (topic as any).posts?.map((p: any) => ({
        ...p,
        initialUserVote: userId ? (p.forumPostVotes?.[0]?.type || 0) : 0,
        author: {
            name: p.author?.name || "Anonymous",
            role: p.author?.role === "PRO" ? "PRO MEMBER" : p.author?.role
        },
        createdAt: "2 hours ago" // For demo
    }))
  } as any;

  const baseUrl = process.env.NEXTAUTH_URL || "https://bloggerpro.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": topic.title,
    "articleBody": topic.content,
    "author": {
      "@type": "Person",
      "name": (topic as any).author?.name || "Anonymous"
    },
    "datePublished": topic.createdAt.toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          <Link href="/community" className="hover:text-primary">Community</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/community/${slug}`} className="hover:text-primary uppercase">{slug.replace("-", " ")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary truncate max-w-[200px]">{topic.title}</span>
        </div>

        <TopicView topic={processedTopic} />
      </div>
    </div>
  </>
  );
}
