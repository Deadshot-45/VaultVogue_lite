"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { SellerRow, SellerStatus } from "@/types/admin";
import { motion } from "framer-motion";
import { Search, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { sellerService } from "@/lib/services/sellerService";
import { useDebounce } from "@/hooks/useDebounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services/adminService";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusCfg: Record<SellerStatus, { label: string; cls: string }> = {
  approved: { label: "Approved", cls: "badge badge-success" },
  pending: { label: "Pending", cls: "badge badge-gold" },
  rejected: { label: "Rejected", cls: "badge badge-sale" },
  suspended: { label: "Suspended", cls: "badge" },
};

const col = createColumnHelper<SellerRow>();

export default function SellersPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const query = useDebounce(globalFilter, 500);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Admin-sellers", limit, page, query],
    queryFn: () => adminService.getAllSellers(page, limit, query),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleApprove = async (id: string) => {
    try {
      await sellerService.approve(id);
      toast.success("Seller status approved!");
      refetch();
    } catch (err) {
      console.error("Failed to approve seller", err);
      toast.error("Failed to approve seller.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await sellerService.reject(id);
      toast.error("Seller status rejected.");
      refetch();
    } catch (err) {
      console.error("Failed to reject seller", err);
      toast.error("Failed to reject seller.");
    }
  };

  const columns = [
    col.accessor("businessName", {
      header: "Business",
      cell: (i) => (
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--brand-text)" }}
          >
            {i.getValue()}
          </p>
          <p className="text-xs text-muted-foreground">
            {i.row.original.email}
          </p>
        </div>
      ),
    }),
    col.accessor("ownerName", {
      header: "Owner",
      cell: (i) => (
        <span className="text-sm" style={{ color: "var(--brand-text)" }}>
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
    col.accessor("joinedAt", {
      header: "Joined",
      cell: (i) => (
        <span className="text-xs text-muted-foreground">
          {new Date(i.getValue()).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    }),
    col.accessor("revenue", {
      header: "Revenue",
      cell: (i) => (
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--brand-text)" }}
        >
          {i.getValue() > 0
            ? `\u20b9${i.getValue().toLocaleString("en-IN")}`
            : "\u2014"}
        </span>
      ),
    }),
    col.accessor("products", {
      header: "Products",
      cell: (i) => (
        <span className="text-xs text-muted-foreground">{i.getValue()}</span>
      ),
    }),
    col.accessor("status", {
      header: "Status",
      cell: (i) => {
        const c = statusCfg[i.getValue()];
        return <span className={c.cls}>{c.label}</span>;
      },
    }),
    col.display({
      id: "actions",
      header: "Actions",
      cell: (i) => {
        const row = i.row.original;
        return (
          <Select
            value={row.status}
            onValueChange={async (value) => {
              if (value === "approved") {
                await handleApprove(row.id);
              } else if (value === "rejected") {
                await handleReject(row.id);
              }
            }}
          >
            <SelectTrigger className="h-8 text-xs w-[120px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending" disabled>
                Pending
              </SelectItem>
              <SelectItem value="approved">
                Approved
              </SelectItem>
              <SelectItem value="rejected">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        );
      },
    }),
  ];


  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Loading Sellers...
        </span>
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
        data={data?.sellers ?? []}
        isLoading={isLoading}
        searchPlaceholder="Search products..."
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        // rightHeaderAction={rightAction}
        pageIndex={page - 1}
        pageCount={data?.pagination?.totalPages || data?.pagination?.pages || 1}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
        totalRecords={
          data?.pagination?.totalProducts ||
          data?.pagination?.total ||
          data?.sellers.length
        }
        pageSize={10}
      />
    </motion.div>
  );
}
