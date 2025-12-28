// app/thank-you/page.tsx

'use client';

import { Suspense } from 'react';
import ThankYouClient from './ThankYouClient';

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="pt-44 text-center">Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}