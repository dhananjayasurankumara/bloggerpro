import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function GuideStepPage({ 
  params 
}: { 
  params: { slug: string, stepSlug: string } 
}) {
  const session = await getServerSession(authOptions);
  
  const guide = await prisma.guide.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      steps: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!guide) notFound();

  // Step lookup (by index/order based on stepSlug if it's a number, or just search by title/slug if we had it)
  // For now, we'll assume stepSlug is the index (1-based)
  const stepIndex = parseInt(params.stepSlug) - 1;
  const step = guide.steps[stepIndex];

  if (!step) notFound();

  // Basic access check
  const isEnrolled = session?.user ? true : false;
  if (guide.isPremium && !isEnrolled) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
            <div className="max-w-md w-full text-center space-y-8 bg-zinc-900 p-12 rounded-[50px] border border-zinc-800 shadow-2xl">
                <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white leading-tight">Elite Access Required</h2>
                <p className="text-zinc-500 italic">This phase of the Blueprint is reserved for enrolled members. Unlock the journey to continue.</p>
                <Link href={`/guides/${guide.slug}`} className="block w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:scale-[1.02] transition-all">
                    Unlock Journey
                </Link>
            </div>
        </div>
    );
  }

  const prevStep = guide.steps[stepIndex - 1];
  const nextStep = guide.steps[stepIndex + 1];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 flex justify-between items-center">
            <Link href={`/guides/${guide.slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
                <ChevronLeft className="w-4 h-4" /> Journey Map
            </Link>
            <div className="px-4 py-1.5 bg-gray-100 dark:bg-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-gray-200 dark:border-zinc-800">
                Phase {stepIndex + 1} of {guide.steps.length}
            </div>
        </div>

        {/* Content Body */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-img:rounded-[40px] prose-img:shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-10 text-gray-900 dark:text-white">{step.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: step.content }} />
        </article>

        {/* Step Navigation */}
        <div className="mt-20 pt-12 border-t border-gray-100 dark:border-zinc-900 flex flex-col md:flex-row gap-6">
            {prevStep ? (
                <Link href={`/guides/${guide.slug}/${stepIndex}`} className="flex-1 p-8 bg-gray-50 dark:bg-zinc-900/50 rounded-[40px] border border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all group">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Previous Phase</p>
                    <div className="flex items-center gap-3">
                         <ChevronLeft className="w-5 h-5 text-zinc-600 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                         <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{prevStep.title}</span>
                    </div>
                </Link>
            ) : <div className="flex-1" />}

            {nextStep ? (
                <Link href={`/guides/${guide.slug}/${stepIndex + 2}`} className="flex-1 p-8 bg-black text-white rounded-[40px] border border-zinc-800 hover:border-primary/50 transition-all group text-right">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Next Phase</p>
                    <div className="flex items-center justify-end gap-3">
                         <span className="font-bold group-hover:text-primary transition-colors">{nextStep.title}</span>
                         <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            ) : (
                <Link href="/guides" className="flex-1 p-8 bg-emerald-500 text-white rounded-[40px] shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all text-center">
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-8 h-8 mb-2" />
                        <span className="font-black text-xs uppercase tracking-widest leading-none">Blueprint Completed</span>
                        <p className="text-[10px] text-white/70 italic">Return to Blueprints Gallery</p>
                    </div>
                </Link>
            )}
        </div>
      </div>
    </div>
  );
}
