-- ==============================================================================
-- MarvelRise Decor: Core Production Schema & RLS Policies
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'architect', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Projects Portfolio Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'SPC Flooring',
    'Acoustic Wall Panels',
    'UV Marble',
    'Gypsum Ceilings',
    'Architectural Lighting',
    'Full Spatial Suite'
  )),
  location TEXT NOT NULL,
  client_type TEXT NOT NULL,
  area_sqm NUMERIC(8, 2),
  completion_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  cover_image_url TEXT NOT NULL,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  systems_installed TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

-- 3. Inquiries Table (Client Room Planner & Quote Requests)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  space_type TEXT NOT NULL,
  system_package TEXT NOT NULL,
  estimated_area TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new',
    'contacted',
    'survey_scheduled',
    'quoted',
    'completed',
    'cancelled'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own inquiries"
  ON public.inquiries FOR SELECT
  USING (
    auth.uid() = user_id OR
    (auth.uid() IS NULL AND false)
  );

-- 4. Auth Hook: Automatically create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Seed Portfolio Data
INSERT INTO public.projects (slug, title, category, location, client_type, area_sqm, completion_year, cover_image_url, gallery_images, systems_installed, description, featured)
VALUES
  (
    'karen-monolithic-villa',
    'The Karen Monolithic Villa',
    'Full Spatial Suite',
    'Karen, Nairobi',
    'Private Residence',
    420.00,
    2024,
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    '["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"]'::jsonb,
    ARRAY['SPC French Oak Flooring', 'Fluted Slat Panels', 'UV Calacatta Slabs', 'Floating Gypsum Bulkheads'],
    'A complete architectural finishes fit-out featuring 6mm waterproof SPC French Oak flooring throughout living areas, paired with acoustic fluted walnut slats in the private screening room and book-matched Calacatta Gold UV marble behind the 85-inch display monolith.',
    true
  ),
  (
    'westlands-executive-penthouse',
    'Westlands Executive Penthouse',
    'Acoustic Wall Panels',
    'Westlands, Nairobi',
    'Penthouse Residence',
    280.00,
    2024,
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
    '["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80"]'::jsonb,
    ARRAY['Fluted American Walnut Slats', 'Recessed 48V Magnetic Lighting', '4.5mm SPC Smoked Oak'],
    'Engineered sound dampening (NRC 0.85) acoustic wood slats framing high-altitude panoramic city vistas. Integrated warm 3000K diurnal lighting wash eliminates nighttime glass reflection.',
    true
  ),
  (
    'gigiri-diplomatic-boardroom',
    'Gigiri Diplomatic Boardroom',
    'Full Spatial Suite',
    'Gigiri, Nairobi',
    'Diplomatic Mission',
    160.00,
    2024,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"]'::jsonb,
    ARRAY['Acoustic PET Slat Walls', 'Anti-Static SPC Flooring', 'Acoustic Gypsum Coffers'],
    'Ultra-low reverberation acoustic spatial fit-out designed for international teleconferencing clarity, featuring anti-static 0.55mm wear-layer SPC planks and bespoke coffered gypsum ceilings with micro-prism troffers.',
    true
  ),
  (
    'muthaiga-sanctuary-residence',
    'Muthaiga Sanctuary Residence',
    'UV Marble',
    'Muthaiga, Nairobi',
    'Private Residence',
    340.00,
    2023,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"]'::jsonb,
    ARRAY['UV Nero Marquina Marble', 'Brushed Brass Pendants', 'SPC Nordic Ash'],
    'Monolithic 2800x1220mm mirror-gloss Nero Marquina feature walls seamlessly integrated with hand-spun brushed brass architectural lampshades and Nordic Ash SPC flooring.',
    true
  )
ON CONFLICT (slug) DO NOTHING;
