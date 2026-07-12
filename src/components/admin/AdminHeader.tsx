"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { useState, useEffect } from "react";

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products':  'Products',
  '/admin/orders':    'Orders',
  '/admin/users':     'Users',
  '/admin/sellers':   'Sellers',
  '/admin/sellers/onboard': 'Onboard Seller',
  '/admin/settings':  'Settings',
};

export function AdminHeader() {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const title = pageTitles[pathname ??  'Admin Panel'] ?? 'Admin Panel';
  const [dateStr, setDateStr] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDateStr(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const initials = mounted && user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AU';

  return (
    <header
      className="flex items-center justify-between px-6 py-4 shrink-0"
      style={{ borderBottom: '1px solid var(--gold-faint)', background: 'var(--background)' }}
    >
      <div>
        <h1
          className="font-cormorant text-2xl font-light"
          style={{ color: 'var(--brand-text)' }}
        >
          {title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 min-h-[16px]">
          {dateStr}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[var(--gold)] cursor-pointer"
          style={{ borderColor: 'var(--gold-faint)', background: 'var(--gold-glow)' }}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" style={{ color: 'var(--gold)' }} />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full"
            style={{ background: 'var(--sale-red-500)' }}
          />
        </button>

        <ModeToggle />

        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold"
          style={{
            background: 'var(--gold-faint)',
            border: '1px solid var(--gold-soft)',
            color: 'var(--gold)',
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
