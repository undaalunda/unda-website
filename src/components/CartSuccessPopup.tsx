'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function CartSuccessPopup() {
  const { lastAddedItem, setLastAddedItem } = useCart();
  const [show, setShow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (lastAddedItem) {
      setShow(true);
      const timer = setTimeout(() => {
        if (!isHovering) {
          setShow(false);
          setLastAddedItem(null);
        }
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, isHovering]);

  if (!show || !lastAddedItem) return null;

  return (
    <div
      className="fixed bottom-6 right-6 bg-[#160000] text-[#f8fcdc] border-[0.1px] border-[#dc9e63] p-4 rounded-[4px] shadow-lg flex items-center gap-4 animate-fadeIn z-50 transition-all duration-500 font-[Cinzel]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setTimeout(() => {
          setShow(false);
          setLastAddedItem(null);
        }, 2000);
      }}
    >
      <CheckCircle className="text-green-700" size={28} strokeWidth={1.2} />

      <Image
        src={lastAddedItem.image}
        alt={lastAddedItem.title}
        width={50}
        height={50}
        className="rounded"
      />

      <div className="flex flex-col text-xs">
        <span className="text-sm font-bold text-[#dc9e63] leading-tight">
          Added to Cart!
        </span>
        <span className="font-semibold text-[#f8fcdc]">{lastAddedItem.title}</span>
        <span className="text-[#f8fcdc]/60">{lastAddedItem.subtitle}</span>
      </div>

      <Link
        href="/cart"
        className="ml-4 text-xs text-[#dc9e63] hover:underline whitespace-nowrap"
      >
        View Cart
      </Link>
    </div>
  );
}