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
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-24 text-center">
        {/* Editorial Heading */}
        <div className="mx-auto max-w-4xl px-4">
          <p className="section-label inline-block">The Sale Edit</p>
          <div className="gold-divider mx-auto mt-4" />
          <h1 className="mt-8 font-cormorant text-5xl font-light tracking-tight text-foreground md:text-7xl">
            Seasonal picks with <br />
            <span style={{ color: "var(--gold)" }}>member-exclusive</span> pricing
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Explore a curated selection of archival pieces and seasonal favorites, 
            offering restrained luxury at an exceptional value for our members.
          </p>
          <button
            className="mt-10 rounded-full px-10 py-3 text-sm font-medium text-white transition-all hover:shadow-lg active:scale-95"
            style={{ background: "var(--gold)" }}
          >
            Explore the Collection
          </button>
        </div>

        {/* Decorative background orb */}
        <div 
          className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-10"
          style={{ background: "var(--gold)" }}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted/20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4">
                  <Badge 
                    className="rounded-full border-none px-3 py-1 text-[10px] font-medium tracking-wider text-white shadow-sm"
                    style={{ background: "var(--gold)" }}
                  >
                    SALE
                  </Badge>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="font-cormorant text-xl font-light text-foreground group-hover:underline underline-offset-4">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium" style={{ color: "var(--gold)" }}>
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-muted-foreground line-through opacity-60">
                    ₹{product.original}
                  </span>
                </div>
                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border/40 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-[2.5rem] p-12 text-center text-white sm:p-20"
          style={{ background: "var(--gold)" }}
        >
          <div className="relative z-10">
            <h2 className="font-cormorant text-4xl font-light sm:text-5xl">Refresh Your Wardrobe</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 opacity-90 sm:text-base">
              Build your next look with marked-down essentials from across our 
              collections before the selection rotates.
            </p>
            <button className="mt-10 rounded-full bg-white px-10 py-3 text-sm font-medium text-black transition-transform active:scale-95">
              Explore All Offers
            </button>
          </div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        </div>
      </section>
    </div>
  );
}
