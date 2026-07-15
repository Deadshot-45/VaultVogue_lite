"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { Loader2 } from "lucide-react";
import { Loader } from "../global/Loader";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex min-h-screen w-7xl mx-auto items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
