"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryTabsProps {
  categories: Category[];
  onSelect: (slug: string) => void;
}

export default function CategoryTabs({ categories, onSelect }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabClick = (slug: string) => {
    setActiveTab(slug);
    onSelect(slug);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => handleTabClick("all")}
        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
          activeTab === "all"
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-primary/50"
        }`}
      >
        All Articles
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleTabClick(cat.slug)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === cat.slug
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-primary/50"
          }`}
        >
          {cat.name}
        </button>
      ))}

      <div className="flex-1"></div>
      
      <button className="flex items-center space-x-1 text-sm font-bold text-primary group">
        <span>Filter AI Tools</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
