import type { PortableTextBlock } from "next-sanity";

export interface SanityImage {
  _type: "image";
  asset?: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: unknown;
  crop?: unknown;
}

export interface SeoFields {
  title?: string;
  description?: string;
}

export interface Profile {
  officeName: string;
  personName: string;
  heroText?: string;
  bio?: PortableTextBlock[];
  portrait?: SanityImage;
  portraitAlt?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  seo?: SeoFields;
}

export interface SpecializationSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  order?: number;
  seo?: SeoFields;
}

export interface SpecializationDetails extends SpecializationSummary {
  content?: PortableTextBlock[];
}

export interface SlugParam {
  slug: string;
}

export interface ArticleSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage?: SanityImage;
  mainImageAlt?: string;
  publishedAt: string;
  seo?: SeoFields;
}

export interface ArticleSpecialization {
  _id: string;
  title: string;
  slug: string;
}

export interface ArticleDetails extends ArticleSummary {
  content?: PortableTextBlock[];
  specializations?: ArticleSpecialization[];
}
