import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Share2, MessageSquare, Bookmark, ShieldCheck, ArrowLeft, Twitter, Linkedin, Facebook, Copy, Edit, Trash2, ShieldAlert, Lock } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import AdUnit from "@/components/ads/AdUnit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PostInteractions from "@/components/blog/PostInteractions";
import CommentSection from "@/components/blog/CommentSection";
import StaffControlPanel from "@/components/blog/StaffControlPanel";
import AnimatedArticleHeader from "@/components/blog/AnimatedArticleHeader";
import AnimatedFeaturedImage from "@/components/blog/AnimatedFeaturedImage";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, author: true }
  });

  if (!post) return { title: "Post Not Found" };

  const baseUrl = process.env.NEXTAUTH_URL || "https://bloggerpro.com";
  const url = `${baseUrl}/blog/${post.category.slug}/${post.slug}`;

  return {
    title: `${post.title} | BloggerPro`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      url: url,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name || "BloggerPro Editor"],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
    },
    alternates: {
      canonical: url,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: {
      author: true,
      category: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Robust Routing: Redirect to correct category if it mismatches
  if (post.category.slug !== category) {
    redirect(`/blog/${post.category.slug}/${post.slug}`);
  }

  const session = await getServerSession(authOptions);
  let initialUserVote = 0;

  if (session?.user) {
    // Defensive check for desynchronized Prisma Client
    if ((prisma as any).postVote) {
      const vote = await (prisma as any).postVote.findUnique({
        where: {
          userId_postId: {
            userId: (session.user as any).id,
            postId: post.id,
          },
        },
      });
      initialUserVote = vote?.type || 0;
    }
  }

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";
  const isModerator = userRole === "MODERATOR";
  const isStaff = isAdmin || isModerator;
  const isProMember = userRole === "PRO" || userRole === "BUSINESS" || isStaff;

  const baseUrl = process.env.NEXTAUTH_URL || "https://bloggerpro.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.featuredImage ? [post.featuredImage] : [],
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": [{
        "@type": "Person",
        "name": post.author.name,
        "url": `${baseUrl}/profile/${post.author.id}`
      }]
  };

  // Paywall Logic: Extract Headings for "What's inside" teaser
  const headingMatches = Array.from(post.content.matchAll(/<(h[23])[^>]*>(.*?)<\/\1>/gi));
  const articleHighlights = headingMatches.map(match => match[2].replace(/<[^>]*>/g, ''));

  // Content Truncation Logic
  let displayContent = post.content;
  const isPaywalled = post.isPremium && !isProMember;
  
  if (isPaywalled) {
    const halfLength = Math.floor(post.content.length / 2);
    const splitPoint = post.content.indexOf("</p>", halfLength);
    if (splitPoint !== -1) {
      displayContent = post.content.substring(0, splitPoint + 4);
    } else {
      displayContent = post.content.substring(0, halfLength);
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs & Back */}
        <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
          <Link href="/blog" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span>/</span>
            <Link href={`/blog/${post.category.slug}`} className="hover:text-primary text-primary">{post.category.name}</Link>
          </div>
        </div>

        {/* Header */}
        <AnimatedArticleHeader
          title={post.title}
          authorName={post.author.name || "BloggerPro Editor"}
          createdAt="March 11, 2026"
          readTime={post.readTime}
          isPaywalled={isPaywalled}
        />

        {/* Admin/Moderator Controls */}
        {(isAdmin || isModerator) && (
          <StaffControlPanel postId={post.id} />
        )}

        {/* Featured Image */}
        <AnimatedFeaturedImage
          src={post.featuredImage}
          title={post.title}
          isPremium={post.isPremium}
        />

        {/* Content Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar Left - Social Share */}
          <div className="hidden lg:block lg:col-span-1 sticky top-32 h-fit">
            {/* Social Share Column - Handled in PostInteractions, but keeping minimal vertical indicators */}
            <div className="flex flex-col space-y-4 items-center opacity-20">
              <div className="w-1 h-16 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
              <span className="[writing-mode:vertical-lr] text-[10px] uppercase tracking-widest font-black text-gray-400">Scroll Progress</span>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="lg:col-span-8">
              <div className="prose prose-lg dark:prose-invert prose-primary max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-600 dark:prose-li:text-gray-400">
                <p className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-8 italic border-l-4 border-primary pl-6">
                  {post.excerpt}
                </p>

                {/* Database Content Injection */}
                <div 
                  className={`mb-8 relative ${isPaywalled ? "paywall-active" : ""}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: displayContent }} />
                  
                  {isPaywalled && (
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Paywall Protocol */}
                {isPaywalled && (
                  <div className="relative mt-0 p-8 md:p-12 rounded-[40px] bg-gray-50 dark:bg-zinc-950 border border-primary/20 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px]"></div>
                    
                    <div className="relative z-10 space-y-10">
                      <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Premium Insights Locked
                          </div>
                          <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white leading-[1.1]">
                            {session?.user ? "Go Pro to Read the Rest" : "Unlock the Full Analysis"}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            {session?.user 
                              ? "You've reached the free preview limit. Pro members get full access to expert strategies, automation scripts, and exclusive market reports."
                              : "This expert analysis is exclusive to our community. Sign in to unlock your free member preview or upgrade for full access."}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/pricing" className="px-8 py-4 bg-primary !text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-center">
                              Upgrade to Pro Plus
                            </Link>
                            {!session?.user && (
                              <Link href="/login" className="px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 font-bold !text-primary rounded-2xl active:scale-95 transition-all text-center hover:border-primary">
                                Sign In to Continue
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* What's Inside Teaser */}
                        <div className="w-full md:w-80 p-8 bg-white dark:bg-black rounded-[32px] border border-gray-100 dark:border-gray-800 space-y-6 shadow-xl">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Hidden in this Article</h4>
                            <div className="space-y-4">
                                {articleHighlights.slice(headingMatches.length / 2).slice(0, 4).map((text, i) => (
                                    <div key={i} className="flex gap-3 items-start group">
                                        <div className="p-1 rounded bg-gray-50 dark:bg-zinc-900 text-gray-400 group-hover:text-primary transition-colors">
                                            <Lock className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 line-clamp-2 leading-tight uppercase tracking-wide">{text}</span>
                                    </div>
                                ))}
                                {articleHighlights.length === 0 && (
                                   <div className="space-y-4">
                                      {[1,2,3].map(i => (
                                         <div key={i} className="h-4 bg-gray-50 dark:bg-zinc-900 rounded-lg animate-pulse" />
                                      ))}
                                   </div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-gray-50 dark:border-gray-900 mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                                <span className="text-[10px] font-bold text-accent uppercase">Members Only</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            {/* Author box */}
            <div className="mt-16 p-8 rounded-3xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 shrink-0 flex items-center justify-center font-display font-bold text-primary text-2xl">
                {post.author.name?.charAt(0)}
              </div>
              <div className="space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{post.author.name}</h4>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">Expert Contributor</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Financial analyst and wealth builder with over 15 years of experience in market analysis and automated income strategies.
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-4 pt-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <Link href={`/profile/${post.author.id}`} className="hover:text-accent transition-colors">View Profile</Link>
                  <Link href="#" className="hover:text-accent transition-colors">Follow</Link>
                </div>
              </div>
            </div>

            {/* Interactions (Votes & Views) */}
            <PostInteractions 
              postId={post.id} 
              initialVotes={(post as any).votes || 0}
              initialViews={post.viewCount || 0}
              initialUserVote={initialUserVote}
            />

            {/* Comments Section */}
            <CommentSection postId={post.id} />
          </div>

          {/* Sidebar Right - Table of Contents & Ads */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-12">
              <TableOfContents />
              
              <AdUnit slot="sidebar-rect-1" format="rectangle" label="Pro Tools" />
              
              <div className="p-6 rounded-3xl bg-primary text-white space-y-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="text-lg font-display font-bold relative z-10">Get the Weekly Blueprint</h4>
                <p className="text-white/70 text-sm relative z-10">Join 12k+ readers getting premium wealth tips every Monday.</p>
                <form className="space-y-3 relative z-10">
                  <input type="email" placeholder="Your email" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm placeholder-white/50 focus:ring-2 focus:ring-accent outline-none" />
                  <button className="w-full py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-white transition-all shadow-lg active:scale-95">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </>
  );
}
