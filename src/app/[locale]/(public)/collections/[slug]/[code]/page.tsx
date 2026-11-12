import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase/products";
import { ProductDetailView } from "@/components/catalogue/ProductDetailView";
import type { Metadata } from "next";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: {
    locale: string;
    slug: string;
    code: string; // This parameter captures the product slug
  };
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.code);
  if (!product) return { title: "Product Not Found | MarvelRise Decor" };

  return {
    title: `${product.code} ${product.name} | MarvelRise Decor Nairobi`,
    description:
      product.description ||
      `${product.name} (${product.code}) architectural finish specification.`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const product = await getProductBySlug(params.code);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#03060b] text-white pt-28 pb-32">
      <main className="max-w-7xl mx-auto px-6">
        <ProductDetailView product={product} locale={params.locale} />
      </main>
    </div>
  );
}

