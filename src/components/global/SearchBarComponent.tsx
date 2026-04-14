"use client";

import { useEffect, useState } from "react";
import { searchService, SearchResult } from "@/lib/api/searchService";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resolveUiProductImage } from "@/utility/utils";

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await searchService.search(debouncedQuery);
        setResults(data);
        console.log(data);
        setOpen(true);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (id: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/products/${id}`);
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* INPUT */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="pl-9"
          onFocus={() => results.length && setOpen(true)}
        />

        {loading && (
          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border bg-background shadow-lg overflow-hidden">
          {results.length === 0 && !loading ? (
            <div className="p-4 text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {results.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSelect(item._id)}
                  className="flex w-full items-center gap-3 p-3 hover:bg-muted transition"
                >
                  {item?.images?.[0]?.url && (
                    <Image
                      src={resolveUiProductImage(item?.images?.[0]?.url)}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
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
  );
}
