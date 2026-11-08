# MarvelRise Decor (MRD) — Architecture & Finishing Atelier

Premier interior architectural craftsmanship website for **MarvelRise Decor**, Nairobi, Kenya. Specializing in bespoke acoustic gypsum ceilings, fluted wall panelling, ambient architectural illumination, and precision joinery across East Africa.

---

## Phase 1: Foundation & Design System Deliverables

- **Project Foundation**: Next.js 14 App Router, TypeScript (strict mode), Tailwind CSS, PostCSS.
- **Brand System & Color Palette**:
  - `brand-black` (`#0A0B0D` obsidian noir)
  - `brand-orange` (`#F25C05` architectural burnt orange)
  - `brand-green` (`#0F4C3A` Kenyan emerald / heritage green)
  - `brand-sand` (`#FAF9F5` warm alabaster limestone)
- **Typography**:
  - Display Serif: `Cormorant Garamond` (editorial architectural headings)
  - Modern Clean Sans: `Plus Jakarta Sans` (refined body & UI)
  - Spec Monospace: `JetBrains Mono` (technical tolerances & coordinates)
- **Internationalization (i18n)**:
  - `next-intl` integration with `/en` (English) and `/sw` (Swahili) locales.
  - Seamless instant language switcher pill in the navigation header.
- **Data & Supabase Setup**:
  - Browser and Server Supabase clients configured in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.
  - Secure `.env.example` with zero hardcoded credentials.
- **Motion & Smooth Scroll Engine**:
  - Lenis smooth momentum scrolling synchronized with GSAP ticker & ScrollTrigger.
  - Full support for `prefers-reduced-motion`.
- **Reusable Motion Components**:
  - `<Reveal>`: Viewport threshold reveal with configurable directional slide.
  - `<MultiLayerParallax>`: Multi-layer depth with background, midground, and foreground scrub rates.
  - `<PinnedScene>`: GSAP ScrollTrigger pinned scene container.
  - `<ScrubbedTimeline>`: Scroll-scrubbed multi-step sequence progression.
  - `<HorizontalScroll>`: Pinned horizontal track driven by vertical scroll.
  - `<TextSplitReveal>`: Editorial typography masked text-split animation.
  - `<ImageMaskReveal>`: Sliding architectural curtain and clip-path zoom reveal.
  - `<AnimatedCounter>`: Scroll-triggered high-precision numeric statistics counters.
- **Branded Loader & Page Transitions**:
  - Animated geometric "MRD" architectural monogram with SVG line drawing and curtain sweep.
  - Smooth page and route transitions.
- **Layout & Showroom Connect**:
  - Fixed glassmorphism `<Header>` with responsive mobile drawer.
  - Sticky `<StickyWhatsApp>` CTA with active status beacon and bilingual prefill.
  - Comprehensive `<Footer>` with Nairobi showroom details, direct phone lines, technical email, and Google Maps direct link.

---

## Getting Started

1. Clone repository:
   ```bash
   git clone https://github.com/Manukyalo/mavelrise-decor.git
   cd "mavelrise-decor"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
