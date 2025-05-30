/* SearchOverlay */

'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { allItems } from '@/components/allItems';

function isBundlePrice(
  price: number | { original: number; sale: number }
): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  // 🚀 Debounce search query to improve performance
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      setDelayedQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 🚀 Memoized filtered results - only update when delayedQuery changes
  const filtered = useMemo(() => {
    const q = delayedQuery.toLowerCase().trim();
    if (q.length === 0) return [];
    
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [delayedQuery]);

  // 🚀 Memoized search suggestions for empty query
  const suggestions = useMemo(() => {
    const popularCategories = ['Merch', 'Music', 'Bundles', 'Backing Track'];
    const popularTags = [...new Set(allItems.flatMap(item => item.tags))].slice(0, 6);
    return [...popularCategories, ...popularTags];
  }, []);

  // 🚀 Memoized handlers to prevent re-renders
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Optional: Navigate to search results page
    // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    searchInputRef.current?.focus();
  }, []);

  // 🚀 Handle ESC key to close overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 🚀 Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0dea] flex items-start justify-center pt-32 px-4 animate-fadeIn">
      <div className="w-full max-w-2xl">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#f8fcdc]/50">
              <Search size={20} />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, categories, or tags..."
              value={searchQuery}
              onChange={handleInputChange}
              autoFocus
              className="w-full pl-12 pr-12 py-3 text-lg text-[#f8fcdc] caret-[#dc9e63] bg-transparent border border-[#dc9e63] rounded-md placeholder:text-[#777] outline-none focus:border-[#f8fcdc] transition-colors"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[#f8fcdc] hover:text-[#dc9e63] transition cursor-pointer"
            >
              <X size={24} strokeWidth={1.4} />
            </button>
          </div>
        </form>

        {/* Search Results */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {searchQuery.trim() === '' ? (
            // 🚀 Show suggestions when no search query
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#f8fcdc] mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-sm bg-[#dc9e63]/20 text-[#dc9e63] rounded-full hover:bg-[#dc9e63]/30 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 🚀 Show search results
            <div className="space-y-4">
              {/* Loading state */}
              {searchQuery !== delayedQuery && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#dc9e63]"></div>
                  <p className="text-sm text-[#f8fcdc]/70 mt-2">Searching...</p>
                </div>
              )}

              {/* Results */}
              {searchQuery === delayedQuery && (
                <>
                  {filtered.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-[#f8fcdc]/60 mb-2">No results found for "{searchQuery}"</p>
                      <p className="text-xs text-[#f8fcdc]/40">Try searching with different keywords</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-[#f8fcdc]/70 mb-4">
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filtered.map((item) => (
                          <Link
                            href={`/product/${item.id}`}
                            key={item.id}
                            onClick={onClose}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#dc9e63]/10 transition-colors cursor-pointer group"
                          >
                            <div className="flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded group-hover:scale-105 transition-transform"
                                loading="lazy" // 🚀 Lazy loading
                                quality={75}   // 🎯 Optimize for thumbnails
                                sizes="48px"   // 📐 Fixed size
                                placeholder="blur" // 🌟 Smooth loading
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                              />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-medium text-[#f8fcdc] truncate">
                                {item.title}
                              </span>
                              <span className="text-xs text-[#f8fcdc]/70 truncate">
                                {item.subtitle}
                              </span>
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
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}