import React from "react";

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": "https://mavelrise-decor.vercel.app/#localbusiness",
    "name": "MarvelRise Decor",
    "alternateName": "MarvelRise Decor Atelier Kenya",
    "description":
      "East Africa's premier interior architectural craftsmanship studio. 100% waterproof SPC flooring (5.5mm & 6mm), acoustic fluted WPC wall panels, high-gloss UV marble sheets and bespoke ambient lighting in Ruiru, Nairobi, and Kiambu.",
    "url": "https://mavelrise-decor.vercel.app",
    "telephone": "+254719113343",
    "priceRange": "KSh 1,400 - KSh 4,500",
    "image": [
      "https://mavelrise-decor.vercel.app/images/hero-showroom.jpg",
      "https://mavelrise-decor.vercel.app/images/spc-teak.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Eastern Bypass, First U-turn from Bypass to OJ, opposite NattyGym",
      "addressLocality": "Ruiru",
      "addressRegion": "Kiambu County",
      "postalCode": "00232",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.1492,
      "longitude": 36.9624
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Ruiru" },
      { "@type": "City", "name": "Nairobi" },
      { "@type": "City", "name": "Thika" },
      { "@type": "City", "name": "Juja" },
      { "@type": "City", "name": "Kiambu" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Architectural Finishes Catalog",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "SPC Rigid Core Flooring (5.5mm & 6mm IXPE)",
            "description": "100% waterproof stone polymer composite flooring with click-lock technology"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "WPC Fluted Acoustic Wall Panels",
            "description": "Luxury vertical timber slat cladding for living rooms, TV walls, and executive suites"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "UV Marble Sheets (PVC Composite)",
            "description": "High-gloss mirror finish lightweight marble alternative for walls and bathrooms"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

