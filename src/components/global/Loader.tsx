"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export function Loader({ size = 48, text, className }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center"
      >
        {/* Glow Ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />

        {/* Rotating Arc */}
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-l-primary"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

        {/* Outer Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
          }}
        />

        {/* Core Dot */}
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-primary"
          animate={{
            scale: [1, 1.4, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
      </div>

      {text && (
        <motion.p
          className="text-sm text-muted-foreground tracking-wide"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
