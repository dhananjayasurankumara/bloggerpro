import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Globe, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DynamicStaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Reserved slugs that already have specific folders
  const reservedSlugs = [
    "blog", "community", "dashboard", "guides", "login", 
    "pricing", "privacy-policy", "profile", "register", 
    "settings", "shop", "terms", "about", "disclaimer",
    "whats-new", "checkout"
  ];

  if (reservedSlugs.includes(slug)) {
    // This shouldn't normally hit if folders exist, but good to have
    return null;
  }

  const page = await prisma.staticPage.findUnique({
    where: { slug },
  });

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <header className="space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                    {page.title}
                </h1>
                <div className="flex items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-primary" /> Verified Content
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Updated {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
          </header>

          <div 
            className="prose prose-lg dark:prose-invert prose-primary max-w-none text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-900 pt-12 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}
