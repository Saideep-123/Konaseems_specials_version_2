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

  const special = products[0];

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

        {/* ===== ORIGINAL ABOUT + SHIPPING CARDS ===== */}
        <section id="about" className="px-6 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* About card */}
            <div className="rounded-2xl border border-[#d9c7a6] bg-[#f8f3ea] p-8 shadow-sm">
              <h2 className="text-3xl font-semibold mb-4">
                About Konaseema Foods
              </h2>

              <p className="opacity-80 mb-6">
                We craft authentic Konaseema sweets using traditional recipes
                and pure ingredients. Every batch is prepared hygienically and
                packed carefully to preserve freshness and taste.
              </p>

              <ul className="space-y-2 opacity-90">
                <li>✅ Traditional recipes</li>
                <li>✅ Quality ingredients</li>
                <li>✅ Fresh packing</li>
                <li>✅ Perfect for gifting</li>
              </ul>
            </div>

            {/* Shipping card */}
            <div className="rounded-2xl border border-[#d9c7a6] bg-[#f8f3ea] p-8 shadow-sm">
              <h2 className="text-3xl font-semibold mb-4">
                Shipping & Freshness
              </h2>

              <p className="opacity-80 mb-6">
                Orders are confirmed via WhatsApp. We pack sweets carefully for
                safe delivery. For best taste, store in a cool dry place and
                consume within the mentioned shelf life.
              </p>

              <div className="rounded-xl border border-[#d9c7a6] p-4">
                <p className="font-semibold">
                  Need bulk / gift orders?
                </p>
                <p className="opacity-80">
                  Message us on WhatsApp for custom combo boxes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER CONTACT AREA ===== */}
        <footer id="contact" className="bg-[#efe7db] px-6 py-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Konaseema Foods
              </h3>
              <p className="opacity-80">
                Authentic traditional sweets & snacks.
                Freshly prepared and packed.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="opacity-80">
                Email: konaseemafoods@example.com
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Policies</h4>
              <p className="opacity-80">Return & Refund Policy</p>
              <p className="opacity-80">Delivery Policy</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Quick Order</h4>
              <p className="opacity-80 mb-3">
                Order instantly via WhatsApp.
              </p>
              <a
                href="https://wa.me/916305419750"
                target="_blank"
                className="btn-primary bg-green-700 hover:bg-green-800"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
