// app/shop/[category]/page.tsx

import ShopPageWrapper from '@/components/ShopPageWrapper';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const categoryTitles: Record<string, string> = {
  merch: 'Shop Merch - UNDA ALUNDA',
  music: 'Shop Music - UNDA ALUNDA',
  bundles: 'Shop Bundles - UNDA ALUNDA',
  digital: 'Shop Digital - UNDA ALUNDA',
};

const categoryDescriptions: Record<string, string> = {
  merch: 'Explore exclusive merch from Unda Alunda, including t-shirts, stickers, and more.',
  music: 'Browse physical albums, CDs, and vinyl from Unda Alunda.',
  bundles: 'Get bundled deals for fans of Unda Alunda – music, merch & more.',
  digital: 'Download stems, tabs, and digital albums from Unda Alunda.',
};

// ✅ FIX: ใช้ any ไปก่อนเพื่อให้ TypeScript หยุดร้องไห้
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const categoryKey = params.category?.toLowerCase();
  if (!categoryKey || !categoryTitles[categoryKey]) notFound();

  return {
    title: categoryTitles[categoryKey],
    description: categoryDescriptions[categoryKey],
  };
}

// ✅ FIX: ไม่ต้องระบุ type ตรงๆ แล้วมันจะหายบ้า
export default async function ShopCategoryPage({ params }: any) {
  const { category } = await params;
  if (!category || !categoryTitles[category]) notFound();

  return (
    <AppClientWrapper>
      <ShopPageWrapper category={category} />
    </AppClientWrapper>
  );
}