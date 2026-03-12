"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface VoteControlProps {
  entityId: string;
  initialVotes: number;
  initialUserVote: number; // 1, -1, or 0
  apiEndpoint: string; // e.g., /api/posts/[id]/vote
}

export default function VoteControl({
  entityId,
  initialVotes,
  initialUserVote,
  apiEndpoint
}: VoteControlProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type: number) => {
    if (isVoting) return;
    
    // Determine new vote type
    const newVoteType = userVote === type ? 0 : type;
    
    // Calculate optimistic vote count change
    let voteChange = 0;
    if (newVoteType === 0) {
      voteChange = -userVote;
    } else {
      voteChange = newVoteType - userVote;
    }

    // Optimistic Update
    const prevVotes = votes;
    const prevUserVote = userVote;
    
    setVotes(prev => prev + voteChange);
    setUserVote(newVoteType);
    setIsVoting(true);

    try {
      const res = await axios.post(apiEndpoint.replace("[id]", entityId), { type: newVoteType });
      
      if (res.data.status === 'success') {
        if (newVoteType === 1) {
            toast.success("+1 Community Point!", {
                icon: '🚀',
                style: { borderRadius: '16px', fontWeight: 'bold' }
            });
        }
      }
    } catch (e: any) {
      // Rollback on error
      setVotes(prevVotes);
      setUserVote(prevUserVote);
      
      if (e.response?.status === 401) {
        toast.error("Please sign in to vote");
      } else {
        toast.error("Failed to register vote");
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-1.5 min-w-[48px] h-fit self-start">
      <button 
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`p-1.5 rounded-xl transition-all ${
          userVote === 1 
          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
          : "text-gray-400 hover:text-primary hover:bg-primary/10"
        }`}
      >
        <ArrowBigUp className={`w-6 h-6 ${userVote === 1 ? "fill-current" : ""}`} />
      </button>

      <div className="flex items-center justify-center min-h-[24px]">
        {isVoting ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <span className={`text-sm font-black font-display ${
            votes > 0 ? "text-primary" : votes < 0 ? "text-red-500" : "text-gray-500"
          }`}>
            {votes}
          </span>
        )}
      </div>

      <button 
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`p-1.5 rounded-xl transition-all ${
          userVote === -1 
          ? "bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105" 
          : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
        }`}
      >
        <ArrowBigDown className={`w-6 h-6 ${userVote === -1 ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
