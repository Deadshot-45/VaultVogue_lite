"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenueDataPoint } from "@/types/admin";
import { motion } from "framer-motion";

const data: RevenueDataPoint[] = [
  { month: "Jan", revenue: 42000, orders: 320 },
  { month: "Feb", revenue: 58000, orders: 410 },
  { month: "Mar", revenue: 51000, orders: 380 },
  { month: "Apr", revenue: 74000, orders: 520 },
  { month: "May", revenue: 68000, orders: 490 },
  { month: "Jun", revenue: 92000, orders: 640 },
  { month: "Jul", revenue: 87000, orders: 610 },
  { month: "Aug", revenue: 103000, orders: 720 },
  { month: "Sep", revenue: 96000, orders: 680 },
  { month: "Oct", revenue: 118000, orders: 830 },
  { month: "Nov", revenue: 134000, orders: 940 },
  { month: "Dec", revenue: 158000, orders: 1100 },
];

const CustomTooltip = ({ active, payload, label }: Record<string, unknown>) => {
  if (active && Array.isArray(payload) && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 shadow-lg"
        style={{
          background: 'color-mix(in oklch, var(--background) 90%, transparent)',
          border: '1px solid var(--gold-faint)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p className="section-label text-[10px] mb-2">{String(label)}</p>
        <p className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>
          ₹{Number((payload[0] as { value: number }).value).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-muted-foreground">
          {(payload[1] as { value: number })?.value} orders
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="section-label text-[10px]">Revenue Overview</p>
          <h3 className="font-cormorant text-2xl font-light mt-1" style={{ color: 'var(--brand-text)' }}>
            Annual Performance
          </h3>
        </div>
        <span className="badge badge-gold">2024</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-montserrat)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-montserrat)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--gold)"
            strokeWidth={2}
            fill="url(#goldGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
