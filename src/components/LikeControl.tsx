"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface LikeControlProps {
  entityId: string;
  initialLikes: number;
  initialUserLiked: boolean;
  apiEndpoint: string; // e.g., /api/comments/[id]/like
}

export default function LikeControl({
  entityId,
  initialLikes,
  initialUserLiked,
  apiEndpoint
}: LikeControlProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialUserLiked);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    // Optimistic Update
    const prevLikes = likes;
    const prevIsLiked = isLiked;
    
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
    setIsLiking(true);

    try {
      const res = await axios.post(apiEndpoint.replace("[id]", entityId));
      
      if (res.data.status === 'success') {
        if (!prevIsLiked) {
            toast.success("+1 Community Point!", {
                icon: '❤️',
                style: { borderRadius: '16px', fontWeight: 'bold' }
            });
        }
      }
    } catch (e: any) {
      // Rollback on error
      setLikes(prevLikes);
      setIsLiked(prevIsLiked);
      
      if (e.response?.status === 401) {
        toast.error("Please sign in to like");
      } else {
        toast.error("Failed to update like");
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button 
        onClick={handleLike}
        disabled={isLiking}
        className={`p-2 rounded-xl transition-all group ${
          isLiked 
          ? "bg-red-50 dark:bg-red-500/10 text-red-500" 
          : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        }`}
      >
        <Heart 
            className={`w-5 h-5 transition-transform group-hover:scale-110 active:scale-90 ${isLiked ? "fill-current" : ""}`} 
        />
      </button>

      <div className="flex items-center justify-center min-h-[20px]">
        {isLiking ? (
          <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
        ) : (
          <span className={`text-xs font-black font-display ${
            likes > 0 ? "text-red-500" : "text-gray-500"
          }`}>
            {likes}
          </span>
        )}
      </div>
    </div>
  );
}
