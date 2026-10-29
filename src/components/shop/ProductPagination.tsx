"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalCount,
  startIndex,
  endIndex,
  onPageChange,
}: ProductPaginationProps) {
  if (totalCount === 0) return null;

  // Generate visible page numbers (max 5 page buttons)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Catalog Pagination"
      className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--vault-line)] pt-8 sm:flex-row"
    >
      {/* Range Display */}
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--vault-muted)]">
        Showing{" "}
        <span className="font-bold text-[var(--vault-ink)]">
          {startIndex + 1}–{endIndex}
        </span>{" "}
        of <span className="font-bold text-[var(--vault-ink)]">{totalCount}</span> pieces
      </p>

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
            className="flex h-9 w-9 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--vault-line)] disabled:hover:text-[var(--vault-ink)]"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Numbered Page Buttons */}
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-9 w-7 items-center justify-center font-mono text-xs text-[var(--vault-muted)]"
                >
                  …
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-9 min-w-9 items-center justify-center px-2 font-mono text-xs uppercase transition border ${
                  isActive
                    ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] font-bold text-white shadow-sm"
                    : "border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next Page"
            className="flex h-9 w-9 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--vault-line)] disabled:hover:text-[var(--vault-ink)]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}

