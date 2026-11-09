export const VARIANT_SIZES = ["XS", "S", "M", "L", "XL"] as const;

export type VariantSize = (typeof VARIANT_SIZES)[number] | string;

export interface SizeMeasurement {
  size: VariantSize;
  chest: string;
  length: string;
  weight: string;
}

export interface VariantColor {
  id: string;
  name: string;
  code: string;
  hex: string;
  pantone: string;
  image: string;
  stockBySize: Record<string, number>;
}

export interface VariantProduct {
  id: string;
  slug: string;
  code: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  leadTime: string;
  fabric: string;
  description: string;
  measurements: Record<string, SizeMeasurement>;
  colors: VariantColor[];
  gallery?: string[];
  rating?: number;
  reviewsCount?: number;
  highlights?: string[];
  careInstructions?: string[];
  composition?: string;
  variants?: {
    id?: string;
    sku?: string;
    size?: string;
    color?: string;
    price?: number;
    compareAtPrice?: number;
    images?: { url: string; isPrimary: boolean }[];
    isActive?: boolean;
    stock?: number;
  }[];
  availableSizes?: string[];
}

export interface CartItem {
  variantKey: string;
  productSlug: string;
  productName: string;
  sku: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  size: VariantSize;
  price: number;
  image: string;
  quantity: number;
}
