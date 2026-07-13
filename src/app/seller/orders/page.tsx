"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Truck,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
}

const STATUS_FILTERS = ["All", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const local = localStorage.getItem("vault_vogue_seller_orders");
    if (local) {
      setOrders(JSON.parse(local));
    }
  }, []);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem("vault_vogue_seller_orders", JSON.stringify(updated));
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        toast.success(`Order ${orderId} updated to ${newStatus.toUpperCase()}`);
        return { ...o, status: newStatus };
      }
      return o;
    });
    saveOrders(updated);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = activeFilter === "All" || order.status === activeFilter;
    return matchSearch && matchStatus;
  });

  const statusCfg: Record<Order["status"], { label: string; cls: string; icon: any }> = {
    pending: { label: "Pending", cls: "badge badge-gold", icon: Calendar },
    processing: { label: "Processing", cls: "badge badge-new", icon: Loader2 },
    shipped: { label: "Shipped", cls: "badge badge-gold", icon: Truck },
    delivered: { label: "Delivered", cls: "badge badge-success", icon: CheckCircle },
    cancelled: { label: "Cancelled", cls: "badge badge-sale", icon: XCircle },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Order ID, name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border w-full pl-9 h-10 text-xs"
          />
        </div>

        {/* Status filtering tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`py-1.5 px-3 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === filter
                  ? "bg-[var(--gold)] text-white"
                  : "text-muted-foreground bg-background/50 border border-border/40 hover:bg-muted/40"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Container */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="card text-center py-16 flex flex-col items-center justify-center space-y-3">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
            <div>
              <p className="text-sm font-semibold text-[var(--brand-text)]">No Atelier Orders Found</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No orders match your current filter selection.
              </p>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const config = statusCfg[order.status];
            const StatusIcon = config?.icon || Calendar;

            return (
              <motion.div
                key={order.id}
                layout
                className="card flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:border-[var(--gold-soft)] transition-all duration-300"
              >
                {/* Details Section */}
                <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-8 flex-1">
                  {/* Order ID & Date */}
                  <div className="min-w-[120px]">
                    <span className="font-mono text-xs font-semibold text-[var(--gold)]">
                      {order.id}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5 font-medium">
                      <Calendar className="h-3 w-3" />
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="min-w-[180px]">
                    <div className="flex items-center gap-1 text-xs font-semibold text-[var(--brand-text)]">
                      <User className="h-3.5 w-3.5 text-[var(--gold)]" />
                      {order.customer}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 ml-4.5 truncate max-w-[200px]">
                      {order.email}
                    </p>
                  </div>

                  {/* Price & Items Count */}
                  <div className="min-w-[140px]">
                    <p className="text-xs font-semibold text-[var(--brand-text)]">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {order.items} {order.items === 1 ? "listing item" : "listing items"}
                    </p>
                  </div>

                  {/* Earnings Breakdown (85% Seller share, 15% Platform commission) */}
                  <div className="min-w-[140px] hidden lg:block">
                    <p className="text-xs font-semibold text-emerald-600">
                      ₹{Math.round(order.amount * 0.85).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Net Earnings (85% cut)
                    </p>
                  </div>
                </div>

                {/* Status & Actions Section */}
                <div className="flex flex-row items-center justify-between md:justify-end gap-4 border-t border-border/10 pt-3 md:border-t-0 md:pt-0">
                  {/* Status Badge */}
                  <div className="flex items-center gap-1">
                    <span className={`${config?.cls ?? "badge"} flex items-center gap-1`}>
                      <StatusIcon className={`h-3 w-3 ${order.status === "processing" ? "animate-spin" : ""}`} />
                      {config?.label ?? order.status}
                    </span>
                  </div>

                  {/* Status Actions Dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor={`status-${order.id}`} className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:block">
                      Fulfilment:
                    </label>
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      className="input-field py-1 px-2.5 h-8 text-[11px] w-32 border-[var(--gold-faint)] focus:border-[var(--gold)] bg-transparent rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
