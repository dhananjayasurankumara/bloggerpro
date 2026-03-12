import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
                <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Terms of Service</h1>
            <p className="text-gray-500 font-medium">Last updated: March 11, 2026</p>
          </header>

          <div className="prose prose-lg dark:prose-invert prose-primary max-w-none space-y-8 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-900 pt-12">
            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">1. Agreement to Terms</h2>
              <p>By accessing or using BloggerPro, you agree to be bound by these Terms of Service.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">2. Use of License</h2>
              <p>Permission is granted to temporarily download one copy of the materials on BloggerPro's website for personal, non-commercial transitory viewing only.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">3. Disclaimer</h2>
              <p>The materials on BloggerPro's website are provided on an 'as is' basis. BloggerPro makes no warranties, expressed or implied.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-gray-900 dark:text-white font-bold text-2xl font-display">4. Limitations</h2>
              <p>In no event shall BloggerPro or its suppliers be liable for any damages arising out of the use or inability to use the materials on BloggerPro's website.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
