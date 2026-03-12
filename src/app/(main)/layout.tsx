import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogBot from "@/components/BlogBot";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
      </div>
      <BlogBot />
      <Footer />
    </>
  );
}
