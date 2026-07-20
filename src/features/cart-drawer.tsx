"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, X, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useAddToCart,
  useCart,
  useDecrementFromCart,
  useRemoveFromCart,
} from "@/lib/queries/useCart";
import { getAuthCookie } from "@/lib/auth";
import { useCartQueue } from "@/hooks/useCartQueue";
import { toast } from "sonner";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

export const CART_DRAWER_OPEN_EVENT = "vault-vogue:open-cart-drawer";

export function openCartDrawer() {
  window.dispatchEvent(new Event(CART_DRAWER_OPEN_EVENT));
}

const CartDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const handleOpen = () => setOpen(true);
    window.addEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);

    return () => {
      window.removeEventListener(CART_DRAWER_OPEN_EVENT, handleOpen);
    };
  }, []);

  const token = getAuthCookie();
  const isAuthenticated = mounted && !!token;

  const { data: cartItems = [] } = useCart(isAuthenticated);
  const addToCart = useAddToCart();
  const decrement = useDecrementFromCart();
  const { mutate: remove } = useRemoveFromCart();

  const { add: queueAdd } = useCartQueue((actions) => {
    actions.forEach(({ variantId, delta }) => {
      if (delta > 0) {
        addToCart.mutate({ variantId, quantity: delta });
      } else if (delta < 0) {
        for (let i = 0; i < Math.abs(delta); i++) {
          decrement.mutate(variantId);
        }
      }
    });
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group relative text-muted-foreground hover:text-foreground"
          aria-label="Open shopping bag"
        >
          <ShoppingBag className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />

          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] font-semibold text-white"
              >
                {cartItems.length}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-hidden border-[var(--gold-faint)] bg-[var(--background)] p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-[var(--gold-faint)] px-6 py-5 text-left">
          <p className="section-label">Your Atelier Bag</p>
          <SheetTitle className="font-cormorant text-3xl font-light text-[var(--brand-text)]">
            Shopping Bag ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {!isAuthenticated ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 py-20 text-center">
              <ShoppingBag className="h-12 w-12 text-[var(--gold)]" />
              <div>
                <h3 className="font-cormorant text-3xl font-light text-[var(--brand-text)]">
                  Maison Authentication Required
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Please sign in to view, alter, and manage your current
                  shopping bag.
                </p>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
                className="btn-primary"
              >
                Sign In to Shop
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 py-20 text-center">
              <ShoppingBag className="h-12 w-12 text-[var(--gold)]" />
              <div>
                <h3 className="font-cormorant text-3xl font-light text-[var(--brand-text)]">
                  Your Atelier Bag is Empty
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Explore the latest seasonal drops and select refined pieces
                  to begin your order.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="btn-primary">
                Continue Browsing
              </button>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      exit={{ opacity: 0, y: -16 }}
                      className="flex gap-4 rounded-2xl border border-border/40 bg-card/45 p-4 backdrop-blur-md"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-border/30 bg-muted">
                        <Image
                          src={item.image || FALLBACK_IMAGE}
                          alt={item.name || "Product image"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-medium uppercase tracking-widest text-[var(--gold)]">
                          Atelier Series
                        </span>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-[var(--brand-text)]">
                          {item.name}
                        </p>
                        {item.size && (
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                            Selected Size:{" "}
                            <span className="font-bold text-[var(--gold)]">
                              {item.size}
                            </span>
                          </p>
                        )}
                        <p className="mt-3 text-sm font-bold text-[var(--gold)]">
                          Rs. {(item.price ?? 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end justify-between">
                        <button
                          onClick={() => remove(item.variantId || "")}
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                          title="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-1 rounded-full border border-border/40 bg-background/50 p-1">
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                            onClick={() => queueAdd(item.variantId || "", -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="w-7 text-center text-xs font-semibold text-[var(--brand-text)]">
                            {item.quantity}
                          </span>

                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                            onClick={() => queueAdd(item.variantId || "", 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="border-t border-[var(--gold-faint)] bg-card/45 p-5 backdrop-blur-md">
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Bag Subtotal</span>
                    <span className="font-medium text-[var(--brand-text)]">
                      Rs. {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Premium Shipping</span>
                    <span className="font-medium text-[var(--brand-text)]">
                      {shipping === 0 ? "Complimentary" : `Rs. ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Maison Tax (8%)</span>
                    <span className="font-medium text-[var(--brand-text)]">
                      Rs. {tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/10 pt-3 text-sm font-semibold text-[var(--brand-text)]">
                    <span>Total Order Value</span>
                    <span className="font-bold text-[var(--gold)]">
                      Rs. {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-primary mt-5 w-full py-4 text-xs font-semibold uppercase tracking-wider"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
