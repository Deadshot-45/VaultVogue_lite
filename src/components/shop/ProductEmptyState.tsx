"use client";

import { SearchX, RotateCcw } from "lucide-react";

interface ProductEmptyStateProps {
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function ProductEmptyState({ onClearFilters, hasFilters }: ProductEmptyStateProps) {
  return (
    <div className="mx-auto my-12 max-w-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-12 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-accent)]">
        <SearchX size={26} strokeWidth={1.5} />
      </div>

      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
        Catalog Query
      </p>

      <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
        No pieces found.
      </h3>

      <p className="mx-auto mt-3 max-w-md font-sans text-xs sm:text-sm text-[var(--vault-muted)] leading-relaxed">
        Try adjusting your filters or search to discover more from the collection.
      </p>

      {hasFilters && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClearFilters}
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest cursor-pointer"
          >
            <RotateCcw size={12} /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
