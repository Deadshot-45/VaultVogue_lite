import { UIProduct } from "@/lib/query/useGetProducts";

const createMockProduct = (
  id: string,
  name: string,
  price: number,
  image: string,
  category: string,
  description: string,
  options: Partial<UIProduct> & { isSale?: boolean } = {}
): UIProduct & { isSale?: boolean } => {
  const sizes = [
    { variantId: `${id}-xs`, size: "XS", price, stock: 10 },
    { variantId: `${id}-s`, size: "S", price, stock: 15 },
    { variantId: `${id}-m`, size: "M", price, stock: 20 },
    { variantId: `${id}-l`, size: "L", price, stock: 8 },
    { variantId: `${id}-xl`, size: "XL", price, stock: 3 },
  ];

  const sizeQuantities = { XS: 10, S: 15, M: 20, L: 8, XL: 3 };
  const sizeToVariantMap = {
    XS: `${id}-xs`,
    S: `${id}-s`,
    M: `${id}-m`,
    L: `${id}-l`,
    XL: `${id}-xl`,
  };

  return {
    id,
    name,
    price,
    minPrice: price,
    maxPrice: price,
    availableSizes: ["XS", "S", "M", "L", "XL"],
    sizeQuantities,
    sizeToVariantMap,
    lowStockThreshold: 5,
    image,
    category,
    description,
    bestseller: options.bestseller ?? false,
    trending: options.trending ?? false,
    isNew: options.isNew ?? false,
    isSale: options.isSale ?? false,
    variants: [],
    sizes,
    createdAt: new Date().toISOString(),
    ...options,
  };
};

export const sampleMenProducts: UIProduct[] = [
  createMockProduct(
    "men-1",
    "Cashmere Crew Knit",
    245,
    "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=500&h=500&fit=crop",
    "Knitwear",
    "A remarkably soft cashmere sweater knitted in Scotland, styled with a classic crew neck and ribbed trim.",
    { isNew: true, bestseller: true }
  ),
  createMockProduct(
    "men-2",
    "Heritage Wool Coat",
    850,
    "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=500&h=500&fit=crop",
    "Outerwear",
    "Double-breasted trench coat tailored in durable virgin wool, designed to offer supreme insulation and a timeless silhouette.",
    { isSale: true, trending: true }
  ),
  createMockProduct(
    "men-3",
    "Tailored Linen Blazer",
    420,
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop",
    "Blazers",
    "A breathable linen jacket ideal for warm climates, cut in a modern regular fit with patch pockets."
  ),
  createMockProduct(
    "men-4",
    "Premium Cotton Oxford Shirt",
    110,
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&h=500&fit=crop",
    "Shirts",
    "Spun from long-staple cotton, this classic button-down Oxford features mother-of-pearl buttons and a neat buttoned collar.",
    { isNew: true }
  ),
  createMockProduct(
    "men-5",
    "Italian Leather Boots",
    380,
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=500&fit=crop",
    "Footwear",
    "Chelsea boots hand-assembled in Tuscany from full-grain calf leather. Mounted on sturdy, flexible crepe soles.",
    { bestseller: true }
  ),
  createMockProduct(
    "men-6",
    "Classic Slim-Fit Denim",
    160,
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop",
    "Denim",
    "Made with raw Japanese selvedge denim, these slim-cut jeans age uniquely with wear. Mid-rise with minimal details.",
    { isSale: true }
  ),
  createMockProduct(
    "men-7",
    "Suede Bomber Jacket",
    590,
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    "Outerwear",
    "Crafted from silky goatskin suede with a warm satin lining, rib-knit cuffs, and a polished silver zip pull.",
    { isNew: true, trending: true }
  ),
  createMockProduct(
    "men-8",
    "Silk-Blend Knit Polo",
    190,
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop",
    "Shirts",
    "An elegant summer polo knitted in a refined blend of organic cotton and silk, offering a light, breathable feel."
  ),
];

