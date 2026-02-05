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
  price: number;
  total_weight: string;
  is_combo: true;
  items: { name: string; weight: string }[];
};


function parseGViz(json: any) {
  const cols = json.table.cols.map((c: any) => c.label);
  return json.table.rows.map((r: any) => {
    const obj: any = {};
    r.c.forEach((cell: any, i: number) => {
      obj[cols[i]] = cell?.v ?? "";
    });
    return obj;
  });
}

export async function getCombosFromSheet(): Promise<ComboProduct[]> {
  const res = await fetch(COMBO_SHEET_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch combo sheet");
  }

  const text = await res.text();

  // Google wraps JSON in JS — extract it
  const json = JSON.parse(text.substring(47, text.length - 2));
  const rows = parseGViz(json);

  const comboMap: Record<string, ComboProduct> = {};

  for (const row of rows) {
    const comboId = row.combo_id;
    if (!comboId) continue;

    if (!comboMap[comboId]) {
      comboMap[comboId] = {
  id: comboId,
  name: row.combo_name,
  category: "Combos & Value Packs",
  image: row.image_url,
  price: Number(row.price ?? 0),
  total_weight: row.total_weight,
  is_combo: true,
  items: [],
};
    }

    comboMap[comboId].items.push({
      name: row.item_name,
      weight: row.item_weight,
    });
  }

  return Object.values(comboMap);
}
