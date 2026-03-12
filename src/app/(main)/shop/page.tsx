import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Sparkles, Filter, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: any[] = [];
  
  try {
    // Attempt standard prisma call
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Simple Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Storefront</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
            BloggerPro Master <br />
            <span className="text-primary italic">Toolkits & Guides</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Premium assets designed to accelerate your workflow. From professional financial templates to deep-dive e-books.
          </p>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {["All Products", "E-Books", "Templates", "Personal Coaching"].map((label, i) => (
                <button 
                  key={label}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    i === 0 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-gray-50 dark:bg-zinc-900 text-gray-500 hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full text-xs font-bold hover:border-primary transition-all">
                  <Filter className="w-4 h-4" />
                  <span>Sort Options</span>
               </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {products.length === 0 && (
              <div className="col-span-full py-32 text-center rounded-[60px] bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-gray-800">
                 <div className="w-24 h-24 bg-white dark:bg-black rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                 </div>
                 <h2 className="text-2xl font-display font-bold mb-3">Restocking Our Digital Shelves</h2>
                 <p className="text-gray-400 max-w-xs mx-auto leading-relaxed">
                   We're currently finalizing our next batch of high-impact financial toolkits. Check back very soon!
                 </p>
                 <button className="mt-10 px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
                    <CreditCard className="w-4 h-4" />
                    Notify Me
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
