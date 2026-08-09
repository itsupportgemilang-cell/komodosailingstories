import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const slugInput = z.object({ slug: z.string().min(1).max(200) });

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchSiteSettings } = await import("./content.server");
  return fetchSiteSettings();
});

export const getFeaturedPackages = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchFeaturedPackages } = await import("./content.server");
  return fetchFeaturedPackages(4);
});

export const getPublishedPackages = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPublishedPackages } = await import("./content.server");
  return fetchPublishedPackages();
});

export const getPackageBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => slugInput.parse(data))
  .handler(async ({ data }) => {
    const { fetchPackageBySlug, fetchRelatedPackages } = await import("./content.server");
    const pkg = await fetchPackageBySlug(data.slug);
    if (!pkg) return { pkg: null, related: [] };
    return { pkg, related: await fetchRelatedPackages(data.slug, 3) };
  });

export const getDestinations = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchDestinations } = await import("./content.server");
  return fetchDestinations();
});

export const getDestinationBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => slugInput.parse(data))
  .handler(async ({ data }) => {
    const { fetchDestinationBySlug, fetchDestinations } = await import("./content.server");
    const destination = await fetchDestinationBySlug(data.slug);
    if (!destination) return { destination: null, others: [] };
    const all = await fetchDestinations();
    return { destination, others: all.filter((d) => d.slug !== data.slug).slice(0, 3) };
  });

export const getPublishedArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPublishedArticles } = await import("./content.server");
  return fetchPublishedArticles();
});

export const getLatestArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPublishedArticles } = await import("./content.server");
  return fetchPublishedArticles(3);
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => slugInput.parse(data))
  .handler(async ({ data }) => {
    const { fetchArticleBySlug, fetchRelatedArticles } = await import("./content.server");
    const article = await fetchArticleBySlug(data.slug);
    if (!article) return { article: null, related: [] };
    return { article, related: await fetchRelatedArticles(data.slug, 3) };
  });

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchTestimonials } = await import("./content.server");
  return fetchTestimonials(6);
});

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  whatsapp: z.string().trim().max(60).optional(),
  guests: z.number().int().min(1).max(200).optional(),
  preferred_date: z.string().max(30).optional(),
  duration: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
  package_slug: z.string().trim().max(200).optional(),
});

export const createBookingInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { insertBookingInquiry } = await import("./content.server");
    return insertBookingInquiry(data);
  });