
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'admin');
$$;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PACKAGES
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC,
  price_label TEXT,
  duration TEXT,
  location TEXT,
  featured_image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  included JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded JSONB NOT NULL DEFAULT '[]'::jsonb,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT, seo_description TEXT, og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_public_read" ON public.packages FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "packages_admin_write" ON public.packages FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DESTINATIONS
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  featured_image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT, seo_description TEXT, og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.destinations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destinations TO authenticated;
GRANT ALL ON public.destinations TO service_role;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "destinations_public_read" ON public.destinations FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "destinations_admin_write" ON public.destinations FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ARTICLES
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT, seo_description TEXT, og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "articles_admin_write" ON public.articles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_country TEXT,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  avatar TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "testimonials_admin_write" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- BOOKING INQUIRIES
CREATE TABLE public.booking_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  guests INTEGER,
  preferred_date DATE,
  duration TEXT,
  message TEXT,
  package_slug TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.booking_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_inquiries TO authenticated;
GRANT ALL ON public.booking_inquiries TO service_role;
ALTER TABLE public.booking_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inquiries_public_insert" ON public.booking_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "inquiries_admin_read" ON public.booking_inquiries FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "inquiries_admin_update" ON public.booking_inquiries FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "inquiries_admin_delete" ON public.booking_inquiries FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Komodo Tropical Cruise',
  logo TEXT,
  whatsapp TEXT, email TEXT, phone TEXT, address TEXT,
  instagram TEXT, facebook TEXT,
  default_seo_title TEXT, default_seo_description TEXT, default_og_image TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings_admin_write" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

INSERT INTO public.site_settings (company_name, whatsapp, email, phone, address, instagram, facebook, default_seo_title, default_seo_description, default_og_image)
VALUES ('Komodo Tropical Cruise', '+6281234567890', 'hello@komodotropicalcruise.com', '+62 812 3456 7890', 'Jl. Soekarno Hatta, Labuan Bajo, Flores, Indonesia', 'https://instagram.com/komodotropicalcruise', 'https://facebook.com/komodotropicalcruise',
'Komodo Tropical Cruise — Luxury Sailing in Komodo National Park', 'Intimate Phinisi sailing journeys and private charters through the wild islands of Komodo National Park, Labuan Bajo, Indonesia.', '/images/hero-phinisi.jpg');

