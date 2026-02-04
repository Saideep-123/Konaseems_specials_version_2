import "./globals.css";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes" });

export const metadata = {
  title: "Konaseema Foods | Authentic Traditional Sweets",
  description: "Traditional Konaseema sweets made with pure ingredients",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${greatVibes.variable}`}>
      <body>
<div className='w-full bg-black text-white text-sm overflow-hidden whitespace-nowrap'>
  <div className='animate-marquee inline-block px-4'>🚚 Free Shipping · 🌿 100% Handmade · ⭐ 4.8 Rated · 🎁 Combo Deals</div>
</div>
 className="bg-cream text-brown">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
