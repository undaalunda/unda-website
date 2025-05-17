import { Suspense } from 'react';
import ShopPageWrapper from '../../src/components/ShopPageWrapper';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading shop...</div>}>
      <ShopPageWrapper />
    </Suspense>
  );
}