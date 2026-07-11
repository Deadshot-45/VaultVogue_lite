"use client";

import { Category } from "@/lib/api/productService";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fallbackCategoryImage =
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&h=800&fit=crop";

const defaultCategories = [
  {
    title: "Women",
    slug: "women",
    subtitle: "Les Silhouettes Feminines",
    description:
      "Flowing silk, structural outerwear, and premium knitwear designed for modern effortless elegance.",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop",
    href: "/women",
  },
  {
    title: "Men",
    slug: "men",
    subtitle: "L'Homme Moderne",
    description:
      "Impeccably tailored suits, soft cashmere knits, and clean essential layers crafted with heritage values.",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=800&fit=crop",
    href: "/men",
  },
  {
    title: "Kids",
    slug: "kids",
    subtitle: "Les Petits Ateliers",
    description:
      "Comfortable organic cottons and miniature winter layering pieces that protect gentle skin.",
    image:
      "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&h=800&fit=crop",
    href: "/kids",
  },
];

interface CategoryShowcaseProps {
  readonly categories?: Category[];
}

function getCategoryCards(categories: Category[] = []) {
  if (categories.length === 0) {
    return defaultCategories;
  }

  return categories.map((category) => {
    const fallback =
      defaultCategories.find(
        (item) => item.slug.toLowerCase() === category.slug.toLowerCase(),
      ) ?? defaultCategories[0];

    return {
      ...fallback,
      title: category.name,
      slug: category.slug,
      href: `/${category.slug}`,
    };
  });
}

function CategoryCard({
  category,
  index,
}: {
  readonly category: (typeof defaultCategories)[number];
  readonly index: number;
}) {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(category.image);

  return (
    <motion.div
      key={category.slug}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onClick={() => router.push(category.href)}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image with zoom */}
      <Image
        src={imageSrc}
        alt={category.title}
        fill
        sizes="(max-width: 768px) 100vw, 30vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        onError={() => setImageSrc(fallbackCategoryImage)}
      />

      {/* Gold Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-text)]/90 via-[var(--brand-text)]/30 to-transparent transition-opacity duration-300" />
      <div className="absolute inset-0 bg-[var(--gold-soft)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content Frame */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white z-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          {category.subtitle}
        </span>

        <h3 className="font-cormorant text-3xl font-light mt-1 tracking-wide text-white">
          {category.title}
        </h3>

        <p className="text-xs text-white/70 mt-3 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 max-w-xs">
          {category.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium">
          <span className="uppercase tracking-wider">Discover Edit</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

export default function CategoryShowcase({
  categories = [],
}: CategoryShowcaseProps) {
  const categoryCards = getCategoryCards(categories);

  return (
    <section className="py-20 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Frame */}
        <div className="mb-14 text-center">
          <span className="section-label">Selected Collections</span>
          <h2 className="section-title mt-3 font-light text-[var(--brand-text)]">
            Explore the Maison
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryCards.map((cat, idx) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
