"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Ruler } from "lucide-react";
import type { SizeMeasurement, VariantSize } from "@/features/storefront/types/variant";

interface SizeGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  measurements?: Record<VariantSize, SizeMeasurement>;
}

const DEFAULT_MEASUREMENTS: Record<VariantSize, SizeMeasurement> = {
  XS: { size: "XS", chest: "36 in", length: "27 in", weight: "380g" },
  S: { size: "S", chest: "38 in", length: "28 in", weight: "410g" },
  M: { size: "M", chest: "40 in", length: "29 in", weight: "440g" },
  L: { size: "L", chest: "42 in", length: "30 in", weight: "475g" },
  XL: { size: "XL", chest: "44 in", length: "31 in", weight: "510g" },
};

export function SizeGuideDialog({
  open,
  onOpenChange,
  measurements = DEFAULT_MEASUREMENTS,
}: SizeGuideDialogProps) {
  const sizes: VariantSize[] = ["XS", "S", "M", "L", "XL"];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-xl -translate-x-1/2 -translate-y-1/2 border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 text-[var(--vault-ink)] shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none">
          <div className="flex items-center justify-between border-b border-[var(--vault-line)] pb-4">
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-[var(--vault-accent)]" />
              <Dialog.Title className="font-serif text-xl sm:text-2xl font-light uppercase tracking-tight">
                Maison Size &amp; Fit Guide
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close size guide"
                className="p-1 text-[var(--vault-muted)] hover:text-[var(--vault-ink)] transition-colors"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            Architectural tailoring measurements in inches and finished garment weight.
          </Dialog.Description>

          {/* Sizing Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--vault-line)] text-[10px] uppercase text-[var(--vault-accent)]">
                  <th className="py-2.5">Size</th>
                  <th className="py-2.5">Chest</th>
                  <th className="py-2.5">Body Length</th>
                  <th className="py-2.5">Garment Mass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vault-line)]/50">
                {sizes.map((s) => {
                  const data = measurements[s] || DEFAULT_MEASUREMENTS[s];
                  return (
                    <tr key={s} className="hover:bg-[var(--vault-canvas)]/50 transition-colors">
                      <td className="py-3 font-bold text-[var(--vault-ink)]">{s}</td>
                      <td className="py-3 text-[var(--vault-muted)]">{data.chest}</td>
                      <td className="py-3 text-[var(--vault-muted)]">{data.length}</td>
                      <td className="py-3 text-[var(--vault-muted)]">{data.weight}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Model Specification Note */}
          <div className="mt-6 border-t border-[var(--vault-line)] pt-4 space-y-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            <p>
              <strong className="text-[var(--vault-ink)]">Model Specs:</strong> 186 cm / 6'1" · 74 kg · Wearing Size Medium
            </p>
            <p>
              <strong className="text-[var(--vault-ink)]">Fit Stance:</strong> Tailored contemporary box silhouette with dropped shoulder articulation. Choose your standard size for the intended drape, or size down for a slimmer formal contour.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
