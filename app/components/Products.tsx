"use client";

import { useEffect, useMemo, useState } from "react";
import { getProductsFromSheet } from "../lib/sheetProducts";
import { useCart } from "./CartContext";
import ProductQuickView from "./ProductQuickView";

export default function Products({ activeCategory, searchQuery }: any) {
  const cart = useCart();
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    getProductsFromSheet().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return items.filter(
      (p) =>
        (activeCategory === "All" || p.category === activeCategory) &&
        (!q || p.name.toLowerCase().includes(q))
    );
  }, [items, activeCategory, searchQuery]);

  return (
    <>
      <section className="px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl border border-[#eee] overflow-hidden cursor-pointer transition hover:shadow-lg"
              onClick={() => setSelected(p)}
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#faf7f2] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {p.out_of_stock && (
                  <div className="absolute inset-0 bg-white/80 grid place-items-center text-sm font-semibold text-gray-700">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col gap-1">
                <div className="text-xs text-gray-500 truncate">
                  {p.category}
                </div>

                <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
                  {p.name}
                </h3>

                <div className="text-xs text-gray-500">{p.weight}</div>

                <div className="mt-1 font-bold text-base">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(p.price)}
                </div>

                <button
                  disabled={p.out_of_stock}
                  onClick={(e) => {
                    e.stopPropagation();
                    cart.add(p, 1);
                  }}
                  className="mt-2 w-full rounded-xl border border-[#2f4a3a] text-[#2f4a3a] py-1.5 text-sm font-semibold hover:bg-[#2f4a3a] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <ProductQuickView
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={(p, qty) => cart.add(p, qty)}
        />
      )}
    </>
  );
}
