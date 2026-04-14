// lib/api/searchService.ts

import { api } from "./apiservices";

type Images = {
  url: string;
  isPrimary: boolean;
};

export type SearchResult = {
  _id: string;
  name: string;
  images?: Images[];
  price?: number;
};

export const searchService = {
  search: async (query: string): Promise<SearchResult[]> => {
    const res = await api.get("/api/products/getAll", {
      params: { search: query },
    });

    return res.data.data;
  },
};
