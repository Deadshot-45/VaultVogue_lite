import { api } from "./apiservices";

export interface Product {
  _id: string;
  name: string;

  description?: string;

  images: {
    url: string;
    isPrimary: boolean;
  }[];

  // Pricing
  minPrice: number;
  maxPrice: number;

  // Flags
  bestseller?: boolean;
  trending?: boolean;
  sellerId: string; // Variants (detailed level - optional for UI)
  variants?: {
    _id: string;
    productId: string;
    sellerId: string;
    sku: string;
    stock: string;
    attributes: {
      size: string;
    };
    price: number;
    images: string[];
    isActive: boolean;
  }[];

  // Sizes (UI friendly)
  sizes: {
    variantId: string;
    size: string;
    price: number;
    stock: number;
  }[];

  createdAt: string;
}

interface ProductListResponse {
  data: Product[];
}

export const productService = {
  getDashboardProducts: async () => {
    const response = await api.get("/api/landing");
    return response.data.data;
  },

  getAllProducts: async (
    params = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
      categoryId: "67dfa578452634da4759bbb2",
    } as {
      page: number;
      limit: number;
      sortBy: string;
      order: string;
      categoryId: string;
    },
  ): Promise<Product[]> => {
    const response = await api.get<ProductListResponse>(
      "/api/products/getAll",
      { params },
    );
    console.log(response);
    return response.data?.data ?? [];
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/api/products/getById/${id}`);
    console.log(response);
    return response.data;
  },
};
