import type { VariantProduct, VariantSize } from "../types/variant";

const SIZE_ORDER: readonly VariantSize[] = ["XS", "S", "M", "L", "XL"];

function measurements(
  chest: readonly string[],
  length: readonly string[],
  weight: readonly string[],
): VariantProduct["measurements"] {
  return Object.fromEntries(
    SIZE_ORDER.map((size, index) => [
      size,
      { size, chest: chest[index], length: length[index], weight: weight[index] },
    ]),
  ) as VariantProduct["measurements"];
}

function stock(values: readonly number[]): Record<VariantSize, number> {
  return Object.fromEntries(
    SIZE_ORDER.map((size, index) => [size, values[index]]),
  ) as Record<VariantSize, number>;
}

export const VARIANT_PRODUCTS: VariantProduct[] = [
  {
    id: "vvl-01",
    slug: "aero-structure-trench",
    code: "VVL-01",
    name: "Aero-Structure Trench",
    category: "Outerwear",
    price: 1480,
    leadTime: "Ships in 24h",
    fabric: "3L bonded nylon · 28,000mm",
    description:
      "A three-layer Japanese bonded storm shell, cut with articulated gussets and archival hardware.",
    measurements: measurements(
      ["36 in", "38 in", "40 in", "42 in", "44 in"],
      ["44 in", "45 in", "46 in", "47 in", "48 in"],
      ["610g", "640g", "670g", "705g", "740g"],
    ),
    colors: [
      {
        id: "red",
        name: "Crimson Red",
        code: "RED",
        hex: "#DC2626",
        pantone: "PMS 18-1662 TCX",
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 7, 12, 4, 0]),
      },
      {
        id: "obsidian",
        name: "Obsidian Black",
        code: "BLK",
        hex: "#18181B",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([2, 5, 8, 3, 1]),
      },
      {
        id: "alabaster",
        name: "Alabaster Bone",
        code: "ALB",
        hex: "#D6D3CD",
        pantone: "PMS 11-0602 TCX",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([4, 6, 9, 2, 1]),
      },
      {
        id: "cobalt",
        name: "Klein Cobalt",
        code: "BLU",
        hex: "#2563EB",
        pantone: "PMS 19-4052 TCX",
        image:
          "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([1, 4, 7, 3, 0]),
      },
    ],
  },
  {
    id: "vvl-02",
    slug: "monolith-technical-blazer",
    code: "VVL-02",
    name: "Monolith Technical Blazer",
    category: "Tailoring",
    price: 1120,
    leadTime: "Atelier stock",
    fabric: "Schoeller dryskin · 4-way stretch",
    description:
      "A modular technical blazer with a laser-cut raw-edge lapel and considered internal construction.",
    measurements: measurements(
      ["36 in", "38 in", "40 in", "42 in", "44 in"],
      ["28.5 in", "29.5 in", "30.5 in", "31.5 in", "32.5 in"],
      ["480g", "510g", "540g", "575g", "610g"],
    ),
    colors: [
      {
        id: "red",
        name: "Crimson Red",
        code: "RED",
        hex: "#DC2626",
        pantone: "PMS 18-1662 TCX",
        image:
          "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([5, 9, 6, 2, 4]),
      },
      {
        id: "obsidian",
        name: "Obsidian Black",
        code: "BLK",
        hex: "#18181B",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 8, 5, 2, 1]),
      },
      {
        id: "cobalt",
        name: "Klein Cobalt",
        code: "BLU",
        hex: "#2563EB",
        pantone: "PMS 19-4052 TCX",
        image:
          "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([2, 4, 6, 3, 1]),
      },
    ],
  },
  {
    id: "vvl-03",
    slug: "kinetic-cargo-parachute",
    code: "VVL-03",
    name: "Kinetic Cargo Parachute",
    category: "Trousers",
    price: 790,
    leadTime: "Ships in 24h",
    fabric: "Cordura ballistic · ripstop",
    description:
      "A technical trouser with articulated knees, ankle drawcords and modular storage.",
    measurements: measurements(
      ["28 in waist", "30 in waist", "32 in waist", "34 in waist", "36 in waist"],
      ["41 in", "42 in", "43 in", "44 in", "45 in"],
      ["520g", "545g", "575g", "600g", "630g"],
    ),
    colors: [
      {
        id: "red",
        name: "Crimson Red",
        code: "RED",
        hex: "#DC2626",
        pantone: "PMS 18-1662 TCX",
        image:
          "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([8, 4, 11, 5, 2]),
      },
      {
        id: "olive",
        name: "Acid Olive",
        code: "OLV",
        hex: "#65A30D",
        pantone: "PMS 17-0535 TCX",
        image:
          "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 6, 8, 2, 1]),
      },
      {
        id: "obsidian",
        name: "Obsidian Black",
        code: "BLK",
        hex: "#18181B",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([4, 7, 6, 3, 1]),
      },
    ],
  },
  {
    id: "vvl-04",
    slug: "vortex-knit-balaclava-hoodie",
    code: "VVL-04",
    name: "Vortex Knit Balaclava Hoodie",
    category: "Knitwear",
    price: 640,
    leadTime: "Limited archive",
    fabric: "620gsm loopback · Japan",
    description:
      "A heavyweight combed-cotton knit with a contoured balaclava collar and ribbed finish.",
    measurements: measurements(
      ["40 in", "42 in", "44 in", "46 in", "48 in"],
      ["25.5 in", "26.5 in", "27.5 in", "28.5 in", "29.5 in"],
      ["780g", "820g", "860g", "910g", "950g"],
    ),
    colors: [
      {
        id: "red",
        name: "Crimson Red",
        code: "RED",
        hex: "#DC2626",
        pantone: "PMS 18-1662 TCX",
        image:
          "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([2, 6, 5, 3, 1]),
      },
      {
        id: "alabaster",
        name: "Alabaster Bone",
        code: "ALB",
        hex: "#D6D3CD",
        pantone: "PMS 11-0602 TCX",
        image:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 8, 7, 5, 2]),
      },
      {
        id: "obsidian",
        name: "Obsidian Black",
        code: "BLK",
        hex: "#18181B",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([1, 7, 4, 3, 2]),
      },
    ],
  },
];

export function getVariantProduct(slugOrId: string): VariantProduct | undefined {
  return VARIANT_PRODUCTS.find(
    (product) => product.slug === slugOrId || product.id === slugOrId,
  );
}
