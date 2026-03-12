"use client";

import { useState, useRef } from "react";
import { Settings, X, Save, Loader2, MapPin, Globe, Camera, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

export default function ProfileEditButton({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    image: user.image || "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 0.1, // Compress to ~100KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        toast.success("Image compressed and ready!");
      };
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setCompressing(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.patch("/api/user/profile", formData);
      toast.success("Profile updated!");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-sm flex items-center gap-2 hover:border-primary transition-all active:scale-95 shadow-sm"
      >
        <Settings className="w-4 h-4" />
        <span>Edit Profile</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-900"
            >
              <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
                <div>
                   <h2 className="text-2xl font-display font-bold">Edit Profile</h2>
                   <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Personalize your presence</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[40px] bg-gray-100 dark:bg-zinc-900 border-4 border-white dark:border-black shadow-xl overflow-hidden flex items-center justify-center">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gray-300" />
                            )}
                            {compressing && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <button 
                            disabled={compressing}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:bg-opacity-90 active:scale-90 transition-all z-10"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Picture</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Display Name</label>
                    <input 
                        type="text" 
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    </div>

                    <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bio</label>
                    <textarea 
                        rows={4}
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium text-sm resize-none"
                        placeholder="Tell the community about yourself..."
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</label>
                        </div>
                        <input 
                        type="text" 
                        placeholder="e.g. New York, NY"
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Website</label>
                        </div>
                        <input 
                        type="url" 
                        placeholder="https://yourpage.com"
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        />
                    </div>
                    </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 dark:border-gray-900 flex justify-end gap-4 bg-gray-50/30 dark:bg-zinc-900/30">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading || compressing}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
