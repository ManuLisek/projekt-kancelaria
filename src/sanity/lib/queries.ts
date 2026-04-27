import { defineQuery } from "next-sanity";

export const PROFILE_QUERY = defineQuery(`
  *[_type == "profile" && _id == "profile"][0]{
    officeName,
    personName,
    heroText,
    bio,
    portrait,
    address,
    phone,
    email,
    facebookUrl,
    instagramUrl,
    seo
  }
`);

export const SPECIALIZATIONS_QUERY = defineQuery(`
  *[_type == "specialization" && defined(slug.current)]
  | order(order asc, title asc) {
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
    publishedAt,
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
