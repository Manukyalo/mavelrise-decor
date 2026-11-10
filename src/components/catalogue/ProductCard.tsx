"use client";

import Link from "next/link";
import { Product } from "@/types/catalogue";
import { ArrowUpRight, Compass, ShieldCheck } from "lucide-react";
import { getSpcColorHex } from "@/lib/catalogue/colors";

interface ProductCardProps {
  product: Product;
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const isSpc = product.category?.slug === "spc-flooring";
  const spcColorHex = isSpc ? getSpcColorHex(product.code) : null;
  const href = `/${locale}/collections/${product.category?.slug || "spc-flooring"}/${product.slug}`;
  const plannerHref = `/${locale}/planner?color=${encodeURIComponent(product.code)}`;

  return (
    <article className="group relative flex flex-col bg-[#070e18]/80 border border-amber-500/15 rounded-sm overflow-hidden hover:border-amber-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5">
      {/* Top Banner: Code & Placeholder flag if applicable */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#050a12]/90 text-[10px] tracking-widest uppercase">
        <span className="font-mono text-amber-400/90 font-medium tracking-wider">
          {product.code}
        </span>
        <div className="flex items-center gap-2">
          {product.is_placeholder ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-amber-500/10 text-amber-300/80 border border-amber-500/20">
              Showroom Spec
            </span>
          ) : (
            <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Visual Preview / Texture Swatch */}
      <Link href={href} className="relative block h-64 overflow-hidden bg-[#03060b]">
        {/* Swatch gradient backdrop */}
        {spcColorHex ? (
          <div
            className="absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{
              background: `linear-gradient(135deg, ${spcColorHex} 0%, #15110e 100%)`,
            }}
          >
            {/* Plank grain lines simulation */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.08) 19px, transparent 20px)",
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#121926] via-[#090f18] to-[#04070d] group-hover:scale-105 transition-transform duration-700 ease-out" />
        )}

        {/* Ambient subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-transparent opacity-90" />

        {/* Color Swatch Circle Indicator */}
        {spcColorHex && (
          <div className="absolute bottom-3 left-4 flex items-center gap-2 z-10">
            <span
              className="w-4 h-4 rounded-full border border-white/30 shadow-md"
              style={{ backgroundColor: spcColorHex }}
            />
            <span className="text-[11px] text-white/70 font-mono tracking-wider">
              {product.colour || "Standard Finish"}
            </span>
          </div>
        )}

        {/* Hover Quick Action Icon */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#050a12]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 group-hover:text-amber-400 group-hover:border-amber-400/40 transition-colors">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-white/40 uppercase mb-1">
            {product.category?.name || "Architectural Finish"}
          </div>
          <Link href={href} className="group-hover:text-amber-400 transition-colors">
            <h3 className="font-serif text-lg text-white font-medium tracking-tight mb-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Specs Highlights */}
        <div className="pt-3 border-t border-white/5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-white/60">
            {product.thickness && (
              <div>
                <span className="text-white/30 block text-[9px] uppercase">Profile</span>
                <span className="text-amber-200/90">{product.thickness}</span>
              </div>
            )}
            {product.size && (
              <div>
                <span className="text-white/30 block text-[9px] uppercase">Format</span>
                <span className="text-white/80 truncate block">{product.size}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-2">
            <Link
              href={href}
              className="flex-1 text-center py-2 px-3 text-xs tracking-wider uppercase font-mono rounded-xs border border-white/15 bg-white/[0.02] text-white/80 hover:bg-amber-400/10 hover:border-amber-400/40 hover:text-amber-300 transition-all"
            >
              Specs
            </Link>

            {isSpc && (
              <Link
                href={plannerHref}
                title="Open in Isometric 3D Room Planner"
                className="py-2 px-3 text-xs tracking-wider uppercase font-mono rounded-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black transition-all flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Plan</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
