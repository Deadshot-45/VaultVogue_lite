"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { BusinessInfo } from "@/types/admin";

const CATEGORIES = [
  'Handbags', 'Accessories', 'Footwear', 'Apparel', 'Jewellery', 'Watches', 'Fragrances', 'Other',
];

interface Props {
  data: BusinessInfo;
  onChange: (data: BusinessInfo) => void;
  errors: Partial<Record<keyof BusinessInfo, string>>;
}

export function Step1BusinessInfo({ data, onChange, errors }: Props) {
  const handle = (field: keyof BusinessInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Business Name *</Label>
          <Input id="bizName" placeholder="e.g. Luxe Collections Pvt Ltd" value={data.businessName} onChange={handle('businessName')} className="h-11" aria-invalid={!!errors.businessName} />
          {errors.businessName && <p className="text-xs text-destructive">{errors.businessName}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Owner / Director Name *</Label>
          <Input id="ownerName" placeholder="Full legal name" value={data.ownerName} onChange={handle('ownerName')} className="h-11" aria-invalid={!!errors.ownerName} />
          {errors.ownerName && <p className="text-xs text-destructive">{errors.ownerName}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Business Email *</Label>
          <Input id="bizEmail" type="email" placeholder="business@example.com" value={data.email} onChange={handle('email')} className="h-11" aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Phone Number *</Label>
          <Input id="bizPhone" type="tel" placeholder="+91 98765 43210" value={data.phone} onChange={handle('phone')} className="h-11" aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Primary Category *</Label>
          <select
            id="bizCategory"
            value={data.category}
            onChange={handle('category')}
            className="input-field h-11"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Website (optional)</Label>
          <Input id="bizWebsite" type="url" placeholder="https://yourstore.com" value={data.website ?? ''} onChange={handle('website')} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">GST Number (optional)</Label>
          <Input id="bizGst" placeholder="22AAAAA0000A1Z5" value={data.gstNumber ?? ''} onChange={handle('gstNumber')} className="h-11" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="section-label text-[10px]">Business Description *</Label>
        <textarea
          id="bizDesc"
          rows={4}
          placeholder="Describe your brand, products, and what makes you unique..."
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
