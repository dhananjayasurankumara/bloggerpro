import prisma from "@/lib/prisma";
import Script from "next/script";

export default async function GoogleAdSense() {
  let settings: any = null;
  
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" }
    });
  } catch (e) {
    console.error("AdSense: Could not fetch site settings", e);
  }

  if (!settings?.adClient || !settings?.adsEnabled) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
