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

        {/* ORIGINAL ABOUT SECTION */}
        <section id="about" className="px-6 py-24 bg-[#faf7f2]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-semibold mb-6">
                About Konaseema Specials
              </h2>
              <p className="text-lg opacity-80 leading-relaxed mb-4">
                We bring authentic homemade sweets and snacks from the
                heart of Konaseema, prepared using traditional recipes
                and pure ingredients.
              </p>
              <p className="text-lg opacity-80 leading-relaxed">
                Every item is freshly made, hygienically packed, and
                shipped with care to preserve taste and quality.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/combo_1.jpg"
                alt="Konaseema sweets"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ORIGINAL CONTACT SECTION */}
        <section id="contact" className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-6">
              Contact Us
            </h2>

            <p className="text-lg opacity-80 mb-8">
              For orders, bulk requests, or custom combos,
              contact us directly on WhatsApp.
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
