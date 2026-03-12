import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { ArrowLeft, Filter, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) return { title: "Category Not Found" };

  const baseUrl = process.env.NEXTAUTH_URL || "https://bloggerpro.com";
  const url = `${baseUrl}/blog/${category.slug}`;

  return {
    title: `${category.name} | Expert Financial Guides & Tips`,
    description: `Master ${category.name} with our professional guides at BloggerPro. Real-world wealth strategies and insights.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category.name} | BloggerPro`,
      description: `Expert financial articles and guides on ${category.name}.`,
      url: url,
    }
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      _count: { select: { posts: true } }
    }
  });

  if (!category) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: { 
      categoryId: category.id,
      published: true 
    },
    orderBy: { createdAt: "desc" },
    include: { author: true, category: true }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to All Articles
          </Link>
          
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                <Filter className="w-3 h-3" />
                <span>Category Filter</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
                {category.name}
             </h1>
             <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
                Explore our curated collection of deep-dives, strategies, and insights specifically about <span className="text-gray-900 dark:text-gray-100 font-bold">{category.name}</span>.
             </p>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-900">
             <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <BookOpen className="w-5 h-5" />
                <span>{category._count.posts} Articles</span>
             </div>
             <div className="flex items-center gap-2 text-sm font-bold text-accent">
                <Zap className="w-5 h-5" />
                <span>Pro Exclusive Content Included</span>
             </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="max-w-6xl mx-auto">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={{
                    ...post,
                    excerpt: post.excerpt || "",
                    readTime: post.readTime || "10 min read",
                    createdAt: post.createdAt.toISOString(),
                    featuredImage: post.featuredImage || undefined,
                    author: {
                        name: post.author.name || "Anonymous",
                        image: post.author.image || undefined
                    },
                    votes: (post as any).votes || 0
                }} />
              ))}
            </div>
          ) : (
            <div className="p-24 text-center bg-gray-50 dark:bg-zinc-950 rounded-[60px] border border-dashed border-gray-200 dark:border-gray-800">
               <div className="w-20 h-20 bg-white dark:bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <BookOpen className="w-8 h-8 text-gray-200" />
               </div>
               <h3 className="text-2xl font-display font-bold mb-2">No Articles Yet</h3>
               <p className="text-gray-500">We're currently drafting new content for this category. Stay tuned!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
