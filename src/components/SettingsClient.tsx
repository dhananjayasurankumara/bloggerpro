"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Globe,
  Settings,
  Smartphone,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Image as ImageIcon,
  Plus,
  ExternalLink
} from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

export default function SettingsClient() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(false);
  const user = session?.user as any;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    image: user?.image || "",
    location: user?.location || "",
    website: user?.website || "",
    twitter: user?.twitter || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    image: user?.image || "",
    coverImage: user?.coverImage || "",
    isProfilePublic: user?.isProfilePublic ?? true,
  });

  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifData, setNotifData] = useState({
    notifNetwork: user?.notifNetwork ?? true,
    notifDirect: user?.notifDirect ?? true,
    notifMarket: user?.notifMarket ?? false,
    notifTransaction: user?.notifTransaction ?? true,
  });

  const [prefData, setPrefData] = useState({
    prefDarkMode: user?.prefDarkMode ?? true,
    prefLowNoise: user?.prefLowNoise ?? false,
    language: user?.language || "English",
    timezone: user?.timezone || "UTC",
  });

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/user/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    if (activeTab === "Billing") {
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await axios.patch("/api/user/profile", {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        github: formData.github,
        image: formData.image,
        coverImage: formData.coverImage,
        isProfilePublic: formData.isProfilePublic
      });
      await update();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSecurity = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (securityData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await axios.patch("/api/user/security", {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Security update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotifications = async (updatedData: any) => {
    setLoading(true);
    try {
      setNotifData(updatedData);
      await axios.patch("/api/user/notifications", updatedData);
      await update();
      toast.success("Notification preferences saved");
    } catch (error: any) {
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const uploadData = new FormData();
      uploadData.append("file", compressedFile);

      const res = await axios.post("/api/admin/upload", uploadData);
      setFormData({ ...formData, image: res.data.url });
      toast.success("Avatar ready to save!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setCompressing(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 1.0,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const uploadData = new FormData();
      uploadData.append("file", compressedFile);

      const res = await axios.post("/api/admin/upload", uploadData);
      setFormData({ ...formData, coverImage: res.data.url });
      toast.success("Cover photo ready to save!");
    } catch (error) {
      toast.error("Cover upload failed");
    } finally {
      setCompressing(false);
    }
  };

  const handleUpdatePreferences = async (updatedData: any) => {
    setLoading(true);
    try {
      setPrefData(updatedData);
      await axios.patch("/api/user/preferences", updatedData);
      await update();
      toast.success("Interface preferences updated");
    } catch (error: any) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:w-1/4 space-y-2">
            {[
                { label: "General", icon: User },
                { label: "Social Connect", icon: Globe },
                { label: "Security", icon: Lock },
                { label: "Notifications", icon: Bell },
                { label: "Billing", icon: CreditCard },
                { label: "Preferences", icon: Shield }
            ].map((item) => (
                <button 
                    key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                        activeTab === item.label 
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900"
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4 space-y-10">
            {activeTab === "General" && (
                <>
                    {/* Subscription Card */}
                    <div className="p-8 bg-gradient-to-br from-zinc-900 to-black rounded-[40px] text-white relative overflow-hidden shadow-2xl border border-zinc-800">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-20 blur-[100px] -translate-y-24 translate-x-24"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                                    <Zap className="w-3 h-3 text-accent" />
                                    <span>Account Status</span>
                                </div>
                                <h3 className="text-3xl font-display font-bold lowercase tracking-tight">
                                    current plan: <span className="text-primary italic uppercase">{user?.role || "FREE"}</span>
                                </h3>
                                <p className="text-zinc-500 text-sm font-medium">Verified Active Presence</p>
                            </div>
                            {user?.role !== "ADMIN" && user?.role !== "PRO" && (
                                <Link href="/pricing" className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 group shrink-0">
                                    Upgrade to Pro Plus
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="p-10 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-sm space-y-8">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="relative group">
                                <div className="w-32 h-32 bg-gray-100 dark:bg-zinc-900 rounded-[32px] overflow-hidden border-4 border-white dark:border-zinc-950 shadow-2xl relative">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-primary bg-primary/10">
                                            {formData.name?.charAt(0)}
                                        </div>
                                    )}
                                    {compressing && (
                                        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleAvatarUpload} 
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-display font-bold">Profile Identity</h4>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Public representation</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Display Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="City, Country"
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personal Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="url" 
                                        placeholder="https://yourlink.com"
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                                        value={formData.website}
                                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cover Photo URL</label>
                                <div className="flex gap-4">
                                    <div className="relative flex-grow">
                                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="url" 
                                            placeholder="https://images.unsplash.com/your-cover-photo"
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold transition-all"
                                            value={formData.coverImage}
                                            onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => coverFileInputRef.current?.click()}
                                        className="p-4 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 group shrink-0"
                                        title="Upload from device"
                                    >
                                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                        <span className="hidden md:inline text-xs font-bold uppercase tracking-widest">Device</span>
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={coverFileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleCoverUpload} 
                                    />
                                </div>
                                {formData.coverImage && (
                                    <div className="mt-4 rounded-3xl overflow-hidden h-32 w-full border border-gray-100 dark:border-zinc-800 shadow-sm relative group">
                                        <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        {compressing && (
                                            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address (Locked)</label>
                                <input 
                                    type="email" 
                                    disabled
                                    className="w-full px-6 py-4 bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-2xl outline-none text-gray-400 font-bold opacity-70 cursor-not-allowed"
                                    value={formData.email}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personal Bio</label>
                                <textarea 
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium transition-all min-h-[120px]"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    placeholder="Tell the community about your wealth goals..."
                                />
                            </div>
                            <div className="md:col-span-2 p-6 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between transition-all">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 dark:text-gray-100">Public Profile Visibility</p>
                                    <p className="text-xs text-gray-500">Allow other members to view your posts, points, and bio.</p>
                                </div>
                                <button 
                                    onClick={() => setFormData({...formData, isProfilePublic: !formData.isProfilePublic})}
                                    className={`w-14 h-8 rounded-full transition-all relative ${formData.isProfilePublic ? "bg-primary" : "bg-gray-300 dark:bg-zinc-800"}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${formData.isProfilePublic ? "right-1" : "left-1"}`}></div>
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 dark:border-gray-900 flex justify-end">
                            <button 
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="px-10 py-5 bg-primary text-white font-display font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save All Changes
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-10 border-2 border-red-50 dark:border-red-950/30 rounded-[50px] space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-display font-bold text-red-600">Danger Zone</h4>
                                <p className="text-red-400 text-xs font-medium uppercase tracking-widest">Irreversible actions</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-red-50/50 dark:bg-red-950/10 rounded-3xl">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-zinc-200">Deactivate Account</p>
                                <p className="text-sm text-gray-500">Temporarily disable your public profile and forum access.</p>
                            </div>
                            <button className="px-6 py-3 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all shrink-0">
                                Deactivate
                            </button>
                        </div>
                    </div>
                </>
            )}

            {activeTab === "Social Connect" && (
                <div className="p-10 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-sm space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-display font-bold">Social Ecosystem</h4>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Digital connectivity</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 max-w-2xl">
                        {[
                            { id: 'twitter', label: "Twitter / X Profile", icon: Twitter, placeholder: "https://twitter.com/username", color: "text-sky-500" },
                            { id: 'linkedin', label: "LinkedIn Profile", icon: Linkedin, placeholder: "https://linkedin.com/in/username", color: "text-blue-700" },
                            { id: 'github', label: "GitHub Profile", icon: Github, placeholder: "https://github.com/username", color: "text-gray-900 dark:text-white" }
                        ].map((social) => (
                            <div key={social.id} className="space-y-3 group">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{social.label}</label>
                                    {formData[social.id as keyof typeof formData] && (
                                        <a href={formData[social.id as keyof typeof formData] as string} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                                            Test Link <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <social.icon className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 ${social.color}`} />
                                    <input 
                                        type="url" 
                                        placeholder={social.placeholder}
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-[28px] outline-none focus:ring-2 focus:ring-primary font-bold transition-all group-hover:border-primary/20"
                                        value={formData[social.id as keyof typeof formData] as string}
                                        onChange={(e) => setFormData({...formData, [social.id]: e.target.value})}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-50 dark:border-gray-900 flex justify-end">
                        <button 
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="px-10 py-5 bg-primary text-white font-display font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Sync Social Identity
                        </button>
                    </div>
                </div>
            )}
            
            {activeTab === "Security" && (
                <div className="p-10 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-sm space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-500">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-display font-bold">Access & Security</h4>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Credential management</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 max-w-xl">
                        <div className="space-y-4">
                            <h5 className="font-bold text-gray-900 dark:text-white">Change Password</h5>
                            <div className="space-y-4">
                                <input 
                                    type="password" 
                                    placeholder="Current Password" 
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium" 
                                    value={securityData.currentPassword}
                                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                                />
                                <input 
                                    type="password" 
                                    placeholder="New Password" 
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium" 
                                    value={securityData.newPassword}
                                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                                />
                                <input 
                                    type="password" 
                                    placeholder="Verify New Password" 
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium" 
                                    value={securityData.confirmPassword}
                                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleUpdateSecurity}
                                disabled={loading || !securityData.currentPassword || !securityData.newPassword}
                                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Update Credentials"}
                            </button>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-900 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold">Two-Factor Authentication</p>
                                    <p className="text-sm text-gray-500 text-zinc-400">Add an extra layer of security to your account.</p>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-[10px] font-bold">COMING SOON</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === "Notifications" && (
                <div className="p-10 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-sm space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-display font-bold">Alert Preferences</h4>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Notification protocols</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { id: 'notifNetwork', title: "Network Updates", desc: "Receive alerts for new Alpha releases and platform upgrades.", active: notifData.notifNetwork },
                            { id: 'notifDirect', title: "Direct Intelligence", desc: "Get notified when someone replies to your forum insights.", active: notifData.notifDirect },
                            { id: 'notifMarket', title: "Market Alerts", desc: "Weekly wealth-building blueprint and market analysis.", active: notifData.notifMarket },
                            { id: 'notifTransaction', title: "Transaction Reciepts", desc: "Email confirmation for all digital asset acquisitions.", active: notifData.notifTransaction }
                        ].map((notif, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-zinc-900/30 border border-gray-100 dark:border-gray-800 rounded-3xl">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{notif.title}</p>
                                    <p className="text-xs text-gray-500">{notif.desc}</p>
                                </div>
                                <button 
                                    onClick={() => handleUpdateNotifications({...notifData, [notif.id]: !notif.active})}
                                    disabled={loading}
                                    className={`w-12 h-7 rounded-full transition-all relative ${notif.active ? "bg-primary" : "bg-gray-300 dark:bg-zinc-800"} disabled:opacity-50`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all ${notif.active ? "right-1" : "left-1"}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "Billing" && (
                <div className="space-y-8">
                    <div className="p-10 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-sm space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-500">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-display font-bold">Subscription Ledger</h4>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Financial connectivity</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-primary border border-gray-100 dark:border-zinc-800">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">Pro Plus Access</p>
                                    <p className="text-xs text-primary font-bold">ACTIVE SUBSCRIPTION</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">Manage Stripe</button>
                        </div>
                    </div>

                    <div className="p-10 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-sm space-y-8">
                        <h5 className="font-bold uppercase tracking-widest text-xs text-gray-400">Alpha Transaction History</h5>
                        <div className="space-y-4">
                             {orders.length > 0 ? orders.map((order, i) => (
                                 <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-900 last:border-0">
                                     <div>
                                         <p className="font-bold text-sm text-gray-900 dark:text-white">{order.product.title}</p>
                                         <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="font-bold text-sm text-gray-900 dark:text-white">${order.amount.toFixed(2)}</p>
                                         <p className={`text-[9px] font-bold uppercase ${order.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.status}</p>
                                     </div>
                                 </div>
                             )) : (
                                 <p className="text-sm text-gray-500 py-4">No recent transactions found.</p>
                             )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Preferences" && (
                <div className="p-10 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[50px] shadow-sm space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Settings className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-display font-bold">System Experience</h4>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Interface customization</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-6 group transition-all hover:border-primary/30">
                            <div className="flex justify-between items-center">
                                <h5 className="font-bold text-gray-900 dark:text-white">Dark Mode Protocol</h5>
                                <button 
                                    onClick={() => handleUpdatePreferences({...prefData, prefDarkMode: !prefData.prefDarkMode})}
                                    disabled={loading}
                                    className={`w-12 h-7 rounded-full relative transition-all ${prefData.prefDarkMode ? "bg-primary" : "bg-gray-300 dark:bg-zinc-800"}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all ${prefData.prefDarkMode ? "right-1" : "left-1"}`}></div>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">Automatic interface switching based on system preference or manual toggle.</p>
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-6 group transition-all hover:border-primary/30">
                            <div className="flex justify-between items-center">
                                <h5 className="font-bold text-gray-900 dark:text-white">Low Noise UI</h5>
                                <button 
                                    onClick={() => handleUpdatePreferences({...prefData, prefLowNoise: !prefData.prefLowNoise})}
                                    disabled={loading}
                                    className={`w-12 h-7 rounded-full relative transition-all ${prefData.prefLowNoise ? "bg-primary" : "bg-gray-300 dark:bg-zinc-800"}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all ${prefData.prefLowNoise ? "right-1" : "left-1"}`}></div>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">Reduce animations and background visuals for maximum focus during analysis.</p>
                        </div>

                        <div className="p-8 bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-6 group transition-all hover:border-primary/30 col-span-1 md:col-span-2 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Globe className="w-5 h-5 text-primary" />
                                <h5 className="font-bold text-gray-900 dark:text-white">Regional Protocol</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Language</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold appearance-none"
                                        value={prefData.language}
                                        onChange={(e) => setPrefData({...prefData, language: e.target.value})}
                                    >
                                        <option value="English">English (US)</option>
                                        <option value="Spanish">Español</option>
                                        <option value="French">Français</option>
                                        <option value="German">Deutsch</option>
                                        <option value="Japanese">日本語</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Operational Timezone</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold appearance-none"
                                        value={prefData.timezone}
                                        onChange={(e) => setPrefData({...prefData, timezone: e.target.value})}
                                    >
                                        <option value="UTC">UTC (Universal Time)</option>
                                        <option value="EST">EST (Eastern Standard)</option>
                                        <option value="PST">PST (Pacific Standard)</option>
                                        <option value="GMT">GMT (Greenwich Mean)</option>
                                        <option value="IST">IST (India Standard)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 dark:border-gray-900 flex justify-end">
                        <button 
                            onClick={() => handleUpdatePreferences(prefData)}
                            disabled={loading}
                            className="px-10 py-5 bg-primary text-white font-display font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Apply UI Protocols
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
