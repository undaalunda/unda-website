// app/product/[slug]/page.tsx

import { allItems } from '@/components/allItems';
import ProductPageContent from '@/components/ProductPageContent';
import type { Metadata } from 'next';

// 💥 FIX TYPE มั่วของ TypeScript โดยแยกออกมา
type ParamsType = {
  params: {
    slug: string;
  };
};

// ✅ บอก Next.js ว่ามี slug อะไรบ้าง
export async function generateStaticParams() {
  return allItems.map((item) => ({
    slug: item.id,
  }));
}

// ✅ สร้างข้อมูล metadata สำหรับ SEO
export async function generateMetadata({ params }: ParamsType): Promise<Metadata> {
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

// ✅ หน้า product
export default async function Page({ params }: ParamsType) {
  return <ProductPageContent slug={params.slug} />;
}

// 🧠 แปลงชื่อสินค้าให้อ่านง่าย
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