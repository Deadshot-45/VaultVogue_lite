"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { UserRow } from "@/types/admin";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ApiService } from "@/lib/services/apiservices";
import { useGetProducts } from "@/lib/queries/useGetProducts";
import { adminService } from "@/lib/services/adminService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { useDebounce } from "@/hooks/useDebounce";

const roleCfg: Record<string, string> = {
  admin: "badge badge-sale",
  seller: "badge badge-new",
  user: "badge badge-gold",
  customer: "badge badge-gold",
};

const col = createColumnHelper<UserRow>();
const columns = [
  col.accessor("fullName", {
    header: "Name",
    cell: (i) => (
      <div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--brand-text)" }}
        >
          {i.getValue()}
        </p>
        <p className="text-xs text-muted-foreground">{i.row.original.email}</p>
      </div>
    ),
  }),
  col.accessor("role", {
    header: "Role",
    cell: (i) => (
      <span className={roleCfg[i.getValue()] || "badge"}>{i.getValue()}</span>
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
  col.accessor("orders", {
    header: "Orders",
    cell: (i) => (
      <span
        className="text-xs font-semibold"
        style={{ color: "var(--brand-text)" }}
      >
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor("status", {
    header: "Status",
    cell: (i) => (
      <span
        className={
          i.getValue() === "active" ? "badge badge-success" : "badge badge-sale"
        }
      >
        {i.getValue()}
      </span>
    ),
  }),
];

export default function UsersPage() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const debounce = useDebounce(query, 500);


  const { data, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-sellers", page, debounce],
    queryFn: async () => {
      const res = await adminService.getAllUsers(page, 10, debounce);
      return res;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--gold)]"></div>
        <p>Loading...</p>
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
        data={data?.users || []}
        isLoading={isLoadingUsers}
        searchPlaceholder="Search products..."
        // rightHeaderAction={rightAction}
        globalFilter={query}
        setGlobalFilter={setQuery}
        pageIndex={page - 1}
        pageCount={data?.pagination?.totalPages || data?.pagination?.pages || 1}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
        totalRecords={
          data?.pagination?.totalProducts ||
          data?.pagination?.total ||
          data?.users.length
        }
        pageSize={10}
      />
    </motion.div>
  );

  // return (
  //   <motion.div
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     transition={{ duration: 0.4 }}
  //   >
  //     <div className="mb-6 w-72">
  //       <div className="relative w-72">
  //         <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  //         <input
  //           placeholder="Search users..."
  //           value={globalFilter}
  //           onChange={(e) => setQuery(e.target.value)}
  //           className="input-field h-10"
  //           style={{ paddingLeft: "2.5rem" }}
  //         />
  //       </div>
  //     </div>
  //     <div className="card">
  //       <div className="overflow-x-auto no-scrollbar">
  //         <table className="w-full">
  //           <thead>
  //             {table.getHeaderGroups().map((hg) => (
  //               <tr
  //                 key={hg.id}
  //                 style={{ borderBottom: "1px solid var(--gold-faint)" }}
  //               >
  //                 {hg.headers.map((h) => (
  //                   <th
  //                     key={h.id}
  //                     className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest"
  //                     style={{ color: "var(--gold)" }}
  //                   >
  //                     {flexRender(h.column.columnDef.header, h.getContext())}
  //                   </th>
  //                 ))}
  //               </tr>
  //             ))}
  //           </thead>
  //           <tbody>
  //             {table.getRowModel().rows.map((row, i) => (
  //               <tr
  //                 key={row.id}
  //                 className="transition-colors hover:bg-[var(--gold-glow)]"
  //                 style={{
  //                   borderBottom:
  //                     i < table.getRowModel().rows.length - 1
  //                       ? "1px solid var(--gold-faint)"
  //                       : "none",
  //                 }}
  //               >
  //                 {row.getVisibleCells().map((cell) => (
  //                   <td key={cell.id} className="py-3.5 pr-4">
  //                     {flexRender(
  //                       cell.column.columnDef.cell,
  //                       cell.getContext(),
  //                     )}
  //                   </td>
  //                 ))}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //       <div
  //         className="mt-4 flex items-center justify-between pt-4"
  //         style={{ borderTop: "1px solid var(--gold-faint)" }}
  //       >
  //         <p className="text-xs text-muted-foreground">
  //           {table.getFilteredRowModel().rows.length} users
  //         </p>
  //         <div className="flex items-center gap-2">
  //           <button
  //             onClick={() => table.previousPage()}
  //             disabled={!table.getCanPreviousPage()}
  //             className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40"
  //           >
  //             Prev
  //           </button>
  //           <span className="text-xs text-muted-foreground">
  //             Page {table.getState().pagination.pageIndex + 1} /{" "}
  //             {table.getPageCount()}
  //           </span>
  //           <button
  //             onClick={() => table.nextPage()}
  //             disabled={!table.getCanNextPage()}
  //             className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-40"
  //           >
  //             Next
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </motion.div>
  // );
}
