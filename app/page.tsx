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

        {/* ABOUT SECTION */}
        <section id="about" className="px-6 py-20 bg-[#faf7f2]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-6">
              About Konaseema Specials
            </h2>
            <p className="text-lg opacity-80 leading-relaxed">
              Konaseema Specials brings you authentic homemade sweets and snacks
              prepared using traditional recipes from the Konaseema region.
              Every item is made with pure ingredients, hygienic methods,
              and packed fresh to preserve taste and quality.
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-6">Contact Us</h2>
            <p className="text-lg opacity-80 mb-6">
              For orders and inquiries, reach out to us directly on WhatsApp.
            </p>

            <a
              href="https://wa.me/916305419750"
              target="_blank"
              className="btn-primary bg-green-700 hover:bg-green-800"
            >
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
