"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogBot from "@/components/BlogBot";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditorRoute = pathname === "/articles/submit" || pathname?.startsWith("/articles/edit/");

  return (
    <>
      {!isEditorRoute && <Navbar />}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
      </div>
      <BlogBot />
      {!isEditorRoute && <Footer />}
    </>
  );
}
