"use client";

import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import CartDrawer from "./components/CartDrawer";

import { getProductsFromSheet } from "./components/sheetProducts";
import { getCombosFromSheet } from "./components/sheetCombos";

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      const p = await getProductsFromSheet();
      const c = await getCombosFromSheet();
      setProducts(p || []);
      setCombos(c || []);
    }
    loadData();
  }, []);

  return (
    <>
      <CartDrawer />

      <main>
        <Hero products={products} />

        <Categories
          active={active}
          setActive={setActive}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          products={products}
        />

        <Products
          products={products}
          combos={combos}
          active={active}
          searchQuery={searchQuery}
        />
      </main>
    </>
  );
}
