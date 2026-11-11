-- Migration: delivery_zones
-- Creates the delivery fee zones table for MarvelRise Decor's quote engine.
-- Pattern: CREATE TABLE IF NOT EXISTS — fully idempotent.

CREATE TABLE IF NOT EXISTS delivery_zones (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  town        text        NOT NULL,
  rate_kes    integer     NOT NULL CHECK (rate_kes >= 0),
  zone_label  text        NOT NULL DEFAULT '',
  notes       text,
  is_confirmed boolean    NOT NULL DEFAULT false,
  active      boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for the most common access pattern: active zones ordered by rate
CREATE INDEX IF NOT EXISTS delivery_zones_active_rate_idx
  ON delivery_zones (active, rate_kes ASC);

-- Seed data — 10 delivery zones covering greater Nairobi and satellite towns.
-- Use INSERT ... ON CONFLICT DO NOTHING so reruns are safe.
INSERT INTO delivery_zones (town, rate_kes, zone_label, notes, is_confirmed, active)
VALUES
  ('Ruiru/Membley',         200,  'Zone 0 — Showroom',    'Pickup or ultra-local delivery',           false, true),
  ('Juja',                  350,  'Zone 1 — Near',        'Juja Farm, Juja Town',                     false, true),
  ('Thika Road Malls',      450,  'Zone 1 — Near',        'Garden City, Ridgeways, Roasters',         false, true),
  ('Kiambu Town',           500,  'Zone 1 — Near',        NULL,                                       false, true),
  ('Nairobi CBD',           650,  'Zone 2 — City',        'Central Business District',                false, true),
  ('Kilimani/Lavington',    750,  'Zone 2 — City',        'Kilimani, Lavington, Westlands',           false, true),
  ('Karen/Langata',         850,  'Zone 3 — Suburbs',     'Karen, Langata, Hardy',                    false, true),
  ('Kitengela',             950,  'Zone 3 — Suburbs',     'EPZ, Kitengela Town',                      false, true),
  ('Machakos',             1200,  'Zone 4 — County',      'Machakos Town and environs',               false, true),
  ('Naivasha',             1500,  'Zone 4 — County',      'Naivasha Town, Hell''s Gate corridor',     false, true)
ON CONFLICT DO NOTHING;
