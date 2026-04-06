"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UIProduct } from "@/lib/query/useGetProducts";
import { useCart } from "@/context/CreateContext";

const ProductModal = ({
  product,
  onClose,
}: {
  product: UIProduct | null;
  onClose: () => void;
}) => {
  const { addToCart, setCartOpen } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setCartOpen(true);
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full md:w-1/2 h-80 object-cover rounded"
          />

          <div>
            <p className="text-muted-foreground">{product.category}</p>
            <p className="text-xl font-bold mt-2">${product.price}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleAdd}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
