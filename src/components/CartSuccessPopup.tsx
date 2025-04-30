'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function CartSuccessPopup() {
  const { lastAddedItem, setLastAddedItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/cart') {
      setIsVisible(false);
      setShouldRender(false);
      setLastAddedItem(null);
      return;
    }

    if (lastAddedItem) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      const timer = setTimeout(() => {
        if (!isHovering) {
          setIsVisible(false);
          setTimeout(() => {
            setShouldRender(false);
            setLastAddedItem(null);
          }, 700);
        }
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, pathname]);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      setLastAddedItem(null);
    }, 700);
  };

  if (!shouldRender || !lastAddedItem) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 bg-[#160000]/30 text-[#f8fcdc] p-4 rounded-[4px] shadow-lg flex items-center gap-4 font-[Cinzel] z-50 transition-all duration-500 ${
        isVisible ? 'animate-fadeIn' : 'animate-fadeOut pointer-events-none'
      } cursor-default`} // ❌ default cursor สำหรับทั้ง popup
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <CheckCircle className="text-green-700" size={28} strokeWidth={1.2} />

      {lastAddedItem.image && (
        <Image
          src={lastAddedItem.image}
          alt={lastAddedItem.title || 'Item image'}
          width={50}
          height={50}
          className="rounded pointer-events-none" // ✅ กัน interaction
        />
      )}

      <div className="flex flex-col text-xs pointer-events-none">
        <span className="text-sm font-bold text-[#dc9e63] leading-tight">
          Added to Cart!
        </span>
        <span className="font-semibold text-[#f8fcdc]">{lastAddedItem.title}</span>
        <span className="text-[#f8fcdc]/60">{lastAddedItem.subtitle}</span>
      </div>

      <Link
        href="/cart"
        className="ml-4 text-xs text-[#dc9e63] hover:underline whitespace-nowrap cursor-pointer pointer-events-auto"
      >
        View Cart
      </Link>
    </div>
  );
}