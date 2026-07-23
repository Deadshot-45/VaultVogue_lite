"use client";

import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { ProductRow } from "@/types/admin";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "@/lib/services/adminService";
import { useDebounce } from "@/hooks/useDebounce";

const statusCfg: Record<string, string> = {
  active: "badge badge-success",
  draft: "badge badge-gold",
  archived: "badge badge-sale",
};

const col = createColumnHelper<ProductRow>();
const columns = [
  col.accessor("id", {
    header: "SKU",
    cell: (i) => (
      <span className="font-mono text-xs text-[var(--gold)]">
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor("name", {
    header: "Product",
    cell: (i) => (
      <span className="text-sm font-medium text-[var(--brand-text)]">
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor("category", {
    header: "Category",
    cell: (i) => (
      <span className="text-xs text-muted-foreground">{i.getValue()}</span>
    ),
  }),
  col.accessor("price", {
    header: "Price",
    cell: (i) => (
      <span className="text-sm font-semibold font-mono text-[var(--brand-text)]">
        ₹{i.getValue().toLocaleString("en-IN")}
      </span>
    ),
  }),
  col.accessor("stock", {
    header: "Stock",
    cell: (i) => (
      <span
        className={`text-xs font-semibold font-mono ${i.getValue() === 0 ? "text-destructive" : "text-muted-foreground"}`}
      >
        {i.getValue() === 0 ? "Out of stock" : i.getValue()}
      </span>
    ),
  }),
  col.accessor("status", {
    header: "Status",
    cell: (i) => (
      <span className={statusCfg[i.getValue()]}>{i.getValue()}</span>
    ),
  }),
];

export default function ProductsPage() {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const query = useDebounce(globalFilter, 500);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-product", page, limit, query],
    queryFn: () => adminService.getAllProducts(page, limit, query),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
  const rawProducts = data?.products || [];

  const rightAction = (
    <button className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2 hover:scale-[0.98] transition-all cursor-pointer">
      <Plus className="h-4 w-4" />
      Add Product
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <DataTable
        columns={columns}
        data={rawProducts}
        isLoading={isLoading}
        searchPlaceholder="Search products..."
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        rightHeaderAction={rightAction}
        pageIndex={page - 1}
        pageCount={data?.pagination?.totalPages || data?.pagination?.pages || 1}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
        totalRecords={
          data?.pagination?.totalProducts ||
          data?.pagination?.total ||
          rawProducts.length
        }
        pageSize={10}
      />
    </motion.div>
  );
}
