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
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: VariantProduct,
    color: VariantColor,
    size: VariantSize,
    quantity?: number,
  ) => boolean;
  setCartQuantity: (variantKey: string, quantity: number) => void;
  removeFromCart: (variantKey: string) => void;
  wishlist: VariantProduct[];
  wishlistCount: number;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (product: VariantProduct) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
}

const CART_STORAGE_KEY = "vault-vogue-variant-cart";
const WISHLIST_STORAGE_KEY = "vault-vogue-variant-wishlist";
const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<VariantProduct[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
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

    const savedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        const parsedWishlist: unknown = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) setWishlist(parsedWishlist as VariantProduct[]);
      } catch (error) {
        console.error("Unable to restore wishlist", error);
        window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openWishlist = useCallback(() => setWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setWishlistOpen(false), []);

  const addToCart = useCallback(
    (
      product: VariantProduct,
      color: VariantColor,
      size: VariantSize,
      quantity = 1,
    ) => {
      const maxStock = color.stockBySize[size];
      const variantKey = buildSku(product, color, size);
      if (maxStock < 1 || quantity < 1) return false;
      const existingItem = cart.find((item) => item.variantKey === variantKey);
      if (existingItem && existingItem.quantity >= maxStock) return false;

      const qtyToAdd = Math.max(1, quantity);

      setCart((items) => {
        const existing = items.find((item) => item.variantKey === variantKey);
        if (existing) {
          const updatedQty = Math.min(existing.quantity + qtyToAdd, maxStock);
          return items.map((item) =>
            item.variantKey === variantKey ? { ...item, quantity: updatedQty } : item,
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
            quantity: Math.min(qtyToAdd, maxStock),
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

  const toggleWishlist = useCallback((product: VariantProduct) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((item) => item.id === productId),
    [wishlist],
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((current) => current.filter((item) => item.id !== productId));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0),
      cartOpen,
      setCartOpen,
      openCart,
      closeCart,
      addToCart,
      setCartQuantity,
      removeFromCart,
      wishlist,
      wishlistCount: wishlist.length,
      wishlistOpen,
      setWishlistOpen,
      openWishlist,
      closeWishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
    }),
    [
      addToCart,
      cart,
      cartOpen,
      closeCart,
      closeWishlist,
      isInWishlist,
      openCart,
      openWishlist,
      removeFromCart,
      removeFromWishlist,
      setCartOpen,
      setCartQuantity,
      setWishlistOpen,
      theme,
      toggleTheme,
      toggleWishlist,
      wishlist,
      wishlistOpen,
    ],
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
