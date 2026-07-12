"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ProductListing } from "@/types/admin";

const CATEGORIES = ['Handbags', 'Accessories', 'Footwear', 'Apparel', 'Jewellery', 'Watches', 'Fragrances', 'Other'];

interface Props {
  data: ProductListing;
  onChange: (data: ProductListing) => void;
  errors: Partial<Record<keyof ProductListing, string>>;
}

export function Step3ProductListing({ data, onChange, errors }: Props) {
  const handle = (field: keyof ProductListing) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Add your first product listing. You can add more products after your account is approved.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="section-label text-[10px]">Product Name *</Label>
          <Input id="productName" placeholder="e.g. Hand-Stitched Leather Tote Bag" value={data.productName} onChange={handle('productName')} className="h-11" aria-invalid={!!errors.productName} />
          {errors.productName && <p className="text-xs text-destructive">{errors.productName}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">SKU / Product Code *</Label>
          <Input id="sku" placeholder="e.g. LTB-001" value={data.sku} onChange={handle('sku')} className="h-11" aria-invalid={!!errors.sku} />
          {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Selling Price (₹) *</Label>
          <Input id="price" type="number" placeholder="e.g. 45000" value={data.price} onChange={handle('price')} className="h-11" aria-invalid={!!errors.price} />
          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Category *</Label>
          <select id="productCategory" value={data.category} onChange={handle('category')} className="input-field h-11">
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Minimum Order Qty</Label>
          <Input id="moq" type="number" placeholder="1" value={data.moq} onChange={handle('moq')} className="h-11" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="section-label text-[10px]">Product Description *</Label>
        <textarea
          id="productDesc"
          rows={4}
          placeholder="Describe materials, craftsmanship, dimensions..."
          value={data.description}
          onChange={handle('description')}
          className="input-field resize-none"
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>
    </div>
  );
}
