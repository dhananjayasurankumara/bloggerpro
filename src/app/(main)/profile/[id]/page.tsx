import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Files, 
  MessageSquare, 
  Twitter, 
  Linkedin, 
  Globe, 
  TrendingUp,
  MapPin,
  Calendar,
  ArrowLeft
} from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileEditButton from "@/components/ProfileEditButton";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.user && (session.user as any).id === id;
  
  let user: any = null;
  let engagement: any = null;

  try {
    user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          where: { published: true },
          take: 6,
          include: { category: true, author: true }
        },
        _count: { select: { posts: true, forumTopics: true } }
      }
    });

    if (user) {
      engagement = await prisma.post.aggregate({
        where: { authorId: id, published: true },
        _sum: { viewCount: true, votes: true }
      }) as any;
    }
  } catch (error) {
    console.error("[PROFILE_PAGE_ERROR] Database unreachable:", error);
  }

  if (!user) notFound();

  // Privacy Check
  if (!(user as any).isProfilePublic && !isOwnProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center space-y-8 p-12 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-2xl">
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-primary">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-display font-bold">Private Profile</h1>
              <p className="text-gray-500 leading-relaxed">
                This member has chosen to keep their profile private. Their contributions and stats are hidden from public view.
              </p>
            </div>
            <Link href="/community" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-opacity-90 active:scale-95 transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Community</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Profile Card */}
        <div className="max-w-6xl mx-auto mb-16 relative">
          <div className="h-64 md:h-80 w-full bg-gradient-to-br from-primary to-emerald-900 rounded-[60px] shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>
          
          <div className="absolute -bottom-12 left-12 flex flex-col md:flex-row items-end gap-8 px-4 w-[calc(100%-48px)]">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] bg-white dark:bg-zinc-900 border-8 border-white dark:border-black shadow-2xl flex items-center justify-center font-display font-bold text-primary text-5xl md:text-7xl shrink-0 overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name || "User Avatar"} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0)
              )}
            </div>
            <div className="pb-4 space-y-2 flex-grow">
               <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white drop-shadow-sm">{user.name}</h1>
                    {user.role === "ADMIN" && <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary drop-shadow-sm" />}
                  </div>
                  {isOwnProfile && <ProfileEditButton user={user} />}
               </div>
               <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> 
                    {user.location || "Global Citizen"}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> 
                    Joined {new Date(user.createdAt).getFullYear()}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mt-24">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[40px] space-y-6">
              <h3 className="text-xl font-display font-bold">About {user.name?.split(' ')[0]}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {user.bio || "Passionate about financial decentralization and building sustainable wealth loops. Contributing expert to BLOGGERPRO since inception."}
              </p>
              <div className="flex gap-4">
                <button className="p-3 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary transition-all shadow-sm">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary transition-all shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </button>
                {user.website && (
                  <Link 
                    href={user.website} 
                    target="_blank"
                    className="p-3 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-primary transition-all shadow-sm"
                  >
                    <Globe className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>

            <div className="p-8 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[40px] grid grid-cols-2 gap-6">
              <div className="text-center p-4 rounded-3xl bg-gray-50 dark:bg-black border border-gray-50 dark:border-gray-900">
                <Files className="w-6 h-6 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-display font-bold">{user._count.posts}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Articles</span>
              </div>
              <div className="text-center p-4 rounded-3xl bg-gray-50 dark:bg-black border border-gray-50 dark:border-gray-900">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-accent" />
                <span className="block text-2xl font-display font-bold">{user._count.forumTopics}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Discussions</span>
              </div>
            </div>
          </div>

          {/* Published Articles */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold">Published Insights</h2>
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <TrendingUp className="w-4 h-4" /> 
                    <span>{engagement?._sum?.viewCount || 0} Total Reads</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {user.posts.map((post: any) => (
                <ArticleCard key={post.id} post={{
                    ...post,
                    readTime: post.readTime || "10 min read",
                    votes: post.votes || 0
                }} />
              ))}
            </div>

            {user.posts.length === 0 && (
                <div className="p-20 text-center rounded-[40px] bg-gray-50 dark:bg-black border border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-400 font-medium">No articles published yet.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
