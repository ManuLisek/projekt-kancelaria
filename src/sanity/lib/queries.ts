import { defineQuery } from "next-sanity";

export const PROFILE_QUERY = defineQuery(`
  *[_type == "profile" && _id == "profile"][0]{
    officeName,
    personName,
    heroText,
    bio,
    portrait,
    address,
    location,
    phone,
    email,
    facebookUrl,
    instagramUrl,
    seo,
    "portraitAlt": portrait.alt
  }
`);

export const SPECIALIZATIONS_QUERY = defineQuery(`
  *[_type == "specialization" && defined(slug.current)]
  | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    order,
    seo
  }
`);

export const SPECIALIZATION_SLUGS_QUERY = defineQuery(`
  *[_type == "specialization" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const SPECIALIZATION_BY_SLUG_QUERY = defineQuery(`
  *[_type == "specialization" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    order,
    seo
  }
`);

export const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    "mainImageAlt": mainImage.alt,
    publishedAt,
    seo
  }
`);

export const ARTICLE_SLUGS_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    "mainImageAlt": mainImage.alt,
    publishedAt,
    content,
    specializations[]->{
      _id,
      title,
      "slug": slug.current
    },
    seo
  }
`);

export const ONLINE_LEGAL_AID_QUERY = defineQuery(`
  *[_type == "onlineLegalAid" && _id == "onlineLegalAid"][0]{
    title,
    excerpt,
    content,
    ctaLabel,
    seo
  }
`);