-- SEED PACKAGES
INSERT INTO public.packages (title, slug, short_description, description, price, price_label, duration, location, featured_image, gallery, highlights, itinerary, included, excluded, faq, featured, is_published, seo_title, seo_description, og_image) VALUES
('Komodo 2D1N Sailing Escape','komodo-2d1n-sailing-escape','A short, unhurried sailing escape through the closest wonders of the Komodo archipelago.','Two days of open water, quiet anchorages and warm evenings on deck. Our 2D1N Sailing Escape is designed for travellers with limited time who still want the real experience of sleeping at sea.',3200000,'from IDR 3,200,000 / person','2 Days 1 Night','Komodo National Park','/images/padar.jpg','["/images/padar.jpg","/images/pink-beach.jpg","/images/hero-phinisi.jpg"]','["Sunrise at Padar Island","Snorkelling at Pink Beach","Dinner under the stars","Komodo dragon trekking"]','[{"day":"Day 1","title":"Departure & Padar","description":"Board in Labuan Bajo, sail towards Padar Island, snorkel at Pink Beach, overnight anchorage."},{"day":"Day 2","title":"Komodo & Return","description":"Sunrise trek, Komodo Island ranger walk, Manta Point snorkelling, return by late afternoon."}]','["Cabin accommodation","All meals & drinking water","Snorkelling equipment","English speaking guide","National park entry"]','["Flights","Travel insurance","Personal expenses","Tips"]','[{"question":"Is this suitable for families?","answer":"Yes. The route is gentle and our crew is experienced with children."},{"question":"What should I bring?","answer":"Light clothing, reef-safe sunscreen, a hat and a sense of adventure."}]',true,true,'Komodo 2D1N Sailing Escape | Komodo Tropical Cruise','A two day sailing escape through Padar, Pink Beach and Komodo Island aboard a traditional Phinisi.','/images/padar.jpg'),
('Komodo 3D2N Signature Journey','komodo-3d2n-signature-journey','Our most loved route — three days across the archipelago''s most extraordinary waters.','The Signature Journey is the fullest expression of what we do: slow mornings, remote islands, manta rays and long golden evenings anchored in still water.',5400000,'from IDR 5,400,000 / person','3 Days 2 Nights','Komodo National Park','/images/hero-phinisi.jpg','["/images/hero-phinisi.jpg","/images/padar.jpg","/images/pink-beach.jpg"]','["Manta Point encounter","Taka Makassar sandbar","Kelor Island viewpoint","Two nights at sea"]','[{"day":"Day 1","title":"Labuan Bajo to Kelor","description":"Set sail late morning, first swim at Kelor Island, sunset at anchor."},{"day":"Day 2","title":"Padar, Pink Beach & Komodo","description":"Sunrise on Padar ridge, Pink Beach, ranger walk on Komodo Island."},{"day":"Day 3","title":"Manta Point & Taka Makassar","description":"Swim with manta rays, walk the sandbar, return to Labuan Bajo."}]','["Cabin accommodation","All meals & snacks","Snorkelling equipment","Ranger & guide fees","Airport transfers"]','["Flights","Diving","Insurance","Alcoholic beverages"]','[{"question":"Can I dive instead of snorkel?","answer":"Yes, certified diving can be arranged at additional cost."}]',true,true,'Komodo 3D2N Signature Journey | Komodo Tropical Cruise','Three days sailing Komodo National Park: Padar, Pink Beach, Manta Point and Taka Makassar.','/images/hero-phinisi.jpg'),
('Komodo 4D3N Island Explorer','komodo-4d3n-island-explorer','A deeper, slower route for travellers who want the archipelago beyond the highlights.','Four days is where Komodo really opens up. Quiet bays, villages, night skies without light and the kind of pace that changes how a place feels.',7900000,'from IDR 7,900,000 / person','4 Days 3 Nights','Komodo National Park','/images/pink-beach.jpg','["/images/pink-beach.jpg","/images/charter-sunset.jpg","/images/padar.jpg"]','["Kanawa Island","Remote southern bays","Night sky at anchor","Local village visit"]','[{"day":"Day 1","title":"Setting Out","description":"Departure and first anchorage near Kanawa Island."},{"day":"Day 2","title":"The Wild South","description":"Sailing towards quieter southern reefs and hidden beaches."},{"day":"Day 3","title":"Padar & Komodo","description":"Sunrise trek, Pink Beach, Komodo dragons."},{"day":"Day 4","title":"Manta Point & Home","description":"Final swim with mantas before returning to Labuan Bajo."}]','["Cabin accommodation","All meals","Snorkelling gear","Guide & park fees","Transfers"]','["Flights","Diving","Insurance"]','[{"question":"How many guests per departure?","answer":"We keep departures intimate, with a maximum of 12 guests."}]',true,true,'Komodo 4D3N Island Explorer | Komodo Tropical Cruise','A four day sailing journey through the quieter reaches of the Komodo archipelago.','/images/pink-beach.jpg'),
('Private Komodo Charter','private-komodo-charter','The whole boat, your route, your pace.','Charter the entire Phinisi for your family, friends or team. Every itinerary is written from scratch around what you want from the sea.',28000000,'from IDR 28,000,000 / day','Flexible','Labuan Bajo & Komodo','/images/charter-sunset.jpg','["/images/charter-sunset.jpg","/images/hero-phinisi.jpg","/images/padar.jpg"]','["Exclusive use of the boat","Custom itinerary","Private chef","Dedicated crew"]','[{"day":"Planning","title":"We listen first","description":"A conversation about pace, interests and dates."},{"day":"On board","title":"Your route","description":"Anchorages, dive sites and meals arranged around you."}]','["Full boat charter","Crew & captain","All meals","Snorkelling equipment"]','["Flights","Diving","Park fees for extra days"]','[{"question":"What is the minimum charter length?","answer":"Two days and one night."}]',false,true,'Private Komodo Charter | Komodo Tropical Cruise','Charter an entire traditional Phinisi and sail Komodo National Park at your own pace.','/images/charter-sunset.jpg');

-- SEED DESTINATIONS
INSERT INTO public.destinations (name, slug, short_description, description, featured_image, gallery, is_published, sort_order, seo_title, seo_description, og_image) VALUES
('Padar Island','padar-island','Three bays, three colours of sand, one of Indonesia''s great views.','Padar''s ridge line is the most photographed view in Komodo, and for good reason. Climbing it before sunrise, with the sea still dark below, is the moment most guests remember.','/images/padar.jpg','["/images/padar.jpg"]',true,1,'Padar Island | Komodo Tropical Cruise','Sunrise on the ridge of Padar Island in Komodo National Park.','/images/padar.jpg'),
('Pink Beach','pink-beach','Rose-coloured sand from crushed red coral, meeting clear shallow water.','One of only a handful of pink sand beaches in the world. The reef just offshore is shallow, calm and full of life.','/images/pink-beach.jpg','["/images/pink-beach.jpg"]',true,2,'Pink Beach | Komodo Tropical Cruise','Snorkel and swim at the famous Pink Beach of Komodo National Park.','/images/pink-beach.jpg'),
('Komodo Island','komodo-island','Home of the Komodo dragon, walked with park rangers.','The island that gives the park its name. Rangers lead short walks through dry savannah where the dragons still live wild.','/images/hero-phinisi.jpg','["/images/hero-phinisi.jpg"]',true,3,'Komodo Island | Komodo Tropical Cruise','Trek with rangers on Komodo Island and see the dragons in the wild.','/images/hero-phinisi.jpg'),
('Manta Point','manta-point','A cleaning station where manta rays glide within arm''s reach.','Currents here bring plankton, and the mantas follow. Swimming above them is quiet, weightless and unforgettable.','/images/charter-sunset.jpg','["/images/charter-sunset.jpg"]',true,4,'Manta Point | Komodo Tropical Cruise','Swim with manta rays at Manta Point in Komodo National Park.','/images/charter-sunset.jpg'),
('Taka Makassar','taka-makassar','A crescent of white sand that appears from the sea at low tide.','A sandbar with no island attached — it simply rises out of turquoise water and disappears again with the tide.','/images/pink-beach.jpg','["/images/pink-beach.jpg"]',true,5,'Taka Makassar | Komodo Tropical Cruise','Visit the crescent sandbar of Taka Makassar in Komodo.','/images/pink-beach.jpg'),
('Kanawa Island','kanawa-island','Shallow reefs and slow afternoons close to Labuan Bajo.','Often the first or last stop of a journey. Warm, easy water and a reef that starts a few metres from the sand.','/images/padar.jpg','["/images/padar.jpg"]',true,6,'Kanawa Island | Komodo Tropical Cruise','Snorkel the shallow reefs of Kanawa Island near Labuan Bajo.','/images/padar.jpg');

