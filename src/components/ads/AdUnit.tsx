import prisma from "@/lib/prisma";
import { DollarSign } from "lucide-react";

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'leaderboard';
  className?: string;
  label?: string;
}

export default async function AdUnit({ 
  slot, 
  format = 'auto', 
  className = "",
  label = "Advertisement"
}: AdUnitProps) {
  let settings: any = null;
  
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" }
    });
  } catch (e) {
    console.error("AdUnit: Could not fetch site settings", e);
  }

  // If ads are disabled or no client ID, show nothing or a subtle placeholder in dev
  if (!settings?.adClient || !settings?.adsEnabled) {
    return null;
  }

  return (
    <div className={`ad-container my-8 w-full overflow-hidden ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-900"></div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 dark:text-zinc-700 flex items-center gap-1.5">
          <DollarSign className="w-3 h-3" /> {label}
        </span>
        <div className="h-[1px] flex-1 bg-gray-100 dark:bg-zinc-900"></div>
      </div>

      {/* Actual Ad Slot */}
      <div className="flex justify-center bg-gray-50/50 dark:bg-zinc-950/30 rounded-2xl border border-dashed border-gray-100 dark:border-gray-900 min-h-[100px] items-center relative group">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={settings.adClient}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Visual cue for dev/empty slots */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-[8px] font-mono font-bold text-gray-400">#AD_SLOT_{slot}</span>
        </div>
      </div>
    </div>
  );
}
