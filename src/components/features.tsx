"use client";

import { motion } from "framer-motion";
import { Truck, Scissors, ShieldCheck, Gift, RefreshCw, Sparkles } from "lucide-react";

const signals = [
  {
    icon: Truck,
    title: "Complimentary Shipping",
    description: "Enjoy complimentary premium courier service on all orders exceeding $150.",
  },
  {
    icon: Scissors,
    title: "Atelier Customization",
    description: "Book custom tailoring consultations online at any of our heritage locations.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkouts",
    description: "Your financial security is guaranteed via our double-encrypted payment gate.",
  },
  {
    icon: Gift,
    title: "Maison Presentation",
    description: "Each item arrives beautifully enclosed in our signature gold-embossed boxes.",
  },
  {
    icon: RefreshCw,
    title: "Atelier Returns",
    description: "Initiate smooth returns or alterations within 30 days of receiving your order.",
  },
  {
    icon: Sparkles,
    title: "Pure Sourcing",
    description: "Only certified organic silk, extra-fine merino, and long-staple cashmere fibers.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-[var(--bg)] border-t border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-14 text-center">
          <span className="section-label">Maison Services</span>
          <h2 className="section-title mt-3 font-light text-[var(--brand-text)]">
            Our Commitments
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {signals.map((sig, idx) => (
            <motion.div
              key={sig.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--gold-faint)] bg-card/60 backdrop-blur-md p-6 hover:border-[var(--gold-soft)] hover:shadow-lg transition-all duration-300 cursor-default"
            >
              <div className="flex gap-4 items-start">
                {/* Icon Wrapper: circle fills gold on hover */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--gold-soft)] bg-[var(--gold-glow)] text-[var(--gold)] transition-all duration-300 group-hover:bg-[var(--gold)] group-hover:text-white group-hover:scale-105">
                  <sig.icon className="h-5 w-5" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="font-montserrat text-sm font-semibold tracking-wide text-[var(--brand-text)]">
                    {sig.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                    {sig.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
