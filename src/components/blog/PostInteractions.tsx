"use client";

import { useState, useEffect } from "react";
import { Share2, Eye, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import VoteControl from "../VoteControl";

interface PostInteractionsProps {
  postId: string;
  initialVotes: number;
  initialViews: number;
  initialUserVote: number;
}

export default function PostInteractions({
  postId,
  initialVotes,
  initialViews,
  initialUserVote
}: PostInteractionsProps) {
  const [views, setViews] = useState(initialViews);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // Increment view count on mount
    const incrementView = async () => {
        try {
            const res = await axios.post(`/api/posts/${postId}/view`);
            setViews(res.data.viewCount);
        } catch (e) {
            console.error("View count error", e);
        }
    };
    incrementView();
  }, [postId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setShowShare(false);
  };

  return (
    <div className="flex items-center gap-8 py-8 border-y border-gray-100 dark:border-gray-900 my-12">
      <div className="flex items-center gap-6">
        <VoteControl 
          entityId={postId}
          initialVotes={initialVotes}
          initialUserVote={initialUserVote}
          apiEndpoint="/api/posts/[id]/vote"
        />
        <div className="flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Community Rank</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Trending Score</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 text-gray-400">
            <Eye className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Reach</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{views} Views</span>
        </div>
      </div>

      <div className="relative">
        <button 
            onClick={() => setShowShare(!showShare)}
            className="flex items-center gap-2.5 text-gray-400 hover:text-primary transition-all group"
        >
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                <Share2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex flex-col items-start">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Distribute</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Share Tips</span>
            </div>
        </button>

        {showShare && (
            <div className="absolute top-full left-0 mt-4 w-48 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-2xl shadow-2xl p-2 z-[50] animate-in fade-in zoom-in-95 duration-200">
                <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-all text-xs font-bold">
                    <LinkIcon className="w-4 h-4 text-primary" /> Copy Link
                </button>
                <div className="h-[1px] bg-gray-100 dark:bg-zinc-900 my-1 mx-2"></div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-all text-xs font-bold">
                    <Twitter className="w-4 h-4 text-sky-500 fill-current" /> Twitter
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-all text-xs font-bold">
                    <Linkedin className="w-4 h-4 text-blue-700 fill-current" /> LinkedIn
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
