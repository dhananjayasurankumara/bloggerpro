import Link from "next/link";
import { Zap, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center">
              <span className="text-2xl font-display font-black tracking-tighter uppercase">
                <span className="text-gray-900 dark:text-white">BLOGGER</span>
                <span className="text-accent">PRO</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Financial Freedom Starts Here. We reveal the strategies used by the top 1% to generate wealth and side hustle income.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Wealth Building</h4>
            <ul className="space-y-4">
              <li><Link href="/blog/passive-income" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Passive Income</Link></li>
              <li><Link href="/blog/real-estate" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Real Estate</Link></li>
              <li><Link href="/blog/stock-market" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Stock Market</Link></li>
              <li><Link href="/blog/ai-tools" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">AI Money Tools</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Pricing Plans</Link></li>
              <li><Link href="/whats-new" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">What's New</Link></li>
              <li><Link href="/community" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Community Forum</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-accent transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Get weekly money tips and the "Top 1% Wealth Blueprint" free.
            </p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 BloggerPro. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
