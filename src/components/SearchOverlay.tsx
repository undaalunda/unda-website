'use client';

import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { allItems } from '@/components/allItems'; // ตรวจ path ให้ด้วยเด้อ

function isBundlePrice(
  price: number | { original: number; sale: number }
): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0dea] flex items-start justify-center pt-32 px-4">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 text-lg text-[#f8fcdc] caret-[#dc9e63] bg-transparent border border-[#dc9e63] rounded-md placeholder:text-[#777] outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#f8fcdc] hover:text-[#dc9e63] transition cursor-pointer"
          >
            <X size={24} strokeWidth={1.4} />
          </button>
        </form>

        {searchQuery.trim() && (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-sm opacity-60 text-center">No Results... Try something else.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <Link
                    href={`/shop/${item.id}`}
                    key={item.id}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#dc9e63]/10 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded opacity-0 transition-opacity duration-500"
                      onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#f8fcdc]">{item.title}</span>
                      <span className="text-xs text-[#f8fcdc]/70">{item.subtitle}</span>
                      {item.price && (
                        <div className="flex items-center gap-1 text-xs text-[#dc9e63] mt-1">
                          {isBundlePrice(item.price) ? (
                            <>
                              <span className="line-through text-[#f8fcdc]/40">
                                ${item.price.original.toFixed(2)}
                              </span>
                              <span>${item.price.sale.toFixed(2)}</span>
                            </>
                          ) : (
                            <span>${typeof item.price === 'number' ? item.price.toFixed(2) : ''}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}