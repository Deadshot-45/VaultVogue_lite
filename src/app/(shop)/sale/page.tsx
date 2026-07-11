"use client";

import { motion } from "framer-motion";
import ProductCardComponent from "@/components/product-card";
import { UIProduct } from "@/lib/query/useGetProducts";
import { useRouter } from "next/navigation";

const products = [
  {
    id: "sale-1",
    name: "City Layer Bomber Jacket",
    price: 290,
    original: 450,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=500&h=500&fit=crop",
    category: "Outerwear",
  },
  {
    id: "sale-2",
    name: "Weekend Flow Co-ord Set",
    price: 190,
    original: 280,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop",
    category: "Sets",
  },
  {
    id: "sale-3",
    name: "Street Pace Everyday Sneakers",
    price: 140,
    original: 220,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Footwear",
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 text-center">
        {/* Editorial Heading */}
        <div className="mx-auto max-w-4xl px-4">
          <p className="section-label inline-block">The Private Archive</p>
          <div className="gold-divider mx-auto mt-4" />
          <h1 className="mt-8 font-cormorant text-5xl font-light tracking-tight text-[var(--brand-text)] md:text-7xl">
            Seasonal picks with <br />
            <span className="italic font-normal text-[var(--gold)]">Maison Special</span> pricing
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Explore a curated selection of archival pieces and seasonal favorites, 
            offering restrained luxury at an exceptional value for our members.
          </p>
          <button
            onClick={() => router.push("/women")}
            className="btn-primary mt-10"
          >
            Explore the Collection
          </button>
        </div>

        {/* Decorative background orb */}
        <div 
          className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-10 bg-[var(--gold)]"
        />
      </section>

      {/* Product List */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p, i) => {
            const uiProduct: UIProduct = {
              id: p.id,
              name: p.name,
              price: p.price,
              minPrice: p.price,
              maxPrice: p.price,
              availableSizes: ["XS", "S", "M", "L", "XL"],
              sizeQuantities: { XS: 10, S: 10, M: 10, L: 10, XL: 10 },
              sizeToVariantMap: {
                XS: `${p.id}-xs`,
                S: `${p.id}-s`,
                M: `${p.id}-m`,
                L: `${p.id}-l`,
                XL: `${p.id}-xl`,
              },
              lowStockThreshold: 5,
              image: p.image,
              category: p.category,
              description: "",
              bestseller: false,
              trending: false,
              isNew: false,
              isSale: true,
              variants: [],
              sizes: [
                { variantId: `${p.id}-xs`, size: "XS", price: p.price, stock: 10 }
              ],
              createdAt: new Date().toISOString(),
            };

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCardComponent product={uiProduct} />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-[2.5rem] p-12 text-center text-white sm:p-20 bg-gradient-to-tr from-[var(--gold)] via-[var(--brand-text)] to-[var(--brand-text)] shadow-2xl"
        >
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
              Maison Archivist
            </span>
            <h2 className="font-cormorant text-4xl font-light sm:text-5xl">Refresh Your Wardrobe</h2>
            <p className="text-xs opacity-90 leading-relaxed max-w-sm mx-auto">
              Build your next look with marked-down essentials from across our collections before the selection rotates.
            </p>
            <button 
              onClick={() => router.push("/women")}
              className="rounded-full bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
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
