# Komodo Voyage

Redesign and rebuild the current Komodo Tropical Cruise website while preserving the existing project architecture where useful.

IMPORTANT:

This is a redesign AND a functional full-stack CMS implementation.

Do NOT create a generic travel agency template.

Do NOT use generic SaaS/dashboard aesthetics for the public website.

Do NOT use hardcoded package/article/destination content in the frontend.

Do NOT create static pages for individual packages or articles.

The final website must look like a premium, editorial, luxury tropical sailing brand and must be fully database-driven.

==================================================

BRAND

==================================================

Brand:

Komodo Tropical Cruise

Business:

Luxury sailing cruise, private charter, and curated adventure experiences.

Location:

Labuan Bajo, Indonesia.

Destination:

Komodo National Park.

Brand personality:

- sophisticated

- adventurous

- tropical

- intimate

- authentic

- premium

- calm

- editorial

- exclusive but approachable

The website should feel closer to a premium boutique travel / yacht / luxury hospitality brand than a normal Indonesian travel agency website.

==================================================

DESIGN REFERENCE

==================================================

Use the visual direction of the design reference provided in this conversation.

The design should have:

- large cinematic photography

- strong editorial typography

- generous whitespace

- asymmetric layouts

- sophisticated typography hierarchy

- large serif headlines

- clean sans-serif UI text

- subtle animations

- elegant transitions

- high-end travel editorial feel

- natural tropical atmosphere

- minimal UI

- refined cards

- strong visual storytelling

Avoid:

- generic Bootstrap-looking layouts

- excessive cards

- excessive rounded containers

- excessive gradients

- childish tropical graphics

- overly bright colors

- generic stock travel agency appearance

- excessive animations

- giant text covering the entire screen

- overly complicated navigation

The website must feel custom-designed rather than generated from a generic template.

==================================================

TYPOGRAPHY

==================================================

Use:

Headings:

Cormorant Garamond

Body/UI:

Manrope or Inter

Use serif typography for:

- hero headline

- major section headings

- editorial statements

Use sans-serif typography for:

- navigation

- body

- buttons

- labels

- forms

- admin interface

Typography should be elegant and spacious.

==================================================

COLOR SYSTEM

==================================================

Primary:

#1B211D

Background:

#F5F1E8

Secondary background:

#E8E2D5

Accent:

muted tropical green

Text:

deep charcoal

Use colors sparingly.

Do not make the site overly green.

==================================================

GLOBAL UX

==================================================

Desktop-first premium editorial layout, but fully responsive.

Breakpoints:

- mobile 375px

- tablet 768px

- desktop 1440px+

Mobile must NOT simply stack every desktop section.

Recompose sections intelligently for mobile.

No horizontal overflow.

Use subtle reveal animations:

- fade

- slide

- image scale

- stagger

Animations must be subtle and performance-friendly.

==================================================

HEADER

==================================================

Create a premium sticky header.

Desktop:

Left:

KOMODO

TROPICAL CRUISE

Navigation:

Packages

Private Charter

Destinations

Journal

About

Right:

Book Your Journey

The header should initially overlay the hero.

After scrolling:

- background becomes solid/off-white

- text becomes readable

- subtle shadow/border

- smooth transition

Mobile:

- logo

- hamburger menu

- full-screen or elegant slide-down menu

==================================================

HOME PAGE

==================================================

Route:

/

Build the homepage as an immersive editorial story.

-----------------------------

SECTION 1 — HERO

-----------------------------

Full viewport cinematic hero.

Background:

A beautiful Indonesian Phinisi sailing boat surrounded by the islands and turquoise waters of Komodo National Park.

Use a real image asset or a high-quality placeholder that can later be replaced from the CMS.

Overlay text:

Small label:

KOMODO NATIONAL PARK · INDONESIA

Main headline:

"Discover Komodo,

Beyond the Ordinary."

Supporting text:

"An intimate sailing experience through wild islands, hidden beaches, and extraordinary waters."

CTA:

Explore Journeys

Secondary CTA:

Private Charter

Add subtle scroll indicator.

The hero must be visually dominant.

