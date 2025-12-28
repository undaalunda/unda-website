// app/cart/page.tsx

import type { Metadata } from 'next';
import CartClientComponent from './CartClientComponent';

export const metadata: Metadata = {
  title: 'Cart | UNDA ALUNDA',
};

export default function CartPage() {
  return <CartClientComponent />;
}