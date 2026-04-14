import { CartListItem } from "@/lib/query/useCart";

export const resolveProductImage = (image: string) => {
  if (!image) return "/fallback.png";
  if (image.startsWith("http")) return image;
  return `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='18'%3ENo image%3C/text%3E%3C/svg%3E";

export const resolveUiProductImage = (image: string) => {
  if (!image || image.length === 0) {
    return FALLBACK_IMAGE;
  }

  const imageUrl = image;

  if (!imageUrl) {
    return FALLBACK_IMAGE;
  }

  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return API_URL ? `${API_URL}${imageUrl}` : imageUrl;
  }

  return API_URL ? `${API_URL}/${imageUrl}` : `/${imageUrl}`;
};

export function updateCartCache(
  old: CartListItem[] | undefined,
  newItem: Omit<CartListItem, "quantity">,
): CartListItem[] {
  const prev = old ?? [];

  const index = prev.findIndex((i) => i.variantId === newItem.variantId);

  if (index !== -1) {
    const updated = [...prev];
    updated[index] = {
      ...updated[index],
      quantity: updated[index].quantity + 1,
    };
    return updated;
  }

  return [...prev, { ...newItem, quantity: 1 }];
}
