import { productService } from "@/lib/services/productService";
import { CartListItem } from "@/lib/queries/useCart";
import { useMutation } from "@tanstack/react-query";

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

export const classifySubcategory = (
  name: string,
  defaultCategory: string,
): string => {
  const lowerName = name.toLowerCase();

  if (
    lowerName.includes("knit") ||
    lowerName.includes("sweater") ||
    lowerName.includes("cashmere") ||
    lowerName.includes("pullover")
  ) {
    return "Knitwear";
  }
  if (
    lowerName.includes("coat") ||
    lowerName.includes("jacket") ||
    lowerName.includes("trench") ||
    lowerName.includes("outerwear") ||
    lowerName.includes("parka")
  ) {
    return "Outerwear";
  }
  if (lowerName.includes("blazer") || lowerName.includes("suit")) {
    return "Blazers";
  }
  if (
    lowerName.includes("shirt") ||
    lowerName.includes("polo") ||
    lowerName.includes("t-shirt") ||
    lowerName.includes("tee")
  ) {
    return "Shirts";
  }
  if (
    lowerName.includes("boot") ||
    lowerName.includes("shoe") ||
    lowerName.includes("sneaker") ||
    lowerName.includes("loafer") ||
    lowerName.includes("footwear")
  ) {
    return "Footwear";
  }
  if (
    lowerName.includes("jeans") ||
    lowerName.includes("denim") ||
    lowerName.includes("trousers") ||
    lowerName.includes("pant") ||
    lowerName.includes("chinos")
  ) {
    return "Denim";
  }
  if (lowerName.includes("dress") || lowerName.includes("gown")) {
    return "Dresses";
  }
  if (lowerName.includes("skirt")) {
    return "Skirts";
  }
  if (
    lowerName.includes("accessory") ||
    lowerName.includes("bag") ||
    lowerName.includes("wallet") ||
    lowerName.includes("belt")
  ) {
    return "Accessories";
  }
  if (
    lowerName.includes("baby") ||
    lowerName.includes("playsuit") ||
    lowerName.includes("romper")
  ) {
    return "Baby";
  }
  if (lowerName.includes("outfit") || lowerName.includes("set")) {
    return "Outfits";
  }
  if (
    lowerName.includes("sleep") ||
    lowerName.includes("pyjama") ||
    lowerName.includes("pajama") ||
    lowerName.includes("sleepwear")
  ) {
    return "Sleepwear";
  }

  return defaultCategory;
};

// Upload utility
export const uploadImageToServer = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await productService.uploadImage(base64, file.name);
        if (res && res.success) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const finalUrl = res.url.startsWith("http")
            ? res.url
            : `${baseUrl.replace(/\/$/, "")}${res.url}`;
          resolve(finalUrl);
        } else {
          reject(new Error(res?.message || "Upload failed"));
        }
      } catch (err: any) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File reading error"));
    reader.readAsDataURL(file);
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImageToServer,
  });
};
