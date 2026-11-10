-- ============================================================
-- MarvelRise Decor: Product Catalogue Schema & Seed
-- ============================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  cover_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public" ON public.categories
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  thickness TEXT,
  size TEXT,
  colour TEXT,
  finish TEXT,
  price_kes NUMERIC(10,2),
  unit TEXT NOT NULL DEFAULT 'sqm',
  stock_status TEXT NOT NULL DEFAULT 'in_stock'
    CHECK (stock_status IN ('in_stock','low_stock','out_of_stock','order_only')),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  texture_url TEXT,
  description TEXT,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_placeholder BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are public" ON public.products
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(code);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- Auto-updated timestamp function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- SEED: 5 Categories
-- ============================================================
INSERT INTO public.categories (slug, name, tagline, description, sort_order) VALUES
  ('spc-flooring',      'SPC Flooring',         'Walk on architectural perfection',  'Stone Plastic Composite floors — waterproof, dimensionally stable, with acoustic IXPE underlay engineered for Nairobi climate.', 1),
  ('wpc-wall-panels',   'WPC Wall Panels',       'Walls that command presence',       'Wood Plastic Composite fluted and textured panels delivering tactile acoustic depth and contemporary elegance.', 2),
  ('marble-sheets',     'Marble Sheets',         'Monolithic veined luxury',          'Ultra-lightweight adhesive and rigid UV marble sheets that impart high-gloss stone grandeur without structural load.', 3),
  ('lampshades',        'Polyester Lampshades',  'Sculptural luminaire poetry',       'Artisanal geometric and organic pendant fixtures transforming ambient spaces into warm diurnal sanctuaries.', 4),
  ('decor-accessories', 'Decor Accessories',     'Curated tactile artifacts',         'Bespoke hand-crafted wall art, ceramic vessels, and spatial sculptures creating deliberate aesthetic harmony.', 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- ============================================================
-- SEED: SPC Flooring products (codes from brochure)
-- ============================================================
INSERT INTO public.products
  (code, slug, name, category_id, thickness, size, colour, finish, unit, stock_status, description, specs, variants, sort_order)
SELECT
  v.code, v.slug, v.name,
  (SELECT id FROM public.categories WHERE slug = 'spc-flooring'),
  v.thickness, v.size, v.colour, v.finish, 'sqm', v.stock_status,
  v.description, v.specs::jsonb, v.variants::jsonb, v.sort_order
FROM (VALUES
  (
    'GJ6345-3', 'spc-gj6345-3', 'Natural French Oak',
    '5.5mm', '1220×183mm', 'Pale Oak / Natural', 'Embossed-in-Register Matte',
    'in_stock',
    'A warm pale oak SPC plank with a micro-registered embossed grain replicating aged French timber. Impervious to water and UV degradation.',
    '{"wear_layer":"0.3mm","AC_rating":"AC4","click_system":"click-lock","waterproof":true,"installation":"Floating Uniclic","underlay":"1.5mm IXPE acoustic backing"}',
    '[{"label":"5.5mm Click-Lock","sku":"GJ6345-3-55","thickness":"5.5mm"},{"label":"6.0mm Commercial Heavy","sku":"GJ6345-3-60","thickness":"6mm"}]',
    1
  ),
  (
    'GJ6345-4', 'spc-gj6345-4', 'Nordic Blue Ash',
    '5.5mm', '1220×183mm', 'Grey-Blue Ash / Cool', 'Embossed-in-Register Matte',
    'in_stock',
    'A sophisticated cool-toned ash with subtle slate-blue undertones. Beautifully balances natural sunlight with matte black joinery.',
    '{"wear_layer":"0.3mm","AC_rating":"AC4","click_system":"click-lock","waterproof":true,"installation":"Floating Uniclic","underlay":"1.5mm IXPE acoustic backing"}',
    '[{"label":"5.5mm Click-Lock","sku":"GJ6345-4-55","thickness":"5.5mm"},{"label":"6.0mm Commercial Heavy","sku":"GJ6345-4-60","thickness":"6mm"}]',
    2
  ),
  (
    'GJ6305-27', 'spc-gj6305-27', 'Desert Sand',
    '5.5mm', '1220×183mm', 'Warm Beige / Sand', 'Embossed-in-Register Matte',
    'in_stock',
    'Warm sun-drenched beige tones reminiscent of dry savannah horizons. Radiates subtle warmth under ambient 3000K illumination.',
    '{"wear_layer":"0.3mm","AC_rating":"AC4","click_system":"click-lock","waterproof":true,"installation":"Floating Uniclic","underlay":"1.5mm IXPE acoustic backing"}',
    '[{"label":"5.5mm Click-Lock","sku":"GJ6305-27-55","thickness":"5.5mm"},{"label":"6.0mm Commercial Heavy","sku":"GJ6305-27-60","thickness":"6mm"}]',
    3
  ),
  (
    'GJ88076-34', 'spc-gj88076-34', 'Charcoal Smoke',
    '6mm', '1220×183mm', 'Dark Grey / Charcoal', 'Low Sheen Matte',
    'in_stock',
    'Deep charred timber tones for dramatic architectural contrasts. Fortified with a 0.55mm commercial-grade wear layer for high footfall.',
    '{"wear_layer":"0.55mm","AC_rating":"AC5","click_system":"click-lock","waterproof":true,"installation":"Floating Uniclic","underlay":"1.5mm IXPE acoustic backing"}',
    '[{"label":"6.0mm Commercial Heavy","sku":"GJ88076-34-60","thickness":"6mm"}]',
    4
  ),
  (
    'GJ7518', 'spc-gj7518', 'Bamboo Honey Series',
    '5.5mm', '1220×183mm', 'Medium Brown / Bamboo', 'Fine Grain Satin',
    'in_stock',
    'Classic golden-honey bamboo aesthetic. A multi-tone colour series celebrating natural organic striations and welcoming earthiness.',
    '{"wear_layer":"0.3mm","AC_rating":"AC4","click_system":"click-lock","waterproof":true,"installation":"Floating Uniclic","underlay":"1.5mm IXPE acoustic backing","note":"Multi-colour series — custom tone selected on site verification"}',
    '[{"label":"5.5mm Click-Lock","sku":"GJ7518-55","thickness":"5.5mm"},{"label":"6.0mm Commercial Heavy","sku":"GJ7518-60","thickness":"6mm"}]',
    5
  )
) AS v(code, slug, name, thickness, size, colour, finish, stock_status, description, specs, variants, sort_order)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specs = EXCLUDED.specs,
  variants = EXCLUDED.variants,
  stock_status = EXCLUDED.stock_status;

-- ============================================================
-- SEED: WPC Wall Panels
-- ============================================================
INSERT INTO public.products
  (code, slug, name, category_id, thickness, size, colour, finish, unit, stock_status, description, specs, sort_order)
SELECT
  v.code, v.slug, v.name,
  (SELECT id FROM public.categories WHERE slug = 'wpc-wall-panels'),
  v.thickness, v.size, v.colour, v.finish, 'sqm', v.stock_status,
  v.description, v.specs::jsonb, v.sort_order
FROM (VALUES
  ('J300H1A8','wpc-j300h1a8','Golden Bamboo Flute','10mm','2800×150mm','Light Golden / Bamboo','Satin','in_stock','Vertical fluted acoustic panel in warm bamboo grain. Provides NRC 0.65 acoustic softening across living and executive boardrooms.','{"panel_width":"150mm","panel_height":"2800mm","installation":"Tongue & groove interlocking","fire_rating":"Class B1","moisture_proof":true}',1),
  ('Z63','wpc-z63','Espresso Dark Panel','10mm','2800×150mm','Dark Espresso / Ebony','Velvet Matte','in_stock','Rich dark espresso fluting designed to frame recessed brass accents and television media consoles.','{"panel_width":"150mm","panel_height":"2800mm","installation":"Tongue & groove interlocking","fire_rating":"Class B1","moisture_proof":true}',2),
  ('J300H1A6','wpc-j300h1a6','Charcoal Architectural Flute','10mm','2800×150mm','Dark Charcoal / Slate','Matte Micro-Etched','in_stock','Architectural dark charcoal fluting offering sharp shadowlines and industrial sophistication.','{"panel_width":"150mm","panel_height":"2800mm","installation":"Tongue & groove interlocking","fire_rating":"Class B1","moisture_proof":true}',3),
  ('J200H1HW','wpc-j200h1hw','Silver Metallic Slat','8mm','2800×120mm','Grey / Silver Metallic','Reflective Sheen','in_stock','Engineered silver metallic finish that subtly reflects ambient cove lighting, amplifying corridor width.','{"panel_width":"120mm","panel_height":"2800mm","installation":"Tongue & groove interlocking","fire_rating":"Class B1","moisture_proof":true}',4),
  ('J200H1H7','wpc-j200h1h7','Warm Walnut Flute','8mm','2800×120mm','Warm Brown / Walnut','Embossed Grain','in_stock','Balanced walnut tone fluting offering timeless residential warmth with commercial grade scrub resistance.','{"panel_width":"120mm","panel_height":"2800mm","installation":"Tongue & groove interlocking","fire_rating":"Class B1","moisture_proof":true}',5),
  ('J200H1H6','wpc-j200h1h6','Deep Ebony Flute','8mm','2800×120mm','Deep Black / Ebony','Ultra-Matte','in_stock','Deep monochromatic black slatted profile for high-contrast monolithic feature partitions and headboards.','{"panel_width":"120mm","panel_height":"2800mm","installation":"Tongue & groove interlocking","fire_rating":"Class B1","moisture_proof":true}',6),
  ('J300P5-AL1','wpc-j300p5-al1','Palm Botanical Relief','10mm','2800×200mm','Green-Gold / Botanical','Embossed Relief','in_stock','Pressed botanical relief panel with delicate organic frond contours. Flagged for custom batch verification.','{"panel_width":"200mm","panel_height":"2800mm","installation":"Adhesive structural bond","fire_rating":"Class B1","moisture_proof":true,"note":"Special batch — check exact panel alignment on site"}',7),
  ('J300P5-AR2','wpc-j300p5-ar2','Starburst Metallic Monolith','10mm','2800×200mm','Silver / Champagne Starburst','Sculpted Metallic','order_only','Geometric starburst relief capturing directional spotlighting. Custom imported per architectural spec.','{"panel_width":"200mm","panel_height":"2800mm","installation":"Adhesive structural bond","fire_rating":"Class B1","moisture_proof":true}',8)
) AS v(code, slug, name, thickness, size, colour, finish, stock_status, description, specs, sort_order)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specs = EXCLUDED.specs;

-- ============================================================
-- SEED: Marble Sheets (Flagged as placeholder verification)
-- ============================================================
INSERT INTO public.products
  (code, slug, name, category_id, thickness, colour, finish, unit, stock_status, description, specs, is_placeholder, sort_order)
SELECT
  v.code, v.slug, v.name,
  (SELECT id FROM public.categories WHERE slug = 'marble-sheets'),
  v.thickness, v.colour, v.finish, 'sqm', v.stock_status,
  v.description, v.specs::jsonb, true, v.sort_order
FROM (VALUES
  ('MRB-ADH-001','marble-adh-calacatta','Calacatta Gold Adhesive Sheet','0.3mm','White with Gold Veining','Mirror Gloss','in_stock','Roll-applied flexible adhesive marble sheet. Transforms splashbacks, vanities, and pillars with zero masonry noise.','{"type":"Roll-on adhesive","roll_width":"1220mm","roll_length":"50m","application":"Peel-and-stick backing","resistance":"Heat & moisture resistant"}',1),
  ('MRB-ADH-002','marble-adh-blue-lapis','Blue Lapis Adhesive Sheet','0.3mm','Cobalt Blue with White Veins','Mirror Gloss','in_stock','Vibrant lapis-veined architectural film creating jewel-toned focal accents in bar niches and powder rooms.','{"type":"Roll-on adhesive","roll_width":"1220mm","roll_length":"50m","application":"Peel-and-stick backing","resistance":"Heat & moisture resistant"}',2),
  ('MRB-RGD-001','marble-rigid-carrara','Carrara White UV Slab','5mm','Carrara White / Grey Veining','High-Gloss UV Cured','in_stock','5mm rigid UV-cured marble slab for waterproof bathroom feature walls, vanity backdrops, and elevator surrounds.','{"type":"Rigid UV panel","panel_size":"1220×2440mm","application":"Polyurethane adhesive + trims","fire_rating":"Class A"}',3),
  ('MRB-RGD-002','marble-rigid-noir','Nero Marquina UV Slab','5mm','Deep Black / White Lightning','High-Gloss UV Cured','in_stock','Dramatic mirror-gloss black slab with vivid lightning-white calcite veining. Book-matching available on request.','{"type":"Rigid UV panel","panel_size":"1220×2440mm","application":"Polyurethane adhesive + trims","fire_rating":"Class A"}',4)
) AS v(code, slug, name, thickness, colour, finish, stock_status, description, specs, sort_order)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_placeholder = true;

-- ============================================================
-- SEED: Lampshades MRDP001–MRDP016
-- ============================================================
INSERT INTO public.products
  (code, slug, name, category_id, colour, finish, unit, stock_status, description, specs, sort_order)
SELECT
  v.code, v.slug, v.name,
  (SELECT id FROM public.categories WHERE slug = 'lampshades'),
  v.colour, v.finish, 'piece', v.stock_status,
  v.description, v.specs::jsonb, v.sort_order
FROM (VALUES
  ('MRDP001','lamp-mrdp001','Grid Cage Pendant','Dark Black / Matte','Powder-Coated Steel','in_stock','Architectural rectilinear cage pendant casting defined linear shadow geometry across dining spaces.','{"bulb_base":"E27","max_wattage":"60W","suspension":"1.5m braided cable","dimensions":"250×250×400mm"}',1),
  ('MRDP002','lamp-mrdp002','Orange Orb Geometric Pendant','Brand Orange with Green Accents','Lacquered Resin','in_stock','Bespoke spherical pendant featuring MarvelRise signature palette cutouts. Emits warm ambient focal illumination.','{"bulb_base":"E27","max_wattage":"40W","suspension":"1.5m adjustable cable","diameter":"350mm"}',2),
  ('MRDP003','lamp-mrdp003','Petal Pinecone Luminaire','Natural Ivory','Translucent Polyester','in_stock','Layered biophilic petals diffusing soft non-glare illumination ideal for high-ceiling bedrooms.','{"bulb_base":"E27","max_wattage":"40W","suspension":"1.5m textile cord","diameter":"420mm"}',3),
  ('MRDP004','lamp-mrdp004','Fluted Pleated Cone','Soft Cream','Matte Polyester Fabric','in_stock','Refined Scandinavian pleated cone providing direct downlight with delicate translucent sideways glow.','{"bulb_base":"E27","max_wattage":"60W","suspension":"1.2m adjustable cable","diameter":"380mm"}',4),
  ('MRDP005','lamp-mrdp005','Bat-Wing Avant-Garde','Matte Black','Architectural Steel Silhouette','order_only','Kinetic aerodynamic profile serving as a daytime sculptural monolith and nighttime atmospheric focal point.','{"bulb_base":"E27","max_wattage":"40W","suspension":"2.0m aircraft wire","wingspan":"650mm"}',5),
  ('MRDP006','lamp-mrdp006','Blooming Orchid Petal','Magenta / Purple','Lacquered Resin','in_stock','Dramatic botanical petal pendant bringing saturated chromatic energy to lounge and dressing spaces.','{"bulb_base":"E27","max_wattage":"40W","suspension":"1.5m adjustable cord","diameter":"450mm"}',6),
  ('MRDP007','lamp-mrdp007','Geodesic Brass Sphere','Brushed Champagne Gold','Metallic Satin','in_stock','Interlocking triangular brass-finish facets creating kaleidoscopic light scattering over dining suites.','{"bulb_base":"E27","max_wattage":"60W","suspension":"1.5m brass-capped rod","diameter":"400mm"}',7),
  ('MRDP008','lamp-mrdp008','Slatted Timber Barrel','Natural Teak','Sealed Satin Wood','in_stock','Hand-crafted slatted timber louvers providing warm horizontal light slices and rich artisanal character.','{"bulb_base":"E27","max_wattage":"60W","suspension":"1.5m twisted rope cable","dimensions":"300×450mm"}',8),
  ('MRDP009','lamp-mrdp009','Cascade Ribbon Cylinder','Cobalt Blue / Indigo','Lacquered Ribbon Ply','in_stock','Vertical floating ribbon tiers filtering light into soothing gradient waves in luxury stairwells.','{"bulb_base":"E27","max_wattage":"40W","suspension":"2.0m suspension cable","height":"600mm"}',9),
  ('MRDP010','lamp-mrdp010','Mahogany Slatted Sphere','Rich Mahogany Brown','Polished Hardwood','in_stock','Interwoven curved mahogany ribs offering tactile heritage warmth and soft ambient cast shadows.','{"bulb_base":"E27","max_wattage":"60W","suspension":"1.5m black braided cord","diameter":"380mm"}',10),
  ('MRDP011','lamp-mrdp011','Grand Layered Globe','Opal Cream','Translucent Layered Poly','in_stock','Grand 500mm architectural orb delivering uniform shadow-free diffusion over meeting and reception tables.','{"bulb_base":"E27 Dual","max_wattage":"2×40W","suspension":"2.0m steel core cord","diameter":"500mm"}',11),
  ('MRDP012','lamp-mrdp012','Woven Rattan Tiered Orb','Sun-Bleached Rattan','Natural Organic Weave','in_stock','Natural organic woven pendant marrying coastal breezes with bespoke craftsmanship.','{"bulb_base":"E27","max_wattage":"40W","suspension":"1.5m natural jute cable","diameter":"450mm"}',12),
  ('MRDP013','lamp-mrdp013','White Architectural Obelisk','Pure Architectural White','Gloss Powder-Coat','in_stock','Slender elongated cage directing ambient light through precision vertical geometric slits.','{"bulb_base":"E27 Tubular","max_wattage":"40W","suspension":"2.0m white braided cable","dimensions":"200×200×700mm"}',13),
  ('MRDP014','lamp-mrdp014','Minimal Slatted Dome','Alabaster White','Matte Polycarbonate','in_stock','Understated broad dome with acoustic baffle properties, harmonizing open residential layouts.','{"bulb_base":"E27","max_wattage":"60W","suspension":"1.5m adjustable cable","diameter":"550mm"}',14),
  ('MRDP015','lamp-mrdp015','Mirrored Disco Sphere','Cobalt Sapphire Mirror','Faceted Mirrored Acrylic','order_only','Faceted reflective tile orb reflecting micro-reflections across entertainment lounges.','{"bulb_base":"E27","max_wattage":"40W","suspension":"1.5m reinforced cable","diameter":"350mm"}',15),
  ('MRDP016','lamp-mrdp016','Heart Contour Silhouette','Blush Rose Pink','Lacquered Translucent Poly','in_stock','Sculptural heart contour providing gentle romantic silhouette lighting for private dressing suites.','{"bulb_base":"E27","max_wattage":"25W","suspension":"1.2m pink woven cable","dimensions":"350×320mm"}',16)
) AS v(code, slug, name, colour, finish, stock_status, description, specs, sort_order)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specs = EXCLUDED.specs;

-- ============================================================
-- SEED: Decor Accessories (Placeholder verified)
-- ============================================================
INSERT INTO public.products
  (code, slug, name, category_id, colour, unit, stock_status, description, specs, is_placeholder, sort_order)
SELECT
  v.code, v.slug, v.name,
  (SELECT id FROM public.categories WHERE slug = 'decor-accessories'),
  v.colour, 'piece', v.stock_status,
  v.description, v.specs::jsonb, true, v.sort_order
FROM (VALUES
  ('DECOR-WALL-001','decor-swirl-wall-art','Swirl Bronze Metal Relief','Brushed Bronze / Copper','in_stock','Hand-hammered continuous vortex wall sculpture celebrating kinetic motion in double-volume foyers.','{"material":"Hammered steel & brass","dimensions":"900×900mm","weight":"6.2kg"}',1),
  ('DECOR-ART-001','decor-painting-wall-art','Framed Abstract Palette','Curated Multi-Tones','in_stock','Gallery-stretched minimalist canvas art in floating black aluminum gallery frames.','{"frame":"Matte black slim aluminium","dimensions":"1000×1400mm"}',2),
  ('DECOR-BOOK-001','decor-book-coffee-table','Architectural Monograph & Vessel Set','Natural Stone & Linen','in_stock','Curated hardbound architectural volumes paired with a turned travertine balancing bowl.','{"pieces":"3 hardbound monographs + 1 travertine bowl"}',3),
  ('DECOR-VASE-001','decor-ceramic-flower-vase','Nordic Ribbed Ceramic Vessels','Chalk White & Terracotta','in_stock','Set of three hand-thrown ceramic vases featuring tactile vertical fluting and water-tight glazes.','{"material":"Stoneware ceramic","heights":"180mm, 240mm, 320mm"}',4),
  ('DECOR-LANTERN-001','decor-lantern-lamp','Brushed Brass Storm Lantern','Brushed Brass & Tempered Glass','in_stock','Heavy-gauge brass framed storm lantern designed for indoor verandah transitions and entryway consoles.','{"dimensions":"220×220×450mm","fuel":"Candle or LED pillar"}',5),
  ('DECOR-CUSHION-001','decor-lumbar-cushion','Bouclé Tailored Lumbar Cushion','Ivory / Charcoal Piping','in_stock','High-density ergonomic lumbar bolster wrapped in luxury Italian bouclé fabric with concealed zip.','{"dimensions":"300×600mm","filling":"Hypoallergenic micro-down"}',6),
  ('DECOR-DONUT-001','decor-donut-pillow','Sculptural Donut Knot Cushion','Ochre Gold Velvet','in_stock','Playful geometric torus pillow crafted in plush stretch velvet for bespoke occasional chairs.','{"diameter":"380mm","filling":"Shape-memory micro-fiber"}',7),
  ('DECOR-FLASK-001','decor-vacuum-flask','Monolithic Stainless Carafe','Matte Obsidian Black','in_stock','Double-walled thermal tabletop carafe with brushed brass trigger cap. Keeps liquids hot for 24h.','{"capacity":"1.2 Litres","insulation":"Vacuum double-wall 304 steel"}',8)
) AS v(code, slug, name, colour, stock_status, description, specs, sort_order)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_placeholder = true;

