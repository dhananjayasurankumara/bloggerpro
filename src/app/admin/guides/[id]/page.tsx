"use client";

import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight, 
  Layout, 
  Eye, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";

export default function GuideEditorPage({ params }: { params: { id: string } }) {
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(`/api/admin/guides/${params.id}`);
        setGuide(res.data);
        if (res.data.steps.length > 0) {
          setActiveStepId(res.data.steps[0].id);
        }
      } catch (error) {
        toast.error("Failed to load blueprint");
        router.push("/admin/guides");
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [params.id]);

  const handleUpdateGuide = async (updates: any) => {
    try {
      setSaving(true);
      const res = await axios.patch(`/api/admin/guides/${params.id}`, updates);
      setGuide({ ...guide, ...res.data });
      toast.success("Blueprint updated");
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAddStep = async () => {
    try {
      const res = await axios.post(`/api/admin/guides/${params.id}/steps`, {
        title: "New Lesson",
        content: "<p>Start writing your lesson content here...</p>",
        order: guide.steps.length
      });
      setGuide({ ...guide, steps: [...guide.steps, res.data] });
      setActiveStepId(res.data.id);
      toast.success("Lesson added to journey");
    } catch (error) {
      toast.error("Failed to add lesson");
    }
  };

  const handleUpdateStep = async (stepId: string, updates: any) => {
    try {
      const res = await axios.patch(`/api/admin/guides/${params.id}/steps/${stepId}`, updates);
      setGuide({
        ...guide,
        steps: guide.steps.map((s: any) => s.id === stepId ? res.data : s)
      });
    } catch (error) {
      toast.error("Failed to update lesson");
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm("Are you sure you want to remove this lesson from the roadmap?")) return;
    try {
      await axios.delete(`/api/admin/guides/${params.id}/steps/${stepId}`);
      setGuide({
        ...guide,
        steps: guide.steps.filter((s: any) => s.id !== stepId)
      });
      if (activeStepId === stepId) {
        setActiveStepId(guide.steps[0]?.id || null);
      }
      toast.success("Lesson removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const activeStep = guide.steps.find((s: any) => s.id === activeStepId);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 md:p-12 pb-32">
      {/* Premium Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <h1 className="text-3xl font-display font-bold">Blueprint Architect</h1>
                   <p className="text-zinc-500 font-medium italic">Mastering the {guide.title} Journey.</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
              onClick={() => handleUpdateGuide({ published: !guide.published })}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                guide.published 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" 
                : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
              }`}
            >
                {guide.published ? "Live on Platform" : "Hidden in Draft"}
            </button>
            <Link 
              href={`/guides/${guide.slug}`} 
              target="_blank"
              className="px-6 py-2.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 font-bold text-xs flex items-center gap-2 transition-all"
            >
                <Eye className="w-4 h-4" /> Preview
            </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Journey Sidebar */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/50 p-8 rounded-[40px] border border-zinc-800 shadow-xl space-y-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Roadmap Identity</label>
                        <input 
                            type="text" 
                            value={guide.title}
                            onChange={(e) => setGuide({...guide, title: e.target.value})}
                            onBlur={() => handleUpdateGuide({ title: guide.title })}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block">Premium Access (USD)</label>
                        <input 
                            type="number" 
                            value={guide.price}
                            onChange={(e) => setGuide({...guide, price: parseFloat(e.target.value)})}
                            onBlur={() => handleUpdateGuide({ price: guide.price })}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 px-4 text-sm font-bold font-display text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Journey Steps</label>
                        <button 
                            onClick={handleAddStep}
                            className="p-1.5 bg-primary/20 text-primary rounded-lg hover:scale-110 transition-transform"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {guide.steps.map((step: any, index: number) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStepId(step.id)}
                                className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                    activeStepId === step.id 
                                    ? "bg-primary/10 border-primary/30 text-white" 
                                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center ${
                                        activeStepId === step.id ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-200"
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-xs font-bold truncate max-w-[150px]">{step.title}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${activeStepId === step.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Media Upload (Placeholder/Draft) */}
            <div className="bg-zinc-900/40 p-10 rounded-[40px] border border-zinc-800 border-dashed text-center group cursor-pointer hover:bg-zinc-900/60 transition-all">
                <div className="w-16 h-16 bg-zinc-950 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-zinc-800 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-8 h-8 text-zinc-700" />
                </div>
                <h4 className="text-sm font-bold text-zinc-400">Blueprint Cover</h4>
                <p className="text-[10px] text-zinc-600 mt-2 font-medium italic">Professional 16:9 ratio recommended.</p>
            </div>
        </div>

        {/* Content Architect */}
        <div className="lg:col-span-8">
            {activeStep ? (
                <div className="space-y-8 bg-zinc-950 p-1 rounded-[40px] border-zinc-900">
                    <div className="flex justify-between items-center mb-6">
                        <div className="space-y-1">
                             <input 
                                type="text"
                                value={activeStep.title}
                                onChange={(e) => handleUpdateStep(activeStep.id, { title: e.target.value })}
                                className="bg-transparent border-none text-2xl font-display font-bold text-white outline-none focus:ring-0 w-full"
                                placeholder="Lesson Title..."
                             />
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">Phase {guide.steps.indexOf(activeStep) + 1} Content</p>
                        </div>
                        <button 
                            onClick={() => handleDeleteStep(activeStep.id)}
                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-white text-black rounded-[40px] overflow-hidden min-h-[600px] shadow-2xl border-b-8 border-primary/20">
                        <RichTextEditor 
                            content={activeStep.content}
                            onChange={(content: string) => handleUpdateStep(activeStep.id, { content })}
                        />
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center p-20 text-center bg-zinc-900/20 rounded-[40px] border border-dashed border-zinc-800">
                    <div className="w-20 h-20 bg-zinc-950 rounded-[32px] flex items-center justify-center mb-8">
                        <Layout className="w-10 h-10 text-zinc-800" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-zinc-400">Empty Journey</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto mt-4 font-medium italic leading-relaxed">
                        Every great roadmap begins with a single step. Add your first lesson to begin architecting this financial blueprint.
                    </p>
                    <button 
                        onClick={handleAddStep}
                        className="mt-10 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                    >
                        <Plus className="w-5 h-5" /> Add First Lesson
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
