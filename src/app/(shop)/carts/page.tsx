"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  decrementItem,
  incrementItem,
  removeFromCart,
} from "@/lib/store/slices/cartSlice";
import { ShoppingCart, Trash2 } from "lucide-react";
import React from "react";

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  console.log(cartItems);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      {cartItems.length === 0 ? (
        <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center text-center">
          <ShoppingCart className="h-16 w-16 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Your cart is empty
          </p>
        </div>
      ) : (
        <div className="grid flex-1 gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="grid gap-4">
              {cartItems.map((item) => (
                <Card
                  key={`${item.id}-${item.selectedSize ?? "default"}`}
                  className="flex flex-col gap-4 rounded-xl border px-4 py-4 transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-20 w-20 rounded-xl border object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                      {item.selectedSize ? (
                        <p className="text-xs text-muted-foreground">
                          Size: {item.selectedSize}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 sm:justify-start">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
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

                    <span className="min-w-6 text-center font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
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

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <p className="font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            id: item.id,
                            selectedSize: item.selectedSize,
                          }),
                        )
                      }
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="rounded-2xl p-5 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="my-3 border-t" />

              <div className="mb-4 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Button className="h-11 w-full rounded-xl text-base font-medium">
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
