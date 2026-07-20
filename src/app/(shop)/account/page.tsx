"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/api/orderService";
import { performAppLogout } from "@/lib/store/logout";
import ProtectedPage from "@/components/auth/ProtectedPage";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Package,
  Shield,
  Coins,
  Sparkles,
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
  hidden: { opacity: 0, y: 20 },
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
  const [fullName, setFullName] = useState(user?.fullName || user?.name || "Maison Member");
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch recent user orders
  const { data: responseData, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["userOrders"],
    queryFn: orderService.getUserOrders,
  });

  const rawOrders = responseData?.data || (Array.isArray(responseData) ? responseData : []);
  const recentOrders = rawOrders.slice(0, 3).map((order: any) => ({
    id: order._id || order.id || "VV-UNKNOWN",
    status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending",
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSaving(false);
    setIsEditing(false);
    toast.success("Maison credentials updated successfully.");
  };

  // Get initials for Profile picture
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <ProtectedPage>
      <div className="min-h-[100dvh] bg-[#f9fafb] text-[var(--brand-text)] flex flex-col justify-start">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Asymmetric Header Layout */}
          <div className="mb-12 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
              Maison Member Portal
            </p>
            <h1 className="font-cormorant text-4xl md:text-5xl font-light text-[var(--brand-text)] mt-2.5">
              Account Overview
            </h1>
            <div className="h-[1px] w-12 bg-[var(--gold-soft)] mt-4" />
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
              className="md:col-span-3 rounded-[2rem] border border-slate-200/50 bg-white p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Avatar Refraction design */}
                <div className="relative h-20 w-20 rounded-full border border-[var(--gold-faint)] bg-[var(--gold-glow)] flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                  <span className="font-mono text-2xl font-semibold text-[var(--gold)] relative z-10">
                    {getInitials(fullName)}
                  </span>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center sm:justify-start">
                    <h2 className="font-cormorant text-2xl font-light text-slate-900 leading-tight">
                      {fullName}
                    </h2>
                    <span className="rounded-full bg-[var(--gold-glow)] border border-[var(--gold-faint)] text-[9px] font-bold uppercase tracking-wider text-[var(--gold)] px-2.5 py-0.5 mt-0.5">
                      Elite Member
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Shield className="h-3 w-3 text-[var(--gold)]" />
                    Maison Security ID: {user?.id ? user.id.slice(-8).toUpperCase() : "MEMBER"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/orders")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.98]"
                >
                  <Package className="h-4 w-4" />
                  All Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-soft)] bg-white px-5 py-3 text-xs font-semibold text-[var(--gold)] transition-all hover:bg-[var(--gold-glow)] shadow-sm active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>

            {/* ─── 2. MAISON PROFILE CARD (Visual Density: 4, label outside) ─── */}
            <motion.div variants={cardVariants} className="flex flex-col">
              <div className="rounded-[2.5rem] border border-slate-200/50 bg-white p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-[var(--gold)]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Profile Details
                      </span>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-lg text-slate-400 hover:text-[var(--gold)] hover:bg-slate-50 transition-colors"
                        aria-label="Edit Profile"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors"
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
                        className="space-y-6"
                      >
                        <div className="space-y-1 font-sans">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Full Name
                          </span>
                          <p className="text-sm font-semibold text-slate-800">{fullName}</p>
                        </div>
                        <div className="space-y-1 font-sans">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Email Address
                          </span>
                          <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                        </div>
                        <div className="space-y-1 font-sans">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Phone Number
                          </span>
                          <p className="text-sm font-semibold text-slate-800">{phoneNumber}</p>
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
                        <div className="space-y-1.5 text-left font-sans">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium focus:border-[var(--gold)] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5 text-left font-sans">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Email Address
                          </label>
                          <input
                            type="email"
                            disabled
                            value={user?.email || ""}
                            className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 text-left font-sans">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium focus:border-[var(--gold)] focus:outline-none transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm mt-6 active:scale-[0.98]"
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
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-[10px] text-slate-400 font-semibold font-sans">
                  <Calendar className="h-3.5 w-3.5 text-[var(--gold)]" />
                  Maison member since July 2026
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mt-3.5 px-6 font-sans">
                Vault-Vogue Identity System
              </span>
            </motion.div>

            {/* ─── 3. LOYALTY & PERKS CARD (Visual Density: 10 numbers) ─── */}
            <motion.div variants={cardVariants} className="flex flex-col">
              <div className="rounded-[2.5rem] border border-slate-200/50 bg-white p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <Coins className="h-4 w-4 text-[var(--gold)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Maison Loyalty Points
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      {/* Monospace rule applied for density numbers */}
                      <p className="font-mono text-4xl font-extrabold text-slate-900 tracking-tight">
                        4,720<span className="text-xs font-normal text-muted-foreground ml-1">pts</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-sans">
                        <Sparkles className="h-3 w-3 text-[var(--gold)]" />
                        Next Reward Unlock: Platinum Tier
                      </p>
                    </div>

                    {/* Progress slider bar */}
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--gold)] rounded-full" style={{ width: "88%" }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 tracking-wider font-sans">
                        <span>4,000 PTS</span>
                        <span>5,000 PTS (PLATINUM)</span>
                      </div>
                    </div>

                    <ul className="space-y-4 pt-4 border-t border-slate-100 font-sans">
                      <li className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-slate-800">Complimentary Standard Shipping</p>
                          <p className="text-[10px] text-green-600 font-medium">Active (Orders above ₹999)</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                          <Clock className="h-3 w-3 text-blue-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-slate-800">Early Private Sale Access</p>
                          <p className="text-[10px] text-blue-500 font-medium">12d 4h remaining</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 font-sans">
                  <button
                    onClick={() => toast.info("Atelier Concierge is available via chat/call.")}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 p-3.5 text-xs font-semibold text-slate-700 transition-colors active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[var(--gold)]" />
                      Atelier Perks Catalogue
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mt-3.5 px-6 font-sans">
                Premium Atelier Privileges
              </span>
            </motion.div>

            {/* ─── 4. RECENT ORDERS CARD (Waterflow reveal) ─── */}
            <motion.div variants={cardVariants} className="flex flex-col">
              <div className="rounded-[2.5rem] border border-slate-200/50 bg-white p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <Package className="h-4 w-4 text-[var(--gold)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Recent Orders
                    </span>
                  </div>

                  {isOrdersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-16 w-full bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
                      ))}
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center font-sans">
                      <Compass className="h-10 w-10 text-slate-300 stroke-1 mb-3" />
                      <p className="text-xs font-medium text-slate-500">No Maison orders placed yet.</p>
                      <button
                        onClick={() => router.push("/")}
                        className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider hover:underline mt-2.5"
                      >
                        Browse Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order: any) => (
                        <div
                          key={order.id}
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="group cursor-pointer rounded-2xl border border-slate-100 hover:border-[var(--gold-soft)] p-4 bg-slate-50/50 transition-all duration-300 flex items-center justify-between"
                        >
                          <div className="min-w-0 text-left font-sans">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-[var(--gold)] transition-colors truncate">
                              {order.id.slice(-12).toUpperCase()}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{order.date}</p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div className="space-y-1">
                              <p className="font-mono text-xs font-bold text-slate-800">
                                ₹{order.totalAmount.toLocaleString("en-IN")}.00
                              </p>
                              <div className="flex items-center gap-1.5 justify-end font-sans">
                                <div
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    order.status.toLowerCase() === "delivered" || order.status.toLowerCase() === "confirmed"
                                      ? "bg-green-500 animate-pulse"
                                      : "bg-[var(--gold)] animate-pulse"
                                  }`}
                                />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 font-sans">
                  <button
                    onClick={() => router.push("/orders")}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 p-3.5 text-xs font-semibold text-slate-700 transition-colors active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2">
                      <LockIcon className="h-4 w-4 text-[var(--gold)]" />
                      Fulfillment History
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mt-3.5 px-6 font-sans">
                Traceable Courier Logistics
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedPage>
  );
}