-----------------------------

SECTION 2 — EDITORIAL INTRO

-----------------------------

Use an asymmetric editorial composition.

Small eyebrow:

THE JOURNEY

Headline:

"Where the sea

becomes your journey."

Supporting text explaining Komodo Tropical Cruise.

Use two images:

- large main image

- smaller overlapping image

Do not use a generic two-column card layout.

-----------------------------

SECTION 3 — FEATURED PACKAGES

-----------------------------

Eyebrow:

CURATED JOURNEYS

Heading:

"Choose Your Journey"

Supporting:

"Thoughtfully crafted sailing experiences through the extraordinary landscapes of Komodo."

IMPORTANT:

This section MUST fetch data from Supabase.

Never hardcode package data.

Query:

packages

WHERE is_published = true

AND featured = true

Create reusable PackageCard component.

Package card must display:

- image

- title

- duration

- location

- starting price

- short description

- CTA

CTA:

Explore Journey

Cards should feel editorial rather than standard ecommerce cards.

Show maximum 4 featured packages.

Add:

View All Journeys

-----------------------------

SECTION 4 — DESTINATIONS

-----------------------------

Eyebrow:

THE ARCHIPELAGO

Heading:

"Places Worth Sailing For"

Load destinations dynamically from Supabase.

Example data:

Padar Island

Pink Beach

Komodo Island

Manta Point

Taka Makassar

Kanawa Island

Create a visually interesting horizontal/offset image layout.

Do NOT make six identical cards.

Use varied image sizes.

Each destination links to:

/destinations/:slug

-----------------------------

SECTION 5 — FULL WIDTH IMAGE STORY

-----------------------------

Create a cinematic full-width image section.

Overlay small text:

"THE KOMODO EXPERIENCE"

Headline:

"Some places are meant

to be discovered slowly."

Include subtle parallax/image movement if performant.

-----------------------------

SECTION 6 — EXPERIENCE

-----------------------------

Create an editorial experience section.

Categories:

Sailing

Snorkeling

Diving

Wildlife

Island Hopping

Sunset

Local Culture

Use a mix of photography and typography.

Do not make this a generic icon grid.

-----------------------------

SECTION 7 — WHY US

-----------------------------

Minimal editorial section.

Heading:

"Made for the moments

you'll remember."

Benefits:

Authentic Sailing

Personalized Service

Curated Routes

Experienced Local Crew

Use simple typography rather than oversized icons.

-----------------------------

SECTION 8 — PRIVATE CHARTER

-----------------------------

Create a visually powerful full-width section.

Image:

Luxury traditional Phinisi boat at sunset.

Heading:

"Your Komodo.

Your Journey."

Text:

"Charter the entire boat and experience Komodo at your own pace."

CTA:

Explore Private Charter

-----------------------------

SECTION 9 — TESTIMONIALS

-----------------------------

Load testimonials from Supabase.

Create elegant editorial testimonials.

Show:

quote

name

country

rating

Avoid giant carousel UI.

-----------------------------

SECTION 10 — JOURNAL

-----------------------------

Eyebrow:

FROM THE JOURNAL

Heading:

"Stories From the Archipelago"

Load latest 3 published articles from Supabase.

Use varied editorial article layouts.

Article card:

- image

- category

- title

- date

- excerpt

- read link

CTA:

Explore Journal

-----------------------------

SECTION 11 — FINAL CTA

-----------------------------

Minimal full-width section.

Heading:

"Ready to discover

Komodo differently?"

CTA:

Plan Your Journey

-----------------------------

FOOTER

-----------------------------

Premium dark footer.

Include:

Komodo Tropical Cruise

Labuan Bajo, Indonesia

Navigation

Packages

Private Charter

Destinations

Journal

About

Contact

Contact:

WhatsApp

Email

Instagram

Legal:

Privacy Policy

Terms & Conditions

==================================================

PACKAGES

==================================================

Route:

/packages

This page MUST be database-driven.

Fetch packages from:

Supabase → packages

Only show:

is_published = true

Create an editorial package listing.

Include:

- page intro

- package count

