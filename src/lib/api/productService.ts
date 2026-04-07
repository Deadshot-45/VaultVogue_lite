import type { AxiosResponse } from "axios";
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

export const productService = {
  getDashboardProducts: async (): Promise<AxiosResponse> => {
    const response = await api.get("/api/products/dashboard");
    return response;
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
  ): Promise<AxiosResponse> => {
    const response = await api.get("/api/products/getAll", { params });
    return response;
  },

  getProductById: async (id: string): Promise<AxiosResponse> => {
    const response = await api.get(`/api/products/${id}`);
    return response;
  },
};
