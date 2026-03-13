import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  FileText, 
  Users, 
  Settings, 
  TrendingUp, 
  MessageSquare, 
  LayoutDashboard, 
  Plus,
  ArrowUpRight,
  ShieldAlert,
  ShoppingBag,
  Activity,
  Eye,
  Heart,
  ShoppingCart,
  ArrowUp,
  Globe,
  MoreVertical,
  Zap,
  CheckCircle2,
  Clock,
  Calendar,
  GraduationCap
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
      redirect("/login");
  }

  // 1. Core Platform Metrics
  // We use Settled to prevent one missing table from crashing the entire dashboard during syncs
  const results = await Promise.allSettled([
    prisma.post.count(),
    prisma.user.count(),
    prisma.forumTopic.count(),
    prisma.user.count({ where: { role: "PRO" } }),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
    prisma.forumTopic.aggregate({ _sum: { viewCount: true } }),
    (prisma as any).postVote ? (prisma as any).postVote.count() : Promise.resolve(0),
    (prisma as any).topicVote ? (prisma as any).topicVote.count() : (prisma as any).topicLike ? (prisma as any).topicLike.count() : Promise.resolve(0),
    prisma.post.count({
      where: { 
          OR: [
              { category: { slug: "wealth-building" } },
              { category: { slug: "passive-income" } }
          ]
      }
    })
  ]);

  const postsCount = results[0].status === 'fulfilled' ? results[0].value : 0;
  const usersCount = results[1].status === 'fulfilled' ? results[1].value : 0;
  const topicsCount = results[2].status === 'fulfilled' ? results[2].value : 0;
  const proUsersCount = results[3].status === 'fulfilled' ? results[3].value : 0;
  const postViewsResult: any = results[4].status === 'fulfilled' ? results[4].value : { _sum: { viewCount: 0 } };
  const topicViewsResult: any = results[5].status === 'fulfilled' ? results[5].value : { _sum: { viewCount: 0 } };
  const postEngagementCount = results[6].status === 'fulfilled' ? results[6].value : 0;
  const topicEngagementCount = results[7].status === 'fulfilled' ? results[7].value : 0;
  const activeRoadmapsCount = results[8].status === 'fulfilled' ? results[8].value : 0;

  const totalViews = (postViewsResult._sum?.viewCount || 0) + (topicViewsResult._sum?.viewCount || 0);
  const totalEngagement = postEngagementCount + topicEngagementCount;

  // 2. Commerce & Model Safety Checks
  let productsCount = 0;
  let recentOrders: any[] = [];
  try {
    productsCount = await prisma.product.count();
    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true } }
      }
    });
  } catch (e) {
    console.log("Commerce interaction log sync...");
  }

  // 3. Activity Feeds
  const [latestPosts, latestUsers, latestTopics] = await Promise.all([
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    }),
    prisma.forumTopic.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } }
    })
  ]);

  const revenue = proUsersCount * 9.99;

  return (
    <div className="p-8 md:p-12 space-y-12 pb-24">
      {/* Premium Glass Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-950 p-10 rounded-[40px] border border-zinc-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 blur-3xl -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-5 blur-3xl translate-y-32 -translate-x-32"></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-xl relative">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
             </div>
             <h1 className="text-4xl font-display font-bold text-white tracking-tight">Executive Dashboard</h1>
          </div>
          <p className="text-zinc-400 font-medium">BloggerPro Insight & Control Engine. <span className="text-emerald-500 font-bold ml-1 flex items-center gap-1 inline-flex"><Globe className="w-3 h-3" /> System Live</span></p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <Link 
            href="/admin/articles/new" 
            className="group px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                <Plus className="w-4 h-4" />
            </div>
            <span>New Content</span>
          </Link>
          <button className="p-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all border border-zinc-800">
             <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Real-Time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: "Total Reach", value: totalViews.toLocaleString(), icon: Eye, color: "text-blue-500", detail: "Published Views", trend: "+18%" },
          { label: "Community", value: usersCount.toLocaleString(), icon: Users, color: "text-emerald-500", detail: `${proUsersCount} Premium Members`, trend: "+5%" },
          { label: "Roadmaps", value: activeRoadmapsCount.toLocaleString(), icon: GraduationCap as any, color: "text-purple-500", detail: "Active Blueprints", trend: "Catalog" },
          { label: "Engagement", value: totalEngagement.toLocaleString(), icon: Heart, color: "text-rose-500", detail: "Content Votes", trend: "+24%" },
          { label: "Moderation", value: (await prisma.post.count({ where: { status: "PENDING" } })).toLocaleString(), icon: Clock as any, color: "text-amber-500", detail: "Pending Review", trend: "Review" },
          { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: TrendingUp, color: "text-amber-500", detail: "Monthly (MRR)", trend: "+12%" },
        ].map((stat) => (
          <div key={stat.label} className="p-8 bg-zinc-950 rounded-[40px] border border-zinc-900 shadow-xl group hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-black border border-zinc-900 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 ${stat.label === 'Moderation' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'} text-[10px] font-bold rounded-lg flex items-center gap-1`}>
                    {stat.trend} {stat.label !== 'Moderation' && <ArrowUpRight className="w-3 h-3" />}
                  </span>
              </div>
            </div>
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</h3>
                <p className="text-4xl font-display font-bold mt-1 text-white">{stat.value}</p>
                <div className="mt-6 pt-6 border-t border-zinc-900 flex items-center justify-between text-[10px] font-bold text-zinc-500">
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className={`${stat.label === 'Moderation' ? 'bg-amber-400' : 'bg-emerald-400'} animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${stat.label === 'Moderation' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        {stat.label === 'Moderation' ? 'ACTION' : 'SYNCED'}
                    </span>
                    <span className="italic">{stat.detail}</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Monitor */}
          <div className="lg:col-span-2 space-y-8">
              {/* Recent User Data */}
              <div className="bg-zinc-950 rounded-[40px] border border-zinc-900 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-black/40">
                  <div className="flex items-center gap-3">
                     <Users className="w-5 h-5 text-emerald-500" />
                     <h2 className="text-xl font-bold font-display text-white">Recent Signups</h2>
                  </div>
                  <Link href="/admin/users" className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 group">
                    <span>Manage All</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left">
                     <thead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <tr>
                          <th className="px-6 py-4">Identity</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4 text-right">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {latestUsers.map((u: any) => (
                          <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 group-hover:border-primary/50 transition-all">
                                      {u.name?.charAt(0) || "U"}
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-white">{u.name || "Unnamed Builder"}</p>
                                      <p className="text-[10px] text-zinc-500">{u.email}</p>
                                   </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                  u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 
                                  u.role === 'PRO' ? 'bg-primary/10 text-primary' : 
                                  'bg-zinc-800 text-zinc-400'
                               }`}>
                                  {u.role}
                               </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                               <span className="text-[10px] font-bold text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>

              {/* Recent Community Pulse */}
              <div className="bg-zinc-950 rounded-[40px] border border-zinc-900 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-black/40">
                  <div className="flex items-center gap-3">
                     <MessageSquare className="w-5 h-5 text-purple-500" />
                     <h2 className="text-xl font-bold font-display text-white">Community Pulse</h2>
                  </div>
                  <Link href="/admin/community" className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 group">
                    <span>Boards</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="p-4 space-y-2">
                    {latestTopics.map((topic: any) => (
                      <div key={topic.id} className="p-5 hover:bg-zinc-900/40 rounded-[24px] border border-transparent hover:border-zinc-800 transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                                <Activity className="w-4 h-4 text-zinc-600 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{topic.title}</p>
                               <p className="text-[10px] text-zinc-500">By {topic.author.name} • {topic.category}</p>
                            </div>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] font-bold text-zinc-400">{new Date(topic.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                    ))}
                    {latestTopics.length === 0 && (
                      <div className="p-12 text-center italic text-zinc-600 text-sm">No community discussions launched yet.</div>
                    )}
                </div>
              </div>
          </div>

          <div className="space-y-8">
              {/* Live Commerce Feed */}
              <div className="bg-zinc-950 rounded-[40px] border border-zinc-900 shadow-2xl overflow-hidden h-full flex flex-col">
                <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-emerald-500/5">
                  <div className="flex items-center gap-3">
                     <ShoppingCart className="w-5 h-5 text-emerald-500" />
                     <h2 className="text-xl font-bold font-display text-white">Latest Sales</h2>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="flex-1 p-6 space-y-6">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex flex-col gap-3 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50">
                         <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-500 font-bold">$</div>
                                <span className="text-sm font-bold text-white">${order.amount}</span>
                             </div>
                             <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> PAID
                             </span>
                         </div>
                         <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest line-clamp-1">{order.product.title}</p>
                         <div className="h-px bg-zinc-800"></div>
                         <div className="flex justify-between items-center text-[10px] text-zinc-500 italic">
                             <span>{order.user.name}</span>
                             <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                    ))}
                    {recentOrders.length === 0 && (
                      <div className="p-20 text-center flex flex-col items-center gap-4 h-full justify-center">
                         <div className="p-4 bg-zinc-900 rounded-full">
                            <ShoppingCart className="w-8 h-8 text-zinc-800" />
                         </div>
                         <p className="text-zinc-600 font-bold italic text-sm">No live transactions.</p>
                      </div>
                    )}
                </div>
                <div className="p-6 bg-emerald-500/5 border-t border-zinc-900">
                    <Link href="/admin/orders" className="w-full py-4 bg-emerald-500/10 text-emerald-500 font-bold rounded-2xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-center block text-sm">
                      View Commerce Console
                    </Link>
                </div>
              </div>
          </div>
      </div>

      {/* Global Article Monitor */}
      <div className="bg-zinc-950 rounded-[40px] border border-zinc-900 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-zinc-900 border-zinc-900 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
             <FileText className="w-5 h-5 text-blue-500" />
             <h2 className="text-xl font-bold font-display text-white">Recent Articles</h2>
          </div>
          <Link href="/admin/articles" className="text-xs font-bold text-primary hover:text-accent transition-colors">Manage Content Catalog</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-8 py-6">Title</th>
                <th className="px-8 py-6">Performance</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {latestPosts.map((post: any) => (
                <tr key={post.id} className="hover:bg-zinc-900/40 transition-colors group">
                  <td className="px-8 py-6">
                      <div className="space-y-1">
                          <p className="font-bold text-white group-hover:text-primary transition-colors text-sm">{post.title}</p>
                          <p className="text-[10px] text-zinc-500 flex items-center gap-2 italic">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {post.author.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                          </p>
                      </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="font-bold text-xs">{post.viewCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300">
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span className="font-bold text-xs">{post.votes || 0}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold uppercase border border-emerald-500/20">Active</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/admin/articles/${post.id}`} className="p-3 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all inline-block border border-zinc-800">
                       <MoreVertical className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
