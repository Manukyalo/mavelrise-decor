"use client";

import React, { useState, useEffect } from "react";
import { Package, Search, Filter, CheckCircle2, AlertCircle, Save } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold">
          Inventory & Pricing Control
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-brand-ivory font-light mt-1">
          Product Catalogue & Live Rates
        </h1>
        <p className="text-xs font-sans text-brand-ivory/60 mt-1">
          Adjust prices, stock statuses, and showroom visibility. Changes instantly update the 3D room planner and quote calculator.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-sm bg-brand-navy-card border border-brand-gold/20 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-brand-gold/70 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code (e.g. MR-SPC-01) or product title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-sm bg-brand-navy border border-brand-gold/20 focus:border-brand-gold text-brand-ivory text-xs font-mono placeholder:text-brand-ivory/30 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-brand-gold" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-sm bg-brand-navy border border-brand-gold/20 text-brand-ivory text-xs font-mono focus:outline-none"
          >
            <option value="all">All Product Lines</option>
            <option value="spc-flooring">SPC Flooring</option>
            <option value="wpc-wall-panels">WPC Wall Panels</option>
            <option value="marble-sheets">Marble Sheets</option>
            <option value="lampshades">Pendant Lampshades</option>
            <option value="decor">Decor & Vases</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded-sm bg-brand-navy-card border border-brand-gold/20 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-brand-gold/20 bg-brand-navy/60 text-[10px] text-brand-gold uppercase tracking-wider">
              <th className="py-3.5 px-4">SKU / Code</th>
              <th className="py-3.5 px-4">Product Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price (KSh)</th>
              <th className="py-3.5 px-4">Stock Status</th>
              <th className="py-3.5 px-4">Active</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gold/10">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-brand-navy/30 transition-colors">
                <td className="py-3 px-4 font-bold text-brand-gold">{prod.code}</td>
                <td className="py-3 px-4 text-brand-ivory font-sans text-xs max-w-[200px] truncate">
                  {prod.name}
                </td>
                <td className="py-3 px-4 text-brand-ivory/60 text-[11px]">
                  {prod.categories?.name || "General"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-brand-ivory/50 text-[11px]">KSh</span>
                    <input
                      type="number"
                      value={prod.price_kes}
                      onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                      className="w-24 px-2 py-1 rounded-sm bg-brand-navy border border-brand-gold/30 text-brand-ivory font-bold text-xs focus:border-brand-gold focus:outline-none"
                    />
                    <span className="text-brand-ivory/40 text-[10px]">/{prod.unit}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={prod.stock_status}
                    onChange={(e) => handleStockChange(prod.id, e.target.value)}
                    className="px-2 py-1 rounded-sm bg-brand-navy border border-brand-gold/20 text-brand-ivory text-xs focus:outline-none"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="made_to_order">Made to Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={prod.active}
                    onChange={(e) => handleActiveToggle(prod.id, e.target.checked)}
                    className="w-4 h-4 rounded-sm border-brand-gold/30 accent-brand-gold cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => saveProduct(prod)}
                    disabled={savingId === prod.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/40 text-[11px] font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {successId === prod.id ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Saved</span>
                      </>
                    ) : savingId === prod.id ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-brand-ivory/40">
                  No products found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

