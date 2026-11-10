"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, ProductVariant } from "@/types/catalogue";
import { getSpcColorHex } from "@/lib/catalogue/colors";
import {
  Compass,
  MessageCircle,
  ShieldCheck,
  Layers,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  Maximize2,
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
  locale: string;
}

export function ProductDetailView({ product, locale }: ProductDetailViewProps) {
  const isSpc = product.category?.slug === "spc-flooring";
  const spcColorHex = isSpc ? getSpcColorHex(product.code) : null;

  // Selected variant state (e.g. 5.5mm vs 6mm for SPC)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Active gallery index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Zoomable texture lens state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x, y });
  };

  // WhatsApp prefilled message
  const whatsappPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
  const whatsappMessage = encodeURIComponent(
    `Hello MarvelRise Decor, I am inquiring about the ${product.name} (Code: ${product.code})${selectedVariant ? ` in ${selectedVariant.label}` : ""
    }. Could you provide availability and a quote for my project?`
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`;

  // Planner URL
  const plannerUrl = `/${locale}/planner?color=${encodeURIComponent(product.code)}`;

  return (
    <div className="space-y-16">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs font-mono text-white/40 tracking-wider">
        <Link href={`/${locale}`} className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-white/20" />
        <Link
          href={`/${locale}/collections`}
          className="hover:text-white transition-colors"
        >
          Collections
        </Link>
        <ChevronRight className="w-3 h-3 text-white/20" />
        <Link
          href={`/${locale}/collections/${product.category?.slug}`}
          className="hover:text-white transition-colors"
        >
          {product.category?.name}
        </Link>
        <ChevronRight className="w-3 h-3 text-white/20" />
        <span className="text-amber-400">{product.code}</span>
      </nav>

      {/* Placeholder Warning Banner if applicable */}
      {product.is_placeholder && (
        <div className="p-4 rounded-sm bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs font-mono">
            <span className="font-semibold block uppercase tracking-wider text-amber-300">
              Showroom Physical Verification SKU
            </span>
            <p className="text-white/70 leading-relaxed">
              This finish code is catalogued directly from the print brochure. Please visit the MarvelRise Ruiru Membley showroom to inspect the physical architectural swatch and confirm current batch calibration.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Gallery / Zoom on Left, Product Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Zoomable Texture Close-Up & Parallax Gallery */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visualizer / Zoom Lens */}
          <div
            className="relative h-[420px] sm:h-[500px] rounded-sm border border-amber-500/20 overflow-hidden cursor-crosshair bg-[#03060c] group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Visual Canvas (either color swatch simulation or photo) */}
            {spcColorHex ? (
              <div
                className="absolute inset-0 transition-transform duration-200"
                style={{
                  background: `linear-gradient(135deg, ${spcColorHex} 0%, #1a1410 100%)`,
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  transform: isZooming ? "scale(2.2)" : "scale(1)",
                }}
              >
                {/* Wood Grain Simulation */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.1) 16px, transparent 18px)",
                  }}
                />
              </div>
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-200"
                style={{
                  backgroundImage: `url(${product.images[activeImageIndex] ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                    })`,
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  transform: isZooming ? "scale(2)" : "scale(1)",
                }}
              />
            )}

            {/* Ambient Lighting Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Lens Hint Pill */}
            <div className="absolute bottom-4 right-4 pointer-events-none px-3 py-1.5 rounded-xs bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70 flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span>Hover to examine micro-texture (2× zoom)</span>
            </div>

            {/* Bottom Left: Finish badge */}
            <div className="absolute bottom-4 left-4 pointer-events-none space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                {product.finish || "Architectural Surface"}
              </span>
              <span className="text-xs font-serif text-white block">
                {product.colour || "Standard Finish"}
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xs overflow-hidden border transition-all ${activeImageIndex === idx
                    ? "border-amber-400 shadow-md shadow-amber-400/20 scale-105"
                    : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Room Context Quote / Architecture Note */}
          <div className="p-6 rounded-sm bg-[#060b14] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Context & Performance</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Engineered specifically for Kenya&apos;s diurnal temperature shifts and humidity. High dimensional stability guarantees zero buckling, while the UV ceramic bead coating protects against intense equatorial sunlight through floor-to-ceiling windows.
            </p>
          </div>
        </div>

        {/* Right Column: Specifications, Variants & Actions */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-semibold tracking-widest uppercase">
                {product.code}
              </span>
              <span className="text-white/40 uppercase tracking-wider">
                {product.category?.name}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Selectable Variants (e.g. 5.5mm vs 6.0mm Click-Lock for SPC) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 border-b border-white/10 pb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-white/60 flex items-center justify-between">
                <span>Select Profile & Core Thickness</span>
                <span className="text-amber-300 text-[10px]">Click-Lock System</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.sku === v.sku;
                  return (
                    <button
                      key={v.sku}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3.5 rounded-xs border text-left transition-all relative ${isSelected
                        ? "bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-400/10"
                        : "bg-black/30 border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                        }`}
                    >
                      <div className="text-xs font-mono font-semibold tracking-wider">
                        {v.label}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono mt-1">
                        SKU: {v.sku}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            {/* Add to Design (Room Planner Integration) */}
            {isSpc && (
              <Link
                href={plannerUrl}
                className="w-full py-4 px-6 rounded-xs bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-amber-400/20 group"
              >
                <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
                <span>Add to Design in 3D Room Planner</span>
              </Link>
            )}

            {/* Ask on WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-xs bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Inquire & Request Pricing via WhatsApp</span>
            </a>
          </div>

          {/* Architectural Specifications Table */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/60">
              Technical Specifications
            </h3>

            <div className="divide-y divide-white/5 border border-white/10 rounded-xs bg-black/30 text-xs font-mono">
              <div className="p-3 flex justify-between">
                <span className="text-white/40">Finish Code</span>
                <span className="text-amber-300 font-semibold">{product.code}</span>
              </div>
              {product.thickness && (
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Thickness</span>
                  <span className="text-white/90">{product.thickness}</span>
                </div>
              )}
              {product.size && (
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Dimensions</span>
                  <span className="text-white/90">{product.size}</span>
                </div>
              )}
              {product.finish && (
                <div className="p-3 flex justify-between">
                  <span className="text-white/40">Surface Texture</span>
                  <span className="text-white/90">{product.finish}</span>
                </div>
              )}

              {/* Dynamic specs from JSONB */}
              {Object.entries(product.specs || {}).map(([key, val]) => {
                if (typeof val === "object" || val === null) return null;
                const formattedKey = key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                const formattedVal =
                  typeof val === "boolean" ? (val ? "Yes" : "No") : String(val);

                return (
                  <div key={key} className="p-3 flex justify-between">
                    <span className="text-white/40">{formattedKey}</span>
                    <span className="text-white/90">{formattedVal}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}