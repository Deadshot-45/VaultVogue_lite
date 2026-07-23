"use client";

import { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { OrderRow, OrderStatus } from "@/types/admin";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { orderService } from "@/lib/services/orderService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services/adminService";
import { DataTable } from "@/components/ui/data-table";
import { useDebounce } from "@/hooks/useDebounce";

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
    const [page, setPage] = useState<number>(1);
    const query = useDebounce(globalFilter, 500)

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, query],
    queryFn: () => adminService.getAllOrders(page, 10, query),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const rightAction = (
    <button className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2 hover:scale-[0.98] transition-all cursor-pointer">
      <Plus className="h-4 w-4" />
      Add Product
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <DataTable
        columns={columns}
        data={data?.orders || []}
        isLoading={isLoading}
        searchPlaceholder="Search orders..."
        rightHeaderAction={rightAction}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        pageIndex={page - 1}
        pageCount={data?.pagination?.totalPages || data?.pagination?.pages || 1}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
        totalRecords={
          data?.pagination?.totalProducts ||
          data?.pagination?.total ||
          data?.orders.length
        }
        pageSize={10}
      />
    </motion.div>
  );

  // return (
  //   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
  //     <div className="mb-6">
  //       <div className="relative w-72">
  //         <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  //         <input 
  //           placeholder="Search orders..." 
  //           value={globalFilter} 
  //           onChange={(e) => setGlobalFilter(e.target.value)} 
  //           className="input-field h-10 w-full" 
  //           style={{ paddingLeft: '2.5rem' }}
  //         />
  //       </div>
  //     </div>
  //     <div className="card">
  //       <div className="overflow-x-auto no-scrollbar">
  //         <table className="w-full">
  //           <thead>{table.getHeaderGroups().map((hg) => (<tr key={hg.id} style={{ borderBottom: '1px solid var(--gold-faint)' }}>{hg.headers.map((h) => (<th key={h.id} className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{flexRender(h.column.columnDef.header, h.getContext())}</th>))}</tr>))}</thead>
  //           <tbody>{table.getRowModel().rows.map((row, i) => (<tr key={row.id} className="transition-colors hover:bg-[var(--gold-glow)]" style={{ borderBottom: i < table.getRowModel().rows.length - 1 ? '1px solid var(--gold-faint)' : 'none' }}>{row.getVisibleCells().map((cell) => (<td key={cell.id} className="py-3.5 pr-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>))}</tr>))}</tbody>
  //         </table>
  //       </div>
  //       <div className="mt-4 flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--gold-faint)' }}>
  //         <p className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} orders</p>
  //         <div className="flex items-center gap-2">
  //           <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40">Prev</button>
  //           <span className="text-xs text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
  //           <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40">Next</button>
  //         </div>
  //       </div>
  //     </div>
  //   </motion.div>
  // );
}
