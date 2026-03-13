import prisma from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import Skeleton from "@/components/Skeleton";

interface ArticleGridProps {
  categoryId?: string;
  limit?: number;
}

export default async function ArticleGrid({ categoryId, limit = 6 }: ArticleGridProps) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(categoryId ? { categoryId } : {}),
    },
    take: limit,
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

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No articles found. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post: any) => (
        <ArticleCard key={post.id} post={{
          ...post,
          readTime: (post as any).readTime || "5 min read",
          votes: (post as any).votes || 0
        }} />
      ))}
    </div>
  );
}

export function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm flex flex-col h-full space-y-6">
          <Skeleton className="w-full aspect-[16/10] rounded-2xl" />
          <div className="space-y-3 px-2">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
          <div className="pt-5 border-t border-gray-50 dark:border-gray-900 flex justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 w-12" />
              </div>
            </div>
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
