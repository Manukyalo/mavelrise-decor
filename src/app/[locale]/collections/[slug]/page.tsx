import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/supabase/products";
import { CategoryStoryHero } from "@/components/catalogue/CategoryStoryHero";
import { CatalogueView } from "@/components/catalogue/CatalogueView";
import type { Metadata } from "next";

export const revalidate = 60;

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found | MarvelRise Decor" };

  return {
    title: `${category.name} | MarvelRise Decor Nairobi`,
    description: category.description || `${category.name} architectural finishes.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategories(),
    getProducts({ categorySlug: params.slug }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#03060b] text-white pt-20 pb-32">
      {/* Scroll-Driven Category Story Hero */}
      <CategoryStoryHero category={category} locale={params.locale} />

      {/* Category Products Section */}
      <main id="products-list" className="max-w-7xl mx-auto px-6 pt-16">
        <CatalogueView
          initialProducts={products}
          categories={categories}
          locale={params.locale}
          defaultCategorySlug={category.slug}
        />
      </main>
    </div>
  );
}

