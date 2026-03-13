import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  Bookmark, 
  Settings, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  User,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch bookmarked posts
  let user: any = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        bookmarks: {
          include: { category: true, author: true }
        }
      }
    });
  } catch (error) {
    console.error("[DASHBOARD_ERROR] Database unreachable:", error);
    // If DB is down, we can't really show the dashboard properly
    // but we can at least not crash.
  }

  if (!user && !process.env.DATABASE_URL?.includes("user:password")) {
    // Session is stale, user was deleted from DB
    redirect("/api/auth/signout");
  }

  const userRole = (session.user as any).role;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">Member Dashboard</h1>
            <p className="text-gray-500">Welcome back, {session.user.name}. Manage your financial roadmap here.</p>
          </div>
          <div className="flex gap-4">
            {session.user.role === "ADMIN" && (
                <Link href="/admin" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" />
                    Admin Panel
                </Link>
            )}
            <Link href="/settings" className="px-6 py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 font-bold rounded-xl shadow-sm flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stats Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-8 bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary font-display font-bold text-3xl">
                        {session.user.name?.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{session.user.name}</h3>
                        <div className="flex flex-col items-center gap-2 mt-2">
                             {(session.user as any).role === "PRO" || (session.user as any).role === "BUSINESS" || (session.user as any).role === "ADMIN" || (session.user as any).role === "MODERATOR" ? (
                                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Zap className="w-3 h-3 fill-accent" /> Platform Pro
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-900 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    Free Account
                                </span>
                            )}
                            {/* Points Indicator */}
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                                    {(user as any).points || 0} Points
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <nav className="space-y-2">
                    <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-900 rounded-xl font-bold text-primary">
                        <Bookmark className="w-4 h-4" /> Bookmarks
                    </Link>
                    <Link href="/community" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-primary transition-all font-bold">
                        <MessageSquare className="w-4 h-4" /> My Discussions
                    </Link>
                    <Link href="/pricing" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-primary transition-all font-bold">
                        <TrendingUp className="w-4 h-4" /> Analytics
                    </Link>
                </nav>
            </div>

            {userRole !== "PRO" && userRole !== "BUSINESS" && userRole !== "ADMIN" && userRole !== "MODERATOR" && (
                <div className="p-8 bg-primary text-white rounded-[40px] shadow-xl space-y-6 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <h4 className="text-lg font-display font-bold relative z-10">Unleash the Pro</h4>
                    <p className="text-white/70 text-sm leading-relaxed relative z-10">Unlock premium guides, ad-free reading, and expert community access.</p>
                    <Link href="/pricing" className="block w-full py-3 bg-accent text-primary text-center font-bold rounded-xl text-sm relative z-10 hover:bg-white transition-all">Upgrade Now</Link>
                </div>
            )}
          </div>

          {/* Bookmarks Grid */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex items-center gap-3">
                <Bookmark className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold">Saved for Later</h2>
            </div>
            
            {user?.bookmarks.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {user.bookmarks.map((post: any) => (
                        <ArticleCard key={post.id} post={{
                            ...post,
                            readTime: post.readTime || "10 min read"
                        }} />
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center rounded-[50px] bg-white dark:bg-black border border-dashed border-gray-100 dark:border-gray-900 space-y-6">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto">
                        <Bookmark className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Your reading list is empty</h3>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">Found a guide you like? Click the bookmark icon to save it here for quick access later.</p>
                    </div>
                    <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
                        Browse Articles <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
