import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/lib/api/cartServices";

export interface CartListItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  sellerId?: string;
  sellerName?: string;
  priceSnapshot?: number;
  inventoryId?: string;
  availableSizes?: string[];
}

export interface CartItemIdentity {
  id: string;
  selectedSize?: string;
}

interface CartState {
  items: CartListItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const normalizeCartItems = (items?: CartItem[]): CartListItem[] =>
  (items ?? []).map((item) => ({
    id: item.id ?? item.product?._id ?? item.productId,
    name: item.name ?? item.product?.name ?? "Product",
    price: item.price ?? item.product?.price ?? item.priceSnapshot ?? 0,
    image:
      item.image ??
      item.product?.images?.find((image) => image.isPrimary)?.url ??
      item.product?.images?.[0]?.url ??
      "/images/placeholder.png",
    quantity: item.quantity,
    selectedSize: item.size,
    sellerId: item.sellerId,
    sellerName: item.sellerName,
    priceSnapshot: item.priceSnapshot,
    inventoryId: item.inventoryId?._id,
    availableSizes:
      item.inventoryId?.items?.map((inventoryItem) => inventoryItem.size) ?? [],
  }));

const isSameCartItem = (
  item: CartListItem,
  target: Pick<CartListItem, "id" | "selectedSize">,
) => item.id === target.id && item.selectedSize === target.selectedSize;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartListItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Omit<CartListItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) => isSameCartItem(item, action.payload),
      );

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({ ...action.payload, quantity: 1 });
    },
    incrementItem: (state, action: PayloadAction<CartItemIdentity>) => {
      const item = state.items.find((entry) => isSameCartItem(entry, action.payload));
      if (item) {
        item.quantity += 1;
      }
    },
    decrementItem: (state, action: PayloadAction<CartItemIdentity>) => {
      const item = state.items.find((entry) => isSameCartItem(entry, action.payload));
      if (!item) {
        return;
      }

      if (item.quantity <= 1) {
        state.items = state.items.filter(
          (entry) => !isSameCartItem(entry, action.payload),
        );
        return;
      }

      item.quantity -= 1;
    },
    removeFromCart: (state, action: PayloadAction<CartItemIdentity>) => {
      state.items = state.items.filter(
        (item) => !isSameCartItem(item, action.payload),
      );
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    clearCartState: (state) => {
      state.items = [];
      state.isOpen = false;
    },
  },
});

export const {
  setCartItems,
  addToCart,
  incrementItem,
  decrementItem,
  removeFromCart,
  setCartOpen,
  clearCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
