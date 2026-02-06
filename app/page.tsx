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
        <section id="about" className="px-6 py-24 bg-[#f6efe6]">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
    
    {/* About card */}
    <div className="bg-white border border-[#d6c2a3] rounded-2xl p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h2 className="text-3xl font-semibold mb-4 text-[#3b2417]">
        About Konaseema Foods
      </h2>

      <p className="opacity-80 mb-6 text-[#4a3b2f]">
        We craft authentic Konaseema sweets using traditional recipes
        and pure ingredients. Every batch is prepared hygienically and
        packed carefully to preserve freshness and taste.
      </p>

      <ul className="space-y-2 text-[#4a3b2f]">
        <li>✅ Traditional recipes</li>
        <li>✅ Quality ingredients</li>
        <li>✅ Fresh packing</li>
        <li>✅ Perfect for gifting</li>
      </ul>
    </div>

    {/* Shipping card */}
    <div className="bg-white border border-[#d6c2a3] rounded-2xl p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h2 className="text-3xl font-semibold mb-4 text-[#3b2417]">
        Shipping & Freshness
      </h2>

      <p className="opacity-80 mb-6 text-[#4a3b2f]">
        Orders are confirmed via WhatsApp. We pack sweets carefully
        for safe delivery. For best taste, store in a cool dry place
        and consume within the mentioned shelf life.
      </p>

      <div className="border border-[#d6c2a3] rounded-xl p-4 bg-[#faf6ef]">
        <p className="font-semibold text-[#3b2417]">
          Need bulk / gift orders?
        </p>
        <p className="text-[#4a3b2f]">
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
