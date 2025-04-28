'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function CartSuccessPopup() {
  const { lastAddedItem, setLastAddedItem } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (lastAddedItem) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setLastAddedItem(null);
      }, 3000); // 3 วิหายเอง
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);

  if (!show || !lastAddedItem) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#160000] text-[#f8fcdc] border border-[#dc9e63] p-4 rounded-lg shadow-lg flex items-center gap-4 animate-fadeIn z-50">
      <Image src={lastAddedItem.image} alt={lastAddedItem.title} width={50} height={50} className="rounded" />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-[#dc9e63]">Added to Cart!</span>
        <span className="text-xs">{lastAddedItem.title}</span>
      </div>
      <Link href="/cart" className="ml-4 text-xs text-[#dc9e63] hover:underline">
        View Cart
      </Link>
    </div>
  );
}