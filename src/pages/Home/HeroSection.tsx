"use client";

// src/components/HeroBanner.tsx
import { heroBanners } from "@/assets/data/homeSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const AUTO_SLIDE_INTERVAL = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroBanners.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] overflow-hidden">
      {/* <h1>Banner image</h1> */}
      {heroBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute top-0 inset-0 transition-opacity duration-700 ease-in-out",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          {/* Background Image */}
          <div
            className="h-[60vh] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image.src})` }}
          >
            {/* Overlay */}
            <div className="h-full w-full bg-foreground/40 dark:bg-black/60">
              <div className="mx-auto flex h-full max-w-7xl items-center px-6">
                <div className="max-w-xl text-background">
                  <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                    {banner.title}
                  </h1>
                  <p className="mt-4 text-lg text-background/90">
                    {banner.subtitle}
                  </p>

                  <Button size="lg" className="mt-6">
                    {banner.ctaText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroBanners.map((_, index) => (
          <Button
            key={index + 1}
            onClick={() => setCurrent(index)}
            className={cn(
              "size-1 rounded-full transition-all",
              index === current
                ? "bg-background"
                : "bg-background/50 hover:bg-background",
            )}
          />
        ))}
      </div>
      {/* Your page content goes here */}
      {/* <h2 className="text-2xl px-6 font-bold mb-4">Welcome to Vault Vogue</h2>
      <p className="px-6">
        Explore our exclusive collection of fashion items tailored just for you.
      </p> */}
    </section>
  );
}
