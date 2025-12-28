'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper'; // ✅ สำคัญ!

// 🚀 Memoize cart item component เพื่อลด re-renders
const CartItemComponent = memo(function CartItemComponent({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const handleIncrement = useCallback(() => {
    onUpdateQuantity(item.id, item.quantity + 1);
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleDecrement = useCallback(() => {
    onUpdateQuantity(item.id, item.quantity - 1);
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  return (
    <motion.div
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
        loading="lazy" // 🚀 Lazy loading
        quality={75}   // 🎯 ลดขนาด
      />

      <div className="flex-1">
        <h2 className="text-[14px] md:text-lg font-bold text-[#dc9e63]">
          <Link href={`/product/${item.id}`} className="cursor-pointer block w-fit">
            {item.title}
          </Link>
        </h2>

        <p className="text-[10px] md:text-xs font-light text-[#f8fcdc]">
          <Link href={`/product/${item.id}`} className="cursor-pointer block w-fit">
            {item.subtitle}
          </Link>
        </p>

        <div className="flex items-center gap-2 mt-2">
          {typeof item.price === 'object' || item.type !== 'digital' ? (
            <>
              <button
                onClick={handleDecrement}
                className="w-7 h-7 border border-[#dc9e63]/50 border-[0.5px] rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer"
              >
                -
              </button>

              <span className="text-[13px] md:text-sm font-light">
                {item.quantity}
              </span>

              <button
                onClick={handleIncrement}
                className="w-7 h-7 border border-[#dc9e63]/50 border-[0.5px] rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </>
          ) : (
            <span className="text-sm text-[#f8fcdc]">x1</span>
          )}

          <button
            onClick={handleRemove}
            className="ml-2 cursor-pointer"
          >
            <Trash2 size={16} strokeWidth={1} className="text-[#f8fcdc]" />
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[#cc3f33] font-semibold text-base md:text-lg tracking-[.08em]">
          $
          {(
            (typeof item.price === 'object' ? item.price.sale : item.price) *
            item.quantity
          ).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
});

export default function CartClientComponent() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const router = useRouter();

  const handleGoToCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  return (
    <AppClientWrapper>
      {cartItems.length === 0 ? (
        <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] p-8">
          <h1 className="text-2xl mb-6">Your cart is empty.</h1>
          <Link href="/shop" className="text-[#dc9e63] hover:underline">
            Return to Shop
          </Link>
        </main>
      ) : (
        <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] p-8">
          <div className="w-full max-w-4xl pt-[140px]">
            <h1 className="text-4xl mb-8 text-center text-[#dc9e63] tracking-wider uppercase font-extrabold">
              Cart
            </h1>

            <div className="flex flex-col gap-8">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
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
                  onClick={handleGoToCheckout}
                  className="px-6 py-3 bg-[#dc9e63] text-[#160000] font-bold hover:bg-[#f8cfa3] rounded-xl text-sm cursor-pointer"
                >
                  Proceed to Checkout
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
      )}
    </AppClientWrapper>
  );
}