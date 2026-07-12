"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { UserRow } from "@/types/admin";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

const USERS: UserRow[] = [
  { id: 'USR-001', fullName: 'Ananya Sharma',    email: 'ananya@gmail.com',    role: 'user',   joinedAt: '2024-01-15', orders: 12, status: 'active' },
  { id: 'USR-002', fullName: 'Rohan Mehta',      email: 'rohan@outlook.com',   role: 'seller', joinedAt: '2024-02-20', orders: 3,  status: 'active' },
  { id: 'USR-003', fullName: 'Priya Nair',       email: 'priya@yahoo.com',     role: 'user',   joinedAt: '2024-03-05', orders: 8,  status: 'active' },
  { id: 'USR-004', fullName: 'Vikram Singh',     email: 'vikram@gmail.com',    role: 'user',   joinedAt: '2024-03-18', orders: 25, status: 'active' },
  { id: 'USR-005', fullName: 'Meera Iyer',       email: 'meera@icloud.com',    role: 'seller', joinedAt: '2024-04-01', orders: 1,  status: 'active' },
  { id: 'USR-006', fullName: 'Arjun Kapoor',     email: 'arjun@gmail.com',     role: 'user',   joinedAt: '2024-04-22', orders: 5,  status: 'suspended' },
  { id: 'USR-007', fullName: 'Divya Reddy',      email: 'divya@outlook.com',   role: 'user',   joinedAt: '2024-05-10', orders: 19, status: 'active' },
  { id: 'USR-008', fullName: 'Vault Admin',      email: 'admin@vaultvogue.com',role: 'admin',  joinedAt: '2024-01-01', orders: 0,  status: 'active' },
];

const roleCfg: Record<string, string> = {
  admin:  'badge badge-sale',
  seller: 'badge badge-new',
  user:   'badge badge-gold',
};

const col = createColumnHelper<UserRow>();
const columns = [
  col.accessor('fullName', { header: 'Name', cell: (i) => <div><p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</p><p className="text-xs text-muted-foreground">{i.row.original.email}</p></div> }),
  col.accessor('role',     { header: 'Role',    cell: (i) => <span className={roleCfg[i.getValue()]}>{i.getValue()}</span> }),
  col.accessor('joinedAt', { header: 'Joined',  cell: (i) => <span className="text-xs text-muted-foreground">{new Date(i.getValue()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> }),
  col.accessor('orders',   { header: 'Orders',  cell: (i) => <span className="text-xs font-semibold" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</span> }),
  col.accessor('status',   { header: 'Status',  cell: (i) => <span className={i.getValue() === 'active' ? 'badge badge-success' : 'badge badge-sale'}>{i.getValue()}</span> }),
];

export default function UsersPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data: USERS, columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 w-72">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search users..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="input-field pl-10 h-10" />
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
          <p className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} users</p>
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
