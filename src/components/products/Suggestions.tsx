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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.id}`} className="block">
            <div className="h-full flex flex-col border border-ring/40 rounded-xl overflow-hidden">
              <img src={item.image} alt={item.name} className="rounded-t-xl object-cover aspect-square" />
              <p className="p-4 flex-1">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
