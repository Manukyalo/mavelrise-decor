"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Save,
  Layers,
  CheckCircle,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

interface ProductItem {
  id: string;
  code: string;
  name: string;
  name_sw?: string;
  category_id?: string;
  categories?: { slug: string; name: string };
  price_kes: number;
  unit: string;
  stock_status: string;
  active: boolean;
  is_placeholder: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price_kes: newPrice } : p))
    );
  };

  const handleStockChange = (id: string, newStock: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock_status: newStock } : p))
    );
  };

  const handleActiveToggle = (id: string, newActive: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: newActive } : p))
    );
  };

  const saveProduct = async (product: ProductItem) => {
    setSavingId(product.id);
    setSuccessId(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          price_kes: product.price_kes,
          stock_status: product.stock_status,
          active: product.active,
        }),
      });
      if (res.ok) {
        setSuccessId(product.id);
        setTimeout(() => setSuccessId(null), 2500);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (p.categories?.slug && p.categories.slug === categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const activeCount = products.filter((p) => p.active).length;
  const inStockCount = products.filter((p) => p.stock_status === "in_stock").length;
  const lowStockCount = products.filter(
    (p) => p.stock_status === "low_stock" || p.stock_status === "out_of_stock"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider text-admin-gold uppercase">
            Inventory & Live Rates
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-admin-text tracking-tight mt-1">
            Product Catalogue & Rates
          </h1>
          <p className="text-xs sm:text-sm text-admin-text-muted font-sans mt-1">
            Real-time material rates, stock availability, and 3D visualizer sync for Ruiru Membley showroom.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-center px-3.5 py-2 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-border-gold text-xs font-sans font-medium text-admin-text transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 text-admin-gold ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Catalogue</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Package}
          label="Catalog SKUs"
          value={products.length.toString()}
          subtext="Standard & custom materials"
          variant="gold"
        />
        <StatCard
          icon={Layers}
          label="Active in 3D Planner"
          value={activeCount.toString()}
          subtext="Available for client room quotes"
          variant="default"
        />
        <StatCard
          icon={CheckCircle}
          label="In Stock Now"
          value={inStockCount.toString()}
          subtext="Immediate showroom dispatch"
          variant="emerald"
        />
        <StatCard
          icon={AlertTriangle}
          label="Attention Needed"
          value={lowStockCount.toString()}
          subtext="Low stock or out of stock"
          variant={lowStockCount > 0 ? "amber" : "default"}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-admin-surface border border-admin-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-admin-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU code (e.g. MR-SPC-01) or product title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-admin-surface-raised border border-admin-border focus:border-admin-border-gold text-admin-text text-xs sm:text-sm font-sans placeholder:text-admin-text-muted/60 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-admin-gold shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-admin-surface-raised border border-admin-border text-admin-text text-xs font-sans focus:border-admin-border-gold focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="spc-flooring">SPC Flooring</option>
            <option value="wpc-wall-panels">WPC Wall Panels</option>
            <option value="marble-sheets">UV Marble Sheets</option>
            <option value="lampshades">Pendant Lampshades</option>
            <option value="decor">Decor & Vases</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-xl bg-admin-surface border border-admin-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-sans">
            <thead>
              <tr className="border-b border-admin-border bg-admin-surface-raised/70 text-[11px] font-sans font-semibold text-admin-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 font-mono">SKU / Code</th>
                <th className="py-3.5 px-4">Product Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Rate (KSh)</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-center">Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/60">
              {filtered.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-admin-surface-raised/40 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-admin-gold whitespace-nowrap">
                    {prod.code}
                  </td>
                  <td className="py-3.5 px-4 text-admin-text font-medium max-w-[240px] truncate">
                    {prod.name}
                  </td>
                  <td className="py-3.5 px-4 text-admin-text-muted text-xs">
                    {prod.categories?.name || "General"}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-admin-text-muted text-xs font-mono">KSh</span>
                      <input
                        type="number"
                        value={prod.price_kes}
                        onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                        className="w-24 px-2.5 py-1 rounded-md bg-admin-surface-raised border border-admin-border focus:border-admin-border-gold text-admin-text font-mono font-semibold text-xs tabular-nums focus:outline-none transition-colors"
                      />
                      <span className="text-admin-text-muted/60 text-[11px] font-mono">
                        /{prod.unit}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={prod.stock_status}
                      onChange={(e) => handleStockChange(prod.id, e.target.value)}
                      className="px-2.5 py-1 rounded-md bg-admin-surface-raised border border-admin-border text-admin-text text-xs focus:border-admin-border-gold focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="made_to_order">Made to Order</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={prod.active}
                      onChange={(e) => handleActiveToggle(prod.id, e.target.checked)}
                      className="w-4 h-4 rounded border-admin-border accent-admin-gold cursor-pointer"
                      title="Toggle visibility in 3D planner & client calculator"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => saveProduct(prod)}
                      disabled={savingId === prod.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-gold/15 hover:bg-admin-gold/25 text-admin-gold border border-admin-gold/40 text-xs font-sans font-medium transition-colors disabled:opacity-50"
                    >
                      {successId === prod.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Saved</span>
                        </>
                      ) : savingId === prod.id ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-admin-text-muted">
                    No products found matching filters.
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
