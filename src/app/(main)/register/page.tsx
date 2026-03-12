"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/register", data);
      
      if (response.status === 200) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data || "Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 pt-24">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-50 dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-gray-900 shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-primary p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-accent fill-accent" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary dark:text-white">
              Blogger<span className="text-accent">Pro</span>
            </span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Join the Community</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start your journey toward financial freedom today.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                placeholder="Full Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                placeholder="Email address"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary font-bold">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="text-primary font-bold">Privacy Policy</Link>.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Free Account"}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-accent">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
