import type { VariantProduct, VariantSize } from "../types/variant";
import { CATEGORY_CONFIGS } from "@/data/categories";

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
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([2, 5, 8, 3, 1]),
      },
      {
        id: "rosegold",
        name: "Rose Gold Edition",
        code: "RSG",
        hex: "#B76E79",
        pantone: "PMS 15-1614 TCX",
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 7, 12, 4, 0]),
      },
      {
        id: "alabaster",
        name: "Warm Ivory",
        code: "IVR",
        hex: "#F8F4F1",
        pantone: "PMS 11-0602 TCX",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([4, 6, 9, 2, 1]),
      },
      {
        id: "cobalt",
        name: "Electric Cobalt",
        code: "BLU",
        hex: "#2457FF",
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
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 8, 5, 2, 1]),
      },
      {
        id: "cobalt",
        name: "Electric Cobalt",
        code: "BLU",
        hex: "#2457FF",
        pantone: "PMS 19-4052 TCX",
        image:
          "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([2, 4, 6, 3, 1]),
      },
      {
        id: "rosegold",
        name: "Rose Gold Accent",
        code: "RSG",
        hex: "#B76E79",
        pantone: "PMS 15-1614 TCX",
        image:
          "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([5, 9, 6, 2, 4]),
      },
    ],
  },
  {
    id: "vvl-03",
    slug: "kinetic-cargo-parachute",
    code: "VVL-03",
    name: "Kinetic Cargo Parachute",
    category: "Tailored Trousers",
    price: 790,
    leadTime: "Ships in 24h",
    fabric: "Cordura ballistic · ripstop",
    description:
      "A technical trouser with articulated knees, ankle drawcords and modular magnetic pocketing.",
    measurements: measurements(
      ["28 in waist", "30 in waist", "32 in waist", "34 in waist", "36 in waist"],
      ["41 in", "42 in", "43 in", "44 in", "45 in"],
      ["520g", "545g", "575g", "600g", "630g"],
    ),
    colors: [
      {
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([4, 7, 6, 3, 1]),
      },
      {
        id: "rosegold",
        name: "Rose Tint",
        code: "RSG",
        hex: "#B76E79",
        pantone: "PMS 15-1614 TCX",
        image:
          "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([8, 4, 11, 5, 2]),
      },
      {
        id: "cobalt",
        name: "Electric Cobalt",
        code: "BLU",
        hex: "#2457FF",
        pantone: "PMS 19-4052 TCX",
        image:
          "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 6, 8, 2, 1]),
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
      "A heavyweight combed-cotton knit with a contoured balaclava collar and raw-hem finish.",
    measurements: measurements(
      ["40 in", "42 in", "44 in", "46 in", "48 in"],
      ["25.5 in", "26.5 in", "27.5 in", "28.5 in", "29.5 in"],
      ["780g", "820g", "860g", "910g", "950g"],
    ),
    colors: [
      {
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([1, 7, 4, 3, 2]),
      },
      {
        id: "alabaster",
        name: "Warm Ivory",
        code: "IVR",
        hex: "#F8F4F1",
        pantone: "PMS 11-0602 TCX",
        image:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 8, 7, 5, 2]),
      },
      {
        id: "rosegold",
        name: "Rose Gold",
        code: "RSG",
        hex: "#B76E79",
        pantone: "PMS 15-1614 TCX",
        image:
          "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([2, 6, 5, 3, 1]),
      },
    ],
  },
  {
    id: "vvl-05",
    slug: "architectural-oversized-tee",
    code: "VVL-05",
    name: "Architectural Oversized Tee",
    category: "Oversized Tees",
    price: 490,
    leadTime: "Ships in 24h",
    fabric: "340gsm combed Egyptian cotton",
    description:
      "A drop-shoulder boxy tee with high neck ribbing and tonal blind-stitched micro branding.",
    measurements: measurements(
      ["42 in", "44 in", "46 in", "48 in", "50 in"],
      ["27 in", "28 in", "29 in", "30 in", "31 in"],
      ["380g", "400g", "420g", "450g", "480g"],
    ),
    colors: [
      {
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([5, 10, 15, 8, 4]),
      },
      {
        id: "alabaster",
        name: "Warm Ivory",
        code: "IVR",
        hex: "#F8F4F1",
        pantone: "PMS 11-0602 TCX",
        image:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([6, 12, 14, 6, 3]),
      },
      {
        id: "rosegold",
        name: "Rose Dust",
        code: "RSG",
        hex: "#B76E79",
        pantone: "PMS 15-1614 TCX",
        image:
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([4, 8, 10, 5, 2]),
      },
    ],
  },
  {
    id: "vvl-06",
    slug: "tailored-fluid-pleat-trouser",
    code: "VVL-06",
    name: "Tailored Fluid Pleat Trouser",
    category: "Tailored Trousers",
    price: 890,
    leadTime: "Atelier stock",
    fabric: "High-twist tropical wool & silk",
    description:
      "A wide-leg double-pleated tailored trouser with internal waistband tab and cascading drape.",
    measurements: measurements(
      ["28 in waist", "30 in waist", "32 in waist", "34 in waist", "36 in waist"],
      ["42 in", "43 in", "44 in", "45 in", "46 in"],
      ["460g", "490g", "520g", "550g", "580g"],
    ),
    colors: [
      {
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([3, 7, 9, 4, 1]),
      },
      {
        id: "cobalt",
        name: "Electric Cobalt",
        code: "BLU",
        hex: "#2457FF",
        pantone: "PMS 19-4052 TCX",
        image:
          "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([2, 4, 7, 3, 0]),
      },
    ],
  },
  {
    id: "vvl-07",
    slug: "tactile-shearling-bomber",
    code: "VVL-07",
    name: "Tactile Shearling Bomber",
    category: "Outerwear",
    price: 1890,
    leadTime: "Limited Edition · 50 Pieces",
    fabric: "Italian lamb shearling & waxed lambskin",
    description:
      "An oversized aviation bomber with heavy nickel zips, buckled storm collar, and plush interior.",
    measurements: measurements(
      ["38 in", "40 in", "42 in", "44 in", "46 in"],
      ["26 in", "27 in", "28 in", "29 in", "30 in"],
      ["1100g", "1180g", "1250g", "1320g", "1400g"],
    ),
    colors: [
      {
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([1, 4, 5, 2, 0]),
      },
      {
        id: "rosegold",
        name: "Rose Tint Fur",
        code: "RSG",
        hex: "#B76E79",
        pantone: "PMS 15-1614 TCX",
        image:
          "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([1, 3, 4, 1, 0]),
      },
    ],
  },
  {
    id: "vvl-08",
    slug: "modular-leather-holster-bag",
    code: "VVL-08",
    name: "Modular Holster Bag",
    category: "Accessories",
    price: 440,
    leadTime: "Ships in 24h",
    fabric: "Full-grain calfskin · Gunmetal steel",
    description:
      "An ergonomic crossbody harness with detachable magnetic card case and phone pod.",
    measurements: measurements(
      ["One Size", "One Size", "One Size", "One Size", "One Size"],
      ["12 in", "12 in", "12 in", "12 in", "12 in"],
      ["320g", "320g", "320g", "320g", "320g"],
    ),
    colors: [
      {
        id: "obsidian",
        name: "Midnight Black",
        code: "BLK",
        hex: "#080B12",
        pantone: "PMS 19-4005 TCX",
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([10, 10, 10, 10, 10]),
      },
      {
        id: "cobalt",
        name: "Electric Cobalt",
        code: "BLU",
        hex: "#2457FF",
        pantone: "PMS 19-4052 TCX",
        image:
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
        stockBySize: stock([5, 5, 5, 5, 5]),
      },
    ],
  },
];

export function getVariantProduct(slugOrId: string): VariantProduct | undefined {
  const direct = VARIANT_PRODUCTS.find(
    (product) => product.slug === slugOrId || product.id === slugOrId,
  );
  if (direct) return direct;

  for (const config of Object.values(CATEGORY_CONFIGS)) {
    const found = config.products.find(
      (p) => p.slug === slugOrId || p.id === slugOrId,
    );
    if (found) return found;
  }
  return undefined;
}
