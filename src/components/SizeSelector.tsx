'use client';

import { useState } from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-[#f8fcdc] mb-3">
        SELECT SIZE:
      </label>
      <div className="grid grid-cols-5 gap-2 max-w-[280px]">
        {sizes.map((size) => (
          <button
  key={size}
  type="button"
  onClick={() => onSizeChange(size)}
  className={`
    px-3 py-1.5 min-w-[50px] font-bold text-xs rounded
    border transition-all duration-200 cursor-pointer
    ${selectedSize === size
      ? 'bg-[#dc9e63] text-black border-[#dc9e63]'
      : 'bg-transparent text-[#f8fcdc] border-[#dc9e63]/40 hover:border-[#dc9e63] hover:bg-[#dc9e63]/10'
    }
  `}
>
  {size}
</button>
        ))}
      </div>
      {!selectedSize && (
        <p className="text-xs text-red-500 mt-2">
          Please select a size
        </p>
      )}
    </div>
  );
}