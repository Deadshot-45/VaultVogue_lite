"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  useAddToCart,
  useCart,
  useDecrementFromCart,
  useRemoveFromCart,
} from "@/lib/query/useCart";
import { getAuthCookie } from "@/lib/auth";
import { useCartQueue } from "@/hooks/useCartQueue";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='24'%3ENo image%3C/text%3E%3C/svg%3E";

const CartDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);

  const token = getAuthCookie();
  const isAuthenticated = !!token;

  const router = useRouter();

  const { data: cartItems = [] } = useCart(isAuthenticated);
  const addToCart = useAddToCart();
  const decrement = useDecrementFromCart();
  const { mutate: remove } = useRemoveFromCart();

  const { add: queueAdd } = useCartQueue((actions) => {
    actions.forEach(({ variantId, delta }) => {
      if (delta > 0) {
        addToCart.mutate({ variantId, quantity: delta });
      } else if (delta < 0) {
        const abs = Math.abs(delta);

        for (let i = 0; i < abs; i++) {
          decrement.mutate(variantId);
        }
      }
    });
  });

  // 🔥 totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const image = useMemo(() => {
    return cartItems[0]?.image || FALLBACK_IMAGE;
  }, [cartItems]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="group relative">
          <ShoppingBag className="h-5 w-5" />

          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center rounded-full bg-ring/20 text-[10px] text-foreground"
              >
                {cartItems.length}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg px-4">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Your Cart ({cartItems.length})</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pb-4">
          {/* 🔒 AUTH */}
          {!isAuthenticated ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-4">
              <h3 className="text-lg font-semibold">Login Required</h3>

              <Button
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
              >
                Login
              </Button>
            </div>
          ) : cartItems.length === 0 ? (
            /* 🛒 EMPTY */
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-4">
              <h3>Your cart is empty</h3>

              <Button onClick={() => setOpen(false)}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              {/* 🧾 ITEMS */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.variantId}
                      className="flex gap-4 p-4 border rounded-xl"
                    >
                      <div className="relative h-16 w-16">
                        <Image
                          src={image}
                          alt={item?.name ?? "Product image"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.name}</p>

                        <p>₹{item.price}</p>

                        {item.size && (
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size}
                          </p>
                        )}
                      </div>

                      {/* 🔥 CONTROLS */}
                      <div className="flex flex-col items-end gap-2">
                        {/* remove */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(item?.variantId ?? "")}
                        >
                          <X />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => queueAdd(item?.variantId ?? "", +1)}
                          >
                            <Minus />
                          </Button>

                          <span>{item.quantity}</span>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => queueAdd(item?.variantId ?? "", -1)}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* 💰 SUMMARY */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <Button className="w-full">Checkout</Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
