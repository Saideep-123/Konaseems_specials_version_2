export const SHEET_URL =
  "https://opensheet.elk.sh/1VfHHO5eN8xHn8MNtmFWdgAXv7SuIt1Bs71SITE7lc_I/Sheet1";

/**
 * Google Sheet columns (recommended):
 * product_id, product_name, category, description, weight, price_usd, out_of_stock, image_url, is_live
 *
 * Notes:
 * - opensheet returns everything as strings mostly, so we parse safely.
 * - is_live must be "TRUE" to show product on website.
 */
export type SheetProduct = {
  product_id: string;
  product_name: string;
  category: string;
  description?: string;
  weight: string; // ex: "250g", "1L", "Assorted"
  price_usd: string | number;
  out_of_stock?: string | boolean;
  image_url: string;
  is_live?: string | boolean;
};

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1";
}

function toUSD(v: unknown): number {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

export async function getProductsFromSheet(): Promise<any[]> {
  const res = await fetch(SHEET_URL, { cache: "no-store" });
  if (!res.ok) {
    console.error("Sheet fetch failed:", res.status, res.statusText);
    return [];
  }

  const rows: SheetProduct[] = await res.json();

  // Show ONLY products marked live
  const liveRows = rows.filter((r) => toBool((r as any).is_live));

  return liveRows.map((r) => ({
    id: String(r.product_id || "").trim(),
    name: String(r.product_name || "").trim(),
    category: String(r.category || "").trim(),
    desc: (r.description ?? "").toString(),
    weight: String((r as any).weight || "").trim(), // keep your original pack labels
    price: toUSD(r.price_usd), // UI expects number
    out_of_stock: toBool(r.out_of_stock),
    image: String(r.image_url || "").trim(),
  }));
}
