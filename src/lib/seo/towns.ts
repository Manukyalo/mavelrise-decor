export interface TownSeoData {
  slug: string;
  name: string;
  county: string;
  headline: string;
  heroSnippet: string;
  introParagraph: string;
  neighborhoods: string[];
  recommendedProducts: {
    category: string;
    productTitle: string;
    reason: string;
  }[];
  showroomDistance: string;
  deliveryNotes: string;
}

export const TOWNS_DATA: Record<string, TownSeoData> = {
  ruiru: {
    slug: "ruiru",
    name: "Ruiru",
    county: "Kiambu County",
    headline: "Architectural SPC Flooring & Fluted Wall Panels in Ruiru",
    heroSnippet: "Our flagship showroom is located right here in Ruiru Membley — visit us along the Eastern Bypass (opposite NattyGym) to explore tactile luxury finishes in person.",
    introParagraph:
      "Ruiru’s contemporary residential developments and gated estates demand durable, climate-resilient interior materials that match high architectural ambition. From Kamakis to Membley Estate, Mugutha, and Jacaranda, homeowners and builders rely on MarvelRise Decor for 100% waterproof 5.5mm & 6mm Stone Polymer Composite (SPC) flooring, acoustic fluted WPC wall claddings, and precision ambient lighting.",
    neighborhoods: ["Membley Estate", "Kamakis", "Mugutha", "Kenyatta Road", "Toll", "Varsity Ville", "Jacaranda"],
    recommendedProducts: [
      {
        category: "SPC Flooring (6mm Acoustic IXPE)",
        productTitle: "Classic Golden Teak SPC",
        reason: "Provides authentic warm timber grain with zero water expansion — ideal for high-traffic ground floors and modern open kitchens in Ruiru villas.",
      },
      {
        category: "WPC Wall Panels",
        productTitle: "Deep Walnut Fluted Acoustic Panel",
        reason: "Adds acoustic damping and warmth to high-ceiling living rooms and TV media walls.",
      },
      {
        category: "UV Marble Sheets",
        productTitle: "Statuario Gold High-Gloss Sheet",
        reason: "Creates seamless, grout-free bathroom vanity backsplashes and feature dining walls at a fraction of Italian slab weight.",
      },
    ],
    showroomDistance: "0 km (Located directly at Eastern Bypass, Ruiru Membley)",
    deliveryNotes: "Same-day showroom pickup or within 2 hours delivery across Ruiru and Kamakis.",
  },
  thika: {
    slug: "thika",
    name: "Thika",
    county: "Kiambu County",
    headline: "Premium SPC Flooring & WPC Wall Panelling in Thika & Landless",
    heroSnippet: "Transform Thika homes, commercial properties, and Ananas/Section 9 residences with waterproof SPC wood-finish floors and luxury wall panelling.",
    introParagraph:
      "As Thika continues its rapid modern residential and hospitality expansion, property developers in Section 9, Ngoingwa, Landless, and Del Monte are shifting away from cold, crack-prone ceramic tiles to acoustically insulated SPC flooring and low-maintenance fluted WPC slats. MarvelRise Decor delivers directly from our Ruiru showroom along the Superhighway with certified installation crews.",
    neighborhoods: ["Section 9", "Ngoingwa", "Landless", "Makongeni", "Thika Greens", "Chania", "Broadway"],
    recommendedProducts: [
      {
        category: "SPC Flooring (5.5mm Rigid Core)",
        productTitle: "Bleached Scandi Ash SPC",
        reason: "Maximizes daylight reflection in airy, modern townhouses and apartment master bedrooms.",
      },
      {
        category: "WPC Wall Panels",
        productTitle: "Natural White Oak Slat Panel",
        reason: "Subtle Scandinavian fluted texture that elevates entry foyers and dining areas.",
      },
      {
        category: "Architectural Lighting",
        productTitle: "Nordic Cone Pendant Light",
        reason: "Soft ambient warm glow for kitchen breakfast peninsulas and dining tables.",
      },
    ],
    showroomDistance: "Approx. 22 km south via Thika Superhighway",
    deliveryNotes: "Daily delivery runs to Section 9, Ngoingwa, and Thika Greens within 4 hours.",
  },
  juja: {
    slug: "juja",
    name: "Juja",
    county: "Kiambu County",
    headline: "Waterproof SPC Flooring & Wall Cladding in Juja & Gachororo",
    heroSnippet: "Next-generation luxury finishes for modern family residences, duplexes, and villas across Juja, Kalimoni, and Mastore.",
    introParagraph:
      "Juja’s vibrant residential scene — including gated estates along Juja Farm Road and High Point — requires hard-wearing, scratch-resistant flooring that withstands active households, pets, and children while preserving an elevated hotel-grade aesthetic. Our click-lock SPC planks install seamlessly without messy cement screeds.",
    neighborhoods: ["Juja High Point", "Kalimoni", "Juja Farm Road", "JKUAT environs", "Mastore", "Mirimaini"],
    recommendedProducts: [
      {
        category: "SPC Flooring (6mm Acoustic IXPE)",
        productTitle: "Smoked Nordic Oak SPC",
        reason: "Deep charcoal-grey undertones that offer a dramatic, modern contrast with light neutral walls.",
      },
      {
        category: "WPC Wall Panels",
        productTitle: "Matte Charcoal Slat Panel",
        reason: "Modern aesthetic for private home cinema lounges and home offices.",
      },
      {
        category: "UV Marble Sheets",
        productTitle: "Marquina Nero Golden Vein",
        reason: "Luxury hotel aesthetic for powder rooms and bar backdrops.",
      },
    ],
    showroomDistance: "Approx. 10 km via Eastern Bypass and Superhighway",
    deliveryNotes: "Fast dispatch directly from Ruiru Membley — typically arrives within 90 minutes.",
  },
  kiambu: {
    slug: "kiambu",
    name: "Kiambu",
    county: "Kiambu County",
    headline: "Bespoke Interior Finishes & SPC Flooring in Kiambu Town & Ndumberi",
    heroSnippet: "Elevate country homes, gated leafy estates, and executive residences in Kiambu Road and Edenville with MarvelRise Decor craftsmanship.",
    introParagraph:
      "From scenic country homes along Kiambu-Limuru Road to prestigious communities like Edenville, Fourways Junction, and Ndumberi, Kiambu discerning residents choose MarvelRise Decor for materials that honor timber’s organic warmth while eliminating termites, dampness, and annual varnishing hassles.",
    neighborhoods: ["Kiambu Town", "Edenville", "Fourways Junction", "Ndumberi", "Kirigiti", "Ting’ang’a", "Riabai"],
    recommendedProducts: [
      {
        category: "SPC Flooring (6mm Heavy Duty)",
        productTitle: "Heritage Brazilian Walnut SPC",
        reason: "Rich deep brown grain that pairs harmoniously with lush outdoor landscape views and leather furniture.",
      },
      {
        category: "WPC Wall Panels",
        productTitle: "Teak Acoustic Fluted Slat",
        reason: "Warm organic relief that compliments coffered ceilings and stone fireplaces.",
      },
      {
        category: "Architectural Lighting",
        productTitle: "Ribbed Fluted Ceramic Pendant",
        reason: "Artisanal tactile pendant light for sophisticated dining suites.",
      },
    ],
    showroomDistance: "Approx. 18 km via Northern Bypass / Eastern Bypass",
    deliveryNotes: "Direct door-to-door delivery and on-site subfloor assessment available.",
  },
  nairobi: {
    slug: "nairobi",
    name: "Nairobi",
    county: "Nairobi County",
    headline: "Architectural SPC Flooring & Luxury Interior Finishes Nairobi",
    heroSnippet: "Supplying premier interior contractors, architects, and homeowners in Runda, Karen, Kilimani, Westlands, and Muthaiga.",
    introParagraph:
      "In Nairobi’s high-value residential and commercial markets, floor and wall specifications require international standards of wear resistance, fire classification, and acoustics. MarvelRise Decor delivers 5.5mm and 6mm IXPE-backed SPC planks with 0.5mm commercial wear layers, German Valinge 2G click locks, and fluted WPC panels across the capital.",
    neighborhoods: ["Runda", "Karen", "Kilimani", "Kileleshwa", "Westlands", "Muthaiga", "Lavington", "Gigiri", "South C"],
    recommendedProducts: [
      {
        category: "SPC Flooring (6mm Acoustic IXPE)",
        productTitle: "Classic Golden Teak SPC",
        reason: "Specified by Nairobi interior architects for seamless open-plan penthouses and luxury townhouses.",
      },
      {
        category: "UV Marble Sheets",
        productTitle: "Calacatta Oro Polished Sheet",
        reason: "Flawless mirror finish for master ensuite vanity niches and foyer statements.",
      },
      {
        category: "WPC Wall Panels",
        productTitle: "Matte Charcoal Slat Panel",
        reason: "Refined minimalist vertical lines for modern corporate offices and living rooms.",
      },
    ],
    showroomDistance: "20 minutes from Thika Road / Bypass interchange",
    deliveryNotes: "Same-day van dispatch or next-day scheduled deliveries across all Nairobi sub-counties.",
  },
};

