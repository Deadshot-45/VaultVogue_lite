"use client";

import { useEffect, useRef, useState } from "react";
import { searchService, SearchResult, SuggestionItem } from "@/lib/services/searchService";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { resolveUiProductImage } from "@/lib/utility/utils";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [products, setProducts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  // Close dropdown when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setProducts([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await searchService.getSuggestions(debouncedQuery);
        setSuggestions(data.suggestions || []);
        setProducts(data.products || []);
        setOpen(true);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSuggestionSelect = (text: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/products?search=${encodeURIComponent(text)}`);
  };

  const handleProductSelect = (id: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/products/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* INPUT */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="pl-9"
          onFocus={() => (suggestions.length || products.length) && setOpen(true)}
        />

        {loading && (
          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border bg-background shadow-lg overflow-hidden">
          {suggestions.length === 0 && products.length === 0 && !loading ? (
            <div className="p-4 text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto p-2 space-y-3">
              {/* SUGGESTIONS */}
              {suggestions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                    Suggestions
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={`suggest-${idx}`}
                      onClick={() => handleSuggestionSelect(item.text)}
                      className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left hover:bg-muted transition text-foreground"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.text}</span>
                      {item.type === "category" && (
                        <span 
                          className="ml-auto text-[10px] px-1.5 py-0.5 rounded border font-medium"
                          style={{ color: "var(--gold)", borderColor: "var(--gold-soft)" }}
                        >
                          Category
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* PRODUCTS */}
              {products.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                    Products
                  </div>
                  {products.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleProductSelect(item._id)}
                      className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition text-left"
                    >
                      {item?.images?.[0]?.url && (
                        <Image
                          src={resolveUiProductImage(item?.images?.[0]?.url)}
                          alt={item.name}
                          width={36}
                          height={36}
                          className="rounded-md object-cover border"
                        />
                      )}

                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.price && (
                          <span className="text-xs text-muted-foreground">
                            ₹{item.price}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
