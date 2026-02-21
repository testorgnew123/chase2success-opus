-- ============================================================
-- CHASE2SUCCESS Database Export
-- Exported: 2026-02-21
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- TABLES
-- ============================================================

-- projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  location text NOT NULL,
  price text NOT NULL,
  description text NOT NULL DEFAULT ''::text,
  short_description text NOT NULL DEFAULT ''::text,
  image_url text NOT NULL DEFAULT ''::text,
  gallery text[] DEFAULT '{}'::text[],
  amenities text[] DEFAULT '{}'::text[],
  type text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'draft'::text,
  area text NOT NULL DEFAULT ''::text,
  rera_number text NOT NULL DEFAULT ''::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL,
  content text NOT NULL DEFAULT ''::text,
  excerpt text NOT NULL DEFAULT ''::text,
  image_url text NOT NULL DEFAULT ''::text,
  author text NOT NULL DEFAULT 'Admin'::text,
  category text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'draft'::text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL DEFAULT ''::text,
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  image_url text DEFAULT ''::text,
  status text NOT NULL DEFAULT 'draft'::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT ''::text,
  project_name text DEFAULT ''::text,
  message text NOT NULL DEFAULT ''::text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- page_visits
CREATE TABLE IF NOT EXISTS public.page_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  referrer text DEFAULT ''::text,
  user_agent text DEFAULT ''::text,
  visited_at timestamptz NOT NULL DEFAULT now()
);

-- user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role app_role NOT NULL DEFAULT 'user'::app_role
);

-- ============================================================
-- FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- projects policies
CREATE POLICY "Anyone can view published projects" ON public.projects FOR SELECT USING ((status = 'published'::text) OR is_admin());
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (is_admin());

-- blog_posts policies
CREATE POLICY "Anyone can view published blogs" ON public.blog_posts FOR SELECT USING ((status = 'published'::text) OR is_admin());
CREATE POLICY "Admins can insert blogs" ON public.blog_posts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update blogs" ON public.blog_posts FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete blogs" ON public.blog_posts FOR DELETE USING (is_admin());

-- testimonials policies
CREATE POLICY "Anyone can view published testimonials" ON public.testimonials FOR SELECT USING ((status = 'published'::text) OR is_admin());
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (is_admin());

-- enquiries policies
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view enquiries" ON public.enquiries FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update enquiries" ON public.enquiries FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete enquiries" ON public.enquiries FOR DELETE USING (is_admin());

-- page_visits policies
CREATE POLICY "Anyone can log visits" ON public.page_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view visits" ON public.page_visits FOR SELECT USING (is_admin());

-- user_roles policies
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Note: Run these via Supabase dashboard or API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- ============================================================
-- SEED DATA: projects
-- ============================================================

