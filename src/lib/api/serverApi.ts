// lib/api/serverApi.ts

export async function serverFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api${url}`, {
    ...options,
    next: { revalidate: 60 }, // 🔥 caching
  });

  console.log(res);

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}
