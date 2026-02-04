"use client";

import { useEffect, useMemo, useState } from "react";

export type ProductLike = {
  id: string;
  name: string;
  category: string;
  image: string;
  price?: number;
  weight?: string;

  desc?: string;
  highlights?: string[];
};

type Props = {
  product: ProductLike;

  /** ✅ NEW: suggestions shown near bottom */
  suggestions?: ProductLike[];

  /** ✅ NEW: open suggestion in quick view */
  onOpenSuggestion?: (p: ProductLike) => void;

  onClose: () => void;

  /** Keep compatibility with your existing cart.add() */
  onAdd: (payload?: ProductLike) => void;
};

const WEIGHTS = [
  { label: "250g", grams: 250, multiplier: 1 },
  { label: "500g", grams: 500, multiplier: 2 },
  { label: "1kg", grams: 1000, multiplier: 4 },
];

function fallbackHighlights(p: ProductLike): string[] {
  const cat = (p.category || "").toLowerCase();
  if (cat.includes("podi")) {
    return [
      "Freshly prepared in small batches",
      "Traditional roast & grind process",
      "Airtight packing for freshness",
      "Best with ghee / oil",
    ];
  }
  if (cat.includes("pickle")) {
    return [
      "Authentic homestyle recipe",
      "Made with fresh ingredients",
      "Balanced spice & tang",
      "Store refrigerated after opening",
    ];
  }
  if (cat.includes("snack")) {
    return [
      "Fresh batch for crunch",
      "Traditional spice blend",
      "Airtight packing",
      "Best before: 15–30 days",
    ];
  }
  return [
    "Freshly prepared and packed",
    "Authentic Konaseema taste",
    "Hygienic packing",
    "Store cool & dry",
  ];
}

