//app/order-status/page.tsx

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const OrderStatusClient = dynamic(() => import('./OrderStatusClient'), {
  ssr: false,
});

export default function OrderStatusPageWrapper() {
  return (
    <Suspense fallback={<div className="pt-44 text-center">Loading...</div>}>
      <OrderStatusClient />
    </Suspense>
  );
}