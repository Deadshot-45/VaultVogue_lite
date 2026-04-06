"use client";

import { createContext, useContext } from "react";
import type { CartContextType } from "./cart-types";

export const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
