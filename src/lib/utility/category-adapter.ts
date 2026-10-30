import type { UIProduct } from "@/lib/queries/useGetProducts";
import type {
  VariantProduct,
  VariantSize,
  SizeMeasurement,
  VariantColor,
} from "@/features/storefront/types/variant";
import { classifySubcategory, resolveUiProductImage } from "@/lib/utility/utils";

const SIZE_ORDER: readonly VariantSize[] = ["XS", "S", "M", "L", "XL"];

const COLOR_HEX_MAP: Record<string, string> = {
  black: "#080B12",
  obsidian: "#080B12",
  white: "#FFFFFF",
  ivory: "#F8F4F1",
  cream: "#F8F4F1",
  bone: "#F8F4F1",
  blue: "#2457FF",
  cobalt: "#2457FF",
  electric: "#2457FF",
  navy: "#0E1C36",
  rose: "#B76E79",
  rosegold: "#B76E79",
  gold: "#B76E79",
  pink: "#E8A598",
  red: "#B22222",
  grey: "#555555",
  gray: "#555555",
  charcoal: "#1D2330",
  slate: "#1D2330",
  green: "#2E5A36",
  olive: "#555246",
  khaki: "#555246",
  beige: "#D8C7B5",
  tan: "#D8C7B5",
  brown: "#4A3525",
  espresso: "#3D2B1F",
};

function getHexForColorName(colorName: string, defaultHex: string): string {
  if (!colorName) return defaultHex;
  const lower = colorName.toLowerCase().replace(/\s+/g, "");
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return defaultHex;
}

/**
 * Transforms a raw API/UIProduct from the MongoDB/Express backend
 * into a typed VariantProduct suitable for the luxury storefront.
 */
export function mapApiProductToVariantProduct(apiProduct: UIProduct): VariantProduct {
  const sizeQuantities = apiProduct.sizeQuantities || {};

  // Build stock by size
  const stockBySize: Record<VariantSize, number> = {
    XS: sizeQuantities["XS"] ?? (apiProduct.availableSizes?.includes("XS") ? 10 : 0),
    S: sizeQuantities["S"] ?? (apiProduct.availableSizes?.includes("S") ? 10 : 0),
    M: sizeQuantities["M"] ?? (apiProduct.availableSizes?.includes("M") ? 10 : 0),
    L: sizeQuantities["L"] ?? (apiProduct.availableSizes?.includes("L") ? 10 : 0),
    XL: sizeQuantities["XL"] ?? (apiProduct.availableSizes?.includes("XL") ? 10 : 0),
  };

  // Primary image
  const primaryImg = resolveUiProductImage(apiProduct.image);

  // Alternate image candidates from variants or additional images
  const allVariantImages = apiProduct.variants?.flatMap((v) => v.images || []) || [];
  const secondaryImgCandidate = allVariantImages.find((img) => !img.isPrimary && img.url)?.url;
  const altImg = secondaryImgCandidate
    ? resolveUiProductImage(secondaryImgCandidate)
    : apiProduct.variants?.[1]?.images?.[0]?.url
    ? resolveUiProductImage(apiProduct.variants[1].images[0].url)
    : primaryImg;

  // Extract distinct colors from variants or availableColors
  const colors: VariantColor[] = [];
  const validColors = (apiProduct.availableColors || []).filter(
    (c) => typeof c === "string" && c.trim().length > 0,
  );

  if (validColors.length > 0) {
    validColors.forEach((colorName, idx) => {
      const variantWithColor = apiProduct.variants?.find(
        (v) => v.color?.toLowerCase() === colorName.toLowerCase(),
      );
      const colorImgUrl = variantWithColor?.images?.[0]?.url;
      const colorImg = colorImgUrl ? resolveUiProductImage(colorImgUrl) : primaryImg;
      const defaultHex = idx === 0 ? "#080B12" : idx === 1 ? "#B76E79" : "#2457FF";
      const hex = getHexForColorName(colorName, defaultHex);

      colors.push({
        id: colorName.toLowerCase().replace(/\s+/g, "-") || `col-${idx}`,
        name: colorName,
        code: colorName.slice(0, 3).toUpperCase(),
        hex,
        pantone: "Standard",
        image: colorImg,
        stockBySize,
      });
    });
  } else {
    colors.push({
      id: "default",
      name: "Standard",
      code: "STD",
      hex: "#080B12",
      pantone: "Standard",
      image: primaryImg,
      stockBySize,
    });
  }

  // Classify subcategory for intelligent navigation filtering
  const classifiedCategory = classifySubcategory(
    apiProduct.name,
    apiProduct.category || "Apparel",
  );

  // Measurements table for size guide
  const measurements: Record<VariantSize, SizeMeasurement> = Object.fromEntries(
    SIZE_ORDER.map((size, index) => [
      size,
      {
        size,
        chest: `${36 + index * 2} in`,
        length: `${27 + index} in`,
        weight: `${380 + index * 30}g`,
      },
    ]),
  ) as Record<VariantSize, SizeMeasurement>;

  const code =
    apiProduct.variants?.[0]?.sku ||
    `VV-${(apiProduct.id || "").slice(-6).toUpperCase()}`;

  const price = apiProduct.price || apiProduct.minPrice || 0;
  const originalPrice =
    apiProduct.maxPrice && apiProduct.maxPrice > price
      ? apiProduct.maxPrice
      : undefined;

  const rawGallery = [
    primaryImg,
    ...(altImg !== primaryImg ? [altImg] : []),
    ...allVariantImages.map((img: { url: string }) => resolveUiProductImage(img.url)),
  ];
  const gallery = Array.from(new Set(rawGallery.filter(Boolean) as string[]));

  return {
    id: apiProduct.id,
    slug: apiProduct.id,
    code,
    name: apiProduct.name,
    category: classifiedCategory,
    price,
    originalPrice,
    leadTime: apiProduct.trending
      ? "Trending"
      : apiProduct.bestseller
      ? "Bestseller"
      : "In Stock",
    fabric: apiProduct.description
      ? apiProduct.description.slice(0, 60)
      : "Standard Fabric",
    description: apiProduct.description || "",
    measurements,
    colors,
    gallery: gallery.length > 0 ? gallery : [primaryImg],
    highlights: [],
    careInstructions: [],
    composition: "",
  };
}
