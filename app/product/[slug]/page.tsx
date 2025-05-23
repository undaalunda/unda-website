// app/product/[slug]/page.tsx

import { allItems } from '@/components/allItems';
import ProductPageContent from '@/components/ProductPageContent';
import type { Metadata } from 'next';

const BASE_URL = 'https://unda-website.vercel.app';

export async function generateStaticParams() {
  return allItems.map((item) => ({
    slug: item.id,
  }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const product = allItems.find((item) => item.id === params.slug);

  if (!product) {
    return {
      title: 'Product Not Found - UNDA ALUNDA',
      description: 'The requested product could not be found.',
    };
  }

  const formattedSubtitle = product.subtitle
    ? product.subtitle.charAt(0).toUpperCase() + product.subtitle.slice(1).toLowerCase()
    : '';

  const title = `${smartTitleCase(product.title)}${
    formattedSubtitle ? ` – ${formattedSubtitle}` : ''
  } - UNDA ALUNDA`;

  return {
    title,
    description: formattedSubtitle || 'Official product page from Unda Alunda.',
    other: {
      'og:title': title,
      'og:description': formattedSubtitle || 'Official product page from Unda Alunda.',
      'og:type': 'product.item',
      'og:url': `${BASE_URL}/product/${params.slug}`,
    },
  };
}

export default async function Page({ params }: any) {
  const product = allItems.find((item) => item.id === params.slug);

  if (!product) return null;

  return (
    <>
      {/* ✅ BreadcrumbList Schema (for SEO hierarchy) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Shop",
                "item": `${BASE_URL}/shop`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": `${product.title} – ${product.subtitle}`,
                "item": `${BASE_URL}/product/${product.id}`
              }
            ]
          })
        }}
      />
      <ProductPageContent product={product} />
    </>
  );
}

function smartTitleCase(str: string): string {
  const exceptions: Record<string, string> = {
    't-shirt': 'T-Shirt',
    'cd': 'CD',
    'dvd': 'DVD',
    'tab': 'TAB',
    'stem': 'STEM',
    'backing': 'Backing',
    'track': 'Track',
  };

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      const key = word.toLowerCase().replace(/[^a-z\-]/g, '');
      return exceptions[key] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}