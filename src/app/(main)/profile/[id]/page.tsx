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
  ArrowLeft,
  Edit,
  Trash2,
  Clock
} from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileEditButton from "@/components/ProfileEditButton";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.user && (session.user as any).id === id;
  
  const user = await prisma.user.findUnique({
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

  if (!user) notFound();
  
  const engagement = await prisma.post.aggregate({
    where: { authorId: id, published: true },
    _sum: { viewCount: true, votes: true }
  }) as any;

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
          <div className="h-64 md:h-80 w-full rounded-[60px] shadow-2xl overflow-hidden relative border border-gray-100 dark:border-zinc-900">
            {user.coverImage ? (
                <img src={user.coverImage} alt="" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary via-emerald-800 to-black relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          <div className="absolute -bottom-12 left-12 flex flex-col md:flex-row items-end gap-8 px-4 w-[calc(100%-48px)]">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] bg-white dark:bg-zinc-900 border-8 border-white dark:border-black shadow-2xl flex items-center justify-center font-display font-bold text-primary text-5xl md:text-7xl shrink-0 overflow-hidden relative group">
              {user.image ? (
                <img src={user.image} alt={user.name || "User Avatar"} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                user.name?.charAt(0)
              )}
            </div>
            <div className="pb-4 space-y-2 flex-grow">
               <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white drop-shadow-lg">{user.name}</h1>
                    {user.role === "ADMIN" && <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary drop-shadow-sm" />}
                  </div>
                  {isOwnProfile && <ProfileEditButton user={user as any} />}
               </div>
               <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                  <span className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                    <MapPin className="w-4 h-4" /> 
                    {user.location || "Global Citizen"}
                  </span>
                  <span className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
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

          <div className="lg:col-span-8 space-y-12">
            {/* My Submissions / Activity (Only for own profile) */}
            {isOwnProfile && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Submissions</h2>
                    <Link 
                      href="/articles/submit" 
                      className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                      Submit New Article
                    </Link>
                </div>
                
                <div className="bg-gray-50 dark:bg-zinc-950 rounded-[40px] border border-gray-100 dark:border-gray-900 overflow-hidden">
                  <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-zinc-900">
                    {(await prisma.post.findMany({
                      where: { authorId: id, NOT: { status: "PUBLISHED" } },
                      orderBy: { createdAt: "desc" },
                      include: { category: true }
                    })).map((submission: any) => (
                      <div key={submission.id} className="p-6 flex items-center justify-between group hover:bg-white dark:hover:bg-black transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 flex items-center justify-center font-bold text-gray-400 group-hover:border-primary/50 transition-all">
                            {submission.status === 'PENDING' ? (
                                <div className="relative">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                                </div>
                            ) : (
                                <ShieldCheck className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{submission.title}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                {submission.category?.name} • Updated {new Date(submission.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                submission.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                                {submission.status}
                            </span>
                            <div className="flex items-center gap-2 pl-4 border-l border-gray-100 dark:border-zinc-900">
                                <Link 
                                    href={`/articles/edit/${submission.id}`}
                                    className="p-2 bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-lg text-gray-400 hover:text-primary transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <DeleteButton 
                                    itemId={submission.id}
                                    deleteUrl={`/api/user/articles/${submission.id}`}
                                    confirmMessage="Delete this submission permanently?"
                                />
                            </div>
                        </div>
                      </div>
                    ))}
                    {(await prisma.post.count({ where: { authorId: id, NOT: { status: "PUBLISHED" } } })) === 0 && (
                      <div className="p-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                        No pending submissions.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Published Insights with Management */}
            <div className="space-y-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Published Insights</h2>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <TrendingUp className="w-4 h-4" /> 
                        <span>{engagement?._sum?.viewCount || 0} Total Reads</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {user.posts.map((post: any) => (
                    <div key={post.id} className="relative group/card">
                        <ArticleCard post={{
                            ...post,
                            readTime: post.readTime || "10 min read",
                            votes: post.votes || 0
                        }} />
                        {isOwnProfile && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-all scale-90 group-hover/card:scale-100 z-10">
                                <Link 
                                    href={`/articles/edit/${post.id}`}
                                    className="p-3 bg-white/90 dark:bg-black/90 backdrop-blur rounded-2xl border border-gray-100 dark:border-zinc-800 text-gray-400 hover:text-primary shadow-xl"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <DeleteButton 
                                     itemId={post.id}
                                     deleteUrl={`/api/user/articles/${post.id}`}
                                     confirmMessage="Remove this article from the public feed?"
                                     className="p-3 bg-white/90 dark:bg-black/90 backdrop-blur rounded-2xl border border-gray-100 dark:border-zinc-800 text-gray-400 hover:text-rose-500 shadow-xl"
                                />
                            </div>
                        )}
                    </div>
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
    </div>
  );
}
