import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/services/apiservices";

export const useGetSellerDashboard = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["sellerDashboard", userId],
    queryFn: async () => {
      const [productsRes, ordersRes] = await Promise.all([
        api.get<{ success: boolean; data: any[] }>(
          `/api/products/getAll?sellerId=${userId}&limit=100`,
        ),
        api.get<{ success: boolean; data: any[] }>("/api/orders/seller/all"),
      ]);

      let products: any[] = [];
      let orders: any[] = [];

      if (productsRes.data.success) {
        products = productsRes.data.data.map((p: any) => {
          const totalStock =
            p.variants?.reduce((sum: number, v: any) => {
              const variantStock =
                v.sizes?.reduce(
                  (sSum: number, s: any) => sSum + (s.stock || 0),
                  0,
                ) || 0;
              return sum + variantStock;
            }, 0) || 0;
          return {
            ...p,
            stock: totalStock,
            status: totalStock > 0 ? "active" : "draft",
          };
        });
      }

      if (ordersRes.data.success) {
        orders = ordersRes.data.data;
      }

      return { products, orders };
    },
    enabled: !!userId,
    retry: 3,
  });
};

export const useGetSellerProducts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["sellerProducts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await api.get<{ success: boolean; data: any[] }>(
        `/api/products/getAll?sellerId=${userId}&limit=100&isActive=all`,
      );
      if (response.data.success) {
        return response.data.data.map((p: any) => {
          const totalStock =
            p.sizes?.reduce((sum: number, s: any) => sum + (s.stock || 0), 0) || 0;
          return {
            id: p._id || p.id,
            sku: p.variants?.[0]?.sku || p.sku || "",
            name: p.name,
            price: p.variants?.[0]?.price || p.minPrice || p.price || 0,
            category:
              typeof p.category === "object" && p.category !== null
                ? p.category.name || ""
                : p.category || "Fashion",
            subCategory:
              typeof p.subCategory === "object" && p.subCategory !== null
                ? p.subCategory.name || ""
                : typeof p.subcategory === "object" && p.subcategory !== null
                ? p.subcategory.name || ""
                : p.subCategory || p.subcategory || "",
            stock: totalStock,
            // ✅ Read isActive from DB — not derived from stock
            status: (p.isActive !== false ? "active" : "draft") as "active" | "draft",
            image: p.images?.[0]?.url || "",
            description: p.description || "",
            variants:
              p.variants?.map((v: any) => ({
                size: v.size || v.attributes?.size || "",
                color: v.color || v.attributes?.color || "",
                stock:
                  p.sizes?.find((s: any) => s.variantId === (v._id || v.id))
                    ?.stock ?? 0,
                images: v.images || [],
              })) || [],
          };
        });
      }
      return [];
    },
    enabled: !!userId,
    retry: 3,
  });
};

export const useGetSellerOrders = () => {
  return useQuery({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: any[] }>("/api/orders/seller/all");
      if (response.data.success) {
        return response.data.data.map((o: any) => ({
          ...o,
          id: o.id || o._id,
        }));
      }
      return [];
    },
    retry: 3,
  });
};
