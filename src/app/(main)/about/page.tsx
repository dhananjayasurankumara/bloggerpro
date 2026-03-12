import { ArrowLeft, Zap, Target, Star, ShieldCheck, Users, Globe, TrendingUp, Cpu, Home as House } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <section className="relative text-center space-y-8 py-16 px-8 rounded-[60px] bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                    <Star className="w-3.5 h-3.5 fill-primary" />
                    <span>Established 2026</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                    Wealth Building for the <br />
                    <span className="text-primary italic">Modern Intelligence Age.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-zinc-400 font-medium leading-relaxed">
                    BloggerPro is the premier destination for financial alpha, bridging the gap between traditional investment theory and the high-yield strategies of the top 1%.
                </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[50px] space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group">
                    <Target className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-display font-bold">Our Mission</h2>
                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                    To democratize wealth-building intelligence. We strip away the corporate jargon and provide battle-tested strategies in AI automation, real estate, and digital markets that were once reserved for institutional players.
                </p>
            </div>
            <div className="p-12 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[50px] space-y-6 hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                    <Globe className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-display font-bold">The Vision</h2>
                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                    A world where financial independence is predictable and programmatic. By leveraging high-growth sectors and automated income loops, we empower our readers to reclaim their most valuable asset: time.
                </p>
            </div>
          </section>

          {/* Core Pillars */}
          <section className="space-y-12">
            <div className="text-center space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">The Collective Intelligence</h3>
                <h2 className="text-4xl font-display font-bold">Our Wealth Pillars</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "AI Automation", desc: "Lowering overhead while maximizing output through LLMs and custom GPT workflows.", icon: Cpu, color: "text-blue-500" },
                    { title: "Niche Assets", desc: "Identifying undervalued real estate and digital property before the market corrects.", icon: House, color: "text-emerald-500" },
                    { title: "Market Alpha", desc: "Deep-dive analysis into stock volatility and cyclical wealth patterns.", icon: TrendingUp, color: "text-amber-500" },
                ].map((pillar, i) => (
                    <div key={i} className="p-8 rounded-[40px] bg-gray-50/50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800 space-y-4 text-center group">
                        <div className={`w-16 h-16 mx-auto rounded-3xl bg-white dark:bg-black flex items-center justify-center ${pillar.color} shadow-sm group-hover:scale-110 transition-transform`}>
                            <pillar.icon className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-bold">{pillar.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-zinc-500 font-medium leading-relaxed">{pillar.desc}</p>
                    </div>
                ))}
            </div>
          </section>

          {/* Community Stats */}
          <section className="py-20 border-y border-gray-100 dark:border-zinc-900 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
                { label: "Active Members", value: "12,500+", icon: Users },
                { label: "Weekly Insights", value: "450+", icon: Zap },
                { label: "Verified Experts", value: "24", icon: ShieldCheck },
                { label: "Alpha Generated", value: "$4.2M", icon: TrendingUp },
            ].map((stat, i) => (
                <div key={i} className="space-y-2">
                    <p className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex justify-center items-center gap-2">
                        <stat.icon className="w-3 h-3" />
                        {stat.label}
                    </p>
                </div>
            ))}
          </section>

          {/* CTA */}
          <section className="bg-primary p-16 rounded-[60px] text-center space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 blur-[100px] translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                    Ready to scale your <br />
                    financial intelligence?
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/pricing" className="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        UPGRADE TO PRO PLUS
                    </Link>
                    <Link href="/community" className="px-10 py-5 bg-primary border border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
                        JOIN THE DISCUSSION
                    </Link>
                </div>
            </div>
          </section>

          {/* Home Link */}
          <div className="text-center pt-8">
            <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Return to Control Center
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
