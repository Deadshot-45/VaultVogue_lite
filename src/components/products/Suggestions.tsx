import React from "react";
import Link from "next/link";
import { ProductCard } from "@/utility/types/productVariant";

type SuggestionsProps = {
  items: ProductCard[];
};

export const Suggestions = React.memo(({ items }: SuggestionsProps) => {
  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold mb-4">You may also like</h2>

      <div className="flex gap-4 overflow-x-auto">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.id}`}>
            <div className="min-w-40 border rounded-xl p-2">
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
