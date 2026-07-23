"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Inbox } from "lucide-react";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  rightHeaderAction?: React.ReactNode;
  globalFilter?: string;
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>;
  emptyState?: React.ReactNode;
  pageIndex?: number;
  pageCount?: number;
  onPageChange?: (index: number) => void;
  totalRecords?: number;
  pageSize?: number;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search...",
  rightHeaderAction,
  globalFilter = "",
  setGlobalFilter = () => {},
  emptyState,
  pageIndex,
  pageCount,
  onPageChange,
  totalRecords,
  pageSize = 10,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      ...(pageIndex !== undefined && {
        pagination: {
          pageIndex,
          pageSize,
        },
      }),
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: pageCount !== undefined,
    pageCount: pageCount,
  });

  const tablePageIndex = table.getState().pagination.pageIndex;
  const tablePageCount = table.getPageCount();

  const canPrev =
    pageIndex !== undefined ? pageIndex > 0 : table.getCanPreviousPage();
  const canNext =
    pageIndex !== undefined && pageCount !== undefined
      ? pageIndex < pageCount - 1
      : table.getCanNextPage();

  const handlePrevPage = () => {
    table.previousPage();
  };

  const handleNextPage = () => {
    table.nextPage();
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm bg-background dark:bg-zinc-900 border border-border/60 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-all"
          />
        </div>
        {rightHeaderAction && (
          <div className="flex items-center gap-2">{rightHeaderAction}</div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] backdrop-blur-md">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-100 dark:border-zinc-800"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-3.5 px-6 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)] align-middle select-none whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  // Skeleton loader
                  Array.from({ length: 5 }).map((_, rIdx) => (
                    <tr key={`skeleton-${rIdx}`}>
                      {columns.map((_, cIdx) => (
                        <td key={`skeleton-cell-${cIdx}`} className="py-4 px-6">
                          <Skeleton className="h-4 w-4/5" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  // Empty State
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-16 px-6 text-center"
                    >
                      {emptyState || (
                        <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 dark:bg-zinc-900/50 text-muted-foreground">
                            <Inbox className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                              No records found
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              We couldn't find any items matching your request.
                              Try adjusting your filter or search.
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  // Table Rows
                  table.getRowModel().rows.map((row) => (
                    <motion.tr
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      key={row.id}
                      className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-900/30"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="py-4 px-6 text-sm text-gray-700 dark:text-zinc-300 align-middle whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && table.getRowModel().rows.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/10">
            <p className="text-xs text-muted-foreground font-medium">
              Showing{" "}
              <span className="font-mono text-gray-900 dark:text-zinc-100">
                {totalRecords !== undefined
                  ? totalRecords
                  : table.getFilteredRowModel().rows.length}
              </span>{" "}
              records
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground font-medium">
                Page{" "}
                <span className="font-mono text-gray-900 dark:text-zinc-100">
                  {pageIndex !== undefined ? pageIndex + 1 : tablePageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-mono text-gray-900 dark:text-zinc-100">
                  {pageCount !== undefined ? pageCount : tablePageCount}
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={
                    pageIndex !== undefined && onPageChange
                      ? () => onPageChange(pageIndex - 1)
                      : handlePrevPage
                  }
                  disabled={!canPrev}
                  className="flex items-center justify-center h-8 w-8 rounded-lg border border-border/40 hover:bg-muted-foreground/5 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={
                    pageIndex !== undefined && onPageChange
                      ? () => onPageChange(pageIndex + 1)
                      : handleNextPage
                  }
                  disabled={!canNext}
                  className="flex items-center justify-center h-8 w-8 rounded-lg border border-border/40 hover:bg-muted-foreground/5 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
