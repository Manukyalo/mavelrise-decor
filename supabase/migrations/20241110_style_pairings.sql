-- Migration: Create style_pairings table for mixed-product complete-the-look rules
CREATE TABLE IF NOT EXISTS public.style_pairings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_code TEXT NOT NULL,
  style_title TEXT NOT NULL,
  style_subtitle TEXT,
  wpc_code TEXT NOT NULL,
  marble_code TEXT NOT NULL,
  lamp_code TEXT NOT NULL,
  decor_code TEXT,
  narrative TEXT,
  palette_colors TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.style_pairings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'style_pairings' AND policyname = 'Style pairings are public') THEN
    CREATE POLICY "Style pairings are public" ON public.style_pairings FOR SELECT USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_style_pairings_floor ON public.style_pairings(floor_code);

