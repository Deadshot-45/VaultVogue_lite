"use client";

import { heroBanners } from "@/assets/data/homeSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const AUTO_SLIDE_INTERVAL = 6000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroBanners.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {heroBanners.map((banner, index) => (
        <AnimatePresence key={banner.id}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === current ? 1 : 0,
              zIndex: index === current ? 10 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={cn(
              "absolute inset-0",
              index === current ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {/* Background Image */}
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image.src})` }}
            >
              {/* Gradient overlays — warm tones */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
                <motion.div
                  initial={{ y: 24, opacity: 0 }}
                  animate={{
                    y: index === current ? 0 : 24,
                    opacity: index === current ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index === current ? 0.25 : 0,
                    ease: "easeOut",
                  }}
                  className="max-w-2xl text-white space-y-6"
                >
                  {/* Label */}
                  <p className="text-xs font-medium tracking-[0.25em] uppercase text-white/60">
                    New Collection
                  </p>

                  {/* Headline — Cormorant serif */}
                  <h1 className="font-cormorant text-5xl font-light leading-[1.08] tracking-tight md:text-7xl lg:text-8xl">
                    {banner.title}
                  </h1>

                  <p className="text-lg text-white/80 max-w-lg leading-relaxed">
                    {banner.subtitle}
                  </p>

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                    <Button
                      size="lg"
                      className="rounded-full px-8 py-4 text-base font-medium shadow-xl transition-all duration-200 active:scale-95"
                      style={{
                        background: "var(--gold)",
                        color: "#fff",
                      }}
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full bg-white/10 border-white/25 backdrop-blur-sm px-8 py-4 text-base font-medium transition-all duration-200 active:scale-95"
                    >
                      Explore Collection
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {heroBanners.map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              index === current
                ? "w-8 bg-white"
                : "w-2 bg-white/35 hover:bg-white/55",
            )}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute bottom-6 right-6 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-6 bg-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
