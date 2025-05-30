/* ShopPageWrapper.tsx */

'use client';

import { memo } from 'react';
import ShopPageContent from './ShopPageContent';

type Props = {
  category?: string;
};

// 🚀 Memoize wrapper เพื่อลด re-renders
const ShopPageWrapper = memo(function ShopPageWrapper({ category }: Props) {
  const selectedTab = category?.toUpperCase() as 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL' | undefined;
  return <ShopPageContent tab={selectedTab || 'MERCH'} />;
});

export default ShopPageWrapper;