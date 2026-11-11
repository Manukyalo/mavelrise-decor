"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  Camera,
  Maximize2,
  RotateCcw,
  Sparkles,
  QrCode,
  Layers,
  CheckCircle2,
  Loader2,
  X,
  Compass,
} from "lucide-react";
import { ArModelConfig, getArModelForProduct } from "@/lib/ar/models";

// Declare web component for TypeScript JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "ar-scale"?: string;
          "ar-placement"?: string;
          "camera-controls"?: boolean;
          "touch-action"?: string;
          "auto-rotate"?: boolean;
          "auto-rotate-delay"?: number;
          "rotation-per-second"?: string;
          "shadow-intensity"?: string;
          "shadow-softness"?: string;
          exposure?: string;
          loading?: string;
          poster?: string;
          reveal?: string;
          scale?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface SpatialArViewerProps {
  categorySlug?: string;
  productCode: string;
  productName: string;
  locale?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export function SpatialArViewer({
  categorySlug,
  productCode,
  productName,
  locale = "en",
  onClose,
  isModal = false,
}: SpatialArViewerProps) {
  const isSw = locale === "sw";
  const modelConfig: ArModelConfig = getArModelForProduct(categorySlug, productCode);

  const modelViewerRef = useRef<HTMLElement | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isArSupported, setIsArSupported] = useState<boolean | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Check AR capability on model-viewer load
  const handleModelLoad = () => {
    setModelLoaded(true);
    const mv = modelViewerRef.current as (HTMLElement & {
      canActivateAR?: boolean;
      activateAR?: () => void;
      resetTurntable?: () => void;
      cameraOrbit?: string;
    }) | null;

    if (mv && typeof mv.canActivateAR === "boolean") {
      setIsArSupported(mv.canActivateAR);
    } else {
      // Feature detect WebXR / QuickLook heuristics
      const isIOS =
        typeof navigator !== "undefined" &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid =
        typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);

      setIsArSupported(isIOS || isAndroid);
    }
  };

  const handleLaunchAr = () => {
    const mv = modelViewerRef.current as (HTMLElement & {
      activateAR?: () => void;
    }) | null;

    if (mv && typeof mv.activateAR === "function") {
      try {
        mv.activateAR();
      } catch (err) {
        console.warn("[SpatialArViewer] activateAR fallback:", err);
      }
    }
  };

  const handleResetCamera = () => {
    const mv = modelViewerRef.current as (HTMLElement & {
      cameraOrbit?: string;
      cameraTarget?: string;
    }) | null;
    if (mv) {
      mv.setAttribute("camera-orbit", "0deg 75deg 105%");
      mv.setAttribute("camera-target", "auto auto auto");
    }
  };

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://mavelrise-decor.vercel.app/${locale}/collections`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=060c18&color=f4ebd9&margin=1`;

  const content = (
    <div className="relative w-full h-full flex flex-col bg-[#03060c] rounded-sm overflow-hidden border border-amber-500/20 shadow-2xl select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xs bg-[#060c18]/90 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-mono tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{productCode}</span>
            <span className="text-white/30">|</span>
            <span className="text-white/80">{isSw ? modelConfig.titleSw : modelConfig.titleEn}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Reset Camera button */}
          <button
            type="button"
            onClick={handleResetCamera}
            title={isSw ? "Rudisha mtazamo wa kamera" : "Reset camera orbit"}
            className="p-2 rounded-xs bg-[#060c18]/90 backdrop-blur-md border border-white/10 hover:border-amber-400/40 text-white/70 hover:text-white transition-all shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Auto-rotate */}
          <button
            type="button"
            onClick={() => setIsAutoRotating((r) => !r)}
            title={isSw ? "Washa/Zima mzunguko wa 3D" : "Toggle 3D auto-rotation"}
            className={`p-2 rounded-xs backdrop-blur-md border transition-all shadow-lg ${isAutoRotating
                ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                : "bg-[#060c18]/90 border-white/10 text-white/50 hover:text-white"
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Close button if in modal mode */}
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xs bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-black transition-all shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main 3D WebXR Viewport */}
      <div className="relative flex-1 w-full h-[420px] sm:h-[480px] bg-gradient-to-b from-[#03060c] via-[#060c18] to-[#040812]">
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          type="module"
          strategy="afterInteractive"
        />

        {/* Loading Spinner Monolith */}
        {!modelLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#03060c]/80 backdrop-blur-xs">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300/80">
              {isSw ? "Inapakia mfano wa 3D wa ukubwa halisi..." : "Calibrating 1:1 Architectural 3D Asset..."}
            </span>
          </div>
        )}

        {/* Google model-viewer element */}
        <model-viewer
          ref={(el) => {
            modelViewerRef.current = el;
          }}
          src={modelConfig.glbSrc}
          ios-src={modelConfig.usdzSrc}
          alt={`MarvelRise Decor - ${productName} (${productCode}) in Augmented Reality`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          ar-placement={modelConfig.placement}
          camera-controls
          touch-action="pan-y"
          auto-rotate={isAutoRotating}
          auto-rotate-delay={1000}
          rotation-per-second="25deg"
          shadow-intensity="1.5"
          shadow-softness="0.8"
          exposure="1.15"
          loading="eager"
          onLoad={handleModelLoad}
          style={{ width: "100%", height: "100%", outline: "none" }}
        />

        {/* Subtle grid floor overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(200, 161, 90, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 161, 90, 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Bottom Architectural Action Bar */}
      <div className="p-4 sm:p-5 bg-[#060c18] border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>{isSw ? "Tazama Chumbani Mwako Kupitia Kamera (AR)" : "Augmented Reality Room Visualizer"}</span>
          </div>
          <p className="text-[11px] font-mono text-white/50 leading-relaxed max-w-lg">
            {isSw ? modelConfig.hintSw : modelConfig.hintEn}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Conditional AR Button: ONLY shown when AR is supported by the device */}
          {isArSupported === true && (
            <button
              type="button"
              onClick={handleLaunchAr}
              className="py-3 px-5 rounded-xs bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all shadow-xl shadow-amber-400/20 animate-pulse hover:animate-none"
            >
              <Camera className="w-4 h-4" />
              <span>{isSw ? "Weka Chumbani Mwangu (AR)" : "Place in My Room (AR)"}</span>
            </button>
          )}

          {/* Desktop Fallback: QR Code for seamless Phone Camera Transfer */}
          {isArSupported === false && (
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="py-2.5 px-4 rounded-xs border border-amber-500/30 hover:border-amber-400 bg-amber-400/10 text-amber-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{isSw ? "Tazama kwenye Simu (AR)" : "Open on Phone for AR"}</span>
            </button>
          )}

          {/* Loading state placeholder for AR detection */}
          {isArSupported === null && (
            <span className="text-[11px] font-mono text-white/30 uppercase tracking-wider py-2 px-3">
              {isSw ? "Inachunguza AR..." : "Detecting AR..."}
            </span>
          )}
        </div>
      </div>

      {/* Desktop QR Modal */}
      {showQrModal && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-xs w-full bg-[#060c18] border border-amber-500/40 rounded-sm p-6 space-y-4 text-center shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                {isSw ? "Uchanganuzi wa AR" : "Mobile AR Handoff"}
              </span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-light">
              {isSw
                ? "Changanua msimbo huu kwa kutumia kamera ya iPhone au simu ya Android ili kufungua kipengele cha AR papo hapo:"
                : "Point your iPhone or Android camera at this code to view this piece directly in your room:"}
            </p>

            <div className="p-3 bg-white/5 rounded-xs border border-amber-500/20 inline-block mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Scan with phone camera to view in AR"
                className="w-48 h-48 rounded-xs"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSw ? "Inatumika na iOS QuickLook na Android WebXR" : "Supports iOS Quick Look & Android WebXR"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
        <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

