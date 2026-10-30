"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { isReducedMotion } from "@/lib/animations/gsap-utils";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isReducedMotion()) {
      gsap.set(containerRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Main page container entrance animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      // Stagger for sections and cards inside the page
      const contentBlocks = containerRef.current?.querySelectorAll(
        "section, article, .gsap-reveal",
      );
      if (contentBlocks && contentBlocks.length > 0) {
        gsap.fromTo(
          contentBlocks,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.04,
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-h-0 w-full">
      {children}
    </div>
  );
}
