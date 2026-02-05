"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProductsFromSheet,
  type ProductFromSheet,
} from "../lib/sheetProducts";
import { getCombosFromSheet } from "../lib/sheetCombos";
import { useCart } from "./CartContext";
import ProductQuickView from "./ProductQuickView";

type Props = {
  activeCategory: string;
  searchQuery: string;
};

type Combo = {
  id: string;
  name: string;
  category: string;
  image: string;

  price: number;
  total_weight: string;

  is_combo: true;
  items: { name: string; weight?: string }[];
};


export default function Products({ activeCategory, searchQuery }: Props) {
  const cart = useCart();

  const [products, setProducts] = useState<ProductFromSheet[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selected, setSelected] = useState<any>(null);

  /* =========================================
     LOAD PRODUCTS + COMBOS
  ========================================= */
  useEffect(() => {
    async function load() {
      try {
        const p = await getProductsFromSheet();
        setProducts(p);
      } catch {
        setProducts([]);
      }

      try {
        const c = await getCombosFromSheet();
        setCombos(c as any);
      } catch {
        console.warn("Combos failed to load");
      }
    }

    load();
  }, []);

  /* =========================================
     FILTER PRODUCTS ONLY
  ========================================= */
  const filteredProducts = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return products.filter((p) => {
      const okCat = activeCategory === "All" || p.category === activeCategory;
      const okSearch = !q || p.name.toLowerCase().includes(q);
      return okCat && okSearch;
    });
  }, [products, activeCategory, searchQuery]);

  /* =========================================
     SUGGESTIONS (ONLY FOR NORMAL PRODUCTS)
  ========================================= */
  const suggestions = useMemo(() => {
    if (!selected || selected?.is_combo) return [];

    const sameCat = products.filter(
      (x) =>
        x.id !== selected.id &&
        x.category === selected.category &&
        x.is_live !== false
    );

    const other = products.filter(
      (x) =>
        x.id !== selected.id &&
        x.category !== selected.category &&
        x.is_live !== false
    );

    return [...sameCat, ...other].slice(0, 8);
  }, [products, selected]);

  return (
    <>
      {/* =========================================
         COMBO SECTION (SEPARATE GRID)
      ========================================= */}
      {combos.length > 0 && (
        <section className="px-4 sm:px-6 pt-6 pb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#2c1f14]">
            Combos & Value Packs
          </h2>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">


            {combos.slice(0, 5).map((c) => (
              <div
  key={c.id}
  onClick={() => setSelected(c)}
  className="rounded-xl border border-[#eadfcd] bg-white/70 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
>

                {/* Title */}
                <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#2c1f14] leading-snug">
                    {c.name}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-md bg-[#c9a36a] text-white">
                    COMBO
                  </span>
                </div>

                {/* Image */}
                <div className="relative aspect-[16/9] bg-[#faf7f2] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Footer */}
<div className="px-3 py-3 border-t border-[#efe4d6]">
  <div className="flex items-center justify-between">
    <div className="text-sm text-[#6b5a4a]">
      {c.total_weight}
    </div>

    <div className="text-sm font-bold text-[#2c1f14]">
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(c.price ?? 0))}
    </div>
  </div>
</div>


              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================
         NORMAL PRODUCTS GRID (UNCHANGED)
      ========================================= */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl border border-[#eadfcd] bg-white/70
                         shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
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

      {/* QUICK VIEW */}
      {selected && (
        <ProductQuickView
          product={selected}
          suggestions={suggestions}
          onOpenSuggestion={(p: any) => setSelected(p)}
          onClose={() => setSelected(null)}
          onAdd={(p: any, qty: number) => cart.add(p, qty)}
        />
      )}
    </>
  );
}
