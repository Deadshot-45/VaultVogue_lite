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