- filters if appropriate

- package grid/list

- pagination or load more if needed

Package cards must use reusable PackageCard.

DO NOT hardcode packages.

==================================================

PACKAGE DATABASE

==================================================

Create Supabase table:

packages

Fields:

id UUID primary key

title TEXT NOT NULL

slug TEXT UNIQUE NOT NULL

short_description TEXT

description TEXT

price NUMERIC

price_label TEXT

duration TEXT

location TEXT

featured_image TEXT

gallery JSONB

highlights JSONB

itinerary JSONB

included JSONB

excluded JSONB

faq JSONB

featured BOOLEAN DEFAULT false

is_published BOOLEAN DEFAULT false

seo_title TEXT

seo_description TEXT

og_image TEXT

created_at TIMESTAMPTZ DEFAULT now()

updated_at TIMESTAMPTZ DEFAULT now()

==================================================

PACKAGE DETAIL

==================================================

Route:

/packages/:slug

Fetch package by slug.

Do NOT create individual hardcoded pages.

Use one reusable template.

Design:

Hero image

Title

Duration

Location

Price

Book button

Then:

Overview

Highlights

Itinerary

Included

Excluded

Gallery

FAQ

Related Packages

Booking CTA

Itinerary should be visually presented as an editorial timeline.

Gallery should be immersive and responsive.

Related packages should query Supabase dynamically.

==================================================

DESTINATIONS

==================================================

Route:

/destinations

Database-driven.

Supabase table:

destinations

Fields:

id UUID

name TEXT

slug TEXT UNIQUE

short_description TEXT

description TEXT

featured_image TEXT

gallery JSONB

is_published BOOLEAN

seo_title TEXT

seo_description TEXT

og_image TEXT

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

Create:

/destinations/:slug

Dynamic detail template.

==================================================

ARTICLES / JOURNAL

==================================================

Use the term "Journal" on the public website instead of "Blog" to make it feel more premium.

Routes:

/articles

/articles/:slug

Database table:

articles

Fields:

id UUID

title TEXT

slug TEXT UNIQUE

excerpt TEXT

content TEXT

featured_image TEXT

category TEXT

author TEXT

published_at TIMESTAMPTZ

is_published BOOLEAN

seo_title TEXT

seo_description TEXT

og_image TEXT

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ

Articles page must have:

Featured article

Article grid

Category filtering

Pagination/load more

Article detail:

Hero

Category

Title

Date

Author

Content

Related articles

Share buttons

CTA

Use reusable ArticleCard.

==================================================

TESTIMONIALS

==================================================

Supabase table:

testimonials

Fields:

id UUID

customer_name TEXT

customer_country TEXT

quote TEXT

rating INTEGER

avatar TEXT

is_published BOOLEAN

created_at TIMESTAMPTZ

Only display:

is_published = true

==================================================

PRIVATE CHARTER

==================================================

Route:

/private-charter

Create a premium dedicated landing page.

Sections:

Hero

Why Private Charter

The Boat

Experience

Custom Itinerary

What's Included

Gallery

FAQ

Booking CTA

Include booking inquiry form:

Name

Email

WhatsApp

Number of Guests

Preferred Date

Duration

Message

Store submissions in Supabase.

==================================================

BOOKING INQUIRIES

==================================================

Create table:

booking_inquiries

Fields:

id UUID

name TEXT

email TEXT

whatsapp TEXT

guests INTEGER

preferred_date DATE

duration TEXT

message TEXT

status TEXT DEFAULT 'new'

created_at TIMESTAMPTZ DEFAULT now()

Status:

new

contacted

confirmed

cancelled

Public users can INSERT.

Only admins can READ/UPDATE.

==================================================

ADMIN CMS

==================================================

Create:

/admin/login

/admin

/admin/packages

/admin/destinations

/admin/articles

/admin/testimonials

/admin/booking-inquiries

/admin/settings

Use Supabase Auth.

Admin login:

Email

Password

Protect all admin routes.

Unauthenticated users must be redirected to /admin/login.

==================================================

ADMIN DASHBOARD DESIGN

==================================================

