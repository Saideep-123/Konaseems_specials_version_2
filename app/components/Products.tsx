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
      <section className="px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-3 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelected(p)}   {/* ✅ THIS WAS MISSING */}
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-32 w-full object-cover rounded"
              />

              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <div className="text-sm">{p.weight}</div>

              <div className="font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(p.price)}
              </div>

              {/* Stop click from opening Quick View */}
              <button
                disabled={p.out_of_stock}
                onClick={(e) => {
                  e.stopPropagation();
                  cart.add(p, 1);
                }}
                className="mt-2 w-full border rounded py-1"
              >
                {p.out_of_stock ? "Out of Stock" : "Add"}
              </button>
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
