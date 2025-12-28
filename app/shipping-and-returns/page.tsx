//ShippingAndReturnsPage.tsx

import type { Metadata } from 'next';
import ShippingClientComponent from './ShippingClientComponent';

export const metadata: Metadata = {
  title: 'Shipping & Returns - UNDA ALUNDA',
};

export default function ShippingPage() {
  return <ShippingClientComponent />;
}