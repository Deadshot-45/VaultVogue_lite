import { productService } from "@/lib/api/productService";
import Home from "@/pages/Home/Home";

export default async function Page() {
  let recentProducts = [];

  try {
    const dashboardResponse = await productService.getDashboardProducts();
    const dashboardData = dashboardResponse?.data ?? dashboardResponse;

    recentProducts =
      dashboardData?.sections?.featured ||
      dashboardData?.sections?.newArrivals ||
      dashboardData?.sections?.trending ||
      dashboardData?.sections?.bestsellers ||
      dashboardData?.data?.sections?.featured ||
      dashboardData?.data?.sections?.newArrivals ||
      dashboardData?.data?.sections?.trending ||
      dashboardData?.data?.sections?.bestsellers ||
      [];
  } catch (error) {
    console.error("Dashboard data fetching failed on server", error);
  }

  return <Home recentProducts={recentProducts} />;
}
