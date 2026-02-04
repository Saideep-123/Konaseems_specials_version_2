export const SHEET_URL =
  "https://opensheet.elk.sh/1VfHHO5eN8xHn8MNtmFWdgAXv7SuIt1Bs71SITE7lc_I/Sheet1";

export type SheetProduct = {
  product_id: string;
  product_name: string;
  category: string;
  description?: string;

  price_250g_usd?: string | number;
  price_500g_usd?: string | number;
  price_1kg_usd?: string | number;

  out_of_stock?: string;
  is_live?: string;

  image_url: string;
};

export type ProductFromSheet = {
  id: string;
  name: string;
  category: string;
  desc?: string;
  image: string;
  out_of_stock: boolean;
  is_live: boolean;

  // ✅ prices by weight (USD)
  prices: {
    "250g"?: number;
    "500g"?: number;
    "1kg"?: number;
  };

  // default selected pack
  weight: "250g" | "500g" | "1kg";
  price: number;
};

const toBool = (v: any) => String(v).toLowerCase() === "true";
const toNum = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export async function getProductsFromSheet(): Promise<ProductFromSheet[]> {
  const res = await fetch(SHEET_URL, { cache: "no-store" });
  const rows: SheetProduct[] = await res.json();

  return rows.map((r) => {
    const prices = {
      "250g": toNum(r.price_250g_usd),
      "500g": toNum(r.price_500g_usd),
      "1kg": toNum(r.price_1kg_usd),
    };

    // ✅ choose first available as default
    const defaultWeight: ProductFromSheet["weight"] =
      prices["250g"] ? "250g" : prices["500g"] ? "500g" : "1kg";

    return {
      id: r.product_id,
      name: r.product_name,
      category: r.category,
      desc: r.description,
      image: r.image_url,
      out_of_stock: toBool(r.out_of_stock),
      is_live: toBool(r.is_live ?? "true"),

      prices,
      weight: defaultWeight,
      price: prices[defaultWeight] ?? 0,
    };
  });
}
