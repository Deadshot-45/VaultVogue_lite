"use client";

// src/components/HeroBanner.tsx
import { heroBanners } from "@/assets/data/homeSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

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
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)] opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.1),transparent_50%)] opacity-30" />

      {heroBanners.map((banner, index) => (
        <AnimatePresence key={banner.id}>
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === current ? 1 : 0,
              scale: index === current ? 1 : 1.1,
              zIndex: index === current ? 10 : 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              opacity: { duration: 0.8, ease: "easeInOut" },
              scale: { duration: 1.2, ease: "easeInOut" },
            }}
            className={cn(
              "absolute top-0 inset-0 transition-opacity duration-700 ease-in-out",
              index === current ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {/* Background Image */}
            <motion.div
              className="h-full w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${banner.image.src})` }}
              initial={{ scale: 1.2 }}
              animate={{ scale: index === current ? 1 : 1.2 }}
              transition={{ duration: 8, ease: "easeOut" }}
            >
              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{
                    x: index === current ? 0 : -100,
                    opacity: index === current ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index === current ? 0.3 : 0,
                    ease: "easeOut",
                  }}
                  className="max-w-2xl text-white space-y-6"
                >
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{
                      y: index === current ? 0 : 30,
                      opacity: index === current ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index === current ? 0.5 : 0,
                    }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-5 w-5 text-background/60" />
                    <span className="text-sm font-medium text-foreground bg-background/60 px-3 py-1 rounded-full">
                      New Collection
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{
                      y: index === current ? 0 : 50,
                      opacity: index === current ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index === current ? 0.7 : 0,
                    }}
                    className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
                  >
                    {banner.title.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: index === current ? 0 : 20,
                          opacity: index === current ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: index === current ? 0.8 + i * 0.1 : 0,
                        }}
                        className="inline-block mr-4 last:mr-0"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>

                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{
                      y: index === current ? 0 : 30,
                      opacity: index === current ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index === current ? 1.0 : 0,
                    }}
                    className="text-xl text-white/90 max-w-lg leading-relaxed"
                  >
                    {banner.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{
                      y: index === current ? 0 : 30,
                      opacity: index === current ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index === current ? 1.2 : 0,
                    }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-primary/25 px-8 py-4 text-lg font-semibold rounded-full"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/30 text-foreground hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-full"
                      >
                        Explore Collection
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ))}

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {heroBanners.map((_, index) => (
          <motion.button
            key={index + 1}
            onClick={() => setCurrent(index)}
            className={cn(
              "relative h-3 w-3 rounded-full transition-all duration-300",
              index === current
                ? "bg-white shadow-lg"
                : "bg-white/40 hover:bg-white/60",
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {index === current && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-6 right-6 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs font-medium">Scroll</span>
          <div className="w-px h-8 bg-white/40" />
          <div className="w-2 h-2 border-r-2 border-b-2 border-white/40 rotate-45" />
        </motion.div>
      </motion.div>
    </section>
  );
}
