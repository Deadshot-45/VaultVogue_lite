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

export type SuggestionItem = {
  type: "category" | "keyword";
  text: string;
  id?: string;
};

export type SuggestionsResponse = {
  suggestions: SuggestionItem[];
  products: SearchResult[];
};

export const searchService = {
  search: async (query: string): Promise<SearchResult[]> => {
    const res = await api.get("/api/products/getAll", {
      params: { search: query },
    });

    return res.data.data;
  },

  getSuggestions: async (query: string): Promise<SuggestionsResponse> => {
    const res = await api.get("/api/products/search-suggestions", {
      params: { search: query },
    });

    return res.data.data;
  },
};
