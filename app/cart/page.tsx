// app/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const normalizeVariantId = (raw: string) => {
  if (raw.startsWith('gid://')) return raw;
  const justDigits = raw.replace(/\D/g, '');
  return `gid://shopify/ProductVariant/${justDigits}`;
};

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
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
                    ${((typeof item.price === 'object' ? item.price.sale : item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 border-t border-[#dc9e63]/30 pt-6 text-right">
          <h2 className="text-[18px] md:text-2xl mb-7 text-[#f8fcdc]">
            Total: ${cartTotal.toFixed(2)}
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
                  const lineItems = cartItems
                    .filter((item) => item.variantId)
                    .map((item) => ({
                      variantId: normalizeVariantId(String(item.variantId)),
                      quantity: item.quantity,
                    }));

                  if (lineItems.length === 0) {
                    alert('ไม่มีสินค้าที่สามารถชำระเงินได้ในตะกร้า');
                    return;
                  }

                  const script = document.createElement('script');
                  script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
                  script.async = true;
                  script.onload = async () => {
                    const client = (window as any).ShopifyBuy.buildClient({
                      domain: 'hp8tvk-qv.myshopify.com',
                      storefrontAccessToken: '6c9ded11108f9040c496274da96fa6fa',
                    });

                    try {
                      const checkout = await client.checkout.create();
                      const newCheckout = await client.checkout.addLineItems(checkout.id, lineItems);
                      window.location.href = newCheckout.webUrl;
                    } catch (error) {
                      console.error('💥 Shopify error:', error);
                      alert('เกิดข้อผิดพลาดในการสร้าง checkout ลองใหม่อีกครั้งนะเพื่อน');
                    }
                  };

                  document.body.appendChild(script);
                } catch (err) {
                  console.error('🔥 Unexpected error:', err);
                  alert('ระบบพังแรงมาก ลองใหม่ทีหลังนะเพื่อน');
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