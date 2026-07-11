"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  onAdd?: () => void;
  disabled: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  className?: string;
}

type State = "idle" | "loading" | "success";

export function AddToCartButton({
  onAdd,
  disabled,
  isLoading,
  isSuccess,
  isError,
  className,
}: AddToCartButtonProps) {
  const state: State = isLoading ? "loading" : isSuccess ? "success" : "idle";

  return (
    <motion.button
      onClick={onAdd}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        "relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold uppercase tracking-wider text-xs shadow-md transition-all duration-300 cursor-pointer",
        "bg-[var(--gold)] text-white hover:shadow-lg",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        isError && "bg-red-500 text-white",
        className
      )}
    >
      {/* Ripple */}
      <motion.span
        className="absolute inset-0 bg-white/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          state === "loading"
            ? { scale: 2, opacity: 0 }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.6 }}
      />

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2"
          >
            <ShoppingBag size={14} />
            <span>Add to Bag</span>
          </motion.div>
        )}

        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "linear",
              }}
            />
            <span>Adding to Bag...</span>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={14} />
            <span>Added to Bag</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
