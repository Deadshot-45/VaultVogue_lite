import { productService } from "@/lib/api/productService";
import Home from "@/pages/Home/Home";

export default async function Page() {
  let recentProducts = [];

  try {
    const dashboardResponse = await productService.getDashboardProducts();
    const dashboardData = dashboardResponse?.data;

    recentProducts =
      dashboardData?.data?.highlights?.recentProducts ||
      dashboardData?.highlights?.recentProducts ||
      dashboardData?.data?.recentProducts ||
      dashboardData?.recentProducts ||
      [];
  } catch (error) {
    console.error("Dashboard data fetching failed on server", error);
  }

  return <Home recentProducts={recentProducts} />;
}
