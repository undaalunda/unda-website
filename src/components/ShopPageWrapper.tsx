/* ShopPageWrapper.tsx */

'use client';

import ShopPageContent from './ShopPageContent';

type Props = {
  category?: string;
};

export default function ShopPageWrapper({ category }: Props) {
  const selectedTab = category?.toUpperCase() as 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL' | undefined;
  return <ShopPageContent tab={selectedTab || 'MERCH'} />;
}