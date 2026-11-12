import React from "react";
import type { Product } from "@/types/catalogue";

interface ProductJsonLdProps {
  product: Product;
  locale?: string;
}

export function ProductJsonLd({ product, locale = "en" }: ProductJsonLdProps) {
  const isSw = locale === "sw";
  const name = isSw && product.name_sw ? product.name_sw : product.name;
  const description = isSw && product.description_sw ? product.description_sw : product.description;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": name,
    "image": product.images || [product.texture_url],
    "description": description,
    "sku": product.code,
    "brand": {
      "@type": "Brand",
      "name": "MarvelRise Decor"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://mavelrise-decor.vercel.app/${locale}/collections/${product.category_id || "spc-flooring"}/${product.code}`,
      "priceCurrency": "KES",
      "price": product.price_kes,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock_status === "out_of_stock"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "MarvelRise Decor"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

