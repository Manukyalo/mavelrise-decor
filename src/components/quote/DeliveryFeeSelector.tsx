"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Truck, AlertCircle, ChevronDown, X } from "lucide-react";
import type { DeliveryZone } from "@/lib/supabase/delivery";

// Re-export type so consumers don't need to import from server module
export type { DeliveryZone };

interface DeliveryFeeSelectorProps {
  onDeliveryChange: (zone: DeliveryZone | null, included: boolean) => void;
  locale: string;
}

type FetchState = "idle" | "loading" | "success" | "error";

export function DeliveryFeeSelector({
  onDeliveryChange,
  locale: _locale,
}: DeliveryFeeSelectorProps) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [deliveryIncluded, setDeliveryIncluded] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch zones on mount
  useEffect(() => {
    setFetchState("loading");
    fetch("/api/delivery-zones")
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<DeliveryZone[]>;
      })
      .then((data) => {
        setZones(data);
        setFetchState("success");
      })
      .catch((err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Could not load delivery zones";
        setErrorMessage(msg);
        setFetchState("error");
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredZones = zones.filter((z) =>
    z.town.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectZone = useCallback(
    (zone: DeliveryZone) => {
      setSelectedZone(zone);
      setSearchQuery("");
      setIsOpen(false);
      onDeliveryChange(zone, deliveryIncluded);
    },
    [deliveryIncluded, onDeliveryChange]
  );

  const handleClearZone = useCallback(() => {
    setSelectedZone(null);
    setDeliveryIncluded(false);
    setSearchQuery("");
    onDeliveryChange(null, false);
  }, [onDeliveryChange]);

  const handleToggleIncluded = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const included = e.target.checked;
      setDeliveryIncluded(included);
      onDeliveryChange(selectedZone, included);
    },
    [selectedZone, onDeliveryChange]
  );

  const handleOpenDropdown = useCallback(() => {
    if (fetchState !== "success") return;
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [fetchState]);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (fetchState === "loading" || fetchState === "idle") {
    return (
      <div className="rounded-sm border border-amber-500/20 bg-[#060c18] p-5 animate-pulse space-y-3">
        <div className="h-3 w-28 rounded-xs bg-white/10" />
        <div className="h-11 w-full rounded-xs bg-white/5" />
        <div className="h-3 w-48 rounded-xs bg-white/10" />
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (fetchState === "error") {
    return (
      <div className="rounded-sm border border-red-500/30 bg-[#060c18] p-5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-mono text-red-300 uppercase tracking-wider font-semibold">
            Delivery zones unavailable
          </p>
          <p className="text-[11px] font-mono text-white/50">
            {errorMessage}. Contact us directly to confirm delivery rates.
          </p>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  return (
    <div className="rounded-sm border border-amber-500/20 bg-[#060c18] p-5 space-y-5">
      {/* Section label */}
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
        <Truck className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
          Delivery to Your Site
        </span>
      </div>

      {/* Bespoke dropdown selector */}
      <div ref={dropdownRef} className="relative">
        {/* Trigger / selected display */}
        <button
          type="button"
          onClick={handleOpenDropdown}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xs bg-[#0a1424] border border-white/10 hover:border-amber-500/40 transition-colors text-left focus:outline-none focus:border-amber-500/50"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedZone ? (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <div className="min-w-0">
                <span className="font-serif text-white text-sm block truncate">
                  {selectedZone.town}
                </span>
                <span className="text-[10px] font-mono text-white/40 block">
                  {selectedZone.zone_label}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {!selectedZone.is_confirmed && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-amber-800/40 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    Est.
                  </span>
                )}
                <span className="text-sm font-mono text-amber-300 font-semibold">
                  KES {selectedZone.rate_kes.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearZone();
                  }}
                  className="text-white/30 hover:text-white/80 transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <span className="text-white/40 font-mono text-xs">
              Select delivery town
            </span>
          )}
          {!selectedZone && (
            <ChevronDown
              className={`w-4 h-4 text-white/30 transition-transform shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xs border border-amber-500/20 bg-[#07101e] shadow-2xl shadow-black/60">
            {/* Search input */}
            <div className="p-2 border-b border-white/10">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by town..."
                className="w-full bg-transparent text-white placeholder-white/30 text-xs font-mono py-1.5 px-2 outline-none"
                autoComplete="off"
              />
            </div>

            {/* Zone list */}
            <ul
              role="listbox"
              className="max-h-56 overflow-y-auto divide-y divide-white/5"
            >
              {filteredZones.length === 0 ? (
                <li className="px-4 py-3 text-xs font-mono text-white/30 text-center">
                  No zones match &ldquo;{searchQuery}&rdquo;
                </li>
              ) : (
                filteredZones.map((zone) => (
                  <li key={zone.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedZone?.id === zone.id}
                      onClick={() => handleSelectZone(zone)}
                      className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-amber-500/5 transition-colors group"
                    >
                      <div className="min-w-0">
                        <span className="font-serif text-white text-sm block group-hover:text-amber-100 transition-colors">
                          {zone.town}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-white/35">
                            {zone.zone_label}
                          </span>
                          {zone.notes && (
                            <>
                              <span className="text-white/20 text-[10px]">
                                ·
                              </span>
                              <span className="text-[10px] font-mono text-white/30 truncate">
                                {zone.notes}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!zone.is_confirmed && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-amber-800/40 text-amber-400 border border-amber-700/40 uppercase tracking-wider">
                            Rate to be confirmed
                          </span>
                        )}
                        <span className="text-sm font-mono text-amber-300 font-semibold">
                          KES {zone.rate_kes.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Add to proposal toggle */}
      {selectedZone && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={deliveryIncluded}
              onChange={handleToggleIncluded}
              className="sr-only peer"
            />
            <div className="w-4 h-4 rounded-xs border border-white/20 bg-[#0a1424] peer-checked:bg-amber-400 peer-checked:border-amber-400 transition-colors flex items-center justify-center">
              {deliveryIncluded && (
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  className="w-2.5 h-2.5"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-white/70 group-hover:text-white transition-colors">
              Add delivery to this proposal
            </span>
            {deliveryIncluded && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  Site Delivery —
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-semibold">
                  + KES {selectedZone.rate_kes.toLocaleString()}
                </span>
                {!selectedZone.is_confirmed && (
                  <span className="text-[9px] font-mono text-amber-500/70">
                    (estimated)
                  </span>
                )}
              </div>
            )}
          </div>
        </label>
      )}
    </div>
  );
}
