/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductDetailsView from "@/features/products/components/ProductDetailsView";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/services/productService";
import { serverFetch } from "@/lib/services/serverApi";
import Link from "next/link";
import { Suspense } from "react";
import { Suggestions } from "@/features/products/components/Suggestions";

type Response = {
  success: string;
  message: string;
  code?: number;
  data: Product[];
};
type ResponseById = {
  success: string;
  message: string;
  code?: number;
  data: Product;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const normalizeProduct = (product: any) => {
  const variants = product.variants || [];

  // fallback image
  const gallery = product.images?.length
    ? product.images
        .sort((a: any, b: any) => Number(b.isPrimary) - Number(a.isPrimary))
        .map((img: any) => img.url)
    : ["/images/placeholder.png"];

  // extract sizes + stock from variants
  const sizeQuantities: Record<string, number> = {};

  variants.forEach((v: any) => {
    const size = v.attributes?.size;
    if (!size) return;

    sizeQuantities[size] = v.stock ?? 0;
  });

  const availableSizes = Object.keys(sizeQuantities).filter(
    (size) => sizeQuantities[size] > 0,
  );

  const price =
    variants.length > 0 ? Math.min(...variants.map((v: any) => v.price)) : 0;

  return {
    id: product._id,
    name: product.name,
    price,
    originalPrice: product.originalPrice || price,
    sellerId: product.sellerId,
    sellerName: product.sellerName || "StyleHub Partner",
    description:
      product.description ||
      "A curated StyleHub Maison piece designed for versatile, elegant everyday styling.",
    category: product.categories?.[0]?.name || "Fashion",
    isNew: true,
    images: gallery,
    availableSizes,
    sizeQuantities,
    lowStockThreshold: 5,
    variants: product.variants || [],
  };
};

const normalizeSuggestion = (product: Product) => ({
  id: product._id || "",
  name: product.name,
  price: product.minPrice,
  image:
    product.images.find((image) => image.isPrimary)?.url ||
    product.images[0]?.url ||
    "/images/placeholder.png",
  category: product.categories?.[0]?.name || "Fashion",
});

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const clientUrl = process.env.NEXT_PUBLIC_API;

  try {
    const response = await serverFetch<ResponseById>(`/products/getById/${id}`);
    const rawProduct = response?.data;

    if (!rawProduct?._id) {
      throw new Error("Product not found");
    }

    const product = normalizeProduct(rawProduct);

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description,
      "category": product.category,
      "offers": {
        "@type": "Offer",
        "price": product.price.toString(),
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": product.availableSizes.length > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": `${clientUrl}/products/${product.id}`,
        "seller": {
          "@type": "Organization",
          "name": product.sellerName,
        },
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <div className="pb-8 max-w-7xl mx-auto bg-[var(--background)]">
          <div className="border-b border-border/10 bg-card/10">
            <div className="mx-auto flex w-full flex-wrap items-center gap-3 px-4 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-6 lg:px-8">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <span>{product.category}</span>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
              <Badge className="ml-auto rounded-full px-3 py-1 badge-gold">
                Maison Piece
              </Badge>
            </div>
          </div>

          <ProductDetailsView
            product={product}
            suggestionsSection={
              <Suspense
                fallback={
                  <div className="mt-16 animate-pulse h-40 bg-muted/20 rounded-xl"></div>
                }
              >
                <ProductSuggestionsServer currentProductId={product.id} />
              </Suspense>
            }
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Product detail fetch failed", error);

    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8 bg-[var(--background)]">
        <Card className="w-full rounded-[2.5rem] border border-[var(--gold-soft)] bg-card/50 backdrop-blur-md">
          <CardContent className="space-y-6 p-10 text-center">
            <Badge className="rounded-full px-3 py-1 badge-gold">
              Unavailable
            </Badge>
            <h1 className="font-cormorant text-3xl font-light tracking-tight text-[var(--brand-text)]">
              Maison Creation Not Found
            </h1>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              This catalog creation may have been retired or updated. Explore
              our collections for alternative edits.
            </p>
            <div className="flex justify-center pt-2">
              <Link href="/" className="btn-primary">
                Return to Storefront
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
}

async function ProductSuggestionsServer({
  currentProductId,
}: {
  currentProductId: string;
}) {
  try {
    const suggestionResponse = await serverFetch<Response>(
      `/products/getAll?limit=5`,
    );

    const suggestions = Array.isArray(suggestionResponse?.data)
      ? (suggestionResponse.data as Product[])
          .filter((item: Product) => (item._id || item.id) !== currentProductId)
          .slice(0, 4)
          .map(normalizeSuggestion)
      : [];

    return <Suggestions items={suggestions} />;
  } catch (error) {
    console.error("Failed to fetch suggestions", error);
    return <Suggestions items={[]} />;
  }
}
