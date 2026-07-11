/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductDetailsView from "@/components/products/ProductDetailsView";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/api/productService";
import { serverFetch } from "@/lib/api/serverApi";
import Link from "next/link";
import { Suspense } from "react";
import { Suggestions } from "@/components/products/Suggestions";
import { allSampleProducts } from "@/utility/sampleData";

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

  try {
    const response = await serverFetch<ResponseById>(`/products/getById/${id}`);
    const rawProduct = response?.data;

    if (!rawProduct?._id) {
      throw new Error("Product not found");
    }

    const product = normalizeProduct(rawProduct);

    return (
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
            <Suspense fallback={<div className="mt-16 animate-pulse h-40 bg-muted/20 rounded-xl"></div>}>
              <ProductSuggestionsServer currentProductId={product.id} />
            </Suspense>
          } 
        />
      </div>
    );
  } catch (error) {
    console.error("Product detail fetch failed, using fallback from static catalog", error);

    // Fallback: If product fails to fetch from API, find it in allSampleProducts so the page still loads!
    const fallbackProduct = allSampleProducts.find((p) => p.id === id);

    if (fallbackProduct) {
      // Map static/fallback Product to Detail shape
      const detailProduct = {
        id: fallbackProduct.id,
        name: fallbackProduct.name,
        price: fallbackProduct.price,
        originalPrice: fallbackProduct.isSale ? fallbackProduct.price * 1.3 : fallbackProduct.price,
        sellerId: "stylehub-maison",
        sellerName: "StyleHub Maison",
        description: fallbackProduct.description || "A curated StyleHub Maison piece designed for versatile, elegant everyday styling.",
        category: fallbackProduct.category,
        isNew: fallbackProduct.isNew,
        isSale: fallbackProduct.isSale,
        images: [fallbackProduct.image],
        availableSizes: fallbackProduct.availableSizes,
        sizeQuantities: fallbackProduct.sizeQuantities,
        lowStockThreshold: 5,
        variants: fallbackProduct.sizes.map((s) => ({
          _id: s.variantId,
          variantId: s.variantId,
          productId: fallbackProduct.id,
          sellerId: "stylehub-maison",
          sku: `${fallbackProduct.id}-${s.size}`,
          attributes: { size: s.size },
          price: s.price,
          images: [{ url: fallbackProduct.image }],
          stock: s.stock,
          reserved: 0,
          sold: 0,
          availableStock: s.stock,
          isOutOfStock: s.stock <= 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      };

      return (
        <div className="pb-8 px-0 md:px-4 bg-[var(--background)]">
          <div className="border-b border-border/10 bg-card/10">
            <div className="mx-auto flex w-full flex-wrap items-center gap-3 px-4 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-6 lg:px-8">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <span>{detailProduct.category}</span>
              <span>/</span>
              <span className="text-foreground">{detailProduct.name}</span>
              <Badge className="ml-auto rounded-full px-3 py-1 badge-gold">
                Maison Piece
              </Badge>
            </div>
          </div>

          <ProductDetailsView 
            product={detailProduct} 
            suggestionsSection={
              <Suspense fallback={<div className="mt-16 animate-pulse h-40 bg-muted/20 rounded-xl"></div>}>
                <ProductSuggestionsServer currentProductId={detailProduct.id} />
              </Suspense>
            } 
          />
        </div>
      );
    }

    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8 bg-[var(--background)]">
        <Card className="w-full rounded-[2.5rem] border border-[var(--gold-soft)] bg-card/50 backdrop-blur-md">
          <CardContent className="space-y-6 p-10 text-center">
            <Badge className="rounded-full px-3 py-1 badge-gold">Unavailable</Badge>
            <h1 className="font-cormorant text-3xl font-light tracking-tight text-[var(--brand-text)]">
              Maison Creation Not Found
            </h1>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              This catalog creation may have been retired or updated. Explore our collections for alternative edits.
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

async function ProductSuggestionsServer({ currentProductId }: { currentProductId: string }) {
  try {
    const suggestionResponse = await serverFetch<Response>(`/products/getAll?limit=4`);
    
    let suggestions = Array.isArray(suggestionResponse?.data)
      ? suggestionResponse.data
          .filter((item: Product) => item._id !== currentProductId)
          .slice(0, 4)
          .map(normalizeSuggestion)
      : [];

    // Use high-end fallbacks if backend is empty
    if (suggestions.length === 0) {
      suggestions = allSampleProducts
        .filter((p) => p.id !== currentProductId)
        .slice(0, 4)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
        }));
    }

    return <Suggestions items={suggestions} />;
  } catch (error) {
    console.error("Failed to fetch suggestions, using fallbacks", error);
    
    const fallbackSuggestions = allSampleProducts
      .filter((p) => p.id !== currentProductId)
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
      }));

    return <Suggestions items={fallbackSuggestions} />;
  }
}
