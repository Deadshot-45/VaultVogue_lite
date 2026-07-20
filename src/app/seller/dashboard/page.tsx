"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Store,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "@/lib/store/hooks";
import { api } from "@/lib/services/apiservices";
import { useGetSellerDashboard } from "@/lib/queries/sellerQuery";
import Image from "next/image";

const CHART_DATA = [
  { day: "Mon", sales: 0, revenue: 0 },
  { day: "Tue", sales: 1, revenue: 125000 },
  { day: "Wed", sales: 2, revenue: 250000 },
  { day: "Thu", sales: 1, revenue: 38000 },
  { day: "Fri", sales: 0, revenue: 0 },
  { day: "Sat", sales: 1, revenue: 420000 },
  { day: "Sun", sales: 0, revenue: 0 },
];

export default function SellerDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useGetSellerDashboard(user?.id);

  const products = data?.products || [];
  const orders = data?.orders || [];

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  // Calculate live stats
  const activeListings = products.filter((p) => p.status === "active").length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;
  const totalOrders = orders.length;

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Dynamic status badges
  const statusCfg: Record<string, string> = {
    pending: "badge badge-gold",
    processing: "badge badge-new",
    shipped: "badge badge-gold",
    delivered: "badge badge-success",
    cancelled: "badge badge-sale",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light font-cormorant text-[var(--brand-text)]">
            Welcome to your Atelier
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor your brand performance, catalog, and private sales.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/seller/inventory"
            className="btn-secondary py-2 px-5 text-xs"
          >
            Manage Catalog
          </Link>
          <Link
            href="/seller/inventory?add=true"
            className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5"
          >
            <Store className="h-3.5 w-3.5" />
            Add New Item
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="card hover:border-[var(--gold-soft)] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold">
              Gross Earnings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--gold-faint)] border border-[var(--gold-soft)]">
              <TrendingUp
                className="h-4 w-4"
                style={{ color: "var(--gold)" }}
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-light text-[var(--brand-text)]">
              ₹{totalRevenue?.toLocaleString("en-IN")}
            </h3>
            <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1 mt-1">
              +14.2%{" "}
              <span className="text-muted-foreground font-normal">
                vs last month
              </span>
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card hover:border-[var(--gold-soft)] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold">
              Atelier Orders
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--gold-faint)] border border-[var(--gold-soft)]">
              <ShoppingBag
                className="h-4 w-4"
                style={{ color: "var(--gold)" }}
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-light text-[var(--brand-text)]">
              {totalOrders}
            </h3>
            <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1 mt-1">
              +8.5%{" "}
              <span className="text-muted-foreground font-normal">
                in last 7 days
              </span>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card hover:border-[var(--gold-soft)] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold">
              Active Listings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--gold-faint)] border border-[var(--gold-soft)]">
              <Package className="h-4 w-4" style={{ color: "var(--gold)" }} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-light text-[var(--brand-text)]">
              {activeListings}
            </h3>
            <span className="text-[10px] text-muted-foreground font-normal flex items-center gap-1 mt-1">
              Currently visible on boutique floor
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card hover:border-[var(--gold-soft)] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold">
              Atelier Alerts
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                lowStockCount > 0
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-[var(--gold-faint)] border-[var(--gold-soft)]"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 ${lowStockCount > 0 ? "text-amber-500 animate-pulse" : "text-muted-foreground"}`}
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-light text-[var(--brand-text)]">
              {lowStockCount}{" "}
              <span className="text-xs text-muted-foreground font-normal">
                items low stock
              </span>
            </h3>
            <span
              className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${lowStockCount > 0 ? "text-amber-500" : "text-muted-foreground"}`}
            >
              {lowStockCount > 0
                ? "Immediate restock recommended"
                : "All inventories stable"}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card flex flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-[var(--gold)]">
                Revenue & Sales Curve
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Earnings trends aggregated over active days.
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--gold)] flex items-center gap-1">
              Atelier Average: ₹{avgOrderValue?.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={CHART_DATA}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--gold)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--gold)"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--gold-faint)"
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--gold-soft)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [
                    `₹${value?.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--gold)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Panel */}
        <div className="card flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[var(--gold)]">
              Low Stock Warnings
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Catalog items with critical stock volume.
            </p>
          </div>

          <div className="flex-1 mt-4 overflow-y-auto no-scrollbar space-y-3 max-h-60">
            {products.filter((p) => p.stock <= 3).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <Store className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  No low-stock items detected.
                </p>
              </div>
            ) : (
              products
                .filter((p) => p.stock <= 3)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border/20 bg-background/30 hover:border-[var(--gold-faint)] transition-colors"
                  >
                    <Image
                      src={
                        product.images?.find((img: any) => img.isPrimary)
                          ?.url ||
                        product.image ||
                        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80"
                      }
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover border border-border/40"
                      width={40}
                      height={40}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--brand-text)] truncate">
                        {product.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold ${product.stock === 0 ? "text-red-500" : "text-amber-500"}`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} left`}
                      </span>
                      <p className="text-[9px] text-muted-foreground">
                        Price: ₹{product?.maxPrice?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="pt-3 border-t border-[var(--gold-faint)]">
            <Link
              href="/seller/inventory"
              className="text-xs font-semibold text-[var(--gold)] flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
            >
              Adjust Inventories <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[var(--gold)]">
              Recent Client Orders
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Most recent purchases of your brand listings.
            </p>
          </div>
          <Link
            href="/seller/orders"
            className="text-xs font-semibold text-[var(--gold)] flex items-center gap-0.5 hover:opacity-80 transition-opacity"
          >
            View All Orders <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--gold-faint)" }}>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">
                  Order ID
                </th>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">
                  Customer
                </th>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">
                  Date
                </th>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">
                  Amount
                </th>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 3).map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-[var(--gold-glow)]"
                  style={{ borderBottom: "1px solid var(--gold-faint)" }}
                >
                  <td className="py-3.5 font-mono text-xs font-semibold text-[var(--gold)]">
                    {order.id}
                  </td>
                  <td className="py-3.5">
                    <p className="text-xs font-medium text-[var(--brand-text)]">
                      {order.customer}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {order.email}
                    </p>
                  </td>
                  <td className="py-3.5 text-xs text-muted-foreground">
                    {new Date(order.date)?.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 text-xs font-semibold text-[var(--brand-text)]">
                    ₹{order?.amount?.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5">
                    <span className={statusCfg[order.status] ?? "badge"}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
