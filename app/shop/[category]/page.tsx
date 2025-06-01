// app/shop/[category]/page.tsx
import ShopPageWrapper from '@/components/ShopPageWrapper';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const BASE_URL = 'https://unda-website.vercel.app';

// Enhanced metadata generation
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const categoryKey = params.category?.toLowerCase();
  
  const categoryConfig = {
    merch: {
      title: 'Shop Merch - UNDA ALUNDA',
      description: 'Explore exclusive merch from Unda Alunda, including t-shirts, stickers, keychains and more. Official merchandise for progressive rock fans.',
      keywords: ['merchandise', 't-shirt', 'stickers', 'keychain', 'unda alunda merch', 'progressive rock merchandise']
    },
    music: {
      title: 'Shop Music - UNDA ALUNDA', 
      description: 'Browse physical albums, CDs, vinyl and audio releases from Unda Alunda. Official progressive rock instrumental music.',
      keywords: ['albums', 'CD', 'vinyl', 'music', 'progressive rock', 'instrumental', 'unda alunda music']
    },
    bundles: {
      title: 'Shop Bundles - UNDA ALUNDA',
      description: 'Get bundled deals for fans of Unda Alunda – music, merch & more at special prices. Best value packages available.',
      keywords: ['bundles', 'deals', 'packages', 'special offers', 'unda alunda bundles', 'value packs']
    },
    digital: {
      title: 'Shop Digital - UNDA ALUNDA',
      description: 'Download stems, tabs, sheet music and digital albums from Unda Alunda. High-quality digital music content for musicians.',
      keywords: ['digital download', 'stems', 'tabs', 'sheet music', 'digital albums', 'backing tracks']
    }
  };

  if (!categoryKey || !categoryConfig[categoryKey as keyof typeof categoryConfig]) {
    notFound();
  }

  const config = categoryConfig[categoryKey as keyof typeof categoryConfig];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: `${BASE_URL}/shop/${categoryKey}`,
      siteName: 'UNDA ALUNDA',
    },

    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      creator: '@undaalunda',
    },

    alternates: {
      canonical: `${BASE_URL}/shop/${categoryKey}`,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 🚨 สำคัญ: Default export function (ส่วนที่หายไป!)
export default async function ShopCategoryPage({ params }: any) {
  const { category } = await params;
  
  // Validate category
  const validCategories = ['merch', 'music', 'bundles', 'digital'];
  if (!category || !validCategories.includes(category.toLowerCase())) {
    notFound();
  }

  return (
    <AppClientWrapper>
      <ShopPageWrapper category={category} />
    </AppClientWrapper>
  );
}