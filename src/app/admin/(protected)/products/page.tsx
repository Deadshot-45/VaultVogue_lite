"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { ProductRow } from "@/types/admin";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useGetProducts } from "@/lib/queries/useGetProducts";

const statusCfg: Record<string, string> = {
  active:   'badge badge-success',
  draft:    'badge badge-gold',
  archived: 'badge badge-sale',
};

const col = createColumnHelper<ProductRow>();
const columns = [
  col.accessor('id', {
    header: 'SKU',
    cell: (i) => <span className="font-mono text-xs" style={{ color: 'var(--gold)' }}>{i.getValue()}</span>,
  }),
  col.accessor('name', {
    header: 'Product',
    cell: (i) => <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{i.getValue()}</span>,
  }),
  col.accessor('category', {
    header: 'Category',
    cell: (i) => <span className="text-xs text-muted-foreground">{i.getValue()}</span>,
  }),
  col.accessor('price', {
    header: 'Price',
    cell: (i) => <span className="text-sm font-semibold" style={{ color: 'var(--brand-text)' }}>₹{i.getValue().toLocaleString('en-IN')}</span>,
  }),
  col.accessor('stock', {
    header: 'Stock',
    cell: (i) => (
      <span className={`text-xs font-semibold ${i.getValue() === 0 ? 'text-destructive' : ''}`}>
        {i.getValue() === 0 ? 'Out of stock' : i.getValue()}
      </span>
    ),
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => <span className={statusCfg[i.getValue()]}>{i.getValue()}</span>,
  }),
];

export default function ProductsPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const { data, isLoading } = useGetProducts({ limit: 100 });
  const rawProducts = data?.pages.flatMap((page) => page) || [];

  const products: ProductRow[] = rawProducts.map((p) => {
    const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: totalStock,
      status: totalStock > 0 ? "active" : "draft",
    };
  });

  const table = useReactTable({
    data: products,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  return (
    <motion.div className="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="rounded-lg h-10 w-72"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <button className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} style={{ borderBottom: '1px solid var(--gold-faint)' }}>
                  {hg.headers.map((h) => (
                    <th key={h.id} className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr key={row.id} className="transition-colors hover:bg-[var(--gold-glow)]" style={{ borderBottom: i < table.getRowModel().rows.length - 1 ? '1px solid var(--gold-faint)' : 'none' }}>
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
        <div className="mt-4 flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--gold-faint)' }}>
          <p className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} products</p>
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
