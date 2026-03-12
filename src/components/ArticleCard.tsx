import Link from "next/link";
import Image from "next/image";
import { Clock, Heart, ArrowRight, ShieldCheck, Eye } from "lucide-react";

interface ArticleCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: { name: string; slug: string };
    author: { name: string; image?: string };
    readTime: string;
    isPremium: boolean;
    featuredImage?: string;
    createdAt: string;
    viewCount: number;
    votes?: number;
  };
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link 
      href={`/blog/${post.category.slug}/${post.slug}`}
      className="bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-gray-100 dark:border-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-full"
    >
      {/* Thumbnail Container */}
      <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-gray-900 rounded-2xl mb-6 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg shadow-lg uppercase tracking-wider">
            {post.category.name}
          </div>
          {post.isPremium && (
            <div className="px-3 py-1 bg-accent text-primary text-[10px] font-bold rounded-lg shadow-lg flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>PRO</span>
            </div>
          )}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 flex items-center justify-center">
          <ArrowRight className="text-white w-10 h-10 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500" />
        </div>
        
        {/* Placeholder Image or Real Image */}
        {post.featuredImage ? (
          <Image 
            src={post.featuredImage} 
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
        )}
      </div>

      {/* Content */}
      <div className="px-2 pb-2 flex flex-col flex-1">
        <h3 className="text-xl font-display font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-3">
          {post.title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed mb-6 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-[10px] text-primary font-bold">
                {post.author.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{post.author.name}</span>
              <span className="text-[10px] text-gray-400">Mar 11, 2026</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-gray-400 italic">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{post.readTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{post.viewCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 group-hover:text-red-500 transition-colors" />
              <span className="text-[11px] font-medium">{post.votes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
