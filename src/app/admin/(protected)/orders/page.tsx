"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { OrderRow, OrderStatus } from "@/types/admin";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

const ORDERS: OrderRow[] = [
  { id: '#VV-10041', customer: 'Ananya Sharma',    email: 'ananya@gmail.com',    date: '2024-12-14', amount: 18500,  status: 'delivered',  items: 2 },
  { id: '#VV-10040', customer: 'Rohan Mehta',      email: 'rohan@outlook.com',   date: '2024-12-13', amount: 42000,  status: 'processing', items: 3 },
  { id: '#VV-10039', customer: 'Priya Nair',       email: 'priya@yahoo.com',     date: '2024-12-13', amount: 8750,   status: 'shipped',    items: 1 },
  { id: '#VV-10038', customer: 'Vikram Singh',     email: 'vikram@gmail.com',    date: '2024-12-12', amount: 95000,  status: 'pending',    items: 5 },
  { id: '#VV-10037', customer: 'Meera Iyer',       email: 'meera@icloud.com',    date: '2024-12-11', amount: 23000,  status: 'delivered',  items: 2 },
  { id: '#VV-10036', customer: 'Arjun Kapoor',     email: 'arjun@gmail.com',     date: '2024-12-11', amount: 6500,   status: 'cancelled',  items: 1 },
  { id: '#VV-10035', customer: 'Divya Reddy',      email: 'divya@outlook.com',   date: '2024-12-10', amount: 55000,  status: 'delivered',  items: 4 },
  { id: '#VV-10034', customer: 'Kabir Das',        email: 'kabir@yahoo.com',     date: '2024-12-09', amount: 12800,  status: 'refunded',   items: 1 },
  { id: '#VV-10033', customer: 'Nandita Bose',     email: 'nandita@gmail.com',   date: '2024-12-08', amount: 74500,  status: 'delivered',  items: 3 },
  { id: '#VV-10032', customer: 'Siddharth Rao',    email: 'siddharth@icloud.com',date: '2024-12-07', amount: 31000,  status: 'shipped',    items: 2 },
];

const statusCfg: Record<OrderStatus, { label: string; cls: string }> = {
  pending:    { label: 'Pending',    cls: 'badge badge-gold' },
  processing: { label: 'Processing', cls: 'badge badge-new' },
  shipped:    { label: 'Shipped',    cls: 'badge badge-gold' },
  delivered:  { label: 'Delivered',  cls: 'badge badge-success' },
  cancelled:  { label: 'Cancelled',  cls: 'badge badge-sale' },
  refunded:   { label: 'Refunded',   cls: 'badge' },
};

const col = createColumnHelper<OrderRow>();
const columns = [
  col.accessor('id',       { header: 'Order ID', cell: (i) => <span className="font-mono text-xs font-semibold" style={{ color: 'var(--gold)' }}>{i.getValue()}</span> }),
  col.accessor('customer', { header: 'Customer',  cell: (i) => <div><p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</p><p className="text-xs text-muted-foreground">{i.row.original.email}</p></div> }),
  col.accessor('date',     { header: 'Date',      cell: (i) => <span className="text-xs text-muted-foreground">{new Date(i.getValue()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> }),
  col.accessor('amount',   { header: 'Amount',    cell: (i) => <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>₹{i.getValue().toLocaleString('en-IN')}</span> }),
  col.accessor('items',    { header: 'Items',     cell: (i) => <span className="text-xs text-muted-foreground">{i.getValue()}</span> }),
  col.accessor('status',   { header: 'Status',    cell: (i) => { const c = statusCfg[i.getValue()]; return <span className={c.cls}>{c.label}</span>; } }),
];

export default function OrdersPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data: ORDERS, columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            placeholder="Search orders..." 
            value={globalFilter} 
            onChange={(e) => setGlobalFilter(e.target.value)} 
            className="input-field h-10 w-full" 
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>
      <div className="card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>{table.getHeaderGroups().map((hg) => (<tr key={hg.id} style={{ borderBottom: '1px solid var(--gold-faint)' }}>{hg.headers.map((h) => (<th key={h.id} className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{flexRender(h.column.columnDef.header, h.getContext())}</th>))}</tr>))}</thead>
            <tbody>{table.getRowModel().rows.map((row, i) => (<tr key={row.id} className="transition-colors hover:bg-[var(--gold-glow)]" style={{ borderBottom: i < table.getRowModel().rows.length - 1 ? '1px solid var(--gold-faint)' : 'none' }}>{row.getVisibleCells().map((cell) => (<td key={cell.id} className="py-3.5 pr-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}</tr>))}</tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--gold-faint)' }}>
          <p className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} orders</p>
          <div className="flex items-center gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40">Prev</button>
            <span className="text-xs text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
