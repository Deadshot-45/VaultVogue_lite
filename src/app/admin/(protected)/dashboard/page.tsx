"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/features/admin/components/StatsCard";
import { RevenueChart } from "@/features/admin/components/RevenueChart";
import { CategoryDonutChart } from "@/features/admin/components/CategoryDonutChart";
import { RecentOrdersTable } from "@/features/admin/components/RecentOrdersTable";
import type { StatsCardData } from "@/types/admin";
import { api } from "@/lib/services/apiservices";

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any }>("/api/dashboard/overview");
        if (response.data.success) {
          const { summary } = response.data.data;
          const mappedStats: StatsCardData[] = [
            { id: '1', label: 'Total Revenue',   value: `\u20b9 ${summary.totalRevenue.toLocaleString('en-IN')}`, delta: '+18.4%', trend: 'up',   icon: 'IndianRupee', description: 'Lifetime earnings' },
            { id: '2', label: 'Total Orders',    value: summary.totalOrders.toLocaleString('en-IN'),       delta: '+12.1%', trend: 'up',   icon: 'ShoppingCart' },
            { id: '3', label: 'Active Products', value: summary.activeProducts.toLocaleString('en-IN'),         delta: '+4.6%',  trend: 'up',   icon: 'Package' },
            { id: '4', label: 'Active Sellers',  value: summary.activeSellers.toLocaleString('en-IN'),          delta: '-2.1%',  trend: 'down', icon: 'Store' },
            { id: '5', label: 'Avg Order Value', value: `\u20b9 ${summary.avgOrderValue.toLocaleString('en-IN')}`,      delta: '+6.3%',  trend: 'up',   icon: 'TrendingUp' },
            { id: '6', label: 'Customers',       value: summary.customersCount.toLocaleString('en-IN'),       delta: '+9.7%',  trend: 'up',   icon: 'Users' },
          ];
          setStats(mappedStats);
        }
      } catch (err) {
        console.error("Failed to load dashboard overview", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

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
