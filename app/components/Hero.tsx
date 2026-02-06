"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="home" className="relative pt-20 pb-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-gold font-semibold tracking-wide mb-3">
            Traditional • Hygienic • Fresh
          </p>

          <h1 className="text-5xl md:text-6xl leading-[1.05] mb-6">
            Authentic <span className="text-gold">Konaseema</span> Sweets
          </h1>

          <p className="text-lg opacity-80 mb-8 max-w-xl">
            Classic recipes from Konaseema — made with pure ingredients and
            packed carefully for delivery.
          </p>

          <div className="flex flex-wrap gap-4">
            <a className="btn-primary" href="#products">
              Shop Products
            </a>
            <a
              className="btn-primary bg-green-700 hover:bg-green-800"
              href="https://wa.me/916305419750"
              target="_blank"
            >
              Order on WhatsApp
            </a>
          </div>

          <div className="mt-10 flex gap-6 opacity-80">
            <div>
              <div className="text-2xl font-bold">Fresh</div>
              <div className="text-sm">Packed Daily</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Pan-India</div>
              <div className="text-sm">Shipping</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Premium</div>
              <div className="text-sm">Gift Boxes</div>
            </div>
          </div>
        </motion.div>

        <motion.img
          src="/images/combo_1.jpg"
          alt="Konaseema Combo"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl shadow-lg"
        />
      </div>
    </section>
  );
}
