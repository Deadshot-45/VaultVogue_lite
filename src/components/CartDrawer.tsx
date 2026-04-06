/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// components/CartDrawer.tsx
import React from "react";
import { useCart } from "@/context/CreateContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

const CartDrawer: React.FC = () => {
  const {
    cartItems,
    increment,
    decrement,
    removeFromCart,
    cartOpen,
    setCartOpen,
  } = useCart();

  const subtotal = cartItems.reduce(
    (acc: any, item: any) => acc + item.price * item.quantity,
    0,
  );

  return (
    <>
      <Button variant="secondary" onClick={() => setCartOpen(true)}>
        Cart ({cartItems.length})
      </Button>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogPortal>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <DialogContent className="fixed right-0 top-0 h-full w-96 bg-background shadow-lg p-6 z-50 overflow-y-auto transform transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-6 text-secondary-foreground">
              Your Cart
            </h2>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-secondary-foreground/70 text-center mb-4">
                  Your cart is empty!
                </p>
                <img
                  src="/images/empty-cart.png"
                  alt="Empty Cart"
                  className="w-40 h-40 animate-bounce"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-foreground">
                        {item.name}
                      </h3>
                      <p className="text-secondary-foreground/70">
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" onClick={() => decrement(item.id)}>
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button size="sm" onClick={() => increment(item.id)}>
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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