export const sampleWomenProducts: UIProduct[] = [
  createMockProduct(
    "women-1",
    "Silk Slip Dress",
    320,
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&h=500&fit=crop",
    "Dresses",
    "Cut on the bias for a beautiful drape, this silk slip dress features delicate spaghetti straps and a low V-back.",
    { isNew: true, bestseller: true }
  ),
  createMockProduct(
    "women-2",
    "Double-Breasted Trench Coat",
    680,
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop",
    "Outerwear",
    "A true wardrobe icon, tailored in cotton gabardine with traditional D-ring waist belt and storm flaps.",
    { isSale: true, trending: true }
  ),
  createMockProduct(
    "women-3",
    "Merino Wool Cardigan",
    195,
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=500&fit=crop",
    "Knitwear",
    "Knitted from extra-fine Merino wool, this button-down features an oversized fit and tortoiseshell details.",
    { isNew: true }
  ),
  createMockProduct(
    "women-4",
    "Tailored Wide-Leg Trousers",
    260,
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
    "Trousers",
    "Crafted from fluid wool crepe, styled with double front pleats and a high-rise waist for a long, elegant leg line."
  ),
  createMockProduct(
    "women-5",
    "Leather Saddle Bag",
    450,
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
    "Accessories",
    "A sleek, minimalist saddle silhouette cut from smooth box-calf leather with solid gold brass hardware.",
    { bestseller: true }
  ),
  createMockProduct(
    "women-6",
    "Ribbed Knit Midi Skirt",
    180,
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=500&fit=crop",
    "Skirts",
    "Spun with fine rib details, this high-waisted midi skirt stretches comfortably while holding its structured A-line shape.",
    { isSale: true }
  ),
  createMockProduct(
    "women-7",
    "Minimalist Slip-On Loafers",
    295,
    "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=500&h=500&fit=crop",
    "Footwear",
    "An effortless silhouette featuring ultra-soft leather uppers and flexible soles that adapt to daily wear."
  ),
  createMockProduct(
    "women-8",
    "Oversized Cashmere Scarf",
    135,
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=500&fit=crop",
    "Accessories",
    "A luxurious cashmere scarf made from long-staple fibers, finished with subtle raw-edge fringes.",
    { isNew: true, trending: true }
  ),
];

export const sampleKidsProducts: UIProduct[] = [
  createMockProduct(
    "kids-1",
    "Organic Cotton Romper",
    65,
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=500&fit=crop",
    "Baby",
    "An incredibly soft one-piece romper, spun from organic cotton with non-irritating snap closures.",
    { isNew: true, bestseller: true }
  ),
  createMockProduct(
    "kids-2",
    "Mini Cashmere Cardigan",
    120,
    "https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=500&h=500&fit=crop",
    "Knitwear",
    "Keep little ones cozy in pure, lightweight cashmere, detailed with smooth wood button fastenings.",
    { isSale: true, trending: true }
  ),
  createMockProduct(
    "kids-3",
    "Soft Linen Dungarees",
    85,
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&h=500&fit=crop",
    "Outfits",
    "A durable yet lightweight linen overall, equipped with adjustable strap lengths for growing kids.",
    { isNew: true }
  ),
  createMockProduct(
    "kids-4",
    "Little Leather Sneakers",
    95,
    "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=500&h=500&fit=crop",
    "Footwear",
    "Hand-finished leather sneakers with an elasticated fit, providing reliable ankle support and flexibility."
  ),
  createMockProduct(
    "kids-5",
    "Cozy Fleece Pullover",
    75,
    "https://images.unsplash.com/photo-1622295057244-7d220d357553?w=500&h=500&fit=crop",
    "Knitwear",
    "A warm plush fleece sweatshirt, detailed with clean contrast piping and a convenient half-zip collar.",
    { isSale: true }
  ),
  createMockProduct(
    "kids-6",
    "Classic Corduroy Trousers",
    80,
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=500&fit=crop",
    "Trousers",
    "An elastic-waist pant constructed from soft, durable corduroy cotton. Designed for comfort and high-energy play."
  ),
  createMockProduct(
    "kids-7",
    "Organic Cotton Pajama Set",
    70,
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&h=500&fit=crop",
    "Sleepwear",
    "Breathable two-piece pajama set styled with smooth seams to ensure a comfortable night's sleep.",
    { isNew: true }
  ),
  createMockProduct(
    "kids-8",
    "Quilted Winter Parka",
    145,
    "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=500&h=500&fit=crop",
    "Outerwear",
    "Insulated with a light, warm padding. Features a windproof hood and zipped pockets to protect against the chill."
  ),
];

export const allSampleProducts: UIProduct[] = [
  ...sampleMenProducts,
  ...sampleWomenProducts,
  ...sampleKidsProducts,
];