The public website should be premium/editorial.

The admin dashboard should be simple and functional.

Sidebar:

Dashboard

Packages

Destinations

Journal

Testimonials

Booking Inquiries

Settings

Dashboard cards:

Total Packages

Published Packages

Total Articles

Published Articles

New Inquiries

Recent activity.

==================================================

ADMIN PACKAGE CRUD

==================================================

Create functional CRUD.

Admin can:

Create

Read

Update

Delete

Publish/unpublish

Feature/unfeature

Form:

Title

Slug

Short Description

Description

Price

Price Label

Duration

Location

Featured Image

Gallery

Highlights

Itinerary

Included

Excluded

FAQ

Featured

Published

SEO Title

SEO Description

OG Image

Image upload through Supabase Storage.

Use preview before saving.

==================================================

ADMIN DESTINATION CRUD

==================================================

Create:

Read

Update

Delete

Publish/unpublish

Fields:

Name

Slug

Short Description

Description

Featured Image

Gallery

Published

SEO Title

SEO Description

OG Image

==================================================

ADMIN ARTICLE CRUD

==================================================

Create:

Read

Update

Delete

Publish/unpublish

Fields:

Title

Slug

Excerpt

Content

Featured Image

Category

Author

Published Date

Published

SEO Title

SEO Description

OG Image

Use a proper rich text editor.

==================================================

ADMIN TESTIMONIAL CRUD

==================================================

Fields:

Customer Name

Country

Quote

Rating

Avatar

Published

CRUD functionality.

==================================================

ADMIN BOOKING INQUIRIES

==================================================

Admin can:

View

Search

Filter

Open details

Change status

Do not allow public users to access this data.

==================================================

ADMIN SETTINGS

==================================================

Create site settings.

Fields:

Company Name

Logo

WhatsApp

Email

Phone

Address

Instagram

Facebook

Default SEO Title

Default SEO Description

Default OG Image

Store in Supabase.

Public website should read these values dynamically.

==================================================

SUPABASE STORAGE

==================================================

Create buckets:

site-assets

package-images

destination-images

article-images

testimonial-images

Use Storage for images.

Do not store image binaries in PostgreSQL.

Store URLs in database.

Validate:

file type

file size

Show upload progress and errors.

==================================================

AUTHENTICATION

==================================================

Use Supabase Auth.

Create profiles table:

id UUID

full_name TEXT

role TEXT

created_at TIMESTAMPTZ

Only role = admin can access CMS.

Use Row Level Security.

==================================================

RLS SECURITY

==================================================

Enable RLS for all content tables.

Public:

SELECT published content only.

Admin:

full CRUD.

Booking inquiries:

public INSERT only.

admin SELECT/UPDATE.

Never expose Supabase service role key in frontend.

Use environment variables.

==================================================

DYNAMIC DATA REQUIREMENT

==================================================

THIS IS CRITICAL.

The following must NEVER be hardcoded into the frontend:

Packages

Destinations

Articles

Testimonials

Booking inquiries

Site settings

All must come from Supabase.

For example:

Admin creates:

Title:

Komodo 5D4N Ultimate Sailing

Price:

6500000

Duration:

5 Days 4 Nights

Image:

uploaded from admin

After publishing:

It automatically appears at:

/packages

and:

/packages/komodo-5d4n-ultimate-sailing

without changing frontend code.

Same behavior for:

Articles

Destinations

Testimonials

==================================================

SEO

==================================================

Implement dynamic SEO.

Every public page must have:

title

meta description

canonical URL

Open Graph title

Open Graph description

Open Graph image

Twitter card

semantic HTML

correct heading hierarchy

image alt text

Dynamic package SEO.

Dynamic article SEO.

Dynamic destination SEO.

Generate SEO-friendly slugs.

Add JSON-LD where appropriate:

Organization

WebSite

BreadcrumbList

Article

TouristTrip / appropriate travel structured data where valid

Do not generate invalid schema.

Create sitemap-ready architecture.

Create robots.txt-ready architecture.

==================================================

PERFORMANCE

==================================================

Prioritize excellent Core Web Vitals.

