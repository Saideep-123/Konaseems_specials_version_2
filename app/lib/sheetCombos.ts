export const COMBO_SHEET_URL =
  "REPLACE_WITH_COMBO_SHEET_JSON_URL"; 

export type ComboItem = {
  name: string;
  weight: string;
};

export type ComboProduct = {
  id: string;
  name: string;
  category: "Combos";
  image: string;
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
        category: "Combos",
        image: row.image_url,
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
