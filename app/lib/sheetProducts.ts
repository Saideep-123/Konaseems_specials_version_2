export const SHEET_URL = "https://opensheet.elk.sh/1VfHHO5eN8xHn8MNtmFWdgAXv7SuIt1Bs71SITE7lc_I/Sheet1";

export type SheetProduct = {
  product_id: string;
  product_name: string;
  category: string;
  description?: string;
  weight_lb: number;
  price_usd: number;
  out_of_stock?: string;
  image_url: string;
};

export async function getProductsFromSheet(): Promise<any[]> {
  const res = await fetch(SHEET_URL, { cache: "no-store" });
  const rows: SheetProduct[] = await res.json();

  return rows.map(r => ({
    id: r.product_id,
    name: r.product_name,
    category: r.category,
    desc: r.description,
    weight: `${r.weight_lb} lb`,
    price: Number(r.price_usd),
    out_of_stock: String(r.out_of_stock).toLowerCase() === "true",
    image: r.image_url,
  }));
}
