-- ============================================================
-- GURUCRAFTPRO & PV LABS-INSPIRED E-COMMERCE VISUAL PRODUCTION
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY, -- Maps to Firebase Auth UID or Supabase Auth UID
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'qa', 'designer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VISUAL PRODUCTION SERVICES & PACKAGES
CREATE TABLE IF NOT EXISTS public.ecom_services (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  starting_price NUMERIC NOT NULL DEFAULT 49,
  turnaround_hours INTEGER DEFAULT 24,
  features JSONB DEFAULT '[]'::JSONB,
  specifications JSONB DEFAULT '[]'::JSONB,
  faqs JSONB DEFAULT '[]'::JSONB,
  sample_assets JSONB DEFAULT '[]'::JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. E-COMMERCE VISUAL PRODUCTION PROJECTS (PV LABS-STYLE)
CREATE TABLE IF NOT EXISTS public.ecom_production_projects (
  id TEXT PRIMARY KEY DEFAULT ('PRJ-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8))),
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  brand_name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'hero_white_bg', 'ghost_mannequin', 'lifestyle_staging', 'infographics', 'recoloring', 'packaging_3d', 'full_pack'
  target_marketplaces TEXT[] DEFAULT ARRAY['amazon', 'flipkart'], -- 'amazon', 'flipkart', 'shopify', 'etsy', 'zepto', 'blinkit', 'myntra'
  sku_count INTEGER DEFAULT 1,
  total_images_requested INTEGER DEFAULT 5,
  rush_delivery BOOLEAN DEFAULT FALSE,
  aspect_ratios TEXT[] DEFAULT ARRAY['1:1', '4:5'],
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'in_production', 'qa_review', 'revision_requested', 'approved', 'delivered', 'archived'
  )),
  progress_percent INTEGER DEFAULT 10,
  assigned_designer TEXT,
  assigned_qa TEXT,
  brief TEXT,
  specifications JSONB DEFAULT '{}'::JSONB,
  deliverables JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ASSETS & SOURCE MEDIA
CREATE TABLE IF NOT EXISTS public.ecom_project_assets (
  id TEXT PRIMARY KEY DEFAULT ('AST-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8))),
  project_id TEXT REFERENCES public.ecom_production_projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'raw_input', 'processed_preview', 'highres_final', 'psd_source'
  stage TEXT DEFAULT 'input' CHECK (stage IN ('input', 'wip', 'qa_pending', 'delivered')),
  file_size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VISUAL REVISION & QA ANNOTATIONS
CREATE TABLE IF NOT EXISTS public.ecom_revisions (
  id TEXT PRIMARY KEY DEFAULT ('REV-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8))),
  project_id TEXT REFERENCES public.ecom_production_projects(id) ON DELETE CASCADE,
  asset_id TEXT REFERENCES public.ecom_project_assets(id) ON DELETE CASCADE,
  revision_number INTEGER DEFAULT 1,
  comment TEXT NOT NULL,
  pin_x NUMERIC, -- Coordinate percentage (0-100)
  pin_y NUMERIC,
  feedback_type TEXT DEFAULT 'color_tweak' CHECK (feedback_type IN ('color_tweak', 'shadow_fix', 'edge_cleanup', 'align_crop', 'text_change', 'other')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'addressed', 'resolved')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS & CHECKOUT
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  total_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  payment_id TEXT,
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENTS & WEBHOOKS AUDIT LOG
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  method TEXT,
  gateway TEXT DEFAULT 'razorpay',
  raw_payload JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecom_production_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecom_project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecom_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, Admins can read all
CREATE POLICY "Profiles are viewable by owner and admin" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Services: Publicly readable
CREATE POLICY "Services are publicly readable" ON public.ecom_services
  FOR SELECT USING (active = TRUE);

-- Projects: Customers see their own projects, Admins/Designers see all
CREATE POLICY "Users see own projects" ON public.ecom_production_projects
  FOR SELECT USING (
    user_id = auth.uid() OR
    client_email = auth.email() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'designer', 'qa'))
  );

CREATE POLICY "Users can insert own projects" ON public.ecom_production_projects
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    client_email IS NOT NULL
  );

CREATE POLICY "Admins & Designers can update projects" ON public.ecom_production_projects
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'designer', 'qa'))
  );

-- Orders: Owner or admin
CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT USING (
    user_id = auth.uid() OR
    customer_email = auth.email() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_client_email ON public.ecom_production_projects(client_email);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.ecom_production_projects(status);
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON public.ecom_project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
