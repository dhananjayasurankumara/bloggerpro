"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Search, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Bot
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AdminBotCommands() {
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  
  const [newCommand, setNewCommand] = useState({
    command: "",
    response: ""
  });

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const res = await axios.get("/api/admin/bot-commands");
      setCommands(res.data);
    } catch (error) {
      toast.error("Failed to load commands");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommand.command || !newCommand.response) return;

    try {
      const res = await axios.post("/api/admin/bot-commands", newCommand);
      setCommands([res.data, ...commands]);
      setNewCommand({ command: "", response: "" });
      setIsAdding(false);
      toast.success("Manual command added!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add command");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This manual override will be removed.")) return;

    try {
      await axios.delete(`/api/admin/bot-commands?id=${id}`);
      setCommands(commands.filter(c => c.id !== id));
      toast.success("Command removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredCommands = commands.filter(c => 
    c.command.toLowerCase().includes(search.toLowerCase()) ||
    c.response.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-950 p-8 rounded-[40px] border border-zinc-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-xl">
                <Bot className="w-5 h-5 text-primary" />
             </div>
             <h1 className="text-4xl font-display font-bold text-white">Bot Overrides</h1>
          </div>
          <p className="text-zinc-400">Manage manual question-and-answer pairs for BlogBot AI.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 relative z-10"
        >
          {isAdding ? <MessageSquare className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{isAdding ? "View All" : "Add Command"}</span>
        </button>
      </div>

      {isAdding ? (
        <form onSubmit={handleCreate} className="bg-zinc-950 p-10 rounded-[40px] border border-zinc-900 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4 italic">Trigger Question / Phrase</label>
              <input 
                required
                value={newCommand.command}
                onChange={(e) => setNewCommand({...newCommand, command: e.target.value})}
                placeholder="e.g. how many pricing plans?"
                className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all text-white font-bold"
              />
              <p className="text-[10px] text-zinc-600 ml-4 font-italic">* This must be the exact user input (case-insensitive).</p>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4 italic">Override Answer</label>
              <textarea 
                required
                rows={4}
                value={newCommand.response}
                onChange={(e) => setNewCommand({...newCommand, response: e.target.value})}
                placeholder="The manual response BlogBot should give..."
                className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all text-zinc-300 resize-none leading-relaxed"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
          >
            Save Command Override
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Filter commands..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-900 rounded-xl outline-none focus:border-primary transition-all text-zinc-300 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="font-bold uppercase tracking-widest text-xs">Syncing Command Database...</p>
              </div>
            ) : filteredCommands.length > 0 ? filteredCommands.map((cmd) => (
              <div key={cmd.id} className="group bg-zinc-950 border border-zinc-900 p-8 rounded-[40px] hover:border-primary/50 transition-all space-y-6 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(cmd.id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest italic">Trigger</span>
                  </div>
                  <h3 className="text-lg font-bold text-white line-clamp-2">"{cmd.command}"</h3>
                  <div className="h-px bg-zinc-900 w-full"></div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Manual Response</span>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4 italic">
                      {cmd.response}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active Override</span>
                   </div>
                   <span className="text-[10px] text-zinc-600">{new Date(cmd.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center bg-zinc-950 rounded-[40px] border border-zinc-900 border-dashed border-2">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Zap className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold text-zinc-500 mb-2 italic">Zero Manual Overrides</h3>
                <p className="text-zinc-600 text-sm max-w-xs mx-auto">Add manual Q&A pairs to bypass GPT-4 for specific business questions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
