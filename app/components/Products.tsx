"use client";

import { useEffect, useMemo, useState } from "react";
import { getProductsFromSheet, type ProductFromSheet } from "../lib/sheetProducts";
import { useCart } from "./CartContext";
import ProductQuickView from "./ProductQuickView";

type Props = {
  activeCategory: string;
  searchQuery: string;
};

export default function Products({ activeCategory, searchQuery }: Props) {
  const cart = useCart();
  const [items, setItems] = useState<ProductFromSheet[]>([]);
  const [selected, setSelected] = useState<ProductFromSheet | null>(null);

  useEffect(() => {
    getProductsFromSheet().then(setItems).catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return items.filter((p) => {
      const okCat = activeCategory === "All" || p.category === activeCategory;
      const okSearch = !q || p.name.toLowerCase().includes(q);
      return okCat && okSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const suggestions = useMemo(() => {
    if (!selected) return [];
    // same category suggestions first, then any others
    const sameCat = items.filter(
      (x) => x.id !== selected.id && x.category === selected.category && x.is_live !== false
    );
    const other = items.filter(
      (x) => x.id !== selected.id && x.category !== selected.category && x.is_live !== false
    );
    return [...sameCat, ...other].slice(0, 8);
  }, [items, selected]);

  return (
    <>
      <section className="px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={[
                "group rounded-2xl border border-[#eadfcd] bg-white/70",
                "shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer",
              ].join(" ")}
              onClick={() => setSelected(p)}
            >
              <div className="relative aspect-[4/3] bg-[#faf7f2] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition"
                  loading="lazy"
                />
              </div>

              <div className="p-3 sm:p-4">
                <div className="text-[11px] text-[#c9a36a] font-semibold truncate">
                  {p.category}
                </div>

                <h3 className="mt-1 font-semibold text-[#2c1f14] leading-snug line-clamp-2">
                  {p.name}
                </h3>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="text-sm text-[#6b5a4a]">{p.weight}</div>

                  <div className="text-sm font-bold text-[#2c1f14]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Number(p.price ?? 0))}
                  </div>
                </div>

                <button
                  disabled={p.out_of_stock || p.is_live === false}
                  onClick={(e) => {
                    e.stopPropagation();
                    cart.add(p, 1);
                  }}
                  className={[
                    "mt-3 w-full h-10 rounded-xl font-semibold transition",
                    p.out_of_stock || p.is_live === false
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#2f4a3a] text-white hover:brightness-110",
                  ].join(" ")}
                >
                  {p.out_of_stock ? "Out of Stock" : "Add"}
                </button>

                <div className="mt-2 text-xs text-[#6b5a4a] opacity-70">
                  Tap card for Quick View
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <ProductQuickView
          product={selected as any}
          suggestions={suggestions as any}
          onOpenSuggestion={(p: any) => setSelected(p)}
          onClose={() => setSelected(null)}
          onAdd={(p: any, qty: number) => cart.add(p, qty)}
        />
      )}
    </>
  );
}
