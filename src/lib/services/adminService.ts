import { get } from "http";
import { ApiService } from "./apiservices";

export interface DashboardOverviewResponse {
  success: boolean;
  data: {
    summary: {
      totalRevenue: number;
      totalOrders: number;
      activeProducts: number;
      activeSellers: number;
      avgOrderValue: number;
      customersCount: number;
    };
  };
}

export const adminService = {
  getOverview: async (): Promise<DashboardOverviewResponse> => {
    return ApiService.get<DashboardOverviewResponse>("/api/dashboard/overview");
  },

  getAllProducts: async (
    page: number,
    limit: number,
    query: string,
  ): Promise<{ products: any[]; pagination: any }> => {
    const response = await ApiService.get<{
      success: boolean;
      data: any[];
      pagination: any;
    }>(`/api/admin/products/all?page=${page}&limit=${limit}&query=${query}`);
    if (response.success) {
      const mapped = response.data.map((p: any) => {
        const totalStock =
          p.sizes?.reduce((sum: number, s: any) => sum + (s.stock || 0), 0) ??
          p.stock ??
          0;
        return {
          id: p._id || p.id,
          name: p.name,
          category:
            typeof p.category === "object" && p.category !== null
              ? p.category.name || ""
              : p.category || p.categories?.[0]?.name || "Fashion",
          price: p.price || p.minPrice || p.variants?.[0]?.price || 0,
          stock: totalStock,
          status: p.status || (p.isActive !== false ? "active" : "draft"),
        };
      });
      return { products: mapped, pagination: response?.pagination };
    } else {
      return { products: [], pagination: {} };
    }
  },

  getAllOrders: async (
    page: number,
    limit: number,
    query: string
  ): Promise<{ orders: any[]; pagination: any }> => {
    const response = await ApiService.get<{
      success: boolean;
      data: any[];
      pagination: any;
    }>(`/api/admin/orders/all?page=${page}&limit=${limit}&query=${query}`);
    if (response.success) {
      const mapped = response.data.map((o: any) => ({
        id: o.id || o._id,
        customer: o.address?.fullName || o.userId?.email || "Guest Customer",
        email: o.userId?.email || "",
        date: o.placedAt || o.createdAt,
        amount: o.totalAmount,
        status: o.status || "pending",
        items: o.totalItems || o.items?.length || 0,
      }));
      return { orders: mapped, pagination: response?.pagination };
    } else {
      return { orders: [], pagination: {} };
    }
  },

  getAllSellers: async (
    page: number,
    limit: number,
    query: string
  ): Promise<{ sellers: any[]; pagination: any }> => {
    const response = await ApiService.get<{
      success: boolean;
      data: any[];
    }>("/api/sellers");

    if (response.success && response.data) {
      let filtered = response.data;
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          (s: any) =>
            (s.name && s.name.toLowerCase().includes(lowerQuery)) ||
            (s.ownerName && s.ownerName.toLowerCase().includes(lowerQuery)) ||
            (s.contactEmail && s.contactEmail.toLowerCase().includes(lowerQuery))
        );
      }

      const totalSellers = filtered.length;
      const totalPages = Math.ceil(totalSellers / limit);
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      const mapped = paginated.map((s: any) => ({
        id: s._id || s.id,
        businessName: s.name || "",
        ownerName: s.ownerName || "",
        email: s.contactEmail || "",
        category: s.category || "Fashion",
        joinedAt: s.createdAt,
        revenue: s.revenue || 0,
        products: s.products || 0,
        status: s.status || "pending",
      }));

      return {
        sellers: mapped,
        pagination: {
          total: totalSellers,
          page,
          limit,
          totalPages,
        },
      };
    } else {
      return { sellers: [], pagination: { total: 0, page, limit, totalPages: 1 } };
    }
  },

  getAllUsers: async (page: number, limit: number, query: string): Promise<{ users: any[]; pagination: any }> => {
    const response = await ApiService.get<{
      success: boolean;
      data: any[];
      pagination: any;
    }>(`/api/admin/users/all?page=${page}&limit=${limit}&query=${query}`);
    if (response.success) {
      const mapped = response.data.map((u: any) => ({
        id: u._id || u.id,
        fullName: u.fullName || u.email,
        email: u.email,
        phone: u.phone,
        role: u.role,
        joinedAt: u.createdAt,
        orders: u.ordersCount || 0,
        status: (u.isActive ? "active" : "suspended") as "active" | "suspended",
      }));
      return { users: mapped, pagination: response?.pagination };
    } else {
      return { users: [], pagination: {} };
    }
  },
};
