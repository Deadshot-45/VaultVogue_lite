"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useCart } from "@/context/CreateContext";
import { UIProduct } from "@/lib/query/useGetProducts";
import { Info, Minus, Plus } from "lucide-react";

const ProductCard = ({
  product,
  onQuickView,
}: {
  product: UIProduct;
  onQuickView?: (p: UIProduct) => void;
}) => {
  const {
    cartItems,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    setCartOpen,
  } = useCart();

  const productId = product.id;
  const cartItem = cartItems.find((item) => item.id === productId);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addToCart({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setCartOpen(true);
  };

  const handleIncrement = () => {
    increment(productId);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeFromCart(productId);
      return;
    }

    decrement(productId);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition py-0">
      <CardHeader className="p-0 relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-64 w-full object-cover group-hover:scale-105 transition"
        />

        {product.isNew && <Badge className="absolute top-2 left-2">New</Badge>}

        {onQuickView && (
          <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 bg-black/10 transition">
            <Button
              type="button"
              size="sm"
              onClick={() => onQuickView(product)}
            >
              <Info className="w-4 h-4 mr-1" />
              Quick View
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <p className="text-lg font-bold mt-2">${product.price}</p>
      </CardContent>

      <CardFooter className="p-4">
        {quantity > 0 ? (
          <div className="flex w-full items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="flex-1 rounded-md border bg-muted/40 px-3 py-2 text-center font-medium">
              {quantity}
            </div>

            <Button
              type="button"
              size="icon"
              className="shrink-0"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button type="button" className="w-full" onClick={handleAdd}>
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
