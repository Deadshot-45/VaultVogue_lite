"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { CategoryDonutChart } from "@/components/admin/CategoryDonutChart";
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import type { StatsCardData } from "@/types/admin";

const stats: StatsCardData[] = [
  { id: '1', label: 'Total Revenue',   value: '\u20b9 12,48,300', delta: '+18.4%', trend: 'up',   icon: 'IndianRupee', description: 'Lifetime earnings' },
  { id: '2', label: 'Total Orders',    value: '8,640',       delta: '+12.1%', trend: 'up',   icon: 'ShoppingCart' },
  { id: '3', label: 'Active Products', value: '346',         delta: '+4.6%',  trend: 'up',   icon: 'Package' },
  { id: '4', label: 'Active Sellers',  value: '38',          delta: '-2.1%',  trend: 'down', icon: 'Store' },
  { id: '5', label: 'Avg Order Value', value: '\u20b9 1,444',      delta: '+6.3%',  trend: 'up',   icon: 'TrendingUp' },
  { id: '6', label: 'Customers',       value: '4,218',       delta: '+9.7%',  trend: 'up',   icon: 'Users' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 no-scrollbar">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => <StatsCard key={s.id} data={s} index={i} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <CategoryDonutChart />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable />
    </div>
  );
}
