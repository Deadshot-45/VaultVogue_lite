"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Gem,
  ArrowLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearAuth } from "@/lib/store/slices/authSlice";
import { clearAuthCookie } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLayoutEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/seller/inventory", icon: Package },
  { label: "Orders", href: "/seller/orders", icon: ShoppingCart },
  { label: "Payments Options", href: "/seller/payments", icon: CreditCard },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(clearAuth());
    clearAuthCookie();
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 248 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative z-20 flex flex-col shrink-0 border-r"
      style={{
        background: "var(--sidebar)",
        borderColor: "var(--sidebar-border)",
        height: "100vh",
      }}
    >
      <section className="flex flex-col h-full w-full">
        {/* Brand Header */}
        <div
          className="flex items-center gap-3 px-4 py-5 shrink-0"
          style={{ borderBottom: "1px solid var(--gold-faint)" }}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "var(--gold-faint)",
              border: "1px solid var(--gold-soft)",
            }}
          >
            <Gem className="h-4.5 w-4.5" style={{ color: "var(--gold)" }} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="section-label text-[10px] leading-none">
                  Vault Vogue
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Seller Atelier
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                  active
                    ? "font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
                style={
                  active
                    ? {
                        background: "var(--gold-faint)",
                        border: "1px solid var(--gold-soft)",
                        color: "var(--gold)",
                      }
                    : { border: "1px solid transparent" }
                }
              >
                <item.icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: active ? "var(--gold)" : undefined }}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {/* Quick link back to shop */}
          <div className="my-4 border-t border-[var(--gold-faint)]" />
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground",
            )}
            style={{ border: "1px solid transparent" }}
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Back to Boutique
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </nav>

        {/* User Info & Logout */}
        <div
          className="px-2 pb-4 shrink-0"
          style={{
            borderTop: "1px solid var(--gold-faint)",
            paddingTop: "1rem",
          }}
        >
          {!collapsed && mounted && (
            <div className="mb-3 px-3">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "var(--brand-text)" }}
              >
                {user?.fullName || "Seller Partner"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
          {!collapsed && !mounted && (
            <div className="mb-3 px-3 animate-pulse">
              <div className="h-3 w-24 bg-muted rounded mb-1.5" />
              <div className="h-2.5 w-32 bg-muted rounded" />
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-destructive cursor-pointer",
            )}
            style={{ border: "1px solid transparent" }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </section>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="absolute -right-3 top-20 z-10 hidden md:flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-colors duration-200 hover:border-[var(--gold)] cursor-pointer"
        style={{
          background: "var(--background)",
          borderColor: "var(--gold-soft)",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" style={{ color: "var(--gold)" }} />
        ) : (
          <ChevronLeft className="h-3 w-3" style={{ color: "var(--gold)" }} />
        )}
      </button>
    </motion.aside>
  );
}
