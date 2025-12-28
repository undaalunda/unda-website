//app/order-status/page.tsx

import { Suspense } from 'react';
import OrderStatusClient from './OrderStatusClient';

export default function OrderStatusPageWrapper() {
  return (
    <Suspense fallback={<div className="pt-44 text-center">Loading...</div>}>
      <OrderStatusClient />
    </Suspense>
  );
}