export default function ProductQuickView({
  product,
  suggestions = [],
  onOpenSuggestion,
  onClose,
  onAdd,
}: Props) {
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(WEIGHTS[0]);

  const highlights = useMemo(() => {
    const h = product.highlights?.filter(Boolean) ?? [];
    return h.length >= 4 ? h.slice(0, 4) : fallbackHighlights(product);
  }, [product]);

  const computedPrice = useMemo(() => {
    const base = Number(product.price ?? 0);
    return base * weight.multiplier * qty;
  }, [product.price, weight.multiplier, qty]);

  // Lock background scroll (but sheet content scrolls).
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleAdd = () => {
    // We keep your existing cart behavior: add the product (increments qty in cart).
    // (Your cart currently merges by product.id; we’re not changing cart logic here.)
    onAdd(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile bottom-sheet / Desktop centered modal */}
      <div className="absolute inset-0 flex items-end md:items-center md:justify-center">
        {/* Panel MUST be flex-col with max height so inner scroll works on mobile */}
        <div
          role="dialog"
          aria-modal="true"
          className={[
            "w-full md:max-w-4xl bg-[#fffaf2] border border-[#e8dccb] shadow-2xl",
            "rounded-t-3xl md:rounded-2xl",
            "max-h-[92dvh] md:max-h-[calc(100dvh-3rem)]",
            "overflow-hidden",
            "flex flex-col",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Small grab handle (premium feel) */}
          <div className="md:hidden pt-2 pb-1 flex justify-center">
            <div className="h-1.5 w-12 rounded-full bg-black/15" />
          </div>

          {/* Header (always visible) */}
          <div className="relative px-5 pt-3 pb-4 md:px-6 md:pt-6 border-b border-[#efe4d6]">
            <div className="text-[12px] text-[#c9a36a] font-semibold tracking-wide">
              {product.category}
            </div>

            <div className="mt-1 pr-12">
              <h3 className="text-2xl md:text-3xl font-semibold text-[#2c1f14] leading-tight">
                {product.name}
              </h3>
              {product.desc && (
                <p className="mt-2 text-sm text-[#6b5a4a]">{product.desc}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-3 md:right-5 md:top-5 h-10 w-10 rounded-full grid place-items-center bg-white/70 hover:bg-white border border-[#e8dccb] text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* ✅ THIS is the scrollable area. If this isn’t scrollable, mobile will get stuck. */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="relative bg-[#faf7f2]">
                <div className="relative w-full h-[240px] md:h-full min-h-[240px] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="p-5 md:p-7">
                <div className="text-sm text-[#6b5a4a]">
                  Selected:{" "}
                  <span className="font-semibold text-[#2c1f14]">
                    {weight.label}
                  </span>
                </div>

                <div className="mt-3 text-2xl font-bold text-[#2c1f14]">
                  ₹{Number.isFinite(computedPrice) ? computedPrice : 0}
                </div>

                {/* Weight */}
                <div className="mt-6">
                  <div className="text-sm font-semibold text-[#2c1f14] mb-2">
                    Select weight
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {WEIGHTS.map((w) => {
                      const active = w.label === weight.label;
                      return (
                        <button
                          key={w.label}
                          type="button"
                          onClick={() => setWeight(w)}
                          className={[
                            "px-4 py-2 rounded-full text-sm border transition",
                            active
                              ? "bg-[#2f4a3a] text-white border-[#2f4a3a]"
                              : "bg-white text-[#2c1f14] border-[#e8dccb] hover:border-[#c9a36a]",
                          ].join(" ")}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Qty */}
                <div className="mt-6">
                  <div className="text-sm font-semibold text-[#2c1f14] mb-2">
                    Quantity
                  </div>

                  <div className="inline-flex items-center rounded-xl border border-[#e8dccb] bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-12 h-10 grid place-items-center text-xl text-[#2c1f14] hover:bg-[#faf7f2]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <div className="w-14 h-10 grid place-items-center font-semibold text-[#2c1f14]">
                      {qty}
                    </div>

                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="w-12 h-10 grid place-items-center text-xl text-[#2c1f14] hover:bg-[#faf7f2]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Details list */}
                <div className="mt-6">
                  <div className="text-sm font-semibold text-[#2c1f14] mb-2">
                    Product details
                  </div>

                  <ul className="space-y-2 text-sm text-[#5c4a3c] list-disc pl-5">
                    {highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>

                {/* ✅ Suggestions (appear down below; user must scroll to reach) */}
                {suggestions.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-[#2c1f14]">
                        You may also like
                      </div>
                      <div className="text-xs text-[#6b5a4a]">
                        Tap to open
                      </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
                      {suggestions.slice(0, 8).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            if (onOpenSuggestion) onOpenSuggestion(s);
                          }}
                          className="shrink-0 w-[170px] rounded-2xl border border-[#e8dccb] bg-white overflow-hidden text-left hover:shadow-md transition"
                        >
                          <div className="h-[92px] w-full overflow-hidden bg-[#faf7f2]">
                            <img
                              src={s.image}
                              alt={s.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <div className="p-3">
                            <div className="text-[12px] text-[#c9a36a] font-semibold truncate">
                              {s.category}
                            </div>
                            <div className="mt-0.5 text-sm font-semibold text-[#2c1f14] truncate">
                              {s.name}
                            </div>
                            <div className="mt-1 text-sm font-bold text-[#2c1f14]">
                              ₹{Number(s.price ?? 0)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keep space so last content never hides behind sticky bar */}
                <div className="h-28" />
              </div>
            </div>
          </div>

          {/* ✅ Sticky Add-to-Cart Bar (always visible) */}
          <div className="border-t border-[#efe4d6] bg-[#fffaf2] px-5 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[12px] text-[#6b5a4a]">Total</div>
                <div className="text-lg font-bold text-[#2c1f14] truncate">
                  ₹{Number.isFinite(computedPrice) ? computedPrice : 0}
                  <span className="ml-2 text-sm font-semibold text-[#6b5a4a]">
                    ({weight.label} × {qty})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="shrink-0 h-12 px-6 rounded-2xl bg-[#2f4a3a] text-white font-semibold hover:brightness-110 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
