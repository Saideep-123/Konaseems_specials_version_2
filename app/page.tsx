"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import CartDrawer from "./components/CartDrawer";
import { getProductsFromSheet } from "./lib/sheetProducts";

export default function Page() {
  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const p = await getProductsFromSheet();
      setProducts(p || []);
    }
    load();
  }, []);

  const special = products[0]; // first product as special

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main>
        <Hero special={special} />

        <Categories
          active={active}
          setActive={setActive}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <Products
          activeCategory={active}
          searchQuery={searchQuery}
        />
      </main>
    </>
  );
}
