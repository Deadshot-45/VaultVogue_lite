"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export function Loader({ size = 40, text, className }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div style={{ width: size, height: size }} className="relative">
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-primary/15"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 0.9,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute inset-[28%] rounded-full bg-primary/20"
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.45, 0.85, 0.45],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
      </div>

      {text ? (
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.45, 1, 0.45], y: [0, -2, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      ) : null}
    </div>
  );
}
