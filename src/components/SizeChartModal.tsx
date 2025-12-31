'use client';

import React from 'react';
import Image from 'next/image';

interface SizeChartModalProps {
  sizeChartImage: string;
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export default function SizeChartModal({ sizeChartImage, isOpen, onClose, productTitle }: SizeChartModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer animate-fadeIn" 
      onClick={onClose}
    >
      <div 
       className="relative max-w-2xl w-full" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Size Chart Image - ดิบๆ ไม่มีกรอบ */}
        <Image
          src={sizeChartImage}
          alt={`${productTitle} Size Chart`}
          width={1600}
          height={1200}
          className="w-full h-auto cursor-default"
          quality={100}
        />
      </div>
    </div>
  );
}