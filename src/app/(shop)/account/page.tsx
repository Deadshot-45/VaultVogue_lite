"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/services/orderService";
import { performAppLogout } from "@/lib/store/logout";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Calendar,
  LogOut,
  Package,
  Shield,
  Coins,
  ArrowRight,
  Edit2,
  Save,
  X,
  Award,
  Clock,
  Compass,
  Lock as LockIcon,
} from "lucide-react";
import { toast } from "sonner";

// Container animations for Bento Grid cards stagger reveal
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Local profile states for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(
    user?.fullName || user?.name || "Maison Member",
  );
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch recent user orders
  const { data: responseData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["userOrders"],
    queryFn: orderService.getUserOrders,
  });

  const rawOrders =
    responseData?.data || (Array.isArray(responseData) ? responseData : []);
  const recentOrders = rawOrders.slice(0, 3).map((order: any) => ({
    id: order._id || order.id || "VV-UNKNOWN",
    status: order.status
      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
      : "Pending",
    totalAmount: order.totalAmount ?? 0,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Date Unknown",
  }));

  const handleLogout = async () => {
    try {
      await performAppLogout(dispatch);
      toast.success("Logged out from Vault-Vogue Maison.");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast.success("Maison credentials updated successfully.");
  };

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-[var(--vault-bg)] text-[var(--vault-ink)] transition-colors duration-300 flex flex-col justify-start">
        {/* ── Breadcrumb Bar ── */}
        <div className="border-b border-[var(--vault-line)] bg-[var(--vault-panel)]/50 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--vault-muted)]"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="hover:text-[var(--vault-ink)] transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-[var(--vault-muted)]">Maison Portal</span>
              <span>/</span>
              <span className="text-[var(--vault-accent)] font-semibold">
                Account Overview
              </span>
            </nav>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          {/* Header Title */}
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
              Maison Member Portal
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--vault-ink)] mt-2">
              Account Overview
            </h1>
            <div className="h-0.5 w-12 bg-[var(--vault-accent)] mt-3" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* ─── 1. OVERVIEW BANNER (Spans all columns) ─── */}
            <motion.div
              variants={cardVariants}
              className="md:col-span-3 rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                {/* Avatar */}
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full border border-[var(--vault-accent)]/30 bg-[var(--vault-accent)]/10 flex items-center justify-center overflow-hidden">
                  <span className="font-mono text-2xl font-bold text-[var(--vault-accent)]">
                    {getInitials(fullName)}
                  </span>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
                    <h2 className="font-serif text-2xl font-light text-[var(--vault-ink)]">
                      {fullName}
                    </h2>
                    <span className="rounded-full bg-[var(--vault-accent)]/10 border border-[var(--vault-accent)]/30 text-[9px] font-bold uppercase tracking-wider text-[var(--vault-accent)] px-3 py-0.5">
                      Elite Member
                    </span>
                  </div>
                  <p className="text-xs text-[var(--vault-muted)] mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Shield className="h-3.5 w-3.5 text-[var(--vault-accent)]" />
                    Maison Security ID:{" "}
                    {user?.id ? user.id.slice(-8).toUpperCase() : "MEMBER"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/orders")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] transition-all shadow-sm active:scale-[0.98]"
                >
                  <Package className="h-4 w-4" />
                  All Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--vault-accent)]/40 bg-[var(--vault-accent)]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--vault-accent)] hover:bg-[var(--vault-accent)] hover:text-white transition-all shadow-sm active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>

            {/* ─── 2. MAISON PROFILE CARD ─── */}
            <motion.div variants={cardVariants} className="flex flex-col">
              <div className="rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-[var(--vault-accent)]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vault-muted)]">
                        Profile Details
                      </span>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg text-[var(--vault-muted)] hover:text-[var(--vault-accent)] hover:bg-[var(--vault-bg)] transition-colors"
                        aria-label="Edit Profile"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-1.5 rounded-lg text-[var(--vault-muted)] hover:text-rose-500 hover:bg-[var(--vault-bg)] transition-colors"
                        aria-label="Cancel Edit"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div
                        key="view"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-5"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--vault-muted)] uppercase tracking-wider block">
                            Full Name
                          </span>
                          <p className="text-sm font-semibold text-[var(--vault-ink)]">
                            {fullName}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--vault-muted)] uppercase tracking-wider block">
                            Email Address
                          </span>
                          <p className="text-sm font-semibold text-[var(--vault-ink)] truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[var(--vault-muted)] uppercase tracking-wider block">
                            Phone Number
                          </span>
                          <p className="text-sm font-semibold text-[var(--vault-ink)]">
                            {phoneNumber}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="edit"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        onSubmit={handleSaveChanges}
                        className="space-y-4"
                      >
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-bold text-[var(--vault-muted)] uppercase tracking-wider">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-xl border border-[var(--vault-line)] bg-[var(--vault-bg)] px-3.5 py-2 text-sm text-[var(--vault-ink)] font-medium focus:border-[var(--vault-accent)] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-bold text-[var(--vault-muted)] uppercase tracking-wider">
                            Email Address
                          </label>
                          <input
                            type="email"
                            disabled
                            value={user?.email || ""}
                            className="w-full rounded-xl border border-[var(--vault-line)]/50 bg-[var(--vault-bg)]/50 px-3.5 py-2 text-sm font-medium text-[var(--vault-muted)] cursor-not-allowed outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-bold text-[var(--vault-muted)] uppercase tracking-wider">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full rounded-xl border border-[var(--vault-line)] bg-[var(--vault-bg)] px-3.5 py-2 text-sm text-[var(--vault-ink)] font-medium focus:border-[var(--vault-accent)] focus:outline-none transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--vault-accent)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:brightness-110 transition-all shadow-sm mt-4 active:scale-[0.98]"
                        >
                          {isSaving ? (
                            "Saving Changes..."
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
                <div className="pt-5 border-t border-[var(--vault-line)] mt-6 flex items-center gap-2 text-[10px] text-[var(--vault-muted)] font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-[var(--vault-accent)]" />
                  Maison member since July 2026
                </div>
              </div>
            </motion.div>

            {/* ─── 3. LOYALTY & PERKS CARD ─── */}
            <motion.div variants={cardVariants} className="flex flex-col">
              <div className="rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Coins className="h-4 w-4 text-[var(--vault-accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vault-muted)]">
                      Maison Loyalty Points
                    </span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="font-mono text-4xl font-extrabold text-[var(--vault-ink)] tracking-tight">
                        4,720
                        <span className="text-xs font-normal text-[var(--vault-muted)] ml-1">
                          pts
                        </span>
                      </p>
                      <p className="text-xs text-[var(--vault-muted)] mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--vault-accent)]" />
                        Next Unlock: Platinum Tier (5,000 pts)
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-[var(--vault-line)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--vault-accent)] rounded-full"
                          style={{ width: "88%" }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-[var(--vault-muted)] tracking-wider">
                        <span>4,000 PTS</span>
                        <span>5,000 PTS (PLATINUM)</span>
                      </div>
                    </div>

                    <ul className="space-y-3 pt-3 border-t border-[var(--vault-line)]">
                      <li className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-[var(--vault-ink)]">
                            Complimentary Courier Dispatch
                          </p>
                          <p className="text-[10px] text-emerald-500 font-medium">
                            Active (Orders above ₹10,000)
                          </p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-[var(--vault-cobalt)]/10 flex items-center justify-center border border-[var(--vault-cobalt)]/30">
                          <Clock className="h-3 w-3 text-[var(--vault-cobalt)]" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-[var(--vault-ink)]">
                            Early Private Archive Access
                          </p>
                          <p className="text-[10px] text-[var(--vault-cobalt)] font-medium">
                            12d 4h remaining
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-5 border-t border-[var(--vault-line)] mt-6">
                  <button
                    onClick={() =>
                      toast.info(
                        "Atelier Concierge is available via chat/call.",
                      )
                    }
                    className="w-full flex items-center justify-between rounded-xl border border-[var(--vault-line)] bg-[var(--vault-bg)] hover:border-[var(--vault-accent)]/50 p-3 text-xs font-semibold text-[var(--vault-ink)] transition-colors active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[var(--vault-accent)]" />
                      Atelier Perks Catalogue
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--vault-muted)]" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ─── 4. RECENT ORDERS CARD ─── */}
            <motion.div variants={cardVariants} className="flex flex-col">
              <div className="rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Package className="h-4 w-4 text-[var(--vault-accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--vault-muted)]">
                      Recent Orders
                    </span>
                  </div>

                  {isOrdersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="h-14 w-full bg-[var(--vault-bg)] animate-pulse rounded-xl border border-[var(--vault-line)]"
                        />
                      ))}
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center">
                      <Compass className="h-9 w-9 text-[var(--vault-muted)]/50 mb-2" />
                      <p className="text-xs font-medium text-[var(--vault-muted)]">
                        No orders placed yet.
                      </p>
                      <button
                        onClick={() => router.push("/products")}
                        className="text-[10px] font-bold text-[var(--vault-accent)] uppercase tracking-wider hover:underline mt-2"
                      >
                        Browse Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((order: any) => (
                        <div
                          key={order.id}
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="group cursor-pointer rounded-2xl border border-[var(--vault-line)] hover:border-[var(--vault-accent)] p-3.5 bg-[var(--vault-bg)] transition-all duration-200 flex items-center justify-between"
                        >
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-[var(--vault-ink)] group-hover:text-[var(--vault-accent)] transition-colors truncate">
                              {order.id.slice(-12).toUpperCase()}
                            </p>
                            <p className="text-[10px] text-[var(--vault-muted)] font-mono mt-0.5">
                              {order.date}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div className="space-y-0.5">
                              <p className="font-mono text-xs font-bold text-[var(--vault-ink)]">
                                ₹{order.totalAmount.toLocaleString("en-IN")}.00
                              </p>
                              <div className="flex items-center gap-1.5 justify-end">
                                <div
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    order.status.toLowerCase() ===
                                      "delivered" ||
                                    order.status.toLowerCase() === "confirmed"
                                      ? "bg-emerald-500"
                                      : "bg-[var(--vault-accent)]"
                                  }`}
                                />
                                <span className="text-[9px] font-bold text-[var(--vault-muted)] uppercase tracking-wider">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-[var(--vault-muted)] group-hover:text-[var(--vault-accent)] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-[var(--vault-line)] mt-6">
                  <button
                    onClick={() => router.push("/orders")}
                    className="w-full flex items-center justify-between rounded-xl border border-[var(--vault-line)] bg-[var(--vault-bg)] hover:border-[var(--vault-accent)]/50 p-3 text-xs font-semibold text-[var(--vault-ink)] transition-colors active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2">
                      <LockIcon className="h-4 w-4 text-[var(--vault-accent)]" />
                      Fulfillment History
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--vault-muted)]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedPage>
  );
}
