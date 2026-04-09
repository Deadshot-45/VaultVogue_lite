"use client";

import { images } from "@/assets/data/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import HeroSection from "./HeroSection";
import AnimatedSection from "@/components/AnimatedSection";
import { ArrowRight, Star, Truck, Shield, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; isPrimary: boolean }[];
  categoryIds?: string[];
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const trustSignals = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders over ₹999",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout process",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Handpicked fashion items",
  },
];

export default function Home({ recentProducts = [] }: HomeProps) {
  const router = useRouter();
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      <HeroSection />

      <main className="mx-auto w-full space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {/* Shop by Category */}
        <motion.section variants={itemVariants} className="space-y-8">
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover your perfect style from our curated collections
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {HomeData.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl"
              >
                <Card className="border-0 bg-transparent shadow-none p-0 py-0">
                  <CardContent className="p-0 overflow-hidden">
                    <motion.div
                      className="aspect-[4/3] bg-muted bg-cover bg-center transition-all duration-700 group-hover:scale-110 sm:aspect-[5/4] lg:aspect-[4/3]"
                      style={{ backgroundImage: `url(${item.src})` }}
                      whileHover={{ scale: 1.1 }}
                    />
                  </CardContent>

                  <CardFooter className="justify-between items-center px-6 pb-6 pt-4">
                    <p className="text-lg font-semibold text-foreground">
                      {item.label}
                    </p>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="rounded-full bg-primary/10 p-2"
                    >
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* New Arrivals */}
        <motion.section variants={itemVariants} className="space-y-8">
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
            <p className="mt-2 text-muted-foreground">
              Be the first to wear the latest trends
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5"
          >
            {recentProducts.length > 0
              ? recentProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                  >
                    <Card className="overflow-hidden p-0 border-0 bg-card/50 shadow-lg backdrop-blur-sm transition-all hover:shadow-2xl">
                      <CardTitle className="mb-3 overflow-hidden rounded-t-lg h-52 bg-secondary relative">
                        <motion.img
                          src={
                            product.images.find((img) => img.isPrimary)?.url ||
                            product.images[0]?.url
                          }
                          alt={product.name}
                          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(`/products/${product._id}`)
                            }
                            className="bg-white/90 text-black hover:bg-white"
                          >
                            Quick View
                          </Button>
                        </motion.div>
                      </CardTitle>
                      <CardContent className="pb-4 px-4 m-0">
                        <p className="font-semibold line-clamp-1 text-sm">
                          {product.name}
                        </p>
                        <p className="text-lg font-bold mt-1 text-primary">
                          ${product.price.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i + 1}
                    variants={itemVariants}
                    className="rounded-2xl overflow-hidden border bg-muted/30 animate-pulse shadow-lg"
                  >
                    <div className="aspect-3/4 bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-1/2 bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </motion.section>

        {/* Promotional Banner */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl sale-primary dark:sale-priamry/60 px-8 py-12 shadow-2xl"
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-md"
          >
            <h3 className="text-3xl font-bold mb-2">Flat 30% Off</h3>
            <p className="sale-text-light mb-6">
              On selected summer collections. Limited time offer!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute right-0 top-0 h-full w-1/2 hidden md:block"
          >
            <div
              className="h-full w-full bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url(${images.heroBanners.bannerImg_02.src})`,
              }}
            />
          </motion.div>

          {/* Animated background elements */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/10 blur-xl"
          />
        </motion.section>
        {/* Trust Signals */}
        <AnimatedSection className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trustSignals.map((signal) => (
            <motion.div
              key={signal.title}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 rounded-xl bg-card/50 p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <signal.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{signal.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {signal.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </main>
    </motion.div>
  );
}
