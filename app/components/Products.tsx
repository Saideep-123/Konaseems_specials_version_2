"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "./data";
import { useCart } from "./CartContext";
import ProductQuickView, { ProductLike } from "./ProductQuickView";

export default function Products({
  activeCategory,
  searchQuery,
}: {
  activeCategory: string;
  searchQuery: string;
}) {
  const cart = useCart();
  const [selected, setSelected] = useState<ProductLike | null>(null);

  const filtered = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();

    return PRODUCTS.filter((p) => {
      const byCategory = activeCategory === "All" || p.category === activeCategory;
      const bySearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.weight || "").toLowerCase().includes(q);

      return byCategory && bySearch;
    });
  }, [activeCategory, searchQuery]);

  const suggestions = useMemo(() => {
    if (!selected) return [];
    return PRODUCTS.filter(
      (p) => p.category === selected.category && p.id !== selected.id
    ).slice(0, 8);
  }, [selected]);

  return (
    <>
      <section className="px-6 pb-24" id="products">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[34px] font-semibold tracking-tight mb-8">
            Featured Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(p as any)}
                className="group bg-white rounded-2xl border border-[#e8dccb] hover:shadow-lg transition cursor-pointer overflow-hidden"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelected(p as any);
                }}
              >
                {/* IMAGE */}
                <div className="relative w-full h-[150px] bg-[#faf7f2] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.onerror = null;
                      img.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <div className="text-[12px] text-gray-500 mb-1">{p.category}</div>

                  <h3 className="text-[15px] font-medium leading-tight line-clamp-2">
                    {p.name}
                  </h3>

                  <p className="text-[12px] text-gray-500 mt-1">{p.weight}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[15px] font-semibold">₹{p.price}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cart.add(p as any);
                      }}
                      className="text-[12px] px-3 py-1 rounded-full border border-[#c9a36a] hover:bg-[#c9a36a] hover:text-white transition"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 opacity-70">No products found.</div>
          )}
        </div>
      </section>

      {/* QUICK VIEW */}
      {selected && (
        <ProductQuickView
          product={selected}
          suggestions={suggestions}
          onOpenSuggestion={(p) => setSelected(p)}
          onClose={() => setSelected(null)}
          onAdd={(payload) => {
            // keep your current behavior: add opens cart and increments
            if (payload) cart.add(payload as any);
            else cart.add(selected as any);
          }}
        />
      )}
    </>
  );
}
