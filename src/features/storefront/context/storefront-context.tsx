"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { buildSku } from "../lib/variant-utils";
import { getVariantProduct } from "../data/catalog";
import type { CartItem, VariantColor, VariantProduct, VariantSize } from "../types/variant";
import { useTheme, type VaultTheme } from "@/components/theme-context";

interface StorefrontContextValue {
  theme: VaultTheme;
  toggleTheme: () => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: (
    product: VariantProduct,
    color: VariantColor,
    size: VariantSize,
  ) => boolean;
  setCartQuantity: (variantKey: string, quantity: number) => void;
  removeFromCart: (variantKey: string) => void;
}

const CART_STORAGE_KEY = "vault-vogue-variant-cart";
const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed: unknown = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed as CartItem[]);
      } catch (error) {
        console.error("Unable to restore the storefront cart", error);
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = useCallback(
    (product: VariantProduct, color: VariantColor, size: VariantSize) => {
      const maxStock = color.stockBySize[size];
      const variantKey = buildSku(product, color, size);
      if (maxStock < 1) return false;
      const existingItem = cart.find((item) => item.variantKey === variantKey);
      if (existingItem && existingItem.quantity >= maxStock) return false;

      setCart((items) => {
        const existing = items.find((item) => item.variantKey === variantKey);
        if (existing && existing.quantity >= maxStock) return items;
        if (existing) {
          return items.map((item) =>
            item.variantKey === variantKey
              ? { ...item, quantity: Math.min(item.quantity + 1, maxStock) }
              : item,
          );
        }

        return [
          ...items,
          {
            variantKey,
            productSlug: product.slug,
            productName: product.name,
            sku: variantKey,
            colorId: color.id,
            colorName: color.name,
            colorHex: color.hex,
            size,
            price: product.price,
            image: color.image,
            quantity: 1,
          },
        ];
      });
      return true;
    },
    [cart],
  );

  const setCartQuantity = useCallback((variantKey: string, quantity: number) => {
    setCart((items) =>
      quantity <= 0
        ? items.filter((item) => item.variantKey !== variantKey)
        : items.map((item) => {
            if (item.variantKey !== variantKey) return item;
            const product = getVariantProduct(item.productSlug);
            const color = product?.colors.find((option) => option.id === item.colorId);
            const maxStock = color?.stockBySize[item.size] ?? 0;
            return { ...item, quantity: Math.min(quantity, maxStock) };
          }),
    );
  }, []);

  const removeFromCart = useCallback((variantKey: string) => {
    setCart((items) => items.filter((item) => item.variantKey !== variantKey));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0),
      addToCart,
      setCartQuantity,
      removeFromCart,
    }),
    [addToCart, cart, removeFromCart, setCartQuantity, theme, toggleTheme],
  );

  return (
    <StorefrontContext.Provider value={value}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }
  return context;
}
