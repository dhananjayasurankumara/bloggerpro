"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ChevronUp, 
  ChevronDown,
  MessageSquare, 
  Share2, 
  CornerDownRight, 
  ShieldCheck, 
  Zap, 
  Plus, 
  Send, 
  Info,
  Scale,
  Gavel,
  CheckCircle2,
  MoreVertical,
  Reply as ReplyIcon,
  Edit,
  Trash2,
  Copy,
  Clock
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VoteControl from "./VoteControl";

interface Author {
  id: string;
  name: string;
  role: string;
}

interface Post {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  parentId?: string | null;
  votes: number;
  initialUserVote: number;
  isEdited: boolean;
}

interface TopicViewProps {
  topic: {
    id: string;
    title: string;
    content: string;
    votes: number;
    posts: Post[];
    author: Author;
    isEdited: boolean;
    category: string;
    initialUserVote?: number;
  };
}

export default function TopicView({ topic }: TopicViewProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [votes, setVotes] = useState(topic.votes);
  const [userVote, setUserVote] = useState(topic.initialUserVote || 0); // -1, 0, 1
  const [isVoting, setIsVoting] = useState(false);
  
  const [posts, setPosts] = useState(topic.posts);
  const [newReply, setNewReply] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingTopic, setEditingTopic] = useState(false);
  const [editedTopicContent, setEditedTopicContent] = useState(topic.content);
  
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedPostContent, setEditedPostContent] = useState("");

  const currentUser = session?.user as any;
  const isTopicAuthor = currentUser?.id === topic.author.id;
  const isAdmin = currentUser?.role === "ADMIN";
  const isModerator = currentUser?.role === "MODERATOR";
  const canModerate = isAdmin || isModerator;

  const [topicMenuOpen, setTopicMenuOpen] = useState(false);
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);


  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
        const res = await axios.post("/api/community/post", {
            topicId: topic.id,
            content: newReply,
            parentId: replyTo
        });
        
        const freshPost = {
            ...res.data,
            author: { id: currentUser.id, name: currentUser.name || "You", role: currentUser.role },
            votes: 0,
            initialUserVote: 0,
            isEdited: false,
            createdAt: "Just now"
        };
        setPosts([...posts, freshPost]);
        setNewReply("");
        setReplyTo(null);
        toast.success("+10 Contribution Points!", { icon: "💎" });
    } catch (e: any) {
        toast.error("Failed to broadcast contribution");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Discussion link copied to clipboard!");
  };

  const handleDeleteTopic = async () => {
     if (!confirm("Are you sure? This will permanently erase this discussion.")) return;
     try {
         await axios.delete(`/api/community/topic/${topic.id}`);
         toast.success("Discussion archived");
         router.push(`/community/${topic.category}`);
     } catch (e) {
         toast.error("Failed to delete topic");
     }
  };

  const handleEditTopic = async () => {
      try {
          await axios.patch(`/api/community/topic/${topic.id}`, { content: editedTopicContent });
          toast.success("Discussion updated");
          setEditingTopic(false);
          // In a real app, update state or revalidate
          window.location.reload();
      } catch (e) {
          toast.error("Failed to save changes");
      }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this insight?")) return;
    try {
        await axios.delete(`/api/community/post/${id}`);
        setPosts(prev => prev.filter(p => p.id !== id));
        toast.success("Contribution removed");
    } catch (e) {
        toast.error("Failed to delete post");
    }
  };

  const handleSaveEditedPost = async (id: string) => {
     try {
         await axios.patch(`/api/community/post/${id}`, { content: editedPostContent });
         setPosts(prev => prev.map(p => p.id === id ? { ...p, content: editedPostContent, isEdited: true } : p));
         setEditingPostId(null);
         toast.success("Insight modified");
     } catch (e) {
         toast.error("Failed to save contribution");
     }
  };

  const topLevelPosts = posts.filter(p => !p.parentId);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Main Discussion Column */}
      <div className="lg:col-span-8 space-y-12">
        {/* Opener Post */}
        <div className="flex gap-6">
          <div className="shrink-0 mt-1">
            <VoteControl 
              entityId={topic.id}
              initialVotes={topic.votes}
              initialUserVote={topic.initialUserVote || 0}
              apiEndpoint="/api/community/topic/[id]/vote"
            />
          </div>

          {/* Content Body */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-4 flex-1">
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                    {topic.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/10">
                      <ShieldCheck className="w-4 h-4" /> Expert Analysis
                    </span>
                    {topic.isEdited && (
                        <span className="text-amber-500 bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/10 flex items-center gap-1.5">
                            <Edit className="w-3.5 h-3.5" /> Modified
                        </span>
                    )}
                  </div>
                </div>
                {(isTopicAuthor || canModerate) && (
                    <div className="relative group p-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 cursor-pointer">
                        <button onClick={() => setTopicMenuOpen(!topicMenuOpen)} className="p-1">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {topicMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden">
                                <button onClick={() => { setEditingTopic(true); setEditedTopicContent(topic.content); setTopicMenuOpen(false); }} className="w-full px-6 py-4 text-left text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 flex items-center gap-3">
                                    <Edit className="w-4 h-4 text-blue-500" /> Edit Archive
                                </button>
                                <button onClick={() => { handleDeleteTopic(); setTopicMenuOpen(false); }} className="w-full px-6 py-4 text-left text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 flex items-center gap-3">
                                    <Trash2 className="w-4 h-4" /> Delete Permanently
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {editingTopic ? (
                <div className="space-y-4 pt-4">
                    <textarea 
                        value={editedTopicContent}
                        onChange={(e) => setEditedTopicContent(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-zinc-900 border-2 border-primary/20 rounded-3xl p-6 text-sm font-medium outline-none focus:border-primary transition-all min-h-[300px]"
                    />
                    <div className="flex gap-4">
                        <button onClick={handleEditTopic} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">Save Changes</button>
                        <button onClick={() => setEditingTopic(false)} className="px-8 py-3 bg-gray-100 dark:bg-zinc-800 font-bold rounded-xl text-gray-500">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="prose prose-xl dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-4">
                  {topic.content}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-12 border-t border-gray-100 dark:border-gray-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-black text-lg shadow-lg shadow-primary/20">
                  {topic.author.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-gray-900 dark:text-white">{topic.author.name}</span>
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{topic.author.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-8 ml-auto">
                <button 
                    onClick={() => { setReplyTo(null); scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all group"
                >
                  <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" /> <span>Contribute</span>
                </button>
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all group"
                >
                  <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> <span>Share Insight</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Activity Feed */}
        <div className="space-y-12 pl-0 md:pl-20 relative">
          <div className="hidden md:block absolute left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-gray-100 via-gray-100 to-transparent dark:from-zinc-900 dark:via-zinc-900"></div>
          
          <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                <span className="w-8 h-px bg-primary"></span>
                {posts.length} Verified Perspectives
              </h3>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Stream</span>
              </div>
          </div>
          
          {topLevelPosts.map((post) => {
            const isPostAuthor = currentUser?.id === post.author.id;

            return (
              <div key={post.id} className="group relative">
                {/* Node Dot */}
                <div className="hidden md:block absolute -left-[54px] top-8 w-3 h-3 rounded-full bg-white dark:bg-black border-2 border-gray-200 dark:border-zinc-800 z-10 group-hover:border-primary group-hover:scale-125 transition-all duration-500"></div>
                
                <div className="p-8 rounded-[40px] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 space-y-6 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 relative overflow-hidden group/card shadow-sm border-l-0 hover:border-l-[12px] hover:border-l-primary/10">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center font-display font-black text-sm text-primary group-hover:rotate-6 transition-transform">
                        {post.author.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{post.author.name}</span>
                           {isPostAuthor && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">YOU</span>}
                        </div>
                        <span className="text-[9px] font-black text-accent tracking-[0.2em] uppercase">{post.author.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {post.createdAt}
                        </span>
                        {(isPostAuthor || canModerate) && (
                            <div className="relative">
                                <button 
                                    onClick={() => setActivePostMenuId(activePostMenuId === post.id ? null : post.id)}
                                    className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl transition-all"
                                >
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                                {activePostMenuId === post.id && (
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden">
                                        <button 
                                            onClick={() => { setEditingPostId(post.id); setEditedPostContent(post.content); setActivePostMenuId(null); }}
                                            className="w-full px-4 py-3 text-left text-[10px] font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 flex items-center gap-2"
                                        >
                                            <Edit className="w-3.5 h-3.5 text-blue-500" /> Edit Insight
                                        </button>
                                        <button 
                                            onClick={() => { handleDeletePost(post.id); setActivePostMenuId(null); }}
                                            className="w-full px-4 py-3 text-left text-[10px] font-bold hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                  </div>

                  {editingPostId === post.id ? (
                      <div className="space-y-4 relative z-10">
                          <textarea 
                              value={editedPostContent}
                              onChange={(e) => setEditedPostContent(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-zinc-900 border-2 border-primary/20 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary transition-all min-h-[100px]"
                          />
                          <div className="flex gap-2">
                              <button onClick={() => handleSaveEditedPost(post.id)} className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-primary/20">Save</button>
                              <button onClick={() => setEditingPostId(null)} className="px-5 py-2 bg-gray-100 dark:bg-zinc-800 text-xs font-bold rounded-lg text-gray-500">Cancel</button>
                          </div>
                      </div>
                  ) : (
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium relative z-10 pr-4">
                        {post.content}
                      </p>
                  )}

                  <div className="flex items-center gap-6 pt-4 relative z-10 border-t border-gray-50 dark:border-zinc-900">
                    <div className="shrink-0">
                      <VoteControl 
                        entityId={post.id}
                        initialVotes={post.votes}
                        initialUserVote={post.initialUserVote}
                        apiEndpoint="/api/community/post/[id]/vote"
                      />
                    </div>
                    <button 
                      onClick={() => { setReplyTo(post.id); scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="text-[10px] font-black text-gray-400 hover:text-primary flex items-center gap-2.5 transition-colors uppercase tracking-[0.2em] group/btn"
                    >
                      <CornerDownRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:translate-y-1 transition-transform" /> Reply
                    </button>
                    {post.isEdited && (
                        <span className="text-[10px] font-bold text-gray-400 font-mono flex items-center gap-1 ml-auto italic">
                           Edited
                        </span>
                    )}
                  </div>
                </div>

                {/* Nested Replies Stream */}
                {posts.filter(p => p.parentId === post.id).map(reply => {
                    const isReplyAuthor = currentUser?.id === reply.author.id;
                    return (
                        <div key={reply.id} className="mt-6 ml-12 md:ml-16 border-l-2 border-gray-100 dark:border-zinc-900 pl-8 space-y-4 group/reply relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center font-black text-[10px] text-gray-400 shadow-sm">
                                      {reply.author.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{reply.author.name}</span>
                                        <span className="text-[8px] text-gray-400 font-bold uppercase py-0.5">{reply.createdAt}</span>
                                    </div>
                                </div>
                                {(isReplyAuthor || canModerate) && (
                                    <button onClick={() => handleDeletePost(reply.id)} className="p-1.5 opacity-0 group-hover/reply:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium bg-gray-50/50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-gray-50/50 dark:border-zinc-900/50 shadow-sm">
                                {reply.content}
                            </p>
                        </div>
                    );
                })}
              </div>
            );
          })}

          {/* Broadcast Form */}
          <div ref={scrollRef} id="reply-form" className="pt-12 relative z-10">
            <div className="absolute -left-[54px] top-[60px] w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                <Plus className="w-4 h-4 text-white" />
            </div>
            
            <form onSubmit={handleSubmitReply} className="bg-zinc-950 border border-zinc-900 rounded-[50px] p-10 space-y-6 shadow-3xl shadow-primary/5 hover:border-primary/20 transition-all group/form relative overflow-hidden">
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary opacity-5 blur-[80px] group-hover/form:opacity-10 transition-opacity"></div>
               
               <div className="flex items-center gap-4 text-white">
                   <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover/form:scale-110 transition-transform">
                       {replyTo ? <ReplyIcon className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                   </div>
                   <div>
                       <h4 className="font-display font-black text-2xl tracking-tight">{replyTo ? "Syncing Response" : "Broadcasting Knowledge"}</h4>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contribute to the collective intelligence</p>
                   </div>
               </div>

               {replyTo && (
                   <div className="flex items-center justify-between bg-zinc-900/50 px-6 py-3 rounded-2xl text-[10px] font-black text-primary border border-primary/10">
                       <span className="flex items-center gap-2"><Plus className="w-3.5 h-3.5" /> Targeting a specific discussion node</span>
                       <button type="button" onClick={() => setReplyTo(null)} className="hover:text-white transition-colors uppercase">Cancel Broadcast</button>
                   </div>
               )}

               <textarea 
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Share a strategy, ask a question, or provide market perspective..."
                  className="w-full bg-black border border-zinc-900 rounded-[32px] p-8 text-base text-white outline-none focus:border-primary/50 transition-all min-h-[160px] font-medium placeholder:text-zinc-700"
               />
               
               <div className="flex flex-col md:flex-row items-center gap-6">
                   <div className="flex items-center gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4">
                       <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Node</span>
                       <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-accent" /> +10 Contribution</span>
                   </div>
                   <button 
                      type="submit"
                      disabled={!newReply.trim() || isSubmitting}
                      className="w-full md:w-auto md:ml-auto px-12 py-5 bg-primary text-white font-black rounded-[24px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group/submit disabled:opacity-50 disabled:grayscale"
                   >
                       <Send className={`w-5 h-5 transition-transform ${!isSubmitting && "group-hover/submit:translate-x-1 group-hover/submit:-translate-y-1"}`} />
                       <span>{isSubmitting ? "TRANSMITTING..." : "BROADCAST CONTRIBUTION"}</span>
                   </button>
               </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sidebar - Navigation & Intel */}
      <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
          {/* Action Intel Board */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" /> Engagement Intel
              </h4>
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-black border border-zinc-900 rounded-3xl space-y-2">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">Growth</p>
                      <p className="text-2xl font-display font-black text-emerald-500">+{votes}%</p>
                  </div>
                  <div className="p-6 bg-black border border-zinc-900 rounded-3xl space-y-2">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">Insights</p>
                      <p className="text-2xl font-display font-black text-primary">{posts.length}</p>
                  </div>
              </div>
              <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <Zap className="w-3.5 h-3.5 text-accent" /> Participation Goal
                      </div>
                      <span className="text-[10px] font-black text-white">85%</span>
                  </div>
              </div>
          </div>

          {/* Social Proof Rewards */}
          <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-[40px] p-10 shadow-sm transition-all hover:border-primary/20">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-accent fill-accent" /> Social Equity
              </h4>
              <div className="space-y-6">
                  {[
                      { label: "Launch Discussion", reward: "+25 XP", icon: Plus, color: "text-blue-500" },
                      { label: "Expert Insight", reward: "+10 XP", icon: MessageSquare, color: "text-emerald-500" },
                      { label: "Discussion Catalyst", reward: "+5 XP", icon: Send, color: "text-amber-500" },
                  ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-default">
                          <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                          </div>
                          <span className="text-[11px] font-black text-primary">{item.reward}</span>
                      </div>
                  ))}
              </div>
          </div>

          {/* Community Protocols */}
          <div className="bg-zinc-900 rounded-[40px] p-10 text-white relative overflow-hidden group border border-zinc-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
              
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 relative z-10">
                  <Scale className="w-5 h-5 text-accent" /> Global Protocols
              </h4>
              
              <ul className="space-y-8 relative z-10">
                  {[
                      { title: "Verify Intel", desc: "Share only first-hand data and field-tested strategies.", icon: ShieldCheck },
                      { title: "Respect Friction", desc: "Debate the thesis with intensity, respect the builder.", icon: Gavel },
                      { title: "Zero Noise", desc: "Sollicitation or scams result in permanent node exclusion.", icon: Info },
                  ].map((rule, i) => (
                      <li key={i} className="flex gap-5 group/rule">
                          <div className="shrink-0 pt-1">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center group-hover/rule:bg-primary transition-colors">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary group-hover/rule:text-white" />
                              </div>
                          </div>
                          <div>
                              <p className="text-xs font-black uppercase tracking-wider mb-1.5 group-hover/rule:text-primary transition-colors">{rule.title}</p>
                              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{rule.desc}</p>
                          </div>
                      </li>
                  ))}
              </ul>

              <div className="mt-12 pt-8 border-t border-zinc-800 text-center relative z-10">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                       <span className="w-4 h-px bg-zinc-800"></span> Moderated Asset <span className="w-4 h-px bg-zinc-800"></span>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
}

import { Activity } from "lucide-react";
