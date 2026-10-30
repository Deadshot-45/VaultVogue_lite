import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetailPage } from "@/features/products/components/ProductDetailPage";
import { serverFetch } from "@/lib/services/serverApi";
import { mapProduct } from "@/lib/queries/useGetProducts";
import { mapApiProductToVariantProduct } from "@/lib/utility/category-adapter";
import type { VariantProduct } from "@/features/storefront/types/variant";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

type ResponseById = {
  success: string | boolean;
  message: string;
  code?: number;
  data: any;
};

export const metadata: Metadata = {
  title: "Archival Garment Silhouette | VAULT VOGUE Atelier",
  description: "Curated collection piece designed for timeless, modern editorial fashion.",
};

export default async function ProductPage(props: PageProps) {
  const { id } = await props.params;
  if (props.searchParams) {
    await props.searchParams;
  }

  let rawProduct: any = null;

  // 1. Fetch real product by ID from backend API
  try {
    const response = await serverFetch<ResponseById>(`/products/getById/${id}`);
    rawProduct = response?.data || response;
  } catch (error) {
    console.warn("API product lookup failed for ID:", id, error);
  }

  // 2. If not found by direct ID, search in case slug or code was provided
  if (!rawProduct || (!rawProduct._id && !rawProduct.id)) {
    try {
      const searchRes = await serverFetch<any>(`/products/getAll?search=${encodeURIComponent(id)}&limit=1`);
      const searchList = searchRes?.data || searchRes;
      if (Array.isArray(searchList) && searchList.length > 0) {
        rawProduct = searchList[0];
      }
    } catch {
      // ignore
    }
  }

  // 3. If product does not exist in API, trigger 404
  if (!rawProduct || (!rawProduct._id && !rawProduct.id)) {
    notFound();
  }

  rawProduct._id = rawProduct._id || rawProduct.id;
  const uiProduct = mapProduct(rawProduct as any);
  const activeProduct: VariantProduct = mapApiProductToVariantProduct(uiProduct);

  const clientUrl = process.env.NEXT_PUBLIC_API || "https://vaultvogue.com";

  // Schema.org Structured Data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: activeProduct.name,
    image: activeProduct.colors.map((c) => c.image),
    description: activeProduct.description,
    category: activeProduct.category,
    sku: activeProduct.code,
    offers: {
      "@type": "Offer",
      price: activeProduct.price.toString(),
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: `${clientUrl}/products/${activeProduct.slug || activeProduct.id}`,
      seller: {
        "@type": "Organization",
        name: "VAULT VOGUE Maison",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Suspense
        fallback={
          <div className="mx-auto min-h-[70vh] max-w-[1440px] animate-pulse px-4 py-12 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="aspect-[3/4] bg-[var(--vault-panel)] border border-[var(--vault-line)]" />
              <div className="space-y-6 pt-4">
                <div className="h-4 w-1/4 bg-[var(--vault-line)]" />
                <div className="h-10 w-3/4 bg-[var(--vault-line)]" />
                <div className="h-6 w-1/3 bg-[var(--vault-line)]" />
                <div className="h-20 w-full bg-[var(--vault-line)]" />
              </div>
            </div>
          </div>
        }
      >
        <ProductDetailPage product={activeProduct} />
      </Suspense>
    </>
  );
}
