"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatsCardData } from "@/types/admin";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  data: StatsCardData;
  index?: number;
}

export function StatsCard({ data, index = 0 }: StatsCardProps) {
  // Dynamically resolve icon from lucide
  const IconComponent = (LucideIcons as any)[data.icon] ?? LucideIcons.BarChart2;

  const trendColors = {
    up: 'var(--success-500)',
    down: 'oklch(0.637 0.237 25.331)',
    neutral: 'var(--muted-foreground)',
  };

  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card card-hover relative overflow-hidden"
    >
      {/* Subtle gold top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, var(--gold-soft), transparent)' }}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="section-label text-[10px] mb-2">{data.label}</p>
          <p
            className="font-cormorant text-3xl font-light tracking-tight"
            style={{ color: 'var(--brand-text)' }}
          >
            {data.value}
          </p>
          {data.description && (
            <p className="mt-1 text-xs text-muted-foreground">{data.description}</p>
          )}
        </div>

        <div
          className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--gold-faint)', border: '1px solid var(--gold-soft)' }}
        >
          <IconComponent className="h-5 w-5" style={{ color: 'var(--gold)' } as React.CSSProperties} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <TrendIcon className="h-3.5 w-3.5" style={{ color: trendColors[data.trend] }} />
        <span className="text-xs font-semibold" style={{ color: trendColors[data.trend] }}>
          {data.delta}
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </motion.div>
  );
}
