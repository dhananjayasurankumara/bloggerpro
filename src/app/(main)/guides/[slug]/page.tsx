import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  GraduationCap, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Lock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  
  const guide = await prisma.guide.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      steps: {
        orderBy: { order: "asc" }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });

  if (!guide) {
    notFound();
  }

  // Basic access check (Real enrollment logic would go here)
  const isEnrolled = session?.user ? true : false;
  const canAccess = !guide.isPremium || isEnrolled;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-32 pb-32">
      <div className="container mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-12">
            <Link href="/guides" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Back to Blueprints
            </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 mb-20">
            <div className="lg:w-2/3 space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                             Knowledge Journey
                         </div>
                         {guide.isPremium && (
                             <div className="px-3 py-1 bg-accent/20 text-accent rounded-lg text-[10px] font-black uppercase tracking-widest border border-accent/20">
                                 Elite Content
                             </div>
                         )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight">{guide.title}</h1>
                    <p className="text-gray-500 text-lg md:text-xl italic leading-relaxed max-w-2xl">{guide.description}</p>
                </div>

                <div className="flex flex-wrap gap-8 items-center pt-4 border-t border-gray-100 dark:border-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Structure</p>
                            <p className="font-bold text-sm">{guide.steps.length} Phases</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <Users className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Community</p>
                            <p className="font-bold text-sm">{guide._count.enrollments} Students</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl">
                            <Clock className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</p>
                            <p className="font-bold text-sm">Self-Paced Execution</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:w-1/3">
                <div className="sticky top-40 bg-white dark:bg-black p-8 rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-2xl space-y-8 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -translate-y-16 translate-x-16"></div>
                    
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment Fee</p>
                        <h3 className="text-4xl font-display font-bold text-primary">
                            {guide.price > 0 ? `$${guide.price}` : 'Complimentary'}
                        </h3>
                    </div>

                    {!isEnrolled ? (
                         <div className="space-y-4">
                            <button className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Initialize Enrollment
                            </button>
                            <p className="text-[9px] text-zinc-500 text-center font-bold uppercase tracking-widest">
                                Instant access upon authorization
                            </p>
                         </div>
                    ) : (
                        <div className="space-y-4">
                             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Blueprint Active</span>
                             </div>
                             <button className="w-full py-5 bg-zinc-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all">
                                Resume Progress
                             </button>
                        </div>
                    )}

                    <div className="space-y-4 pt-8 border-t border-gray-50 dark:border-zinc-900">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">What's Included</h4>
                        <ul className="space-y-3">
                            {[
                                "Full High-Fidelity Roadmap",
                                "Expert Financial Blueprints",
                                "Interactive Progress Tracking",
                                "Elite Community Discourse"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                    <Zap className="w-3.5 h-3.5 text-accent" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* Journey Map */}
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold">The Journey Map</h2>
            </div>

            <div className="space-y-4">
                {guide.steps.map((step, index) => (
                    <div key={step.id} className={`group p-8 bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 flex justify-between items-center transition-all ${
                        canAccess ? 'hover:border-primary/30 cursor-pointer' : 'opacity-60 grayscale'
                    }`}>
                        <div className="flex items-center gap-8">
                            <span className="text-5xl font-display font-black text-gray-100 dark:text-zinc-900 transition-colors group-hover:text-primary/10">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <div className="space-y-1">
                                <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{step.title}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Phase Objective Defined</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                             {!canAccess ? (
                                <Lock className="w-5 h-5 text-gray-300" />
                             ) : (
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}
