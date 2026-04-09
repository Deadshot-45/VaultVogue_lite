import { api } from "./apiservices";

export interface Product {
  _id: string;
  name: string;
  price: number;
  sellerId?: string;
  inventoryId?: {
    _id: string;
    productId: string;
    items: {
      _id: string;
      size: string;
      quantity: number;
      updatedAt: string;
    }[];
  };
  images: { url: string; isPrimary: boolean }[];
  categoryIds?: string[];
}

interface ProductListResponse {
  data: Product[];
}

export const productService = {
  getDashboardProducts: async () => {
    const response = await api.get("/api/products/dashboard");
    return response.data;
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
    return response.data?.data ?? [];
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
};
