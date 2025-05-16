// /app/thank-you/page.tsx

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ThankYouClient = dynamic(() => import('./ThankYouClient'), {
  ssr: false,
});

export default function ThankYouPageWrapper() {
  return (
    <Suspense fallback={<div className="pt-44 text-center">Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}