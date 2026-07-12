"use client";

import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import type { ProductRow } from "@/types/admin";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const PRODUCTS: ProductRow[] = [
  { id: 'PRD-001', name: 'Quilted Caviar Shoulder Bag',    category: 'Handbags',    price: 185000, stock: 12,  status: 'active'  },
  { id: 'PRD-002', name: 'Silk Twill Scarf — Floral',      category: 'Accessories', price: 24500,  stock: 45,  status: 'active'  },
  { id: 'PRD-003', name: 'Crocodile-Embossed Belt',        category: 'Accessories', price: 18000,  stock: 0,   status: 'draft'   },
  { id: 'PRD-004', name: 'Patent Leather Derby Shoes',     category: 'Footwear',    price: 42000,  stock: 8,   status: 'active'  },
  { id: 'PRD-005', name: 'Merino Wool Trench Coat',        category: 'Apparel',     price: 96000,  stock: 4,   status: 'active'  },
  { id: 'PRD-006', name: '18K Gold Leaf Drop Earrings',    category: 'Jewellery',   price: 56000,  stock: 20,  status: 'active'  },
  { id: 'PRD-007', name: 'Suede Chelsea Boots',            category: 'Footwear',    price: 38000,  stock: 15,  status: 'active'  },
  { id: 'PRD-008', name: 'Cashmere Wrap Coat — Camel',    category: 'Apparel',     price: 124000, stock: 0,   status: 'archived'},
  { id: 'PRD-009', name: 'Woven Leather Tote Bag',         category: 'Handbags',    price: 72000,  stock: 6,   status: 'active'  },
  { id: 'PRD-010', name: 'Diamond Tennis Bracelet',        category: 'Jewellery',   price: 280000, stock: 2,   status: 'active'  },
];

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
  const table = useReactTable({
    data: PRODUCTS,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <motion.div className="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="input-field pl-10 h-10 w-72"
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
