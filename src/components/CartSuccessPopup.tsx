/* CartSuccessPopup.tsx */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function CartSuccessPopup() {
  const { lastActionItem, setLastActionItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const startHideTimer = (duration: number = 7000) => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
        setLastActionItem(null);
      }, 400); // match .4s fadeOut
    }, duration);
  };

  useEffect(() => {
    const pagesToSuppressPopup = ['/cart', '/checkout', '/shop'];

    if (pagesToSuppressPopup.includes(pathname as string)) {
      if (lastActionItem) {
        setLastActionItem(null);
      }
      return;
    }

    if (lastActionItem) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);

      // Show for less time if it's a removal
      startHideTimer(lastActionItem.action === 'remove' ? 2500 : 7000);
    }

    return () => {
      clearHideTimer();
    };
  }, [lastActionItem, pathname]);

  // 👇 เคลียร์ popup ถ้าผู้ใช้กด back ของ browser
  useEffect(() => {
    const onPopState = () => {
      setLastActionItem(null);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [setLastActionItem]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    clearHideTimer();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    startHideTimer(lastActionItem?.action === 'remove' ? 2500 : 7000);
  };

  if (!shouldRender || !lastActionItem) return null;

  const isAdd = lastActionItem.action === 'add';
  const { image, title, subtitle } = lastActionItem.item;

  return (
    <div
      className={`fixed bottom-6 right-6 bg-[#160000] text-[#f8fcdc] p-4 rounded-[4px] shadow-lg flex items-center gap-4 font-[Cinzel] z-50 transition-all duration-500 ${
        isVisible ? 'animate-fadeIn' : 'animate-fadeOut pointer-events-none'
      } cursor-default`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isAdd ? (
        <CheckCircle className="text-green-700" size={28} strokeWidth={1.2} />
      ) : (
        <XCircle className="text-[#cc3f33]" size={28} strokeWidth={1.2} />
      )}

      {image && (
        <Image
          src={image}
          alt={title || 'Item image'}
          width={50}
          height={50}
          className="rounded pointer-events-none"
        />
      )}

      <div className="flex flex-col text-xs pointer-events-none">
        <span className="text-sm font-bold leading-tight" style={{ color: isAdd ? '#dc9e63' : '#cc3f33' }}>
          {isAdd ? 'Added to Cart!' : 'Removed from Cart'}
        </span>
        <span className="font-semibold text-[#f8fcdc]">{title}</span>
        <span className="text-[#f8fcdc]/60">{subtitle}</span>
      </div>

      {isAdd ? (
        <Link
          href="/cart"
          className="ml-4 text-xs text-[#dc9e63] hover:underline whitespace-nowrap cursor-pointer pointer-events-auto"
        >
          View Cart
        </Link>
      ) : (
        <div className="ml-4 w-[50px] pointer-events-none" /> // 👈 ให้พื้นที่ว่างตอน remove
      )}
    </div>
  );
}