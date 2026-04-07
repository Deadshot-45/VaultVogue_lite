"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  decrementItem,
  incrementItem,
  removeFromCart,
  setCartOpen,
} from "@/lib/store/slices/cartSlice";
import { Trash2 } from "lucide-react";

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartOpen = useAppSelector((state) => state.cart.isOpen);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <>
      <Button variant="secondary" onClick={() => dispatch(setCartOpen(true))}>
        Cart ({cartItems.length})
      </Button>

      <Dialog
        open={cartOpen}
        onOpenChange={(open) => dispatch(setCartOpen(open))}
      >
        <DialogPortal>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-40"
            onClick={() => dispatch(setCartOpen(false))}
          />

          <DialogContent className="fixed right-0 top-0 z-50 h-full w-96 overflow-y-auto bg-background p-6 shadow-lg transition-transform duration-300">
            <h2 className="mb-6 text-2xl font-bold text-secondary-foreground">
              Your Cart
            </h2>

            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <p className="mb-4 text-center text-secondary-foreground/70">
                  Your cart is empty!
                </p>
                <img
                  src="/images/empty-cart.png"
                  alt="Empty Cart"
                  className="h-40 w-40 animate-bounce"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize ?? "default"}`}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-foreground">
                        {item.name}
                      </h3>
                      <p className="text-secondary-foreground/70">
                        ${item.price}
                      </p>
                      {item.selectedSize ? (
                        <p className="text-xs text-secondary-foreground/60">
                          Size: {item.selectedSize}
                        </p>
                      ) : null}
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            dispatch(
                              decrementItem({
                                id: item.id,
                                selectedSize: item.selectedSize,
                              }),
                            )
                          }
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          onClick={() =>
                            dispatch(
                              incrementItem({
                                id: item.id,
                                selectedSize: item.selectedSize,
                              }),
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            id: item.id,
                            selectedSize: item.selectedSize,
                          }),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="mt-6 flex flex-col gap-2">
                  <p className="text-xl font-bold text-secondary-foreground">
                    Subtotal: ${subtotal.toFixed(2)}
                  </p>
                  <Button size="lg">Proceed to Checkout</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default CartDrawer;
