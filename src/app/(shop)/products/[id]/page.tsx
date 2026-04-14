/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductDetailsView from "@/components/products/ProductDetailsView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/api/productService";
import { serverFetch } from "@/lib/api/serverApi";
import Link from "next/link";

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

    sizeQuantities[size] = v.stock ?? 0; // assuming you merged inventory
  });

  const availableSizes = Object.keys(sizeQuantities).filter(
    (size) => sizeQuantities[size] > 0,
  );

  // get price (min variant price)
  const price =
    variants.length > 0 ? Math.min(...variants.map((v: any) => v.price)) : 0;

  return {
    id: product._id,
    name: product.name,

    price,
    originalPrice: product.originalPrice || price,

    sellerId: product.sellerId,
    sellerName: product.sellerName || "Vault Vogue Partner",

    description:
      product.description ||
      "A curated Vault Vogue piece designed for versatile everyday styling.",

    category: "Fashion",
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
  category: "Fashion",
});

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  console.log(id);

  try {
    const [response, suggestionResponse] = await Promise.all([
      serverFetch<ResponseById>(`/products/getById/${id}`),
      serverFetch<Response>(`/products/getAll?limit=4`),
    ]);

    console.log(response);
    console.log(suggestionResponse);

    const rawProduct = response?.data;

    console.log("rawProduct", rawProduct);

    if (!rawProduct?._id) {
      throw new Error("Product not found");
    }

    const product = normalizeProduct(rawProduct);
    const suggestions = Array.isArray(suggestionResponse?.data)
      ? suggestionResponse.data
          .filter((item: Product) => item._id !== product.id)
          .slice(0, 4)
          .map(normalizeSuggestion)
      : [];

    return (
      <div className="pb-8 px-0 md:px-4">
        <div className="border-b bg-muted/20">
          <div className="mx-auto flex w-full flex-wrap items-center gap-3 px-4 py-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
            <Badge className="ml-auto rounded-full px-3 py-1">
              Product Details
            </Badge>
          </div>
        </div>

        <ProductDetailsView product={product} suggestions={suggestions} />
      </div>
    );
  } catch (error) {
    console.error("Product detail fetch failed", error);

    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full rounded-[2rem] border">
          <CardContent className="space-y-4 p-8 text-center">
            <Badge className="rounded-full px-3 py-1">Unavailable</Badge>
            <h1 className="text-3xl font-semibold tracking-tight">
              This product is not available right now
            </h1>
            <p className="text-muted-foreground">
              The item may have been removed, updated, or is temporarily
              unavailable.
            </p>
            <div className="flex justify-center">
              <Button asChild className="rounded-full">
                <Link href="/">Back to shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
}
