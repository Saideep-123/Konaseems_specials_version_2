"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import About from "./components/About";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar />
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
        <Products activeCategory={activeCategory} searchQuery={searchQuery} />
        <About />
        <Footer />
      </main>
    </>
  );
}
