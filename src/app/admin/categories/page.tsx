"use client";

import { useState, useEffect } from "react";
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit, 
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: ""
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    setFormData({ name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return toast.error("Please fill all fields");

    setSubmitting(true);
    try {
      if (isEditing) {
        await axios.patch(`/api/categories/${isEditing}`, formData);
        toast.success("Category updated");
      } else {
        await axios.post("/api/categories", formData);
        toast.success("Category created");
      }
      setFormData({ name: "", slug: "" });
      setIsEditing(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This category must have 0 posts to be deleted.")) return;

    try {
      await axios.delete(`/api/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete category");
    }
  };

  const startEdit = (category: any) => {
    setIsEditing(category.id);
    setFormData({ name: category.name, slug: category.slug });
  };

  return (
    <div className="p-12 max-w-6xl">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Category Management</h1>
          <p className="text-gray-500">Organize your content structure and taxonomies.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-black p-8 rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm sticky top-12">
            <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
              {isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {isEditing ? "Edit Category" : "New Category"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Psychology"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">SEO Slug</label>
                <input 
                  type="text" 
                  placeholder="e.g. psychology"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isEditing ? "Update" : "Create"}</span>
                </button>
                {isEditing && (
                  <button 
                    type="button"
                    onClick={() => {
                        setIsEditing(null);
                        setFormData({ name: "", slug: "" });
                    }}
                    className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-black rounded-[40px] border border-gray-100 dark:border-gray-900 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-8 py-4">Name</th>
                  <th className="px-8 py-4">Slug</th>
                  <th className="px-8 py-4">Posts</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-gray-400 font-bold">Loading categories...</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-gray-900 dark:text-white">{category.name}</td>
                    <td className="px-8 py-6 font-mono text-xs text-gray-500">{category.slug}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {category._count.posts} Articles
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          onClick={() => startEdit(category)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className={`p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors ${category._count.posts > 0 ? "opacity-20 cursor-not-allowed" : ""}`}
                          disabled={category._count.posts > 0}
                          title={category._count.posts > 0 ? "Cannot delete category with posts" : "Delete category"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-gray-500">
                        No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-accent/10 border border-accent/20 rounded-3xl flex items-start gap-4">
             <AlertCircle className="w-6 h-6 text-accent shrink-0" />
             <div className="text-sm">
                <h4 className="font-bold text-primary mb-1">Administrative Note</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
                  Deleting a category is only permitted when there are no articles associated with it. 
                  To delete an active category, first reassign its articles to a new taxonomy in the Article Management dashboard.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
