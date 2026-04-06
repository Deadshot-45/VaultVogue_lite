"use client";

import { images } from "@/assets/data/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import HeroSection from "./HeroSection";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string; isPrimary: boolean }[];
  categoryIds?: string[];
}

interface HomeProps {
  readonly recentProducts?: Product[];
}

const HomeData = [
  {
    label: "Men",
    src: "http://localhost:5000/p_img2.png",
    href: "/men",
  },
  {
    label: "Women",
    src: "http://localhost:5000/p_img1.png",
    href: "/women",
  },
  {
    label: "Kids",
    src: "http://localhost:5000//p_img4.png",
    href: "/kids",
  },
  {
    label: "Sale",
    src: "http://localhost:5000//p_img3.png",
    href: "/sale",
  },
];

export default function Home({ recentProducts = [] }: HomeProps) {
  const router = useRouter();
  return (
    <div className="h-full w-full overflow-x-hidden">
      <HeroSection />

      <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <section className="">
          <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 xl:gap-6">
            {HomeData.map((item) => (
              <Card
                key={item.label}
                className="group h-full cursor-pointer overflow-hidden py-0 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-0 overflow-hidden">
                  <div
                    className="aspect-[4/3] bg-muted bg-cover bg-center transition duration-500 group-hover:scale-105 sm:aspect-[5/4] lg:aspect-[4/3]"
                    style={{ backgroundImage: `url(${item.src})` }}
                  />
                </CardContent>

                <CardFooter className="justify-center px-4 pb-4 pt-3 sm:px-5">
                  <p
                    onClick={() => router.push(item.href)}
                    className="text-sm font-semibold text-foreground sm:text-base"
                  >
                    {item.label}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-background/10">
          <div className="mx-auto ">
            <h2 className="mb-6 text-2xl font-bold">New Arrivals</h2>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {recentProducts.length > 0
                ? recentProducts.map((product) => (
                    <Card
                      key={product._id}
                      className="rounded-lg border gap-2 bg-background p-0 shadow-sm transition hover:shadow-md"
                    >
                      <CardTitle className="mb-3 overflow-hidden rounded-md h-52 bg-secondary">
                        <img
                          src={
                            product.images.find((img) => img.isPrimary)?.url ||
                            product.images[0]?.url
                          }
                          alt={product.name}
                          className="h-full w-full object-cover transition hover:scale-105"
                        />
                      </CardTitle>
                      <CardContent className="pb-4 px-4 m-0">
                        <p className="font-medium line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-foreground/50 font-semibold">
                          Rs. {product.price}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                : [...Array(10)].map((_, i) => (
                    <div
                      key={i + 1}
                      className="rounded-lg bg-background p-4 shadow-sm animate-pulse"
                    >
                      <div className="mb-3 h-52 bg-muted rounded-md" />
                      <div className="h-4 bg-muted w-3/4 mb-2" />
                      <div className="h-4 bg-muted w-1/4" />
                    </div>
                  ))}
            </div>
          </div>
        </section>

        <section className="">
          <div className="rounded-lg relative bg-foreground/10 dark:bg-slate-800 px-10 py-12 text-foreground/80 dark:border dark:shadow-4xl">
            <h3 className="text-3xl font-bold">Flat 30% Off</h3>
            <p className="mt-2">On selected summer collections</p>
            <Button
              variant={"ghost"}
              className="mt-6 shadow-sm shadow-background/30 rounded py-3 font-semibold"
            >
              Shop Collection
            </Button>

            <div
              className="h-[90%] w-[49.5%] rounded absolute top-2 left-1/2 bg-cover bg-center hidden md:block"
              style={{
                backgroundImage: `url(${images.heroBanners.bannerImg_02.src})`,
              }}
            >
              <div className="h-full w-full bg-foreground/40"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
