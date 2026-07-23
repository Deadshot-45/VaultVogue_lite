import { ApiService } from "./apiservices";

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
    const res = await ApiService.get<{ success: boolean; data: SearchResult[] }>("/api/products/getAll", {
      search: query,
    });

    return res.data;
  },

  getSuggestions: async (query: string): Promise<SuggestionsResponse> => {
    const res = await ApiService.get<{ success: boolean; data: SuggestionsResponse }>("/api/products/search-suggestions", {
      search: query,
    });

    return res.data;
  },
};
