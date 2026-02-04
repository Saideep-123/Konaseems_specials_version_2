"use client";

import { useEffect, useMemo, useState } from "react";

export type ProductLike = {
  id: string;
  name: string;
  category: string;
  image: string;

  price: number; // USD
  weight: string;

  desc?: string;
  highlights?: string[];
  out_of_stock?: boolean;
  is_live?: boolean;

  // optional prices map if you later add weight selector
  prices?: Record<string, number>;
};

type Props = {
  product: ProductLike;
  suggestions?: ProductLike[];
  onOpenSuggestion?: (p: ProductLike) => void;
  onClose: () => void;
  onAdd: (payload: ProductLike, qty: number) => void;
};

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

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number.isFinite(n) ? n : 0
  );

export default function ProductQuickView({
  product,
  suggestions = [],
  onOpenSuggestion,
  onClose,
  onAdd,
}: Props) {
  const [qty, setQty] = useState(1);

  // reset qty when switching products inside quick view
  useEffect(() => setQty(1), [product?.id]);

  const highlights = useMemo(() => {
    const h = product.highlights?.filter(Boolean) ?? [];
    return h.length >= 4 ? h.slice(0, 4) : fallbackHighlights(product);
  }, [product]);

  const totalPrice = useMemo(() => {
    const base = Number(product.price ?? 0);
    return base * qty;
  }, [product.price, qty]);

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

  const disabled = !!product.out_of_stock || product.is_live === false;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />

      <div className="absolute inset-0 flex items-end md:items-center md:justify-center">
        <div
          role="dialog"
          aria-modal="true"
          className={[
            "w-full md:max-w-4xl bg-[#fffaf2] border border-[#e8dccb] shadow-2xl",
            "rounded-t-3xl md:rounded-2xl",
            "max-h-[92dvh] md:max-h-[calc(100dvh-3rem)]",
            "overflow-hidden flex flex-col",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="md:hidden pt-2 pb-1 flex justify-center">
            <div className="h-1.5 w-12 rounded-full bg-black/15" />
          </div>

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

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
            <div className="grid grid-cols-1 md:grid-cols-2">
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

              <div className="p-5 md:p-7">
                <div className="text-sm text-[#6b5a4a]">
                  Pack:{" "}
                  <span className="font-semibold text-[#2c1f14]">
                    {product.weight}
                  </span>
                </div>

                <div className="mt-3 text-2xl font-bold text-[#2c1f14]">
                  {usd(Number(product.price ?? 0))}
                  <span className="ml-2 text-sm font-semibold text-[#6b5a4a]">
                    / pack
                  </span>
                </div>

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

                {/* ✅ Suggestions are back */}
                {suggestions.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-[#2c1f14]">
                        You may also like
                      </div>
                      <div className="text-xs text-[#6b5a4a]">Tap to open</div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
                      {suggestions.slice(0, 8).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => onOpenSuggestion?.(s)}
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
                              {usd(Number(s.price ?? 0))}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-28" />
              </div>
            </div>
          </div>

          <div className="border-t border-[#efe4d6] bg-[#fffaf2] px-5 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[12px] text-[#6b5a4a]">Total</div>
                <div className="text-lg font-bold text-[#2c1f14] truncate">
                  {usd(totalPrice)}
                  <span className="ml-2 text-sm font-semibold text-[#6b5a4a]">
                    ({product.weight} × {qty})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAdd(product, qty);
                  onClose();
                }}
                disabled={disabled}
                className={[
                  "shrink-0 h-12 px-6 rounded-2xl font-semibold transition",
                  disabled
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#2f4a3a] text-white hover:brightness-110",
                ].join(" ")}
              >
                {product.out_of_stock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
