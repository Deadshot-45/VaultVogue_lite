import { getAuthCookie } from "../auth";
import { ApiService } from "./apiservices";

export interface CartProduct {
  _id?: string;
  name?: string;
  price?: number;
  images?: { url: string; isPrimary?: boolean }[];
}

export interface InventorySizeItem {
  _id: string;
  size: string;
  quantity: number;
  updatedAt: string;
}

export interface InventoryDetails {
  _id: string;
  productId: string;
  items: InventorySizeItem[];
}

export interface CartItem {
  _id?: string;
  id?: string;
  productId: string;
  name?: string;
  image?: string;
  sellerId?: string;
  sellerName?: string;
  size?: string;
  quantity: number;
  price?: number;
  priceSnapshot?: number;
  inventoryId?: InventoryDetails;
  product?: CartProduct;
  variantId?: string;
}

export interface CartResponse {
  success?: boolean;
  message?: string;
  code: string;
  data?: CartItem[];
  cart?:
    | CartItem[]
    | {
        _id?: string;
        items?: CartItem[];
        totalAmount?: number;
        totalItems?: number;
      };
}

export const getCartResponseItems = (
  cart: CartResponse["cart"],
): CartItem[] | undefined => {
  if (Array.isArray(cart)) {
    return cart;
  }

  return cart?.items;
};

export interface AddToCartPayload {
  quantity: number;
  variantId?: string;
}

export interface UpdateCartPayload {
  variantId: string;
  quantity: number;
}

export const cartService = {
  getCartDetails: async (): Promise<CartResponse> => {
    const token = getAuthCookie();
    if (!token) return { success: false, code: "UNAUTHORIZED", data: [] };
    return ApiService.get<CartResponse>("/api/cartController/getCart");
  },

  addToCart: async (payload: AddToCartPayload): Promise<CartResponse> => {
    return ApiService.post<CartResponse>(
      "/api/cartController/addToCart",
      payload,
      {
        Authorization: `Bearer ${getAuthCookie()}`,
      },
    );
  },

  decrementFromCart: async (
    payload: UpdateCartPayload,
  ): Promise<CartResponse> => {
    return ApiService.post<CartResponse>(
      "/api/cartController/decrementFromCart",
      payload,
    );
  },

  removeCartItem: async (variantId: string): Promise<CartResponse> => {
    return ApiService.post<CartResponse>(
      "/api/cartController/removeFromCart",
      { variantId },
    );
  },

  clearCart: async (): Promise<CartResponse> => {
    return ApiService.delete<CartResponse>(
      "/api/cartController/clearCart",
    );
  },
};
