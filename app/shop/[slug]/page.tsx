//app/[slug]/page.tsx

'use client';

import AppClientWrapper from '@/components/AppClientWrapper';
import ProductPageContent from '@/components/ProductPageContent';

export default function Page() {
  return (
    <AppClientWrapper>
      <ProductPageContent />
    </AppClientWrapper>
  );
}