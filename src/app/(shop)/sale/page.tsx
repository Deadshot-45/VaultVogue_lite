"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1999,
    original: 3999,
    image: "https://images.unsplash.com/photo-1518444028785-8f1c1d8d9b33",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2499,
    original: 4999,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
  },
  {
    id: 3,
    name: "Sneakers",
    price: 1499,
    original: 2999,
    image: "https://images.unsplash.com/photo-1528701800489-20be3c3c9b5c",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* HERO */}
      <section className="relative overflow-hidden py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-red-500 text-white px-4 py-1">
            Mega Sale 🔥
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Up to <span className="text-red-500">70% OFF</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Grab the best deals before they are gone.
          </p>

          <Button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-lg rounded-xl">
            Shop Now
          </Button>
        </motion.div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />

                  <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                    <Flame className="w-4 h-4 mr-1" /> Hot Deal
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-red-500">
                      ₹{product.price}
                    </span>
                    <span className="line-through text-gray-400">
                      ₹{product.original}
                    </span>
                  </div>

                  <Button className="w-full mt-4 rounded-xl">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-6 md:mx-12 mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-500 text-white rounded-3xl p-10 text-center"
        >
          <h2 className="text-3xl font-bold">Limited Time Offer</h2>
          <p className="mt-2 text-red-100">
            Hurry up! Sale ends soon. Don’t miss out.
          </p>

          <Button className="mt-6 bg-white text-red-500 hover:bg-gray-100 px-6 py-3 rounded-xl">
            Explore Deals
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
