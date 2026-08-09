export interface ItineraryDay {
  day: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number | null;
  price_label: string | null;
  duration: string | null;
  location: string | null;
  featured_image: string | null;
  gallery: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  faq: FaqItem[];
  featured: boolean;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  featured_image: string | null;
  gallery: string[];
  is_published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_country: string | null;
  quote: string;
  rating: number;
  avatar: string | null;
  is_published: boolean;
  created_at: string;
}

export interface BookingInquiry {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  guests: number | null;
  preferred_date: string | null;
  duration: string | null;
  message: string | null;
  package_slug: string | null;
  status: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  logo: string | null;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  default_seo_title: string | null;
  default_seo_description: string | null;
  default_og_image: string | null;
  updated_at: string;
}