Use:

responsive images

lazy loading

optimized images

proper image dimensions

minimal JavaScript

code splitting

reusable components

efficient Supabase queries

Do not load huge images unnecessarily.

==================================================

ACCESSIBILITY

==================================================

Use:

semantic HTML

proper labels

alt text

keyboard navigation

focus states

accessible buttons

accessible forms

sufficient color contrast

==================================================

COMPONENT ARCHITECTURE

==================================================

Create reusable components:

Header

Footer

Hero

PackageCard

DestinationCard

ArticleCard

TestimonialCard

Gallery

ItineraryTimeline

FAQ

BookingForm

CTASection

SectionHeading

ImageReveal

Admin:

AdminLayout

Sidebar

AdminHeader

DataTable

Search

Filters

ImageUploader

RichTextEditor

PackageForm

DestinationForm

ArticleForm

TestimonialForm

BookingInquiryTable

ConfirmDialog

Avoid duplicate code.

==================================================

DATA ACCESS ARCHITECTURE

==================================================

Keep Supabase/database access separate from UI.

Use:

src/

  components/

  pages/

  layouts/

  hooks/

  lib/

    supabase/

    services/

  types/

  utils/

Create service functions such as:

getPublishedPackages()

getFeaturedPackages()

getPackageBySlug()

getDestinations()

getDestinationBySlug()

getPublishedArticles()

getArticleBySlug()

getTestimonials()

createBookingInquiry()

Admin services:

createPackage()

updatePackage()

deletePackage()

createArticle()

updateArticle()

deleteArticle()

createDestination()

updateDestination()

deleteDestination()

Do not place all database logic directly inside UI components.

==================================================

LOADING / ERROR STATES

==================================================

Every dynamic page must support:

Loading state

Empty state

Error state

Success state

Example:

"No journeys available yet."

Do not show broken layouts when data is missing.

==================================================

SAMPLE DATA

==================================================

Seed the database with realistic sample content.

Packages:

Komodo 2D1N Sailing Escape

Komodo 3D2N Signature Journey

Komodo 4D3N Island Explorer

Private Komodo Charter

Destinations:

Padar Island

Pink Beach

Komodo Island

Manta Point

Taka Makassar

Kanawa Island

Articles:

Best Time to Visit Komodo National Park

A Guide to Sailing Around Komodo

What to Expect on a Phinisi Cruise

Komodo's Most Beautiful Islands

Testimonials:

Create several realistic examples.

==================================================

SOURCE CODE QUALITY

==================================================

Use TypeScript.

Use reusable components.

Use clear naming.

Avoid duplicated code.

Avoid unnecessary dependencies.

Keep the project maintainable.

Do not expose secrets.

Do not hardcode Supabase credentials.

==================================================

FINAL ACCEPTANCE TEST

==================================================

Before considering this task complete, verify:

1. Public homepage loads.

2. Packages page loads packages from Supabase.

3. Package detail loads using slug.

4. Destinations load from Supabase.

5. Destination detail loads using slug.

6. Articles load from Supabase.

7. Article detail loads using slug.

8. Testimonials load from Supabase.

9. Admin login works.

10. Admin dashboard works.

11. Admin can create package.

12. Admin can upload package image.

13. Admin can edit package.

14. Admin can delete package.

15. Admin can publish/unpublish package.

16. New package automatically appears on public website.

17. Admin can create article.

18. New article automatically appears on Journal.

19. Admin can create destination.

20. New destination automatically appears on public website.

21. Booking form saves to Supabase.

22. Admin can view booking inquiries.

23. RLS prevents unauthorized data access.

24. Dynamic SEO metadata works.

25. Mobile layout works correctly.

26. No hardcoded package/article/destination data remains in the public frontend.

IMPORTANT:

Do not tell me that something is implemented if it is only mocked.

Actually connect the UI to Supabase and verify the data flow.

Preserve the premium editorial design throughout the public website.

The result should be a real production-ready website and CMS, not a static prototype.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://komodosailingstories.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bb12be17-db1e-4200-9f71-01dfa9e37266).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
