"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { SellerRow, SellerStatus } from "@/types/admin";
import { motion } from "framer-motion";
import { Search, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { sellerService } from "@/lib/services/sellerService";

const statusCfg: Record<SellerStatus, { label: string; cls: string }> = {
  approved:  { label: 'Approved',  cls: 'badge badge-success' },
  pending:   { label: 'Pending',   cls: 'badge badge-gold' },
  rejected:  { label: 'Rejected',  cls: 'badge badge-sale' },
  suspended: { label: 'Suspended', cls: 'badge' },
};

const col = createColumnHelper<SellerRow>();

export default function SellersPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadSellers = async () => {
    try {
      const data = await sellerService.getAll();
      const normalized = data.map((s: any) => ({
        id: s._id || s.id,
        businessName: s.name || s.businessName,
        ownerName: s.ownerName || "Owner",
        email: s.contactEmail || s.email,
        category: s.category || "Handbags",
        joinedAt: s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : s.joinedAt,
        status: s.status,
        revenue: s.revenue || 0,
        products: s.products || 0,
      }));
      setSellers(normalized);
    } catch (err) {
      console.error("Failed to load sellers", err);
      toast.error("Failed to load sellers from database.");
    }
  };

  useEffect(() => {
    setMounted(true);
    loadSellers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await sellerService.approve(id);
      toast.success("Seller status approved!");
      loadSellers();
    } catch (err) {
      console.error("Failed to approve seller", err);
      toast.error("Failed to approve seller.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await sellerService.reject(id);
      toast.error("Seller status rejected.");
      loadSellers();
    } catch (err) {
      console.error("Failed to reject seller", err);
      toast.error("Failed to reject seller.");
    }
  };

  const columns = [
    col.accessor('businessName', { header: 'Business', cell: (i) => <div><p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</p><p className="text-xs text-muted-foreground">{i.row.original.email}</p></div> }),
    col.accessor('ownerName',    { header: 'Owner',    cell: (i) => <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</span> }),
    col.accessor('category',     { header: 'Category', cell: (i) => <span className="text-xs text-muted-foreground">{i.getValue()}</span> }),
    col.accessor('joinedAt',     { header: 'Joined',   cell: (i) => <span className="text-xs text-muted-foreground">{new Date(i.getValue()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> }),
    col.accessor('revenue',      { header: 'Revenue',  cell: (i) => <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>{i.getValue() > 0 ? `\u20b9${i.getValue().toLocaleString('en-IN')}` : '\u2014'}</span> }),
    col.accessor('products',     { header: 'Products', cell: (i) => <span className="text-xs text-muted-foreground">{i.getValue()}</span> }),
    col.accessor('status',       { header: 'Status',   cell: (i) => { const c = statusCfg[i.getValue()]; return <span className={c.cls}>{c.label}</span>; } }),
    col.display({
      id: 'actions',
      header: 'Actions',
      cell: (i) => {
        const row = i.row.original;
        if (row.status === 'pending') {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(row.id)}
                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-emerald-500/20 cursor-pointer transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="px-2 py-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-red-500/20 cursor-pointer transition-colors"
              >
                Reject
              </button>
            </div>
          );
        }
        return <span className="text-xs text-muted-foreground font-medium">—</span>;
      }
    })
  ];

  const table = useReactTable({
    data: sellers, columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!mounted) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Loading Sellers...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 flex gap-2 items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            placeholder="Search sellers..." 
            value={globalFilter} 
            onChange={(e) => setGlobalFilter(e.target.value)} 
            className="input-field h-10 w-full" 
            style={{ paddingLeft: '2.5rem' }}
          />
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
