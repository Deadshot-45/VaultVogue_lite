import type {
  VariantColor,
  VariantProduct,
  VariantSize,
} from "../types/variant";

export function buildSku(
  product: VariantProduct,
  color: VariantColor,
  size: VariantSize,
) {
  return `${product.code}-${color.code}-${size}`;
}

export function resolveColor(product: VariantProduct, colorId?: string | null) {
  return (
    product.colors.find((color) => color.id === colorId) ?? product.colors[0]
  );
}

export function resolveSize(size?: string | null): VariantSize {
  return size === "XS" ||
    size === "S" ||
    size === "M" ||
    size === "L" ||
    size === "XL"
    ? size
    : "S";
}

export function formatCurrency(
  amount: number,
  currency: "USD" | "EUR" | "INR" = "INR",
) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(
    currency === "EUR"
      ? amount * 0.92
      : currency === "INR"
        ? amount > 10000
          ? amount
          : amount * 10
        : amount,
  );
}
