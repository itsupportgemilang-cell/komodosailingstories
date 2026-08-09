import { createPublicServerClient } from "@/lib/supabase/public-client.server";
import type {
  Article,
  Destination,
  FaqItem,
  ItineraryDay,
  Package,
  SiteSettings,
  Testimonial,
} from "@/types/content";

const PACKAGE_CARD_FIELDS =
  "id, title, slug, short_description, price, price_label, duration, location, featured_image, featured, is_published, created_at";

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function toObjectArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizePackage(row: Record<string, unknown>): Package {
  return {
    ...(row as unknown as Package),
    gallery: toStringArray(row["gallery"]),
    highlights: toStringArray(row["highlights"]),
    included: toStringArray(row["included"]),
    excluded: toStringArray(row["excluded"]),
    itinerary: toObjectArray<ItineraryDay>(row["itinerary"]),
    faq: toObjectArray<FaqItem>(row["faq"]),
  };
}

function normalizeDestination(row: Record<string, unknown>): Destination {
  return { ...(row as unknown as Destination), gallery: toStringArray(row["gallery"]) };
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createPublicServerClient();
  const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  return (data as SiteSettings | null) ?? null;
}

export async function fetchFeaturedPackages(limit = 4): Promise<Package[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_CARD_FIELDS)
    .eq("is_published", true)
    .eq("featured", true)
    .order("price", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizePackage(row as Record<string, unknown>));
}

export async function fetchPublishedPackages(): Promise<Package[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_CARD_FIELDS)
    .eq("is_published", true)
    .order("price", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizePackage(row as Record<string, unknown>));
}

export async function fetchPackageBySlug(slug: string): Promise<Package | null> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizePackage(data as Record<string, unknown>) : null;
}

export async function fetchRelatedPackages(slug: string, limit = 3): Promise<Package[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_CARD_FIELDS)
    .eq("is_published", true)
    .neq("slug", slug)
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizePackage(row as Record<string, unknown>));
}

export async function fetchDestinations(): Promise<Destination[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeDestination(row as Record<string, unknown>));
}

export async function fetchDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeDestination(data as Record<string, unknown>) : null;
}

export async function fetchPublishedArticles(limit?: number): Promise<Article[]> {
  const supabase = createPublicServerClient();
  let query = supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Article[];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Article | null) ?? null;
}

export async function fetchRelatedArticles(slug: string, limit = 3): Promise<Article[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Article[];
}

export async function fetchTestimonials(limit = 6): Promise<Testimonial[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Testimonial[];
}

export interface BookingInquiryInput {
  name: string;
  email: string;
  whatsapp?: string | undefined;
  guests?: number | undefined;
  preferred_date?: string | undefined;
  duration?: string | undefined;
  message?: string | undefined;
  package_slug?: string | undefined;
}

export async function insertBookingInquiry(input: BookingInquiryInput): Promise<{ ok: true }> {
  const supabase = createPublicServerClient();
  const { error } = await supabase.from("booking_inquiries").insert({
    name: input.name,
    email: input.email,
    whatsapp: input.whatsapp ?? null,
    guests: input.guests ?? null,
    preferred_date: input.preferred_date || null,
    duration: input.duration ?? null,
    message: input.message ?? null,
    package_slug: input.package_slug ?? null,
  });
  if (error) throw new Error(error.message);
  return { ok: true };
}