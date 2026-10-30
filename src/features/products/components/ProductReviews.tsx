"use client";

import { useState } from "react";
import { Star, CheckCircle2, MessageSquare, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export function ProductReviews({
  rating = 0,
  reviewsCount = 0,
}: {
  rating?: number;
  reviewsCount?: number;
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  const handleHelpful = (id: string) => {
    if (helpfulClicked[id]) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)),
    );
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
    toast.success("Thank you for your feedback.");
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      toast.error("Please provide your name and your evaluation.");
      return;
    }

    const created: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: newAuthor.trim(),
      location: "Verified Client",
      date: "Just now",
      rating: newRating,
      title: newTitle.trim() || "Atelier Experience",
      comment: newComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    setReviews([created, ...reviews]);
    setIsWriteOpen(false);
    setNewAuthor("");
    setNewTitle("");
    setNewComment("");
    toast.success("Your evaluation has been submitted to the Maison registry.");
  };

  const totalReviews = reviews.length > 0 ? reviews.length : reviewsCount;
  const displayRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : rating > 0 ? rating.toFixed(1) : "—";

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <section id="reviews-section" className="border-t border-[var(--vault-line)] pt-8 sm:pt-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--vault-line)] pb-8">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
            Client Verification
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Atelier Experiences ({totalReviews})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsWriteOpen(!isWriteOpen)}
          className="inline-flex items-center gap-2 border border-[var(--vault-line)] px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] transition-colors cursor-pointer"
        >
          <MessageSquare size={14} />
          {isWriteOpen ? "Close Form" : "Write an Evaluation"}
        </button>
      </div>

      {/* Review Score Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-8 border border-[var(--vault-line)] bg-[var(--vault-panel)]">
        <div className="flex flex-col justify-center items-center md:border-r border-[var(--vault-line)] md:pr-8 text-center">
          <span className="font-mono text-5xl font-light text-[var(--vault-ink)]">
            {displayRating}
          </span>
          <div className="mt-2 flex items-center gap-1 text-[var(--vault-accent)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} className="fill-[var(--vault-accent)] text-[var(--vault-accent)]" />
            ))}
          </div>
          <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            {totalReviews > 0 ? "Verified Client Evaluations" : "Awaiting Client Evaluations"}
          </span>
        </div>

        {/* Rating Bar Distribution */}
        <div className="col-span-2 space-y-2 font-mono text-[10px] uppercase tracking-wider">
          {distribution.map((bar) => (
            <div key={bar.star} className="flex items-center gap-3">
              <span className="w-12 text-[var(--vault-muted)]">{bar.star} Stars</span>
              <div className="flex-1 h-2 bg-[var(--vault-line)]/50 overflow-hidden">
                <div
                  className="h-full bg-[var(--vault-accent)] transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-[var(--vault-muted)]">{bar.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      {isWriteOpen && (
        <form
          onSubmit={handleCreateReview}
          className="mt-8 border border-[var(--vault-accent)] bg-[var(--vault-panel)] p-6 sm:p-8 space-y-4 animate-in fade-in"
        >
          <h3 className="font-serif text-xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Share Your Atelier Impression
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] uppercase text-[var(--vault-muted)] mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. Laurent D."
                className="w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] px-3 py-2 text-[var(--vault-ink)] focus:border-[var(--vault-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[var(--vault-muted)] mb-1">
                Rating
              </label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] px-3 py-2 text-[var(--vault-ink)] focus:border-[var(--vault-accent)] focus:outline-none"
              >
                <option value={5}>5 Stars — Masterpiece</option>
                <option value={4}>4 Stars — Very Impressed</option>
                <option value={3}>3 Stars — Meets Expectation</option>
                <option value={2}>2 Stars — Room for Refinement</option>
                <option value={1}>1 Star — Unsatisfied</option>
              </select>
            </div>
          </div>

          <div className="font-mono text-xs">
            <label className="block text-[10px] uppercase text-[var(--vault-muted)] mb-1">
              Headline
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Exceptional cut and drape"
              className="w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] px-3 py-2 text-[var(--vault-ink)] focus:border-[var(--vault-accent)] focus:outline-none"
            />
          </div>

          <div className="font-mono text-xs">
            <label className="block text-[10px] uppercase text-[var(--vault-muted)] mb-1">
              Evaluation
            </label>
            <textarea
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Detail the fabric hand-feel, proportion, sizing fidelity, and wear comfort..."
              className="w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] px-3 py-2 text-[var(--vault-ink)] focus:border-[var(--vault-accent)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsWriteOpen(false)}
              className="border border-[var(--vault-line)] px-4 py-2 font-mono text-[10px] uppercase text-[var(--vault-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[var(--vault-accent)] px-6 py-2 font-mono text-[10px] uppercase font-bold text-white hover:opacity-90 transition-opacity"
            >
              Publish Evaluation
            </button>
          </div>
        </form>
      )}

      {/* Review Cards Feed */}
      {reviews.length === 0 ? (
        <div className="mt-8 border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 text-center space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--vault-ink)]">
            No Client Evaluations Yet
          </p>
          <p className="font-mono text-[11px] text-[var(--vault-muted)]">
            Acquired this silhouette? Select &ldquo;Write an Evaluation&rdquo; above to share your impression.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-7 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--vault-line)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-light text-[var(--vault-ink)]">
                    {rev.name}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--vault-muted)]">
                    ({rev.location})
                  </span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-[var(--vault-accent)] border border-[var(--vault-accent)]/30 px-1.5 py-0.5">
                      <CheckCircle2 size={10} /> Verified Acquisition
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[var(--vault-accent)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < Math.floor(rev.rating) ? "fill-[var(--vault-accent)] text-[var(--vault-accent)]" : "text-[var(--vault-line)]"}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--vault-muted)]">
                    {rev.date}
                  </span>
                </div>
              </div>

              <h4 className="font-serif text-lg font-light text-[var(--vault-ink)]">
                &ldquo;{rev.title}&rdquo;
              </h4>

              <p className="font-mono text-xs leading-relaxed text-[var(--vault-muted)]">
                {rev.comment}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)] hover:text-[var(--vault-ink)] transition-colors cursor-pointer"
                >
                  <ThumbsUp size={11} className={helpfulClicked[rev.id] ? "text-[var(--vault-accent)]" : ""} />
                  Helpful ({rev.helpfulCount})
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
