"use client";

import { useState, useEffect } from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Trash2, ShoppingBag, ExternalLink, Package, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/admin/products");
        setProducts(res.data);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Product Management</h1>
          <p className="text-gray-500">Manage your digital storefront and assets.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </header>

      <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-8 py-6">Product Info</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center shrink-0">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{product.title}</p>
                        <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-900 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                  </td>
                  <td className="px-8 py-6 font-display font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`} className="p-3 hover:bg-primary/10 hover:text-primary text-gray-400 rounded-xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={async () => {
                            if (confirm("Delete this product?")) {
                                try {
                                    await axios.delete(`/api/admin/products/${product.id}`);
                                    toast.success("Product deleted");
                                    window.location.reload();
                                } catch (e) {
                                    toast.error("Failed to delete");
                                }
                            }
                        }}
                        className="p-3 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link href={`/shop`} className="p-3 hover:bg-blue-50 hover:text-blue-500 text-gray-400 rounded-xl transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-950 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                       <ShoppingBag className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-bold font-display text-xl">No Products Registered</p>
                    <p className="text-gray-400 text-sm mt-1 mb-8">Start your ecommerce journey today.</p>
                    <Link href="/admin/products/new" className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg">Create First Product</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
