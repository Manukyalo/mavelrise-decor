"use client";

import { useState, useMemo } from "react";
import { Category, Product } from "@/types/catalogue";
import { ProductCard } from "./ProductCard";
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";

interface CatalogueViewProps {
  initialProducts: Product[];
  categories: Category[];
  locale: string;
  defaultCategorySlug?: string;
}

export function CatalogueView({
  initialProducts,
  categories,
  locale,
  defaultCategorySlug,
}: CatalogueViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultCategorySlug || "all"
  );
  const [selectedThickness, setSelectedThickness] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stockOnly, setStockOnly] = useState<boolean>(false);

  // Available thickness options dynamically extracted
  const thicknessOptions = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.thickness) set.add(p.thickness);
    });
    return Array.from(set).sort();
  }, [initialProducts]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category check
      if (selectedCategory !== "all") {
        if (product.category?.slug !== selectedCategory) return false;
      }

      // Thickness check
      if (selectedThickness !== "all") {
        if (product.thickness !== selectedThickness) return false;
      }

      // In stock check
      if (stockOnly) {
        if (product.stock_status !== "in_stock") return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const codeMatch = product.code.toLowerCase().includes(query);
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description?.toLowerCase().includes(query);
        const colorMatch = product.colour?.toLowerCase().includes(query);
        if (!codeMatch && !nameMatch && !descMatch && !colorMatch) return false;
      }

      return true;
    });
  }, [initialProducts, selectedCategory, selectedThickness, stockOnly, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedThickness("all");
    setSearchQuery("");
    setStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedThickness !== "all" ||
    stockOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-10">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all whitespace-nowrap rounded-xs border ${
            selectedCategory === "all"
              ? "bg-amber-400 text-black border-amber-400 font-semibold shadow-md shadow-amber-400/20"
              : "border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-white/[0.02]"
          }`}
        >
          All Collections ({initialProducts.length})
        </button>

        {categories.map((cat) => {
          const count = initialProducts.filter(
            (p) => p.category?.slug === cat.slug
          ).length;
          const isActive = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all whitespace-nowrap rounded-xs border ${
                isActive
                  ? "bg-amber-400 text-black border-amber-400 font-semibold shadow-md shadow-amber-400/20"
                  : "border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-white/[0.02]"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search + Refined Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#050a12]/80 p-4 border border-white/5 rounded-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code (e.g. GJ6345, J300, MRDP)..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xs text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Thickness filter */}
          {thicknessOptions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-white/60">
              <span className="text-[10px] uppercase text-white/40">Profile:</span>
              <select
                value={selectedThickness}
                onChange={(e) => setSelectedThickness(e.target.value)}
                className="bg-black/50 border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-xs focus:outline-none focus:border-amber-400/50"
              >
                <option value="all">All Thicknesses</option>
                {thicknessOptions.map((th) => (
                  <option key={th} value={th}>
                    {th}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* In stock toggle */}
          <button
            onClick={() => setStockOnly(!stockOnly)}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-all flex items-center gap-1.5 ${
              stockOnly
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                stockOnly ? "bg-emerald-400 animate-pulse" : "bg-white/20"
              }`}
            />
            <span>Immediate Dispatch</span>
          </button>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-2.5 py-1.5 text-xs font-mono text-amber-400/80 hover:text-amber-300 flex items-center gap-1 transition-colors"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header / Live count */}
      <div className="flex items-center justify-between text-xs font-mono text-white/40 px-1">
        <div>
          Showing{" "}
          <span className="text-amber-300 font-semibold">
            {filteredProducts.length}
          </span>{" "}
          of {initialProducts.length} architectural SKUs
        </div>
        <div className="text-[11px] tracking-wider uppercase text-white/30 hidden sm:block">
          Nairobi Atelier · Ruiru Membley Showroom
        </div>
      </div>

      {/* Grid Display */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center border border-dashed border-white/10 rounded-sm bg-[#050a12]/50 p-8 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-white">No exact specification match</h3>
          <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
            We could not find finishes matching your active filter combination. Clear your query or consult our Ruiru showroom team for custom orders.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-amber-400 text-black font-semibold rounded-xs hover:bg-amber-300 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

