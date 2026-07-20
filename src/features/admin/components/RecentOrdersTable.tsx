"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { OrderRow, OrderStatus } from "@/types/admin";
import { motion } from "framer-motion";
import { api } from "@/lib/services/apiservices";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: 'Pending',    className: 'badge badge-gold' },
  processing: { label: 'Processing', className: 'badge' },
  shipped:    { label: 'Shipped',    className: 'badge badge-new' },
  delivered:  { label: 'Delivered',  className: 'badge badge-success' },
  cancelled:  { label: 'Cancelled',  className: 'badge badge-sale' },
  refunded:   { label: 'Refunded',   className: 'badge' },
};

const col = createColumnHelper<OrderRow>();

const columns = [
  col.accessor('id', {
    header: 'Order ID',
    cell: (info) => (
      <span className="font-mono text-xs font-semibold" style={{ color: 'var(--gold)' }}>
        {info.getValue()}
      </span>
    ),
  }),
  col.accessor('customer', {
    header: 'Customer',
    cell: (info) => (
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{info.getValue()}</p>
        <p className="text-xs text-muted-foreground">{info.row.original.email}</p>
      </div>
    ),
  }),
  col.accessor('date', {
    header: 'Date',
    cell: (info) => (
      <span className="text-xs text-muted-foreground">
        {new Date(info.getValue()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    ),
  }),
  col.accessor('amount', {
    header: 'Amount',
    cell: (info) => (
      <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>
        ₹{info.getValue().toLocaleString('en-IN')}
      </span>
    ),
  }),
  col.accessor('items', {
    header: 'Items',
    cell: (info) => (
      <span className="text-xs text-muted-foreground text-center block">{info.getValue()}</span>
    ),
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const cfg = statusConfig[info.getValue()];
      return <span className={cfg.className}>{cfg.label}</span>;
    },
  }),
];

export function RecentOrdersTable() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await api.get<{ success: boolean; data: any[] }>("/api/orders/admin/all");
        if (response.data.success) {
          const mapped = response.data.data.slice(0, 7).map((o: any) => ({
            id: o.id || o._id,
            customer: o.address?.fullName || o.userId?.email || "Guest Customer",
            email: o.userId?.email || "",
            date: o.placedAt || o.createdAt,
            amount: o.totalAmount,
            status: o.status || "pending",
            items: o.totalItems || o.items?.length || 0,
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch recent orders", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const table = useReactTable({ data: orders, columns, getCoreRowModel: getCoreRowModel() });

  if (isLoading) {
    return (
      <div className="card py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card"
    >
      <div className="mb-6">
        <p className="section-label text-[10px]">Order Activity</p>
        <h3 className="font-cormorant text-2xl font-light mt-1" style={{ color: 'var(--brand-text)' }}>
          Recent Orders
        </h3>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} style={{ borderBottom: '1px solid var(--gold-faint)' }}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--gold)' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className="transition-colors duration-200 hover:bg-[var(--gold-glow)]"
                style={{ borderBottom: i < orders.length - 1 ? '1px solid var(--gold-faint)' : 'none' }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3.5 pr-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
