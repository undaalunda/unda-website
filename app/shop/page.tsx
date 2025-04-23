import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ShopPageWrapper = dynamic(() => import('../../components/ShopPageWrapper'), { ssr: false });

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading shop...</div>}>
      <ShopPageWrapper />
    </Suspense>
  );
}