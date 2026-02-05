export const COMBO_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1VfHHO5eN8xHn8MNtmFWdgAXv7SuIt1Bs71SITE7lc_I/gviz/tq?tqx=out:json&sheet=combo";

export type ComboItem = {
  name: string;
  weight: string;
};

export type ComboProduct = {
  id: string;
  name: string;
  category: "Combos & Value Packs";
  image: string;

  // ✅ NEW FIELDS
  price: number;
  total_weight: string;

  // combo flags
  is_combo: true;

  items: ComboItem[];
};

export async function getCombosFromSheet(): Promise<ComboProduct[]> {
  const res = await fetch(COMBO_SHEET_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch combo sheet");
  }

  const rows = await res.json();

  const comboMap: Record<string, ComboProduct> = {};

  for (const row of rows) {
    const comboId = row.combo_id;

    if (!comboMap[comboId]) {
      comboMap[comboId] = {
        id: comboId,
        name: row.combo_name,
        category: "Combos & Value Packs",
        image: row.image_url,

        // ✅ important
        price: Number(row.price ?? 0),
        total_weight: row.total_weight ?? "",

        is_combo: true,
        items: [],
      };
    }

    comboMap[comboId].items.push({
      name: row.item_name,
      weight: row.weight,
    });
  }

  return Object.values(comboMap);
}

}
