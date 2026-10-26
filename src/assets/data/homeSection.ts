import { images } from "./images";

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  image: {
    src: string;
  };
}

export interface Category {
  title: string;
  slug: string;
  kicker: string;
  subtitle: string;
  description: string;
  image: string;

  href: string;
  count: string;
}

export const heroBanners: HeroBanner[] = [
  {
    id: 1,
    title: "Big Summer Sale",
    subtitle: "Up to 50% Off on Trending Styles",
    ctaText: "Shop Now",
    image: images.heroBanners.bannerImg_01,
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh Looks for the New Season",
    ctaText: "Explore",
    image: images.heroBanners.bannerImg_02,
  },
];

export const CATEGORIES:Category[] = [
  {
    title: "Women",
    slug: "women",
    kicker: "Archive 01",
    subtitle: "Les Silhouettes Feminines",
    description:
      "Flowing silks, architectural overcoats, and tailored drape pieces.",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=85",
    href: "/women",
    count: "24 Pieces",
  },
  {
    title: "Men",
    slug: "men",
    kicker: "Archive 02",
    subtitle: "L'Homme Moderne",
    description:
      "Structural tailoring, tactical knits, and precision utilitarian layers.",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=85",
    href: "/men",
    count: "18 Pieces",
  },
  {
    title: "Kids",
    slug: "kids",
    kicker: "Archive 03",
    subtitle: "Les Petits Ateliers",
    description:
      "Organic soft cottons and miniature winter layering silhouettes.",
    image:
      "https://images.unsplash.com/photo-1670014541811-9b0ec280ed60?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    href: "/kids",
    count: "12 Pieces",
  },
  {
    title: "Archive Sale",
    slug: "sale",
    kicker: "Archive 04",
    subtitle: "Curated Reductions",
    description: "Archived runway editions and seasonal marks up to 40% off.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=85",
    href: "/sale",
    count: "Limited Stock",
  },
];
