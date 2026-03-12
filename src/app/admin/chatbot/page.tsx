import prisma from "@/lib/prisma";
import { 
  Sparkles, 
  MessageCircle, 
  Bot, 
  Zap, 
  Brain, 
  Settings, 
  History, 
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminChatbotPage() {
  const settingsResult = await prisma.siteSettings.findUnique({
    where: { id: "singleton" }
  });
  
  const settings = settingsResult || {
    chatbotEnabled: true,
    chatbotName: "ProBot",
    chatbotWelcome: "Hi! I'm ProBot. How can I help you today?"
  };

  // Mock interaction history since no dedicated model exists for this yet
  const recentInteractions = [
    { user: "User #8822", query: "How to upgrade to Pro?", status: "Resolved", time: "2m ago" },
    { user: "Guest_839", query: "What is BLOGGERPRO?", status: "Handoff", time: "15m ago" },
    { user: "Dhanush", query: "Explain crypto staking", status: "Resolved", time: "1h ago" },
  ];

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">AI Support Brain</h1>
          <p className="text-gray-500">Configure and monitor your automated assistant's intelligence.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">GPT-4 Turbo Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col: Config */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-black p-8 rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-900 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Bot Personality</h3>
                            <p className="text-xs text-gray-400">Define how the AI represents your brand.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">Status:</span>
                        {settings.chatbotEnabled ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> Online
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                <XCircle className="w-3 h-3" /> Offline
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assistant Name</label>
                            <input type="text" defaultValue={settings.chatbotName} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Model Tone</label>
                            <select className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none appearance-none cursor-pointer">
                                <option>Professional & Financial (Default)</option>
                                <option>Friendly & Encouraging</option>
                                <option>Concise & Direct</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Welcome Message</label>
                        <textarea rows={2} defaultValue={settings.chatbotWelcome} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none"></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Instruction (Brain)</label>
                        <textarea rows={4} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl font-medium text-xs text-gray-500 outline-none focus:ring-2 focus:ring-primary transition-all resize-none leading-relaxed" 
                        placeholder="You are BLOGGERPRO's financial expert. Your goal is to help users navigate our wealth-building blueprints and explain complex financial concepts in simple terms..."></textarea>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all">
                        <Settings className="w-4 h-4" />
                        <span>Update Brain Config</span>
                    </button>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white dark:bg-zinc-950 rounded-[30px] border border-gray-100 dark:border-gray-900 flex items-center justify-between group overflow-hidden relative">
                    <div className="space-y-1 relative z-10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Conversations</p>
                        <h4 className="text-3xl font-display font-bold">1,482</h4>
                    </div>
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-7 h-7" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                </div>
                <div className="p-8 bg-white dark:bg-zinc-950 rounded-[30px] border border-gray-100 dark:border-gray-900 flex items-center justify-between group overflow-hidden relative">
                    <div className="space-y-1 relative z-10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Success Rate</p>
                        <h4 className="text-3xl font-display font-bold">94.8%</h4>
                    </div>
                    <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                        <Brain className="w-7 h-7" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
                </div>
            </div>
        </div>

        {/* Right Col: Activity */}
        <div className="space-y-8 h-full">
            <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-gray-50 dark:border-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Real-time Interactions</h3>
                </div>
                <div className="p-4 flex-1 space-y-4">
                    {recentInteractions.map((item, i) => (
                        <div key={i} className="p-5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-3xl space-y-3 group hover:border-primary/30 transition-all cursor-pointer">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    {item.user}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                            </div>
                            <p className="text-xs font-bold text-gray-900 dark:text-gray-100 line-clamp-1 italic">
                                "{item.query}"
                            </p>
                            <div className="flex justify-between items-center pt-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                                    item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {item.status}
                                </span>
                                <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-zinc-950/50">
                    <button className="w-full py-3 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-gray-500 font-bold rounded-xl text-xs hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Full Intelligence Report
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
