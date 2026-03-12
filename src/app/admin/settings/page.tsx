"use client";

import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  Paintbrush, 
  Mail, 
  Lock,
  Zap,
  CheckCircle2,
  Loader2,
  DollarSign,
  ShieldCheck
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    siteName: "BloggerPro",
    siteDescription: "",
    contactEmail: "",
    primaryColor: "#10b981",
    logoUrl: "",
    adClient: "",
    adsEnabled: false,
    chatbotEnabled: true,
    chatbotName: "ProBot",
    chatbotWelcome: "Hi! I'm ProBot. How can I help you today?",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/admin/settings");
        if (Object.keys(res.data).length > 0) {
          setFormData(prev => ({ ...prev, ...res.data }));
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast.error("Failed to load platform settings");
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("/api/admin/settings", formData);
      toast.success("Platform settings updated successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Cloud synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "appearance", label: "Appearance", icon: Paintbrush },
    { id: "ads", label: "Ads", icon: DollarSign },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "security", label: "Security", icon: Lock },
  ];

  if (fetching) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Command Decryption...</p>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-6xl">
      <header className="flex justify-between items-center mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Platform Configuration</h1>
          <p className="text-gray-500">Master control panel for global site logic and aesthetics.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Commit Changes</span>
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigation */}
        <div className="lg:w-64 shrink-0">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Form Body */}
        <div className="flex-1 space-y-8">
            <div className="bg-white dark:bg-black p-10 rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm space-y-10">
                {activeTab === "general" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Site Title</label>
                                <input 
                                  required
                                  type="text" 
                                  value={formData.siteName} 
                                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Email</label>
                                <input 
                                  type="email" 
                                  value={formData.contactEmail} 
                                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Site Description (SEO)</label>
                            <textarea 
                              rows={4} 
                              value={formData.siteDescription}
                              onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary resize-none leading-relaxed"
                            />
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-50 dark:border-zinc-900">
                             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                             </div>
                             <div>
                                <h4 className="font-bold text-sm">Deployment Heartbeat</h4>
                                <p className="text-xs text-gray-500">Global presence is active. Metadata is being served to edge nodes.</p>
                             </div>
                             <div className="ml-auto">
                                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-widest">LIVE</span>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === "appearance" && (
                    <div className="space-y-10">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'].map((color) => (
                                <div 
                                  key={color} 
                                  onClick={() => setFormData({...formData, primaryColor: color})}
                                  className={`aspect-square rounded-3xl border-4 ${formData.primaryColor === color ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60"} flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 hover:opacity-100`} 
                                  style={{ backgroundColor: color + '10' }}
                                >
                                    <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: color }}></div>
                                    <span className="text-[10px] font-bold opacity-50 uppercase">{color}</span>
                                </div>
                            ))}
                         </div>

                         <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                            <h4 className="font-bold flex items-center gap-2">
                                <Paintbrush className="w-4 h-4" /> Aesthetics Preview
                            </h4>
                            <p className="text-sm text-gray-500 italic leading-relaxed">Selecting a primary color updates all core UI components, including the dashboard status indicators, buttons, and gradients. Committing changes will re-render the site theme platform-wide.</p>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Custom Logo URL</label>
                            <input 
                              type="text" 
                              value={formData.logoUrl}
                              onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                              placeholder="https://example.com/logo.png"
                              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary" 
                            />
                         </div>
                    </div>
                )}

                {activeTab === "ads" && (
                    <div className="space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-orange-500">
                                <DollarSign className="w-6 h-6" />
                                <h3 className="font-bold text-xl font-display">Monetization Hub</h3>
                            </div>
                            <div 
                              onClick={() => setFormData({...formData, adsEnabled: !formData.adsEnabled})}
                              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all ${
                                formData.adsEnabled ? "bg-orange-50 dark:bg-orange-900/10 text-orange-600" : "bg-gray-100 text-gray-400"
                              }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${formData.adsEnabled ? "bg-orange-500 animate-pulse" : "bg-gray-300"}`}></div>
                                {formData.adsEnabled ? "AdSense Active" : "AdSense Offline"}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Google AdSense Publisher ID</label>
                                <input 
                                  type="text" 
                                  value={formData.adClient}
                                  onChange={(e) => setFormData({...formData, adClient: e.target.value})}
                                  placeholder="ca-pub-xxxxxxxxxxxx" 
                                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl font-mono text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm" 
                                />
                            </div>

                            <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl flex items-start gap-4">
                                <Zap className="w-6 h-6 text-orange-500 shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-orange-600">Smart Ad Injection</h4>
                                    <p className="text-xs text-orange-600/70 leading-relaxed italic">Once enabled, ads will automatically be injected into strategic placements in the Hero section and Article body. High-performing slots are prioritized for maximum RPM.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "newsletter" && (
                     <div className="p-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-primary">
                            <Mail className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-2xl font-bold font-display">Email Synchronization</h3>
                           <p className="text-gray-500 max-w-sm mx-auto">Connect your Mailchimp or ConvertKit account to sync weekly blueprints with your newsletter subscribers.</p>
                        </div>
                        <button className="px-8 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 font-bold rounded-xl active:scale-95 transition-all">
                            Configure Relay
                        </button>
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="space-y-8">
                        <div className="p-8 border border-red-100 dark:border-red-900/30 rounded-3xl bg-red-50/30 dark:bg-red-900/10 space-y-4">
                            <h4 className="text-red-600 font-bold flex items-center gap-2 italic">
                                <Zap className="w-4 h-4" /> Danger Zone
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Critical platform overrides. These actions cannot be undone via this dashboard.</p>
                            <div className="flex gap-4 pt-4">
                                <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-red-500/20 active:scale-95 transition-all">Clear System Caches</button>
                                <button className="px-6 py-3 border border-red-200 text-red-600 font-bold rounded-xl text-xs hover:bg-red-50 active:scale-95 transition-all">Reset Platform Tokens</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 bg-zinc-950 rounded-3xl border border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <div>
                        <h4 className="font-bold text-white text-sm tracking-tight">Audit Consistency Check</h4>
                        <p className="text-xs text-zinc-500">Every change involves a zero-downtime persistence to the SQLite backbone.</p>
                    </div>
                </div>
                <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
