'use client';

import { useSearchParams } from 'next/navigation';
import ShopPageContent from './ShopPageContent';

export default function ShopPageWrapper() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL' | null;

  return <ShopPageContent tabParam={tabParam} />;
}