import { ApiService } from "./apiservices";

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface VariantImage {
  url: string;
  isPrimary: boolean;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  category?: string;

  description?: string;

  images: VariantImage[];

  // Pricing (derived from variants — min/max across all)
  minPrice: number;
  maxPrice: number;

  // Flags
  bestseller?: boolean;
  trending?: boolean;
  sellerId: string;

  /**
   * Full variant data — one document per size+color combination.
   * Each variant owns its own images, price, and stock.
   */
  variants?: {
    _id: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    compareAtPrice?: number;
    images: VariantImage[];
    isActive: boolean;
  }[];

  /**
   * Convenience flat list — same data as variants but indexed by variantId.
   * Used by size/color pickers and cart logic.
   */
  sizes: {
    variantId: string;
    size: string;
    color: string;
    price: number;
    stock: number;
    compareAtPrice?: number;
    images: VariantImage[];
  }[];

  categories?: Category[];

  createdAt: string;
}

interface ProductListResponse {
  data: Product[];
}

export const productService = {
  getDashboardProducts: async (options?: { signal?: AbortSignal }): Promise<any> => {
    const res = await ApiService.get<any>("/api/landing");
    return res.data;
  },

  getAllProducts: async (
    params = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
    } as {
      page: number;
      limit: number;
      sortBy: string;
      order: string;
      categoryId?: string;
      categoryName?: string;
      search?: string;
      isSale?: boolean;
      sellerId?: string;
      isActive?: string;
    },
    options?: { signal?: AbortSignal },
  ): Promise<Product[]> => {
    const data = await ApiService.get<ProductListResponse>(
      "/api/products/getAll",
      params,
    );
    return data?.data ?? [];
  },

  getProductById: async (id: string, options?: { signal?: AbortSignal }) => {
    return ApiService.get(`/api/products/getById/${id}`);
  },

  createProduct: async (payload: any): Promise<{ success: boolean }> => {
    return ApiService.post<{ success: boolean }>("/api/products/create", payload);
  },

  deleteProduct: async (id: string): Promise<{ success: boolean }> => {
    return ApiService.delete<{ success: boolean }>(`/api/products/${id}`);
  },

  updateProductStatus: async (id: string, isActive: boolean): Promise<{ success: boolean }> => {
    return ApiService.patch<{ success: boolean }>(`/api/products/${id}/status`, { isActive });
  },

  uploadImage: async (base64: string, fileName: string): Promise<{ success: boolean; url: string; message?: string }> => {
    return ApiService.post<{ success: boolean; url: string; message?: string }>("/api/products/upload", {
      image: base64,
      fileName,
    });
  },
};