INSERT INTO public.projects (id, name, slug, location, price, description, short_description, image_url, gallery, amenities, type, status, area, rera_number, created_at, updated_at) VALUES
('d3263075-c1d6-4128-9ed3-e36d2ade06b8', 'Test project', 'test-project', 'Jaipur', '60 Lack', 'Test DeSC', 'Test Desc', 'https://wdhxmbkdwwqxugxyyxsj.supabase.co/storage/v1/object/public/project-images/1771683438289-ppd2e.png', '{}', ARRAY['test1','test2'], 'Flat', 'published', '2200', '', '2026-02-18 19:01:08.855534+00', '2026-02-21 14:17:24.989272+00'),
('a3ff4be6-200a-4541-a2d3-5b015fb1aebe', 'Royal Greens Luxury Plots', 'royal-greens-luxury-plots', 'Sector 150, Noida Expressway', '₹45 Lac Onwards', 'Royal Greens Luxury Plots offer an exclusive opportunity to own premium land in one of the most sought-after locations along the Noida Expressway. Spread across 25 acres of meticulously planned landscape, each plot is designed to provide the perfect canvas for your dream home. With wide internal roads, dedicated green spaces, and world-class infrastructure, Royal Greens sets the gold standard for luxury plot investments.', 'Premium plots in a gated community with world-class infrastructure and lush green surroundings.', '/project-1.jpg', '{}', ARRAY['Gated Community','24/7 Security','Landscaped Gardens','Club House','Swimming Pool','Jogging Track','Children''s Play Area','Underground Electrification'], 'Luxury Plots', 'published', '200-500 sq. yards', '', '2026-02-21 12:52:29.552906+00', '2026-02-21 12:52:29.552906+00'),
('f494093f-325f-46c3-8f47-ab0fce414317', 'Elite Heights Residences', 'elite-heights-residences', 'Golf Course Road, Gurugram', '₹2.5 Cr Onwards', 'Elite Heights Residences redefine ultra-luxury apartment living on Golf Course Road. These sky residences feature floor-to-ceiling glass walls, private elevators, and smart home automation.', 'Ultra-luxury sky residences with private elevators and panoramic city views.', '/project-3.jpg', '{}', ARRAY['Private Elevator','Infinity Pool','Sky Lounge','Smart Home','Concierge','Valet Parking','Private Theater','Rooftop Observatory'], 'Luxury Residences', 'published', '3500-7000 sq. ft.', '', '2026-02-21 12:52:29.552906+00', '2026-02-21 12:52:29.552906+00'),
('3bf11748-7f88-41df-a0cc-edef175bb7fc', 'Golden Acres Farm Villas', 'golden-acres-farm-villas', 'Sohna Road, Gurugram', '₹1.2 Cr Onwards', 'Golden Acres Farm Villas present an extraordinary blend of luxury living and nature''s tranquility. Nestled along the scenic Sohna Road corridor, these expansive farm villas offer private gardens, swimming pools, and panoramic views of the Aravalli hills.', 'Expansive farm villas with private gardens and panoramic Aravalli views.', '/project-2.jpg', '{}', ARRAY['Private Garden','Swimming Pool','Organic Farm','Horse Riding','Spa & Wellness','Helipad Access','Concierge Service','Wine Cellar'], 'Farm Villas', 'published', '1-5 Acres', 'RAJ/P/test', '2026-02-21 12:52:29.552906+00', '2026-02-21 17:37:13.524363+00'),
('4966342f-32eb-404f-9ad2-5b9778274219', 'Imperial Estate Enclave', 'imperial-estate-enclave', 'Greater Noida West', '₹3.5 Cr Onwards', 'Imperial Estate Enclave is the epitome of grand living, offering palatial villas in a gated township spread across 50 acres.', 'Palatial villas in a 50-acre gated township with private golf course.', '/project-5.jpg', '{}', ARRAY['Private Golf Course','Equestrian Club','Italian Marble','Private Courtyard','Home Theater','Wine Cellar','Guest House','Staff Quarters'], 'Palatial Villas', 'published', '5000-12000 sq. ft.', '', '2026-02-21 12:52:29.552906+00', '2026-02-21 12:52:29.552906+00'),
('e8b2ff35-a95c-4f3b-a393-19902591e3ff', 'Signature Crest Towers', 'signature-crest-towers', 'Dwarka Expressway, Delhi NCR', '₹85 Lac Onwards', 'Signature Crest Towers stand as an architectural marvel on the Dwarka Expressway, offering premium 3 and 4 BHK apartments designed for the discerning homebuyer.', 'Premium towers with distinctive architecture on Dwarka Expressway.', '/project-4.jpg', '{}', ARRAY['Rooftop Garden','Business Center','Indoor Games','Gymnasium','Meditation Zone','EV Charging','Solar Powered','Rainwater Harvesting'], 'Premium Apartments', 'published', '1800-3200 sq. ft.', '', '2026-02-21 12:52:29.552906+00', '2026-02-21 12:52:29.552906+00'),
('007917b0-9605-4e8e-b2fb-35a6441d415c', 'Manhattan Riviera', 'manhattan-riviera-riverfront-apartments', 'Jagatpura Mahal Road, Jaipur (Opposite Bombay Hospital)', '₹14.61 Lac Onwards', E'Introducing Jaipur''s first river-front concept apartments — Manhattan Riviera. Facing the 400 feet wide Dravyavati River, Riviera is Phase-1 of the Manhattan project spread across 6 acres. It offers an exclusive array of river-facing Studios (375 sq.ft.), 1 BHK (536 sq.ft.), and 2 BHK (845 sq.ft.) apartments along with commercial spaces including offices, shops, showrooms, and kiosk bazaar. The project features an ultra-modern clubhouse on the 11th and terrace floors with 5,100 sq.ft. covered area and 15,000 sq.ft. landscape area. Located on the main 200 ft Lifeline Road of Jagatpura, bang opposite Bombay Hospital (700-1000 beds, 4000 employees), near proposed AU Bank Head Office, and surrounded by 25+ educational institutes with 55,000+ students. RERA Reg. No.: RAJ/P/2019/942. Semi-furnished apartments with premium vitrified tiles, UPVC french windows, Jaquar sanitary fittings, modular kitchen, hi-end electrical switches, and provisions for AC, geyser, chimney, DTH, and intercom. Best ROI of 7-9% projected returns compared to 3% residential and 5-6% commercial market averages.', E'Jaipur''s first river-front concept apartments with Studios', 'https://wdhxmbkdwwqxugxyyxsj.supabase.co/storage/v1/object/public/project-images/1771695598953-nuu62k.png', ARRAY['/riviera-page2.jpg','/riviera-page3.jpg','/riviera-page4.jpg','/riviera-page5.jpg','/riviera-page13.jpg'], ARRAY['Skywalk','Rooftop Garden','AC Gymnasium','Yoga Room & Yoga Deck','Steam & Sauna Bath','Massage Facility','Multipurpose Hall with Party Lawn','Indoor Games - Pool Table TT Chess Carrom','Water Body & Fountain','Reception Lobby (Air-Conditioned)','Kids Gaming Zone','Rooftop Food Court','Modular Kitchen with Gas Bank','UPVC French Windows','Jaquar Premium Sanitary Fittings','Premium Vitrified Tiles','Hi-End Electrical Switches','Intercom Facility','Provision for AC in all rooms','CCTV Surveillance','Power Backup','Basement Parking','Swimming Pool','Landscaped Gardens','EV Charging'], 'River-Front Apartments', 'published', '375-845 sq.ft.', 'RAJ/P/2019/942', '2026-02-21 12:59:17.13804+00', '2026-02-21 17:50:04.088498+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA: blog_posts
-- ============================================================

INSERT INTO public.blog_posts (id, title, slug, content, excerpt, image_url, author, category, status, published_at, created_at, updated_at) VALUES
('c50f4e5d-7023-4d25-80e5-7c8eeeab171c', 'Why Luxury Plots Are the Future of Smart Investment', 'luxury-plots-future-smart-investment', '<h2>The Rising Appeal of Luxury Plots</h2><p>In the ever-evolving landscape of real estate investment, luxury plots have emerged as the undisputed champion of long-term wealth creation.</p><h2>Why Smart Investors Choose Plots</h2><p>The mathematics of plot investment is compelling. Over the last decade, premium plots in strategic locations have delivered returns of 15-25% annually.</p><h3>Key Advantages</h3><p>Zero maintenance costs, no depreciation, flexible development timelines, and the freedom to build your vision.</p><h2>The CHASE2SUCCESS Advantage</h2><p>Our team of experts conducts thorough due diligence on every plot we offer, ensuring clear titles, proper approvals, and strategic location advantages.</p>', 'Discover why high-net-worth investors are increasingly turning to premium land as their preferred asset class for long-term wealth creation.', '/blog-1.jpg', 'CHASE2SUCCESS Editorial', 'Investment', 'published', '2026-02-10 00:00:00+00', '2026-02-21 12:53:05.364853+00', '2026-02-21 12:53:05.364853+00'),
('9e51a644-749a-4960-8de2-78213572f424', 'Farmhouse Living: A Growing Trend Among Elite Investors', 'farmhouse-living-growing-trend', '<h2>The Farmhouse Renaissance</h2><p>Post-pandemic, the desire for spacious, nature-connected living has transformed farmhouses from occasional retreats into primary residences for India''s elite.</p><h2>Investment Meets Lifestyle</h2><p>Modern farm villas offer the best of both worlds — the tranquility of countryside living with all urban amenities.</p>', 'From weekend retreats to permanent residences, farmhouse living is experiencing a renaissance among India''s affluent community.', '/blog-2.jpg', 'CHASE2SUCCESS Editorial', 'Lifestyle', 'published', '2026-01-28 00:00:00+00', '2026-02-21 12:53:05.364853+00', '2026-02-21 12:53:05.364853+00'),
('b6c5c3b8-b1b3-4900-9620-7b615023ca72', 'How to Evaluate Premium Real Estate Before Investing', 'evaluate-premium-real-estate', '<h2>The Art of Real Estate Evaluation</h2><p>Investing in premium real estate requires a methodical approach that goes beyond surface-level aesthetics.</p><h2>Legal Due Diligence</h2><p>Title verification, RERA registration, approved building plans, encumbrance certificates, and NOCs from relevant authorities are non-negotiable checkpoints.</p>', 'A comprehensive guide to assessing luxury properties — from legal due diligence to ROI projections.', '/blog-3.jpg', 'CHASE2SUCCESS Editorial', 'Guide', 'published', '2026-01-15 00:00:00+00', '2026-02-21 12:53:05.364853+00', '2026-02-21 12:53:05.364853+00'),
('48991ba8-fa6f-4e8d-bde7-f454b6e08d03', 'Top Locations for Luxury Real Estate Investment in 2026', 'top-locations-luxury-investment-2026', '<h2>Investment Hotspots for 2026</h2><p>As India''s luxury real estate market continues to mature, certain locations stand out for their exceptional growth potential.</p><h2>Delhi NCR''s Golden Corridors</h2><p>The Dwarka Expressway, Noida Expressway, and Sohna Road corridors continue to attract premium development.</p>', 'Our annual analysis of the most promising luxury real estate markets, growth corridors, and emerging investment hotspots.', '/blog-4.jpg', 'CHASE2SUCCESS Editorial', 'Market Analysis', 'published', '2026-01-05 00:00:00+00', '2026-02-21 12:53:05.364853+00', '2026-02-21 12:53:05.364853+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA: testimonials
-- ============================================================

INSERT INTO public.testimonials (id, name, role, content, rating, image_url, status, created_at, updated_at) VALUES
('4d3dba68-f1c9-41af-88f2-c276afe903b0', 'Rajesh Malhotra', 'Business Owner, Delhi', 'CHASE2SUCCESS made my first real estate investment seamless and highly rewarding. Their transparency and market knowledge gave me complete confidence. My plot has already appreciated 40% in just two years.', 5, '', 'published', '2026-02-21 12:53:26.543835+00', '2026-02-21 12:53:26.543835+00'),
('de85c2a3-0786-4150-807f-99ca7cef419d', 'Priya Sharma', 'Senior Executive, Gurugram', 'The team''s dedication to finding the perfect farmhouse for our family was exceptional. From legal verification to handover, every step was handled with professionalism.', 5, '', 'published', '2026-02-21 12:53:26.543835+00', '2026-02-21 12:53:26.543835+00'),
('17607641-15f8-432c-bf79-af6272c0fce9', 'Amit & Sunita Verma', 'NRI Investors, Dubai', 'Investing from abroad was worry-free with CHASE2SUCCESS. Their end-to-end support, video calls for site visits, and transparent documentation made it feel like we were right there.', 5, '', 'published', '2026-02-21 12:53:26.543835+00', '2026-02-21 12:53:26.543835+00'),
('4a98df63-d139-4866-be76-b0341f05b1c7', 'Dr. Kavita Singh', 'Healthcare Professional, Mumbai', 'What sets CHASE2SUCCESS apart is their genuine advisory approach. They didn''t just sell me a property — they helped me build an investment portfolio that aligns with my financial goals.', 5, '', 'published', '2026-02-21 12:53:26.543835+00', '2026-02-21 12:53:26.543835+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA: enquiries
-- ============================================================

INSERT INTO public.enquiries (id, name, email, phone, project_name, message, is_read, created_at) VALUES
('52a7b52b-ea32-4244-bbdb-52d7e11f71aa', 'test one', 'test@test.com', '7339754521', 'Manhattan Riviera', 'ccf', true, '2026-02-21 18:00:45.687074+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA: user_roles
-- ============================================================
-- Note: user_id references auth.users which must exist first
-- INSERT INTO public.user_roles (id, user_id, role) VALUES
-- ('0ad472e4-0f24-41a5-9388-75058c953d5a', 'be502928-84a3-45a7-b288-b260be9eb251', 'admin');

-- ============================================================
-- END OF EXPORT
-- ============================================================
