"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative w-full overflow-hidden bg-[var(--background)] py-16 md:py-24 border-b border-border/10">
      {/* Decorative Gold Glow Orbs */}
      <div className="absolute top-1/4 left-10 -z-10 h-72 w-72 rounded-full bg-[var(--gold)]/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-10 -z-10 h-96 w-96 rounded-full bg-[var(--gold)]/8 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Text Content */}
          <div className="space-y-8 lg:col-span-7">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-soft)] bg-[var(--gold-glow)] px-4 py-1.5"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
                Autumn / Winter Collection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="section-title max-w-2xl font-light leading-[1.1] tracking-tight"
            >
              The Art of <br />
              <span className="italic font-normal text-[var(--gold)]">Quiet Luxury</span>
            </motion.h1>

            {/* Gold Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="gold-divider origin-left"
            />

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="section-subtitle max-w-xl text-lg"
            >
              Restrained, editorial, and curated for the refined eye. Spun from the world&apos;s most premium fibers to accompany a life well-lived.
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => router.push("/women")}
                className="btn-primary"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => router.push("/men")}
                className="btn-secondary"
              >
                Atelier Catalog
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/10 max-w-lg"
            >
              <div className="space-y-1">
                <span className="font-cormorant text-2xl md:text-3xl text-[var(--brand-text)] font-light">100%</span>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cashmere &amp; Silk</p>
              </div>
              <div className="relative pl-6 before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-px before:bg-border/20 space-y-1">
                <span className="font-cormorant text-2xl md:text-3xl text-[var(--brand-text)] font-light">80+</span>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ateliers Worldwide</p>
              </div>
              <div className="relative pl-6 before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-px before:bg-border/20 space-y-1">
                <span className="font-cormorant text-2xl md:text-3xl text-[var(--brand-text)] font-light">1982</span>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Est. Heritage</p>
              </div>
            </motion.div>
          </div>

          {/* Right Image Frame (Featured Edit Card) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem] overflow-hidden border border-[var(--gold-soft)] p-2 bg-gradient-to-tr from-[var(--gold-glow)] to-transparent shadow-xl">
              <div className="relative h-full w-full overflow-hidden rounded-[1.75rem]">
                <Image
                  src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=750&fit=crop"
                  alt="Vault-Vogue Luxury Editorial"
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
                
                {/* Gold Gradient Label Plate */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 label backdrop-blur-md p-4 shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Featured Edit</span>
                  <h3 className="font-cormorant text-xl mt-1.5 font-light leading-tight tracking-wide text-white">
                    The Silk Slip &amp; Tailored Coat
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs text-white/70">Cashmere, Linen &amp; Silk</span>
                    <button
                      onClick={() => router.push("/women")}
                      className="text-xs font-semibold text-[var(--gold)] hover:text-white transition-colors duration-200 underline-offset-2 hover:underline"
                    >
                      View Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
