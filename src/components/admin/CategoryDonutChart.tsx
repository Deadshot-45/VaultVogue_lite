"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CategoryDataPoint } from "@/types/admin";
import { motion } from "framer-motion";

const data: CategoryDataPoint[] = [
  { name: 'Handbags',    value: 34, color: '#8a6a42' },
  { name: 'Accessories', value: 22, color: '#b08d68' },
  { name: 'Footwear',   value: 18, color: '#d4b796' },
  { name: 'Apparel',    value: 15, color: '#6b4f30' },
  { name: 'Jewellery',  value: 11, color: '#e8d5be' },
];

const CustomTooltip = ({ active, payload }: Record<string, unknown>) => {
  if (active && Array.isArray(payload) && payload.length) {
    const item = payload[0] as { name: string; value: number };
    return (
      <div
        className="rounded-xl px-4 py-3"
        style={{
          background: 'color-mix(in oklch, var(--background) 92%, transparent)',
          border: '1px solid var(--gold-faint)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{item.name}</p>
        <p className="section-label text-[10px] mt-1">{item.value}% of sales</p>
      </div>
    );
  }
  return null;
};

export function CategoryDonutChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card h-full"
    >
      <div className="mb-6">
        <p className="section-label text-[10px]">Category Breakdown</p>
        <h3 className="font-cormorant text-2xl font-light mt-1" style={{ color: 'var(--brand-text)' }}>
          Sales by Category
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={64}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-montserrat)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
