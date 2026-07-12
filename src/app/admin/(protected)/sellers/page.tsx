"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { SellerRow, SellerStatus } from "@/types/admin";
import { motion } from "framer-motion";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const SELLERS: SellerRow[] = [
  { id: 'SEL-001', businessName: 'Luxe Collections Pvt Ltd',  ownerName: 'Rohan Mehta',      email: 'rohan@luxecollections.com',  category: 'Handbags',    joinedAt: '2024-02-20', status: 'approved',  revenue: 480000,  products: 14 },
  { id: 'SEL-002', businessName: 'Artisan Atelier',           ownerName: 'Meera Iyer',        email: 'meera@artisanatelier.in',    category: 'Jewellery',   joinedAt: '2024-04-01', status: 'approved',  revenue: 210000,  products: 8  },
  { id: 'SEL-003', businessName: 'Heritage Craft Studio',     ownerName: 'Suresh Pillai',     email: 'suresh@heritagecraft.in',    category: 'Accessories', joinedAt: '2024-05-15', status: 'pending',   revenue: 0,       products: 0  },
  { id: 'SEL-004', businessName: 'Couture House Mumbai',      ownerName: 'Divya Reddy',       email: 'divya@couturehouse.com',     category: 'Apparel',     joinedAt: '2024-06-22', status: 'approved',  revenue: 920000,  products: 32 },
  { id: 'SEL-005', businessName: 'The Leather Workshop',      ownerName: 'Kabir Das',         email: 'kabir@leatherworkshop.in',   category: 'Footwear',    joinedAt: '2024-07-08', status: 'rejected',  revenue: 0,       products: 0  },
  { id: 'SEL-006', businessName: 'Silk Route Emporium',       ownerName: 'Nandita Bose',      email: 'nandita@silkroute.in',       category: 'Accessories', joinedAt: '2024-08-14', status: 'approved',  revenue: 156000,  products: 6  },
  { id: 'SEL-007', businessName: 'Precious Gems & Co',        ownerName: 'Vikram Singh',      email: 'vikram@preciousgems.com',    category: 'Jewellery',   joinedAt: '2024-09-01', status: 'suspended', revenue: 88000,   products: 4  },
  { id: 'SEL-008', businessName: 'Fine Fragrance Boutique',   ownerName: 'Aisha Khan',        email: 'aisha@finefragrance.com',    category: 'Fragrances',  joinedAt: '2024-11-10', status: 'pending',   revenue: 0,       products: 0  },
];

const statusCfg: Record<SellerStatus, { label: string; cls: string }> = {
  approved:  { label: 'Approved',  cls: 'badge badge-success' },
  pending:   { label: 'Pending',   cls: 'badge badge-gold' },
  rejected:  { label: 'Rejected',  cls: 'badge badge-sale' },
  suspended: { label: 'Suspended', cls: 'badge' },
};

const col = createColumnHelper<SellerRow>();
const columns = [
  col.accessor('businessName', { header: 'Business', cell: (i) => <div><p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</p><p className="text-xs text-muted-foreground">{i.row.original.email}</p></div> }),
  col.accessor('ownerName',    { header: 'Owner',    cell: (i) => <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</span> }),
  col.accessor('category',     { header: 'Category', cell: (i) => <span className="text-xs text-muted-foreground">{i.getValue()}</span> }),
  col.accessor('joinedAt',     { header: 'Joined',   cell: (i) => <span className="text-xs text-muted-foreground">{new Date(i.getValue()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> }),
  col.accessor('revenue',      { header: 'Revenue',  cell: (i) => <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>{i.getValue() > 0 ? `\u20b9${i.getValue().toLocaleString('en-IN')}` : '\u2014'}</span> }),
  col.accessor('products',     { header: 'Products', cell: (i) => <span className="text-xs text-muted-foreground">{i.getValue()}</span> }),
  col.accessor('status',       { header: 'Status',   cell: (i) => { const c = statusCfg[i.getValue()]; return <span className={c.cls}>{c.label}</span>; } }),
];

export default function SellersPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data: SELLERS, columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search sellers..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="input-field pl-10 h-10" />
        </div>
        <Link href="/admin/sellers/onboard" className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Onboard Seller
        </Link>
      </div>
      <div className="card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>{table.getHeaderGroups().map((hg) => (<tr key={hg.id} style={{ borderBottom: '1px solid var(--gold-faint)' }}>{hg.headers.map((h) => (<th key={h.id} className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{flexRender(h.column.columnDef.header, h.getContext())}</th>))}</tr>))}</thead>
            <tbody>{table.getRowModel().rows.map((row, i) => (<tr key={row.id} className="transition-colors hover:bg-[var(--gold-glow)]" style={{ borderBottom: i < table.getRowModel().rows.length - 1 ? '1px solid var(--gold-faint)' : 'none' }}>{row.getVisibleCells().map((cell) => (<td key={cell.id} className="py-3.5 pr-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}</tr>))}</tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--gold-faint)' }}>
          <p className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} sellers</p>
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
