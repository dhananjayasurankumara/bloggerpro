import { ArrowLeft, Scale, ShieldAlert, Gavel, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DisclaimerPage() {
  const sections = [
    {
      title: "1. Educational Purposes Only",
      content: "All content provided on BloggerPro, including but not limited to articles, forum posts, guides, and AI-generated responses, is for educational and informational purposes only. We are a platform for the exchange of ideas and strategies, not a financial services provider.",
      icon: Info,
      color: "text-blue-500"
    },
    {
      title: "2. Not Professional Advice",
      content: "The contributors, editors, and administrators of BloggerPro are not licensed financial advisors, accountants, or attorneys. No information on this site should be construed as professional financial, investment, legal, or tax advice. Always consult with a qualified professional before making any significant financial decisions.",
      icon: Gavel,
      color: "text-primary"
    },
    {
      title: "3. Investment Risk",
      content: "Investing in any asset class—including stocks, real estate, digital assets, and business ventures—carries inherent risk. Past performance is not indicative of future results. You should never invest money that you cannot afford to lose entirely.",
      icon: AlertTriangle,
      color: "text-amber-500"
    },
    {
      title: "4. Accuracy of Information",
      content: "While we strive for 100% accuracy in our reporting and analysis, markets move fast. BloggerPro does not warrant the completeness or accuracy of any information found on the platform. Information is provided 'as is' without warranty of any kind.",
      icon: CheckCircle2,
      color: "text-emerald-500"
    },
    {
      title: "5. Affiliate Disclosure",
      content: "Some links on BloggerPro may be affiliate links. If you click on these links and make a purchase, we may receive a small commission at no extra cost to you. This helps support the platform's independent analysis and infrastructure.",
      icon: ShieldAlert,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Header */}
          <header className="space-y-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary mx-auto shadow-sm">
                <Scale className="w-10 h-10" />
            </div>
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                    Financial <span className="text-primary italic">Disclaimer.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">
                    Last updated and verified: March 12, 2026
                </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent"></div>
          </header>

          {/* Warning Card */}
          <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-[40px] flex items-start gap-6 group">
            <div className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20 animate-pulse">
                <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-red-900 dark:text-red-400 uppercase tracking-widest text-xs">Crucial Advisory</h4>
                <p className="text-sm text-red-800/70 dark:text-red-400/70 leading-relaxed font-medium">
                    The strategies discussed on this platform involve significant risk. By using this website, you acknowledge that you are solely responsible for your own financial outcomes and that BloggerPro holds zero liability for any losses incurred.
                </p>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, i) => (
                <div key={i} className="p-10 bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-900 rounded-[50px] space-y-6 hover:border-primary/20 transition-all group">
                    <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 flex items-center justify-center ${section.color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <section.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-tight">{section.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-500 leading-relaxed font-medium">
                            {section.content}
                        </p>
                    </div>
                </div>
            ))}
          </div>

          {/* Footer Info */}
          <footer className="text-center space-y-12 pt-8">
            <div className="p-10 rounded-[50px] bg-zinc-950 text-white relative overflow-hidden group border border-zinc-900">
                <div className="absolute inset-0 bg-primary opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity"></div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-lg font-bold">Still have questions?</h4>
                    <p className="text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
                        If you require further clarification regarding our legal protocols or terms of use, please reach out to our compliance department.
                    </p>
                    <Link href="/contact" className="inline-block mt-4 text-xs font-black text-primary uppercase tracking-[0.3em] hover:text-white transition-colors">
                        Protocol Inquiry &rarr;
                    </Link>
                </div>
            </div>

            <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Return to Control Center
            </Link>
          </footer>

        </div>
      </div>
    </div>
  );
}
