"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { OrderRow, OrderStatus } from "@/types/admin";
import { motion } from "framer-motion";

const orders: OrderRow[] = [
  { id: '#VV-10041', customer: 'Ananya Sharma',    email: 'ananya@gmail.com',   date: '2024-12-14', amount: 18500, status: 'delivered',  items: 2 },
  { id: '#VV-10040', customer: 'Rohan Mehta',      email: 'rohan@outlook.com',  date: '2024-12-13', amount: 42000, status: 'processing', items: 3 },
  { id: '#VV-10039', customer: 'Priya Nair',       email: 'priya@yahoo.com',    date: '2024-12-13', amount: 8750,  status: 'shipped',    items: 1 },
  { id: '#VV-10038', customer: 'Vikram Singh',     email: 'vikram@gmail.com',   date: '2024-12-12', amount: 95000, status: 'pending',    items: 5 },
  { id: '#VV-10037', customer: 'Meera Iyer',       email: 'meera@icloud.com',   date: '2024-12-11', amount: 23000, status: 'delivered',  items: 2 },
  { id: '#VV-10036', customer: 'Arjun Kapoor',     email: 'arjun@gmail.com',    date: '2024-12-11', amount: 6500,  status: 'cancelled',  items: 1 },
  { id: '#VV-10035', customer: 'Divya Reddy',      email: 'divya@outlook.com',  date: '2024-12-10', amount: 55000, status: 'delivered',  items: 4 },
];

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
  const table = useReactTable({ data: orders, columns, getCoreRowModel: getCoreRowModel() });

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
