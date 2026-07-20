import React from "react";
import { Star } from "lucide-react";

const reviewItems = [
  {
    name: "Eleanor P.",
    rating: 5,
    date: "June 24, 2026",
    comment:
      "The wool weave is remarkably soft and the drape of this piece is absolute perfection. Truly an atelier-grade garment.",
  },
  {
    name: "Christian M.",
    rating: 5,
    date: "May 12, 2026",
    comment:
      "Stitch finish is incredibly clean. Fits perfectly according to size. Exquisite presentation box as well.",
  },
  {
    name: "Sofia K.",
    rating: 4.5,
    date: "April 30, 2026",
    comment:
      "Elegant silhouette that feels very premium. Perfect weight for autumn/winter layering edits.",
  },
];

export const Reviews = React.memo(() => {
  return (
    <div className="mt-16 space-y-6">
      {/* Header */}
      <div>
        <span className="section-label">Client Reviews</span>
        <h2 className="text-xl font-light font-cormorant text-[var(--brand-text)] mt-1.5">
          Client Experiences
        </h2>
        <div className="gold-divider" />
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviewItems.map((review) => {
          const wholeStars = Math.floor(review.rating);
          const hasHalfStar = review.rating % 1 !== 0;
          
          return (
            <div
              key={review.name}
              className="p-5 border border-border/40 rounded-2xl bg-card/30 backdrop-blur-sm space-y-2.5 transition-all hover:border-[var(--gold-soft)]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-[var(--brand-text)]">{review.name}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{review.date}</p>
                </div>
                
                {/* Gold Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < wholeStars
                          ? "fill-[var(--gold)] text-[var(--gold)]"
                          : i === wholeStars && hasHalfStar
                          ? "fill-[var(--gold)]/50 text-[var(--gold)]/50"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                "{review.comment}"
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
});
Reviews.displayName = "Reviews";