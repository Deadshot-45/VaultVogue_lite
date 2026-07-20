// 🔥 Single variant (leaf node)
export type ProductVariant = {
  _id: string;
  variantId: string;
  productId: string;
  sellerId: string;
  sku: string;

  attributes: {
    size: string;
  };

  price: number;
  compareAtPrice?: number;

  images: {
    url: string;
    isPrimary?: boolean;
    _id?: string;
  }[];

  stock: number;
  reserved: number;
  sold: number;
  availableStock: number;
  isOutOfStock: boolean;

  createdAt: string;
  updatedAt: string;
};

export type ProductDetail = {
  id: string;
  name: string;

  price: number;
  originalPrice?: number;

  sellerId: string;
  sellerName?: string;

  description: string;
  category: string;
  isNew: boolean;

  images: string[];

  availableSizes: string[];
  sizeQuantities: Record<string, number>;
  lowStockThreshold: number;

  variants: ProductVariant[];
};

export type ProductCard = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export type Variant = {
  variantId: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
};
