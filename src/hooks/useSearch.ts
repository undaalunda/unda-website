// hooks/useSearch.ts
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { allItems } from '@/components/allItems';

// Page links for search
const pageLinks = [
  { title: 'Home', href: '/' },
  { title: 'Shop', href: '/shop' },
  { title: 'About', href: '/about' },
  { title: 'Tour', href: '/tour' },
  { title: 'Contact', href: '/contact' },
];

export const useSearch = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [delayedQuery, setDelayedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const resultRefs = useRef<(HTMLElement | null)[]>([]);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  // Delayed search query
  useEffect(() => {
    if (searchQuery === '') {
      setDelayedQuery('');
    } else {
      const handler = setTimeout(() => {
        setDelayedQuery(searchQuery);
        setHighlightIndex(0);
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [searchQuery]);

  // Scroll to highlighted result
  useEffect(() => {
    if (searchOpen && resultRefs.current[highlightIndex]) {
      resultRefs.current[highlightIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex, searchOpen]);

  // Reset highlight when search opens
  useEffect(() => {
    if (searchOpen) {
      setHighlightIndex(0);
    }
  }, [searchOpen]);

  // Body scroll lock
  useEffect(() => {
    const body = document.body;
    const scrollYRef = window.scrollY;
    
    if (searchOpen) {
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    } else {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, scrollYRef);
    }
    
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
    };
  }, [searchOpen]);

  // Filter products based on query
  const filtered = useMemo(() => {
    const q = delayedQuery.toLowerCase().trim();
    const queryWords = q.split(/\s+/);

    return q.length > 0
      ? allItems.filter((item) => {
          const fields = [
            item.title,
            item.subtitle,
            item.category,
            item.description,
            ...(item.tags || []),
            typeof item.price === 'number'
              ? item.price.toString()
              : `${item.price?.original || ''} ${item.price?.sale || ''}`
          ]
            .filter(Boolean)
            .map((val) => String(val).toLowerCase());

          return queryWords.every((word) =>
            fields.some((field) => field.includes(word))
          );
        })
      : [];
  }, [delayedQuery]);

  // Generate suggestions
  const suggestions = useMemo(() => {
    const q = delayedQuery.toLowerCase();
    const tags = allItems.flatMap((item) => item.tags).filter(Boolean);
    const titles = allItems.map((item) => item.title);
    const allTerms = [...tags, ...titles];
    const unique = Array.from(new Set(allTerms));
    return q.length > 0
      ? unique.filter((term) => term.toLowerCase().startsWith(q)).slice(0, 6)
      : [];
  }, [delayedQuery]);

  // Find matching pages
  const pageMatches = useMemo(() => {
    const q = delayedQuery.toLowerCase();
    return q.length > 0
      ? pageLinks.filter((page) => page.title.toLowerCase().includes(q))
      : [];
  }, [delayedQuery]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hasQuery = delayedQuery.length > 0;
    const productCount = filtered.length;
    const suggestionCount = suggestions.length;
    const pageCount = pageMatches.length;
    const recentCount = recentSearches.length;
    const menuCount = pageLinks.length;

    const totalCount = hasQuery
      ? 1 + productCount + suggestionCount + pageCount + recentCount
      : 1 + menuCount;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev + 1;
        return next >= totalCount ? 1 : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev - 1;
        return next < 1 ? totalCount - 1 : next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const el = resultRefs.current[highlightIndex];
      if (el) {
        addToRecentSearches(searchQuery.trim());
        const link = el.querySelector('a');
        if (link) {
          (link as HTMLElement).click();
        } else {
          el.click();
        }
      }
    }
  };

  // Add to recent searches
  const addToRecentSearches = (query: string) => {
    if (query.length > 0) {
      setRecentSearches((prev) => {
        const withoutDupes = prev.filter((t) => t !== query);
        return [query, ...withoutDupes].slice(0, 5);
      });
    }
  };

  // Close search
  const closeSearch = () => {
    setSearchOpen(false);
  };

  // Open search
  const openSearch = () => {
    setSearchOpen(true);
  };

  return {
    // States
    searchOpen,
    searchQuery,
    delayedQuery,
    recentSearches,
    highlightIndex,
    
    // Refs
    resultRefs,
    searchOverlayRef,
    
    // Data
    filtered,
    suggestions,
    pageMatches,
    pageLinks,
    
    // Actions
    setSearchQuery,
    setRecentSearches,
    handleKeyDown,
    addToRecentSearches,
    closeSearch,
    openSearch,
  };
};