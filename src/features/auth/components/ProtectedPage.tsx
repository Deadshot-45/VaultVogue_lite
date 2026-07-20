"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedPage({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, pathname, router]);

  // Block UI flicker
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
