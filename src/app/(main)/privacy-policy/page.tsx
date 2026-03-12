import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <header className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Privacy Policy</h1>
            <p className="text-gray-500 font-medium">Last updated: March 11, 2026</p>
          </header>

          <div className="prose prose-lg dark:prose-invert prose-primary max-w-none space-y-8 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-900 pt-12">
            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">1. Information We Collect</h2>
              <p>We collect information you provide directly to us when you create an account, subscribe to our newsletter, make a purchase, or communicate with us.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, including to process transactions and send you related information.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">3. Data Security</h2>
              <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">4. Your Choices</h2>
              <p>You may update your account information at any time by logging into your account settings.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
