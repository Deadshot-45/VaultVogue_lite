"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Package,
  CheckCircle,
  Sparkles,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api/apiservices";

interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  images: { url: string; isPrimary?: boolean }[];
}

interface Product {
  sku: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "active" | "draft";
  image: string;
  description: string;
  variants?: ProductVariant[];
}

// Category List
const CATEGORIES = ["Handbags", "Apparel", "Accessories", "Jewellery", "Footwear"];

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const FOOTWEAR_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

export default function SellerInventoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    price: "",
    category: CATEGORIES[0],
    stock: "",
    image: "",
    description: "",
    status: "active" as "active" | "draft",
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Upload states
  const [uploadingIndexes, setUploadingIndexes] = useState<Record<number, boolean>>({});
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  useEffect(() => {
    // Load products from localStorage
    const local = localStorage.getItem("vault_vogue_seller_products");
    if (local) {
      setProducts(JSON.parse(local));
    }

    // Auto-open modal if ?add=true is in URL
    if (searchParams?.get("add") === "true") {
      openAddModal();
      router.replace("/seller/inventory");
    }
  }, [searchParams]);

  // Sync to local storage on product change
  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem("vault_vogue_seller_products", JSON.stringify(updated));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: `VV-SL-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      price: "",
      category: CATEGORIES[0],
      stock: "",
      image: "",
      description: "",
      status: "active",
    });
    setVariants([]);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
      description: product.description,
      status: product.status,
    });
    setVariants(product.variants || []);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (sku: string) => {
    if (confirm("Are you sure you want to remove this item from your boutique catalog?")) {
      const updated = products.filter((p) => p.sku !== sku);
      saveProducts(updated);
      toast.success("Listing deleted successfully");
    }
  };

  const toggleStatus = (sku: string) => {
    const updated = products.map((p) => {
      if (p.sku === sku) {
        const nextStatus = p.status === "active" ? ("draft" as const) : ("active" as const);
        toast.info(`Status changed to ${nextStatus.toUpperCase()}`);
        return { ...p, status: nextStatus };
      }
      return p;
    });
    saveProducts(updated);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Enter a valid positive price";
    }

    const isVariantCategory = formData.category === "Apparel" || formData.category === "Footwear";

    if (isVariantCategory && variants.length > 0) {
      // Validate variants
      const hasEmptyVariant = variants.some(v => !v.color.trim() || !v.size.trim() || isNaN(v.stock) || v.stock < 0);
      if (hasEmptyVariant) {
        newErrors.variants = "Complete color, size, and stock for all variant rows";
      }
    } else {
      // Validate normal stock
      if (formData.stock === "" || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
        newErrors.stock = "Enter a valid stock number";
      }
    }
    
    // Validate SKU uniqueness on Add
    if (!editingProduct) {
      const exists = products.some((p) => p.sku.toLowerCase() === formData.sku.toLowerCase());
      if (exists) newErrors.sku = "SKU must be unique";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVariant = () => {
    const isFootwear = formData.category === "Footwear";
    const defaultSize = isFootwear ? FOOTWEAR_SIZES[0] : APPAREL_SIZES[2]; // UK 6 or M
    setVariants((prev) => [
      ...prev,
      { color: "Black", size: defaultSize, stock: 5, images: [] },
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload utility
  const uploadImageToServer = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await api.post("/api/products/upload", {
            image: base64,
            fileName: file.name,
          });
          if (res.data && res.data.success) {
            const baseUrl = api.defaults.baseURL || "";
            const finalUrl = res.data.url.startsWith("http")
              ? res.data.url
              : `${baseUrl.replace(/\/$/, "")}${res.data.url}`;
            resolve(finalUrl);
          } else {
            reject(new Error(res.data?.message || "Upload failed"));
          }
        } catch (err: any) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsDataURL(file);
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const url = await uploadImageToServer(file);
      setFormData(p => ({ ...p, image: url }));
      toast.success("Cover image uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingIndexes((prev) => ({ ...prev, [index]: true }));
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageToServer(file);
        uploadedUrls.push(url);
      }

      const currentImages = variants[index].images || [];
      const newImages = [
        ...currentImages,
        ...uploadedUrls.map((url, uIdx) => ({
          url,
          isPrimary: currentImages.length === 0 && uIdx === 0,
        })),
      ];

      handleUpdateVariant(index, "images", newImages);
      toast.success(`Uploaded ${files.length} variation image(s)`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image(s)");
    } finally {
      setUploadingIndexes((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const itemPrice = Number(formData.price);
    const isVariantCategory = formData.category === "Apparel" || formData.category === "Footwear";
    
    let itemStock = Number(formData.stock);
    let finalVariants: ProductVariant[] | undefined = undefined;

    if (isVariantCategory && variants.length > 0) {
      // Total stock is sum of variant stocks
      itemStock = variants.reduce((sum, v) => sum + v.stock, 0);
      finalVariants = variants;
    }

    const productPayload: Product = {
      sku: formData.sku,
      name: formData.name,
      price: itemPrice,
      category: formData.category,
      stock: itemStock,
      image: formData.image.trim() || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
      description: formData.description,
      status: formData.status,
      variants: finalVariants,
    };

    let updatedProducts: Product[];

    if (editingProduct) {
      // Edit mode
      updatedProducts = products.map((p) => (p.sku === editingProduct.sku ? productPayload : p));
      toast.success("Catalog listing updated");
    } else {
      // Add mode
      updatedProducts = [productPayload, ...products];
      toast.success("New product added to catalog");
    }

    saveProducts(updatedProducts);
    setIsModalOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const isVariantCategory = formData.category === "Apparel" || formData.category === "Footwear";
  const currentSizes = formData.category === "Footwear" ? FOOTWEAR_SIZES : APPAREL_SIZES;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border w-full pl-9 h-10 text-xs bg-background"
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={openAddModal}
          className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Catalog Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-border/10">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`py-1.5 px-4 rounded-full text-xs transition-all uppercase tracking-wider ${
            selectedCategory === "All"
              ? "bg-[var(--gold)] text-white"
              : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          All Collections
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-1.5 px-4 rounded-full text-xs transition-all uppercase tracking-wider whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-[var(--gold)] text-white"
                : "text-muted-foreground hover:bg-muted/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Catalog Grid/Table */}
      <div className="card">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 space-y-3">
            <Package className="h-12 w-12 text-muted-foreground/30" />
            <div>
              <p className="text-sm font-semibold text-[var(--brand-text)]">No Catalog Items Found</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Try resetting search parameters or add a new piece to get started.
              </p>
            </div>
            <button onClick={openAddModal} className="btn-secondary py-2 px-4 text-xs mt-2">
              Onboard First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--gold-faint)" }}>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">Item Info</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">SKU / Code</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">Collection</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">Retail Price</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">Stock Status</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)]">Visibility</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.sku}
                    className="transition-colors hover:bg-[var(--gold-glow)]"
                    style={{ borderBottom: "1px solid var(--gold-faint)" }}
                  >
                    {/* Item Info */}
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-xl object-cover border border-border/40 bg-muted/40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--brand-text)] truncate max-w-[200px]">
                          {product.name}
                        </p>
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex flex-col gap-1.5 mt-2 max-w-[280px]">
                            {product.variants.map((v, index) => (
                              <div key={index} className="flex flex-col gap-1 bg-[var(--gold-faint)]/40 p-2 rounded border border-[var(--gold-soft)]/20">
                                <span className="text-[9px] font-semibold text-[var(--gold)]">
                                  {v.color} / {v.size} ({v.stock} units)
                                </span>
                                {v.images && v.images.length > 0 && (
                                  <div className="flex gap-1 flex-wrap mt-0.5">
                                    {v.images.map((img, imgIdx) => (
                                      <img
                                        key={imgIdx}
                                        src={img.url}
                                        className="h-6 w-6 rounded object-cover border border-border/20 bg-background"
                                        alt=""
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 text-xs font-mono text-muted-foreground">{product.sku}</td>

                    {/* Category */}
                    <td className="py-3.5 text-xs text-muted-foreground">{product.category}</td>

                    {/* Price */}
                    <td className="py-3.5 text-xs font-medium text-[var(--brand-text)]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5">
                      <div className="space-y-0.5">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                          product.stock === 0
                            ? "text-red-500"
                            : product.stock <= 3
                            ? "text-amber-500"
                            : "text-emerald-600"
                        }`}>
                          {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                        </span>
                        {product.variants && (
                          <p className="text-[9px] text-muted-foreground">{product.variants.length} variations</p>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5">
                      <button
                        onClick={() => toggleStatus(product.sku)}
                        className={`badge ${product.status === "active" ? "badge-success" : "badge-gold"}`}
                      >
                        {product.status === "active" ? "Active" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.sku)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Drawer Sheet */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative h-full w-full max-w-lg border-l bg-[var(--background)] p-6 shadow-2xl overflow-y-auto no-scrollbar flex flex-col justify-between"
              style={{ borderColor: "var(--gold-faint)" }}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-6">
                  <h3 className="font-cormorant text-xl font-light text-[var(--brand-text)] flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                    {editingProduct ? "Revise Collection Item" : "Onboard New Collection Item"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <Label htmlFor="product-name" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Product Name
                    </Label>
                    <Input
                      id="product-name"
                      type="text"
                      placeholder="e.g. Quilted Caviar Shoulder Bag"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className="h-9 text-xs"
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-1">
                      <Label htmlFor="retail-price" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Retail Price (INR)
                      </Label>
                      <Input
                        id="retail-price"
                        type="number"
                        placeholder="e.g. 185000"
                        value={formData.price}
                        onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                        className="h-9 text-xs"
                      />
                      {errors.price && <p className="text-[10px] text-red-500 font-medium">{errors.price}</p>}
                    </div>

                    {/* Stock (Disabled if Category is Footwear/Apparel with variants) */}
                    <div className="space-y-1">
                      <Label htmlFor="starting-stock" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {isVariantCategory && variants.length > 0 ? "Computed Total Stock" : "Starting Stock"}
                      </Label>
                      <Input
                        id="starting-stock"
                        type="number"
                        placeholder="e.g. 10"
                        disabled={isVariantCategory && variants.length > 0}
                        value={isVariantCategory && variants.length > 0 
                          ? variants.reduce((sum, v) => sum + v.stock, 0)
                          : formData.stock
                        }
                        onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))}
                        className="h-9 text-xs font-medium disabled:opacity-60 bg-muted/20"
                      />
                      {!isVariantCategory && errors.stock && (
                        <p className="text-[10px] text-red-500 font-medium">{errors.stock}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-1 flex flex-col justify-end">
                      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Collection Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(val) => {
                          setFormData((p) => ({ ...p, category: val }));
                          // Reset variants when category switches
                          if (val !== "Apparel" && val !== "Footwear") {
                            setVariants([]);
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SKU */}
                    <div className="space-y-1">
                      <Label htmlFor="sku-code" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        SKU / Code
                      </Label>
                      <Input
                        id="sku-code"
                        type="text"
                        disabled={!!editingProduct}
                        placeholder="e.g. VV-SL-821"
                        value={formData.sku}
                        onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))}
                        className="h-9 text-xs font-mono disabled:opacity-60 bg-muted/20"
                      />
                      {errors.sku && <p className="text-[10px] text-red-500 font-medium">{errors.sku}</p>}
                    </div>
                  </div>

                  {/* Size & Color Variants (Apparel & Footwear Only) */}
                  {isVariantCategory && (
                    <div className="space-y-4 p-4 rounded-xl border border-[var(--gold-faint)] bg-[var(--gold-glow)]/40 font-sans">
                      <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                          Manage Variations ({formData.category})
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddVariant}
                          className="h-6 px-2 text-[9px] uppercase tracking-wider gap-1 border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold-faint)]"
                        >
                          <Plus className="h-3 w-3" />
                          Add Variation
                        </Button>
                      </div>

                      {variants.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center py-2">
                          No variations added. Using single flat inventory stock.
                        </p>
                      ) : (
                        <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
                          {variants.map((v, index) => (
                            <div key={index} className="space-y-2 border-b border-border/10 pb-3 last:border-b-0 last:pb-0">
                              <div className="flex gap-2 items-center">
                                {/* Color */}
                                <div className="flex-1">
                                  <Input
                                    placeholder="Color (e.g. Cobalt)"
                                    value={v.color}
                                    onChange={(e) => handleUpdateVariant(index, "color", e.target.value)}
                                    className="h-8 text-[11px]"
                                  />
                                </div>

                                {/* Size Selector */}
                                <div className="w-24">
                                  <Select
                                    value={v.size}
                                    onValueChange={(val) => handleUpdateVariant(index, "size", val)}
                                  >
                                    <SelectTrigger className="h-8 text-[11px]">
                                      <SelectValue placeholder="Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentSizes.map((sz) => (
                                        <SelectItem key={sz} value={sz}>
                                          {sz}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Stock */}
                                <div className="w-16">
                                  <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={v.stock}
                                    onChange={(e) => handleUpdateVariant(index, "stock", parseInt(e.target.value) || 0)}
                                    className="h-8 text-[11px] text-center"
                                  />
                                </div>

                                {/* Delete Variant */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveVariant(index)}
                                  className="h-8 w-8 hover:bg-red-500/10 text-red-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              {/* Multiple Variant Image Uploader */}
                              <div className="space-y-1.5 pl-1">
                                <Label className="text-[9px] font-semibold text-muted-foreground">
                                  Variation Images ({v.images?.length || 0} uploaded)
                                </Label>
                                
                                <div className="flex gap-3 items-center">
                                  <label className="flex items-center gap-1.5 justify-center py-1.5 px-3 border border-dashed border-[var(--gold)]/45 rounded-lg hover:bg-[var(--gold-faint)] cursor-pointer text-[10px] text-[var(--gold)] font-medium transition-all">
                                    {uploadingIndexes[index] ? (
                                      <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-3 w-3" />
                                        Upload Images
                                      </>
                                    )}
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      disabled={uploadingIndexes[index]}
                                      onChange={(e) => handleVariantImageUpload(index, e)}
                                      className="hidden"
                                    />
                                  </label>

                                  {/* Uploaded Thumbnails with deletion support */}
                                  {v.images && v.images.length > 0 && (
                                    <div className="flex gap-1.5 flex-wrap">
                                      {v.images.map((img, imgIdx) => (
                                        <div key={imgIdx} className="relative group h-7 w-7 border border-border/20 rounded overflow-hidden">
                                          <img
                                            src={img.url}
                                            className="h-full w-full object-cover"
                                            alt=""
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&auto=format&fit=crop&q=80";
                                            }}
                                          />
                                          {/* Hover deletion */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = v.images.filter((_, i) => i !== imgIdx);
                                              if (img.isPrimary && updated.length > 0) {
                                                updated[0].isPrimary = true;
                                              }
                                              handleUpdateVariant(index, "images", updated);
                                            }}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-400"
                                          >
                                            <X className="h-2.5 w-2.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {errors.variants && (
                        <p className="text-[10px] text-red-500 font-medium">{errors.variants}</p>
                      )}
                    </div>
                  )}

                  {/* Image Upload/Link for Cover Image */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Cover Image
                    </Label>
                    <div className="flex gap-3 items-center">
                      {formData.image ? (
                        <div className="relative h-14 w-14 rounded-xl border border-border/20 overflow-hidden bg-muted/40 group">
                          <img
                            src={formData.image}
                            className="h-full w-full object-cover"
                            alt="Cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=80";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, image: "" }))}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground">
                          <Package className="h-5 w-5" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <label className="inline-flex items-center gap-1.5 justify-center py-2 px-4 border border-[var(--gold)]/45 rounded-lg hover:bg-[var(--gold-faint)] cursor-pointer text-xs text-[var(--gold)] font-medium transition-all">
                          {isUploadingCover ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5" />
                              Upload Cover Image
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingCover}
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          Upload high-resolution luxury product cover photos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <Label htmlFor="description" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      rows={3}
                      placeholder="Describe the product details, fine materials, craftsmanship..."
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      className="input-field py-2 text-xs"
                    />
                  </div>

                  {/* Status selection */}
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Visibility Status
                    </Label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === "active"}
                          onChange={() => setFormData((p) => ({ ...p, status: "active" }))}
                          className="accent-[var(--gold)]"
                        />
                        Active (Shown in Boutique)
                      </label>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="draft"
                          checked={formData.status === "draft"}
                          onChange={() => setFormData((p) => ({ ...p, status: "draft" }))}
                          className="accent-[var(--gold)]"
                        />
                        Draft (Atelier view only)
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              {/* Submit panel */}
              <div className="pt-6 border-t border-border/10 flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5 border-0 hover:opacity-90"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                  {editingProduct ? "Save Changes" : "Publish Listing"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
