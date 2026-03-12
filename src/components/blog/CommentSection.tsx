"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  User, 
  Reply, 
  Trash2, 
  Flag,
  Globe,
  Ghost,
  ShieldCheck,
  Loader2
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import LikeControl from "../LikeControl";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments?postId=${postId}`);
      setComments(res.data);
    } catch (e) {
      console.error("Fetch comments error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await axios.post("/api/comments", {
        content: newComment,
        postId,
        parentId: replyTo,
        isAnonymous
      });
      setNewComment("");
      setReplyTo(null);
      toast.success(isAnonymous ? "Posted anonymously!" : "+5 Contribution Points!");
      fetchComments();
    } catch (e: any) {
      if (e.response?.status === 401) {
        toast.error("Please sign in to comment");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="mt-20 space-y-12">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-6">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MessageSquare className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-display font-bold">Discussion</h3>
                <p className="text-gray-500 text-sm">Join the conversation with {comments.length} participants.</p>
            </div>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 rounded-[32px] p-6 space-y-4">
        {replyTo && (
            <div className="flex items-center justify-between bg-primary/5 px-4 py-2 rounded-xl text-xs font-bold text-primary">
                <span className="flex items-center gap-2">
                    <Reply className="w-3 h-3" /> Replying to comment
                </span>
                <button type="button" onClick={() => setReplyTo(null)}>Cancel</button>
            </div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? "Write your reply..." : "Insights, questions, or counter-arguments..."}
          className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all min-h-[120px] font-medium"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full relative transition-all ${isAnonymous ? "bg-primary" : "bg-gray-200 dark:bg-zinc-800"}`}>
                    <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isAnonymous} 
                        onChange={() => setIsAnonymous(!isAnonymous)} 
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${isAnonymous ? "translate-x-4" : ""}`}></div>
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <Ghost className="w-3.5 h-3.5" /> Anonymous
                </span>
              </label>
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {replyTo ? "Post Reply" : "Contribute Insight"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-6">
            <div className="flex gap-4 group">
              <div className="shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold border transition-all ${
                    comment.isAnonymous 
                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 border-gray-200 dark:border-zinc-700" 
                    : "bg-primary/10 text-primary border-primary/20"
                }`}>
                  {comment.isAnonymous ? <Ghost className="w-6 h-6" /> : comment.user.name.charAt(0)}
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <LikeControl 
                        entityId={comment.id}
                        initialLikes={comment.votes || 0}
                        initialUserLiked={comment.userLiked || false}
                        apiEndpoint="/api/comments/[id]/like"
                    />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {comment.isAnonymous ? "Restricted User" : comment.user.name}
                  </span>
                  {!comment.isAnonymous && comment.user.points > 100 && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black uppercase tracking-tighter flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" /> Elite Contributor
                      </span>
                  )}
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <button 
                    onClick={() => setReplyTo(comment.id)} 
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <Reply className="w-3 h-3" /> Reply
                  </button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
                    <Flag className="w-3 h-3" /> Report
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 pl-8 border-l-2 border-gray-50 dark:border-zinc-900 space-y-8">
                    {comment.replies.map((reply: any) => (
                        <div key={reply.id} className="flex gap-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-display font-bold border ${
                                    reply.isAnonymous 
                                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 border-gray-200" 
                                    : "bg-gray-50 dark:bg-zinc-950 text-gray-500 border-gray-100 dark:border-gray-900"
                                }`}>
                                    {reply.isAnonymous ? <Ghost className="w-5 h-5" /> : reply.user.name.charAt(0)}
                                </div>
                                <LikeControl 
                                    entityId={reply.id}
                                    initialLikes={reply.votes || 0}
                                    initialUserLiked={reply.userLiked || false}
                                    apiEndpoint="/api/comments/[id]/like"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                                        {reply.isAnonymous ? "Restricted User" : reply.user.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                                    {reply.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
