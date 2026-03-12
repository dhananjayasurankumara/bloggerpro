"use client";

import { motion } from "framer-motion";
import { Check, Star, ShieldCheck, Zap, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Start your wealth building journey with our core community resources.",
    features: [
      "Access to all public articles",
      "Weekly newsletter",
      "Read-only community access",
      "Basic financial calculators",
      "Standard support"
    ],
    cta: "Start for Free",
    href: "/register",
    featured: false,
    gold: false
  },
  {
    name: "Pro Plus",
    price: "$9.99",
    period: "/month",
    description: "The ultimate toolkit for serious wealth builders and side hustlers.",
    features: [
      "Unlimited premium guides",
      "Ad-free reading experience",
      "Early access to new content",
      "Community posting & replies",
      "Downloadable PDF spreadsheets",
      "Priority expert support",
      "Private Discord channel"
    ],
    cta: "Go Pro Plus",
    href: "/api/checkout?plan=pro",
    featured: true,
    gold: true
  },
  {
    name: "Annual Pro",
    price: "$79",
    period: "/year",
    description: "Get full Pro access for an entire year and save over 30%.",
    features: [
      "Everything in Pro Plus",
      "33% discount vs monthly",
      "Exclusive annual-only webinars",
      "Personal wealth audit",
      "Lifetime badge on profile"
    ],
    cta: "Get Annual Pro",
    href: "/api/checkout?plan=annual",
    featured: false,
    gold: false
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <Star className="w-3 h-3 fill-primary" />
            <span>Investment Plans</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap"
          >
            Financial Freedom <span className="text-primary italic">Within Reach</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Join 12,000+ members who have unlocked the strategies to save more, earn more, and live free.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`relative p-8 rounded-[40px] border flex flex-col h-full transition-all duration-500 hover:shadow-2xl ${
                plan.featured 
                  ? "bg-primary text-white border-primary shadow-xl scale-105 z-10" 
                  : "bg-gray-50 dark:bg-zinc-950 border-gray-100 dark:border-gray-900 text-gray-900 dark:text-white"
              }`}
            >
              {plan.gold && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-accent text-primary font-bold text-xs rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 fill-primary" />
                  MOST POPULAR CHOISE
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-display font-bold mb-2 ${plan.featured ? "text-white" : ""}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  {plan.period && <span className={`text-sm font-medium ${plan.featured ? "text-white/60" : "text-gray-500"}`}>{plan.period}</span>}
                </div>
                <p className={`text-sm leading-relaxed ${plan.featured ? "text-white/80" : "text-gray-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.featured ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"}`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-sm font-medium ${plan.featured ? "text-white/90" : "text-gray-700 dark:text-gray-300"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.href}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                  plan.featured
                    ? "bg-accent text-primary hover:bg-white"
                    : "bg-white dark:bg-black text-primary dark:text-white hover:bg-primary hover:text-white border border-gray-100 dark:border-gray-800"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-24 text-center space-y-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Guaranteed secure investment</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl">
              <ShieldCheck className="w-6 h-6" /> Stripe Secure
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Zap className="w-6 h-6" /> Instant Unlock
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Star className="w-6 h-6" /> 24/7 Support
            </div>
          </div>
        </div>

        {/* FAQ - Quick Section */}
        <div className="max-w-4xl mx-auto mt-32 space-y-12">
          <h2 className="text-3xl font-display font-bold text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 rounded-3xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900">
              <h4 className="font-bold">Can I cancel anytime?</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Yes, you can cancel your Pro Plus membership at any time from your account settings with zero penalties.</p>
            </div>
            <div className="space-y-3 p-6 rounded-3xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900">
              <h4 className="font-bold">What are "Premium Guides"?</h4>
              <p className="text-sm text-gray-500 leading-relaxed">These are deep-dive, 5,000+ word guides that include downloadable financial spreadsheets and step-by-step action plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
