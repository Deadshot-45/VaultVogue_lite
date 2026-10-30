// lib/services/serverApi.ts

export async function serverFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const base = (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  const endpoint = cleanPath.startsWith("/api/")
    ? `${base}${cleanPath}`
    : `${base}/api${cleanPath}`;

  const res = await fetch(endpoint, {
    ...options,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
