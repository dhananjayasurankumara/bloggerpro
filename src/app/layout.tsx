import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import GoogleAdSense from "@/components/ads/GoogleAdSense";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/context/CartContext";
import SecurityGuard from "@/components/SecurityGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "BloggerPro | Financial Freedom Starts Here",
    template: "%s | BloggerPro"
  },
  description: "Premium financial blog community platform. Master the strategies used by the top 1% to generate wealth, build passive income, and achieve financial independence.",
  keywords: ["finance", "wealth building", "investing", "side hustles", "passive income", "real estate", "BloggerPro"],
  openGraph: {
    title: "BloggerPro | Financial Freedom Starts Here",
    description: "Premium financial blog community platform.",
    url: "https://bloggerpro.com",
    siteName: "BloggerPro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloggerPro | Financial Freedom Starts Here",
    description: "Premium financial blog community platform.",
    creator: "@bloggerpro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-black dark:text-white relative`} suppressHydrationWarning>
        <CartProvider>
          <AuthProvider>
            <GoogleAdSense />
            <SecurityGuard />
            <Toaster position="bottom-right" />
            <main>{children}</main>
            <CookieBanner />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
