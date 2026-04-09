"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  decrementItem,
  incrementItem,
  removeFromCart,
  setCartOpen,
} from "@/lib/store/slices/cartSlice";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartOpen = useAppSelector((state) => state.cart.isOpen);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const router = useRouter();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <Sheet open={cartOpen} onOpenChange={(open) => dispatch(setCartOpen(open))}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group relative text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ShoppingBag className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground shadow-sm"
              >
                {cartItems.length}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg bg-background/95 backdrop-blur-xl border-l shadow-2xl px-4">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pb-4">
          {!isAuthenticated ? (
            <motion.div
              className="flex flex-col items-center justify-center flex-1 text-center space-y-4 py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted/50 text-3xl">
                🔒
              </div>

              <h3 className="text-lg font-semibold">Login Required</h3>

              <p className="text-sm text-muted-foreground max-w-xs">
                Please sign in to view your cart and continue shopping.
              </p>

              <Button
                className="mt-4"
                onClick={() => {
                  dispatch(setCartOpen(false));
                  router.push("/login?redirect=/carts");
                }}
              >
                Login
              </Button>
            </motion.div>
          ) : cartItems.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center flex-1 text-center space-y-4 py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 flex items-center justify-center rounded-full bg-muted/50 text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🛒
              </motion.div>
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Add some amazing products to get started!
              </p>
              <Button
                onClick={() => dispatch(setCartOpen(false))}
                className="mt-4"
              >
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize ?? "default"}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <motion.div
                        className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold mt-1">
                          ₹{item.price}
                        </p>
                        {item.selectedSize && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  id: item.id,
                                  selectedSize: item.selectedSize,
                                }),
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </motion.div>

                        <div className="flex items-center gap-1">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() =>
                                dispatch(
                                  decrementItem({
                                    id: item.id,
                                    selectedSize: item.selectedSize,
                                  }),
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </motion.div>

                          <span className="w-8 text-center font-medium text-sm">
                            {item.quantity}
                          </span>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() =>
                                dispatch(
                                  incrementItem({
                                    id: item.id,
                                    selectedSize: item.selectedSize,
                                  }),
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div
                className="border-t pt-4 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {subtotal < 999 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(999 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                    >
                      Proceed to Checkout
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => dispatch(setCartOpen(false))}
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
