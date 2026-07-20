"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Bell, Menu } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SellerSidebar } from "./SellerSidebar";
import { useState, useEffect } from "react";

const pageTitles: Record<string, string> = {
  "/seller/dashboard": "Dashboard Overview",
  "/seller/inventory": "Inventory Management",
  "/seller/orders": "Order Fulfilment",
  "/seller/payments": "Payments & Payouts Options",
};

export function SellerHeader() {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const title = pageTitles[pathname ?? "/seller"] ?? "Seller Atelier";
  const [dateStr, setDateStr] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDateStr(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  const initials =
    mounted && user?.name
      ? user.name
          .split(" ")
          .map((n: any) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "SP";

  return (
    <header
      className="flex items-center justify-between px-6 py-4 shrink-0"
      style={{
        borderBottom: "1px solid var(--gold-faint)",
        background: "var(--background)",
      }}
    >
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[var(--gold)] cursor-pointer"
              style={{
                borderColor: "var(--gold-faint)",
                background: "var(--gold-glow)",
              }}
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" style={{ color: "var(--gold)" }} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[248px] border-r-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SellerSidebar />
          </SheetContent>
        </Sheet>

        <div>
          <h1
            className="font-cormorant text-2xl font-light"
            style={{ color: "var(--brand-text)" }}
          >
            {title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 min-h-[16px]">
            {dateStr}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[var(--gold)] cursor-pointer"
          style={{
            borderColor: "var(--gold-faint)",
            background: "var(--gold-glow)",
          }}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" style={{ color: "var(--gold)" }} />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full"
            style={{ background: "var(--sale-red-500)" }}
          />
        </button>

        {/* Theme Toggler */}
        <ModeToggle />

        {/* User initials badge */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold"
          style={{
            background: "var(--gold-faint)",
            border: "1px solid var(--gold-soft)",
            color: "var(--gold)",
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
