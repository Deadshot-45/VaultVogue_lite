import {
  productService,
  type Category,
  type Product,
} from "@/lib/api/productService";
import HeroSection from "@/components/hero-section";
import CategoryShowcase from "@/components/category-showcase";
import FeaturedProducts from "@/components/featured-products";
import Features from "@/components/features";
import Newsletter from "@/components/newsletter";

type DashboardSections = {
  featured?: Product[];
  newArrivals?: Product[];
  trending?: Product[];
  bestsellers?: Product[];
};


type DashboardData = {
  sections?: DashboardSections;
  categories?: Category[];
  data?: {
    sections?: DashboardSections;
    categories?: Category[];
  };
};

function getRecentProducts(dashboardData: DashboardData): Product[] {
  return (
    dashboardData.sections?.featured ||
    dashboardData.sections?.newArrivals ||
    dashboardData.sections?.trending ||
    dashboardData.sections?.bestsellers ||
    dashboardData.data?.sections?.featured ||
    dashboardData.data?.sections?.newArrivals ||
    dashboardData.data?.sections?.trending ||
    dashboardData.data?.sections?.bestsellers ||
    []
  );
}

export default async function Page() {
  let recentProducts: Product[] = [];
  let categories: Category[] = [];

  try {
    const dashboardResponse = await productService.getDashboardProducts();
    const dashboardData = (dashboardResponse?.data ??
      dashboardResponse) as DashboardData;

    recentProducts = getRecentProducts(dashboardData);
    categories = dashboardData.categories ?? dashboardData.data?.categories ?? [];
  } catch (error) {
    console.error("Dashboard data fetching failed on server", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="mx-auto w-full space-y-0 px-4 sm:px-6 lg:px-8">
        <CategoryShowcase categories={categories} />
        <FeaturedProducts products={recentProducts} />
        <Features />
        <Newsletter />
      </main>
    </div>
  );
}