-- SEED ARTICLES
INSERT INTO public.articles (title, slug, excerpt, content, featured_image, category, author, published_at, is_published, seo_title, seo_description, og_image) VALUES
('Best Time to Visit Komodo National Park','best-time-to-visit-komodo-national-park','Seasons, seas and manta migrations — how to choose when to sail.','<p>Komodo can be sailed year round, but the character of the sea changes month to month.</p><h2>April to June</h2><p>Green hills, calm water and fewer boats. Our favourite window.</p><h2>July to August</h2><p>Peak season. Dry, bright and busy, with the most reliable conditions.</p><h2>September to November</h2><p>Warm water, excellent visibility and manta activity at its best.</p><h2>December to March</h2><p>The wet season brings dramatic skies and a quieter archipelago.</p>','/images/padar.jpg','Guides','Komodo Tropical Cruise', now() - interval '5 days', true,'Best Time to Visit Komodo National Park','A month by month guide to sailing conditions in Komodo National Park.','/images/padar.jpg'),
('A Guide to Sailing Around Komodo','a-guide-to-sailing-around-komodo','What a sailing itinerary actually looks like, hour by hour.','<p>Sailing Komodo is less about distance and more about rhythm.</p><h2>Mornings</h2><p>Early starts for ridge walks, before the heat.</p><h2>Afternoons</h2><p>Long sailing legs, snorkelling stops and time on deck.</p><h2>Evenings</h2><p>Anchor, eat, and watch the stars come out over still water.</p>','/images/hero-phinisi.jpg','Sailing','Komodo Tropical Cruise', now() - interval '12 days', true,'A Guide to Sailing Around Komodo','How a Komodo sailing itinerary unfolds, from sunrise treks to evenings at anchor.','/images/hero-phinisi.jpg'),
('What to Expect on a Phinisi Cruise','what-to-expect-on-a-phinisi-cruise','Life aboard a traditional Indonesian wooden sailing boat.','<p>The Phinisi is a Bugis design, built by hand and still sailed across the archipelago.</p><h2>The cabins</h2><p>Simple, comfortable and cool, with sea air rather than noise.</p><h2>The food</h2><p>Fresh fish, Indonesian home cooking and fruit from Labuan Bajo markets.</p><h2>The crew</h2><p>Local, experienced and generous with their knowledge of these waters.</p>','/images/charter-sunset.jpg','On Board','Komodo Tropical Cruise', now() - interval '20 days', true,'What to Expect on a Phinisi Cruise','Cabins, food and crew — what life aboard a traditional Phinisi is really like.','/images/charter-sunset.jpg'),
('Komodo''s Most Beautiful Islands','komodos-most-beautiful-islands','Six places in the archipelago worth sailing for.','<p>Every island in Komodo has its own character. These six are the ones we return to.</p><h2>Padar</h2><p>The ridge, at sunrise.</p><h2>Pink Beach</h2><p>Rose sand and a shallow reef.</p><h2>Taka Makassar</h2><p>A sandbar that appears and disappears.</p>','/images/pink-beach.jpg','Destinations','Komodo Tropical Cruise', now() - interval '30 days', true,'Komodo''s Most Beautiful Islands','A guide to the six most beautiful islands in the Komodo archipelago.','/images/pink-beach.jpg');

-- SEED TESTIMONIALS
INSERT INTO public.testimonials (customer_name, customer_country, quote, rating, is_published) VALUES
('Elise Moreau','France','We have sailed in Croatia and Thailand, and nothing came close to the quiet of waking up anchored off Padar. The crew were extraordinary.',5,true),
('James Whitfield','United Kingdom','Understated, beautifully run and genuinely personal. It felt like being hosted rather than sold a tour.',5,true),
('Sofia Lindqvist','Sweden','Three days that reset something in me. The mantas at dawn are a memory I will keep for a long time.',5,true),
('Daniel Park','Singapore','We chartered the whole boat for our family. Every detail was arranged before we thought to ask.',5,true),
('Ana Ribeiro','Portugal','The food, the anchorages, the slow pace. Exactly the trip we hoped for and rarely find.',4,true);
