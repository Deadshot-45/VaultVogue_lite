"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import type { VariantProduct, VariantSize } from "../types/variant";
import { resolveColor, resolveSize } from "../lib/variant-utils";

export function useVariantSelection(product: VariantProduct) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selection = useMemo(() => {
    const color = resolveColor(product, searchParams.get("color"));
    const size = resolveSize(searchParams.get("size"));
    return { color, size };
  }, [product, searchParams]);

  useEffect(() => {
    if (
      searchParams.get("color") === selection.color.id &&
      searchParams.get("size") === selection.size
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("color", selection.color.id);
    params.set("size", selection.size);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, selection]);

  const replaceVariant = useCallback(
    (update: { colorId?: string; size?: VariantSize }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("color", update.colorId ?? selection.color.id);
      params.set("size", update.size ?? selection.size);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, selection],
  );

  return { ...selection, replaceVariant };
}
