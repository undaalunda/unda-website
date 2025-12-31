/* BundleSizeSelector.tsx - Matches Your Existing Website Design */

'use client';

import React from 'react';

interface BundleSizeSelectorProps {
  sizeOptions: { [productId: string]: string[] };
  selectedSizes: { [productId: string]: string };
  onSizeChange: (productId: string, size: string) => void;
  productNames?: { [productId: string]: string };
}

export default function BundleSizeSelector({
  sizeOptions,
  selectedSizes,
  onSizeChange,
  productNames = {}
}: BundleSizeSelectorProps) {
  const getProductLabel = (productId: string): string => {
    if (productNames[productId]) {
      return productNames[productId];
    }
    
    return productId
      .replace(/-/g, ' ')
      .replace(/t shirt/gi, 'T-Shirt')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const productIds = Object.keys(sizeOptions);

  if (productIds.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {productIds.map((productId, index) => {
        const sizes = sizeOptions[productId];
        const selectedSize = selectedSizes[productId];
        const productLabel = getProductLabel(productId);

        return (
          <div key={productId} className={index > 0 ? 'mt-6' : ''}>
            {/* Label */}
            <label className="block text-sm font-bold text-[#f8fcdc] mb-3">
              {productIds.length > 1 ? (
                <>
                  {index === 0 ? 'FIRST T-SHIRT' : index === 1 ? 'SECOND T-SHIRT' : `T-SHIRT ${index + 1}`}:
                  <span className="font-normal text-[#f8fcdc]/60 ml-2 text-xs">
                    ({productLabel.includes('Dark Wonderful World') ? 'Dark Wonderful World' : 
                      productLabel.includes('Consonance') ? 'Consonance' : productLabel})
                  </span>
                </>
              ) : (
                'SELECT SIZE:'
              )}
            </label>

            {/* Size Grid - matching your existing design exactly */}
            <div className="grid grid-cols-5 gap-2 max-w-[280px]">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(productId, size)}
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

            {/* Validation message for this specific product */}
            {!selectedSize && (
              <p className="text-xs text-red-500 mt-2">
                Please select a size
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}