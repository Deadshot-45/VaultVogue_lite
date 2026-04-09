import ProductDetailsView from "@/components/products/ProductDetailsView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { productService, type Product } from "@/lib/api/productService";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const normalizeProduct = (product: Product) => {
  const inventoryItems = product.inventoryId?.items ?? [];
  const gallery = product.images.length
    ? product.images
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
        .map((image) => image.url)
    : ["/images/placeholder.png"];

  return {
    id: product._id || product.id || "",
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    sellerId: product.sellerId,
    sellerName: product.sellerName || "Vault Vogue Partner",
    description:
      product.description ||
      "A curated Vault Vogue piece designed for versatile everyday styling and a clean premium finish.",
    category: "Fashion",
    isNew: true,
    images: gallery,
    availableSizes: inventoryItems
      .filter((item) => item.quantity > 0)
      .map((item) => item.size),
    sizeQuantities: Object.fromEntries(
      inventoryItems.map((item) => [item.size, item.quantity]),
    ),
    lowStockThreshold: 5,
  };
};

const normalizeSuggestion = (product: Product) => ({
  id: product._id || product.id || "",
  name: product.name,
  price: product.price,
  image:
    product.images.find((image) => image.isPrimary)?.url ||
    product.images[0]?.url ||
    "/images/placeholder.png",
  category: "Fashion",
});

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const response = await productService.getProductById(id);
    const suggestionResponse = await productService.getAllProducts({
      page: 1,
      limit: 5,
      sortBy: "createdAt",
      order: "desc",
      categoryId: "67dfa578452634da4759bbb2",
    });

    const rawProduct =
      response?.data?.data ||
      response?.data?.product ||
      response?.data ||
      response?.product ||
      response;

    if (!(rawProduct?._id || rawProduct?.id)) {
      throw new Error("Product not found");
    }

    const product = normalizeProduct(rawProduct as Product);
    const suggestions = suggestionResponse
      .filter((item) => (item._id || item.id) !== product.id)
      .slice(0, 4)
      .map(normalizeSuggestion);

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
