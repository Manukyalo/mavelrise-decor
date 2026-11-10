-- Migration: Add-ons and Quotes schema for Phase 6 Quote Engine
CREATE TABLE IF NOT EXISTS public.add_ons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('flooring', 'walls', 'installation', 'accessory')),
  unit TEXT NOT NULL,
  unit_price_kes NUMERIC(10,2) NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'add_ons' AND policyname = 'Add-ons are public') THEN
    CREATE POLICY "Add-ons are public" ON public.add_ons FOR SELECT USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(16) UNIQUE NOT NULL,
  quote_data JSONB NOT NULL,
  supply_mode TEXT NOT NULL DEFAULT 'supply_only' CHECK (supply_mode IN ('supply_only', 'supply_and_fit')),
  total_kes NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days')
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Quotes public read by number') THEN
    CREATE POLICY "Quotes public read by number" ON public.quotes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Quotes public insert') THEN
    CREATE POLICY "Quotes public insert" ON public.quotes FOR INSERT WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_quotes_number ON public.quotes(quote_number);

