"use client";

import { Button } from "@/components/ui/button";
import HeroSection from "./HeroSection";
import { ArrowRight, Truck, Shield, RefreshCw, Star } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description?: string;
  images: { url: string; isPrimary: boolean }[];
  minPrice: number;
  maxPrice: number;
  bestseller?: boolean;
  trending?: boolean;
  variants?: {
    _id: string;
    productId: string;
    sellerId: string;
    sku: string;
    attributes: { size: string };
    price: number;
    images: string[];
    isActive: boolean;
  }[];
  sizes: { variantId: string; size: string; price: number; stock: number }[];
  createdAt: string;
}

interface HomeProps {
  readonly recentProducts?: Product[];
}

const HomeData = [
  {
    label: "Men",
    src: `${process.env.NEXT_PUBLIC_API_URL}/p_img2.png`,
    href: "/men",
  },
  {
    label: "Women",
    src: `${process.env.NEXT_PUBLIC_API_URL}/p_img1.png`,
    href: "/women",
  },
  {
    label: "Kids",
    src: `${process.env.NEXT_PUBLIC_API_URL}/p_img3.png`,
    href: "/kids",
  },
  {
    label: "Sale",
    src: `${process.env.NEXT_PUBLIC_API_URL}/p_img4.png`,
    href: "/sale",
  },
];

const trustSignals = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders over $99",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "100% protected checkout",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "30-day return window",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "Handpicked fashion",
  },
];

const sectionEntrance: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function Home({ recentProducts = [] }: HomeProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <HeroSection />

      <main className="mx-auto w-full space-y-0 px-4 sm:px-6 lg:px-8">

        {/* ─── SHOP BY CATEGORY ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionEntrance}
          className="py-20"
        >
          {/* Editorial heading */}
          <div className="mb-12">
            <p className="section-label">Collections</p>
            <div className="gold-divider" />
            <h2 className="mt-5 font-cormorant text-4xl font-light text-foreground lg:text-5xl">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {HomeData.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.src})` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                  <span className="font-cormorant text-xl font-medium text-white lg:text-2xl">
                    {item.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ─── NEW ARRIVALS ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionEntrance}
          className="pb-20"
        >
          <div className="mb-12">
            <p className="section-label">Just In</p>
            <div className="gold-divider" />
            <h2 className="mt-5 font-cormorant text-4xl font-light text-foreground lg:text-5xl">
              New Arrivals
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {recentProducts.length > 0
              ? recentProducts.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => router.push(`/products/${product._id}`)}
                    className="group cursor-pointer text-left"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border/30 transition-shadow duration-300 group-hover:shadow-md">
                      <Image
                        src={
                          product.images.find((img) => img.isPrimary)?.url ||
                          product.images[0]?.url ||
                          ""
                        }
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium line-clamp-1 text-foreground">
                        {product.name}
                      </p>
                      {typeof product.minPrice === "number" ? (
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--gold)" }}
                        >
                          ${product.minPrice}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Price coming soon
                        </p>
                      )}
                    </div>
                  </button>
                ))
              : Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i + 1}
                    className="animate-pulse"
                  >
                    <div className="aspect-[3/4] rounded-xl bg-muted/40" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-muted/40" />
                      <div className="h-3 w-1/2 rounded bg-muted/40" />
                    </div>
                  </div>
                ))}
          </div>
        </motion.section>

        {/* ─── PROMOTIONAL BANNER ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionEntrance}
          className="pb-20"
        >
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-14 lg:py-20"
            style={{ background: "var(--gold)" }}
          >
            <div className="relative z-10 max-w-lg">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
                Limited Offer
              </p>
              <h3 className="mt-3 font-cormorant text-4xl font-light text-white lg:text-5xl">
                Flat 30% Off
              </h3>
              <p className="mt-3 text-base text-white/75 leading-relaxed">
                On selected summer collections. Style meets comfort at prices
                you&apos;ll love.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="mt-8 rounded-full px-8 shadow-lg transition-all duration-200 active:scale-95"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Decorative circle — single, intentional */}
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/8 blur-2xl" />
          </div>
        </motion.section>

        {/* ─── TRUST SIGNALS ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionEntrance}
          className="pb-20"
        >
          <div className="gold-divider-full mb-10" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {trustSignals.map((signal) => (
              <div
                key={signal.title}
                className="flex flex-col items-center gap-3 py-4 text-center"
              >
                <signal.icon
                  className="h-6 w-6"
                  style={{ color: "var(--gold)" }}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {signal.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {signal.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="gold-divider-full mt-10" />
        </motion.section>
      </main>
    </div>
  );
}
