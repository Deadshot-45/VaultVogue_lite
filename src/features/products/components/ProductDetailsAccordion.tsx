"use client";

import { useState } from "react";
import { ChevronDown, Scissors, Layers, ShieldCheck, Truck, Info } from "lucide-react";
import type { VariantProduct } from "@/features/storefront/types/variant";

interface ProductDetailsAccordionProps {
  product: VariantProduct;
}

interface AccordionItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  content: React.ReactNode;
}

export function ProductDetailsAccordion({ product }: ProductDetailsAccordionProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    silhouette: true,
    materials: false,
    care: false,
    shipping: false,
    provenance: false,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const items: AccordionItem[] = [
    {
      id: "silhouette",
      title: "Silhouette & Architectural Fit",
      icon: Scissors,
      content: (
        <div className="space-y-3 font-mono text-xs leading-relaxed text-[var(--vault-muted)]">
          <p>
            Cut with an intentional drop-shoulder stance, articulated underarm gussets, and balanced torso drape for movement and structured elegance.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Tailored contemporary relaxed fit</li>
            <li>Reinforced high-stress seam taping</li>
            <li>Seamless internal pocket integration</li>
            <li>Engineered for versatile layering across transitional seasons</li>
          </ul>
        </div>
      ),
    },
    {
      id: "materials",
      title: "Materials & Textile Composition",
      icon: Layers,
      content: (
        <div className="space-y-3 font-mono text-xs leading-relaxed text-[var(--vault-muted)]">
          <p>
            <strong className="text-[var(--vault-ink)]">Fabric:</strong> {product.fabric || "Premium Japanese Compact Weave"}
          </p>
          <p>
            <strong className="text-[var(--vault-ink)]">Composition:</strong> {product.composition || "100% GOTS-Certified Organic Long-Staple Cotton"}
          </p>
          <p>
            Milled exclusively in limited bolts to maintain density, tensile resilience, and tactile hand feel without synthetic additives.
          </p>
        </div>
      ),
    },
    {
      id: "care",
      title: "Care & Preservation Guidance",
      icon: Info,
      content: (
        <div className="space-y-2 font-mono text-xs leading-relaxed text-[var(--vault-muted)]">
          {(
            product.careInstructions || [
              "Professional archival dry clean strongly recommended",
              "Gentle cold cycle (30°C / 85°F) inside-out with pH-neutral detergent",
              "Reshape while damp and air-dry flat in ambient shade",
              "Warm iron on reverse; do not bleach or tumble dry",
            ]
          ).map((instruction, idx) => (
            <p key={idx} className="flex items-start gap-2">
              <span className="text-[var(--vault-accent)]">•</span>
              <span>{instruction}</span>
            </p>
          ))}
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Insured Shipping & Complimentary Returns",
      icon: Truck,
      content: (
        <div className="space-y-3 font-mono text-xs leading-relaxed text-[var(--vault-muted)]">
          <p>
            Every order is dispatched in our signature unbleached organic cotton dust pouch with serialized tamper-evident sealing.
          </p>
          <p>
            <strong className="text-[var(--vault-ink)]">Domestic Deliveries:</strong> 2–4 business days via carbon-neutral air courier.
          </p>
          <p>
            <strong className="text-[var(--vault-ink)]">International Deliveries:</strong> 3–6 business days with all duties and import customs handled seamlessly at checkout.
          </p>
          <p>
            <strong className="text-[var(--vault-ink)]">14-Day Return Window:</strong> Full refund or exchange on garments returned unworn with archival tags intact.
          </p>
        </div>
      ),
    },
    {
      id: "provenance",
      title: "Provenance & Authenticity Guarantee",
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 font-mono text-xs leading-relaxed text-[var(--vault-muted)]">
          <p>
            Item Code: <strong className="text-[var(--vault-ink)]">{product.code}</strong>
          </p>
          <p>
            Accompanied by a serialized Vault Vogue Certificate of Authenticity. Registered in our atelier registry to guarantee origin, secondary-market verification, and lifetime stitching warranty.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="divide-y divide-[var(--vault-line)] border-y border-[var(--vault-line)]">
      {items.map((item) => {
        const isOpen = !!openItems[item.id];
        const Icon = item.icon;

        return (
          <div key={item.id} className="py-3 sm:py-3.5">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between text-left transition hover:text-[var(--vault-accent)] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--vault-ink)]">
                <Icon size={14} className="text-[var(--vault-accent)]" />
                <span>{item.title}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-[var(--vault-muted)] transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[var(--vault-accent)]" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="pt-3 pb-1 animate-in fade-in duration-200">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
