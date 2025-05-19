// app/product/[slug]/page.tsx

import { allItems } from '@/components/allItems';
import ProductPageContent from '@/components/ProductPageContent';
import type { Metadata } from 'next';

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

// ⛔️ นี่แหละตรงจุด นายใช้ async แล้วไม่บอก TypeScript ว่าฟังก์ชันมันจะ return เป็น Promise<Metadata>
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
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
  };
}

// 👇 และนี่คือตัวแสดงผล
export default function Page() {
  return <ProductPageContent />;
}