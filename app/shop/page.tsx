import { Suspense } from 'react';
import ShopPageWrapper from '../../components/ShopPageWrapper'; // ใช้ตรงๆได้เลย

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading shop...</div>}>
      <ShopPageWrapper />
    </Suspense>
  );
}