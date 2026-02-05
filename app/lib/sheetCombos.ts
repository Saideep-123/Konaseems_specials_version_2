export const COMBO_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1VfHHO5eN8xHn8MNtmFWdgAXv7SuIt1Bs71SITE7lc_I/gviz/tq?tqx=out:json&sheet=combo";

export type ComboItem = {
  name: string;
  weight: string;
};

export type ComboProduct = {
  id: string;
  name: string;
  category: "Combos";
  image: string;

  // REQUIRED for quick view
  is_combo: true;

  // used in product grid
  price: number;
  weight: string;

  items: ComboItem[];
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
        category: "Combos",
        image: row.combo_image,

        is_combo: true,

        price: Number(row.combo_price ?? 0),
        weight: "Combo",

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
