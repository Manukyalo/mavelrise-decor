import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mavelrise-decor.vercel.app";
  const locales = ["en", "sw"];
  const staticRoutes = ["", "/planner", "/collections", "/projects", "/auth/login"];
  const towns = ["ruiru", "thika", "juja", "kiambu", "nairobi"];
  const categories = [
    "spc-flooring",
    "wpc-wall-panels",
    "marble-sheets",
    "lampshades",
    "decor",
  ];

  const items: MetadataRoute.Sitemap = [];

  // Static routes
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      items.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/planner" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/planner" ? 0.9 : 0.8,
      });
    });

    // Town landing pages
    towns.forEach((town) => {
      items.push({
        url: `${baseUrl}/${locale}/areas/${town}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    });

    // Category collections
    categories.forEach((cat) => {
      items.push({
        url: `${baseUrl}/${locale}/collections/${cat}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  return items;
}

