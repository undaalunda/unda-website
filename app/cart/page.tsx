'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { convertPrice } from '@/utils/currency';
import { useCurrency } from '@/context/CurrencyContext';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();

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
    <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] p-8">
      <div className="w-full max-w-4xl pt-[140px]">
        <h1 className="text-4xl mb-8 text-center text-[#dc9e63] tracking-wider uppercase font-extrabold">
          Basket
        </h1>

        <div className="flex flex-col gap-8">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-6 border-b border-[#dc9e63]/30 pb-6"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded"
                />
                <div className="flex-1">
                  <h2 className="text-[14px] md:text-lg font-bold text-[#dc9e63]">
                    <Link href={`/shop/${item.id}`} className="cursor-pointer block w-fit">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="text-[10px] md:text-xs font-light text-[#f8fcdc]">
                    <Link href={`/shop/${item.id}`} className="cursor-pointer block w-fit">
                      {item.subtitle}
                    </Link>
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 border border-[#dc9e63]/50 border-[0.5px] rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-[13px] md:text-sm font-light">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 border border-[#dc9e63]/50 border-[0.5px] rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 cursor-pointer"
                    >
                      <Trash2 size={16} strokeWidth={1} className="text-[#f8fcdc]" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#cc3f33] font-semibold text-[13px] md:text-sm tracking-[.08em]">
                    {convertPrice(
                      (typeof item.price === 'object'
                        ? item.price.sale
                        : item.price) * item.quantity,
                      currency
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 border-t border-[#dc9e63]/30 pt-6 text-right">
          <h2 className="text-[18px] md:text-2xl mb-7 text-[#f8fcdc]">
            Total: {convertPrice(cartTotal, currency)}
          </h2>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Link
              href="/shop"
              className="px-6 py-3 border border-[#dc9e63] text-[#dc9e63] hover:bg-[#dc9e63]/10 text-center rounded-xl text-sm cursor-pointer"
            >
              Continue Shopping
            </Link>

            <button
  onClick={async () => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com', // เอาไว้ก่อน เดี๋ยวค่อยดึงจาก login หรือ form จริง
          items: cartItems.map((item) => ({
            variant_id: item.variantId, // 🔥 มึงต้องมีอันนี้จาก Shopify
            quantity: item.quantity,
          })),
          shippingAddress: {
            address1: '123 Main St',
            city: 'Bangkok',
            province: 'Bangkok',
            country: 'Thailand',
            zip: '10110',
          },
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('สร้างลิงก์ชำระเงินไม่สำเร็จ');
      }
    } catch (err) {
      console.error(err);
      alert('เออเร่ออออออออออออ');
    }
  }}
  className="px-6 py-3 bg-[#dc9e63] text-[#160000] font-bold hover:bg-[#f8cfa3] rounded-xl text-sm cursor-pointer"
>
  Checkout
</button>
          </div>

          <button
            onClick={clearCart}
            className="mt-6 text-xs text-[#f8fcdc]/50 hover:text-[#dc9e63] underline cursor-pointer"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </main>
  );
}