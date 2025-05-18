//ShopPage.tsx

'use client';

import { Suspense } from 'react';
import ShopPageWrapper from '../../src/components/ShopPageWrapper';
import AppClientWrapper from '@/components/AppClientWrapper';

export default function ShopPage() {
  return (
    <AppClientWrapper>
      <Suspense fallback={<div className="text-center text-white">Loading shop...</div>}>
        <ShopPageWrapper />
      </Suspense>
    </AppClientWrapper>
  );
}