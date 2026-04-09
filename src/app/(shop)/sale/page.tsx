"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "City Layer Bomber Jacket",
    price: 2299,
    original: 3499,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234",
  },
  {
    id: 2,
    name: "Weekend Flow Co-ord Set",
    price: 1899,
    original: 2799,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
  {
    id: 3,
    name: "Street Pace Everyday Sneakers",
    price: 1599,
    original: 2499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
];

export default function Page() {
  return (
    <div className="sale-theme min-h-screen bg-linear-to-b from-sale-red-50 to-white">
      <section className="relative overflow-hidden py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 sale-primary px-4 py-1">
            Vault Vogue Sale Edit
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Seasonal picks with{" "}
            <span className="sale-text">member-favorite pricing</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Explore discounted jackets, sneakers, and everyday statement pieces
            picked for the current Vault Vogue collection.
          </p>

          <Button className="mt-6 rounded-xl sale-primary px-6 py-3 text-lg">
            Browse Sale Styles
          </Button>
        </motion.div>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-lg transition hover:shadow-xl">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover"
                  />

                  <Badge className="absolute left-3 top-3 sale-primary">
                    <Flame className="mr-1 h-4 w-4" /> Trending Drop
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-bold text-sale-red-500">
                      Rs. {product.price}
                    </span>
                    <span className="text-gray-400 line-through">
                      Rs. {product.original}
                    </span>
                  </div>

                  <Button className="mt-4 w-full rounded-xl">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add Sale Item
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-6 mb-16 md:mx-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-sale-red-500 p-10 text-center text-white dark:bg-sale-red-200"
        >
          <h2 className="text-3xl font-bold">Refresh Your Wardrobe</h2>
          <p className="mt-2 text-sale-red-100">
            Build your next look with marked-down essentials from men, women,
            and kids collections before the edit rotates.
          </p>

          <Button className="mt-6 rounded-xl bg-white px-6 py-3 text-sale-red-500 hover:bg-gray-100">
            Explore the Full Sale
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
