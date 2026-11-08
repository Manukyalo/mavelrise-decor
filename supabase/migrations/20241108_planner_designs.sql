-- Migration: Create planner_designs table for the isometric house planner
-- Share codes are 6-char uppercase alphanumeric (no ambiguous chars)

CREATE TABLE IF NOT EXISTS public.planner_designs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code  VARCHAR(6) UNIQUE NOT NULL,
  design_data JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Optional: link to a user if they were signed in
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for fast lookup by share code
CREATE INDEX IF NOT EXISTS planner_designs_share_code_idx ON public.planner_designs (share_code);

-- Index for user's saved designs
CREATE INDEX IF NOT EXISTS planner_designs_user_id_idx ON public.planner_designs (user_id);

-- RLS: anyone can read a design by share code (public link)
-- Only authenticated users (or the owner) can delete
ALTER TABLE public.planner_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read by share code"
  ON public.planner_designs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert a new design"
  ON public.planner_designs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only owner can delete their design"
  ON public.planner_designs FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-expire designs after 90 days (optional — uncomment if pg_cron is available)
-- SELECT cron.schedule('expire-planner-designs', '0 3 * * *',
--   $$DELETE FROM public.planner_designs WHERE created_at < now() - interval '90 days'$$);

COMMENT ON TABLE public.planner_designs IS
  'Stores isometric house planner designs with a 6-char public share code.';

