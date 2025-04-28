/* CartPage.tsx */

'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { convertPrice } from '@/utils/currency';
import { useCurrency } from '@/context/CurrencyContext';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currency } = useCurrency();

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = typeof item.price === 'object' ? item.price.sale : item.price;
    return acc + price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] p-8">
        <h1 className="text-2xl mb-6">Your cart is empty.</h1>
        <Link href="/shop" className="text-[#dc9e63] hover:underline">Return to Shop</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-[120px]">
      <div className="w-full max-w-4xl">
      <h1 className="text-4xl mb-8 text-center text-[#dc9e63] tracking-wider uppercase font-extrabold">
  BASKET
</h1>

        <div className="flex flex-col gap-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-6 border-b border-[#dc9e63]/30 pb-6">
              <Image src={item.image} alt={item.title} width={80} height={80} className="rounded" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-[#f8fcdc]/60">{item.subtitle}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border border-[#dc9e63]">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border border-[#dc9e63]">+</button>
                </div>
              </div>
              <div className="text-right">
                <p>{convertPrice((typeof item.price === 'object' ? item.price.sale : item.price) * item.quantity, currency)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-[#dc9e63] hover:underline mt-2 text-sm flex items-center gap-1">
                  <X size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#dc9e63]/30 pt-6 text-right">
          <h2 className="text-2xl mb-4">Total: {convertPrice(cartTotal, currency)}</h2>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Link href="/shop" className="px-6 py-3 border border-[#dc9e63] text-[#dc9e63] hover:bg-[#dc9e63]/10 text-center">
              Continue Shopping
            </Link>
            <button className="px-6 py-3 bg-[#dc9e63] text-[#160000] font-bold hover:bg-[#f8cfa3]">
              Checkout
            </button>
          </div>

          <button
            onClick={clearCart}
            className="mt-6 text-sm text-[#f8fcdc]/50 hover:text-[#dc9e63] underline"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </main>
  );
}