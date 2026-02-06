"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import CartDrawer from "./components/CartDrawer";

export default function Page() {
  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main>
        <Hero />

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
