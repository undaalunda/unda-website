/* AlbumHubPage.tsx - Fixed Framer Motion Import */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { allItems } from './allItems';

// 🚀 Import Optimized Image Components
import { AlbumCover, ProductImage } from '@/components/OptimizedImage';

// 🎯 Simple static import instead of dynamic import
import { motion, AnimatePresence } from 'framer-motion';

// Album song list
const albumSongs = [
  'The Dark', 'Anomic', 'Consonance', 'JYY', 'Out of the Dark',
  'Can\'t Feel My Face', 'Red Down', 'Atlantic', 'Feign', 
  'Dark Wonderful World', 'Quietness'
];

// Album configuration for navigation
const albumsConfig = [
  { slug: 'dark-wonderful-world', title: 'Dark Wonderful World', year: '2025', genre: 'Progressive Rock', songs: albumSongs, available: true },
];

// Get current album info
const getCurrentAlbum = (slug: string) => {
  return albumsConfig.find(album => album.slug === slug) || albumsConfig[0];
};

// Get digital products for this album
const getAlbumProducts = (albumSlug: string) => {
  const realProducts = allItems.filter(item => {
    // Only include Tabs, Backing Track, or Stem
    const isValidCategory = item.category === 'Tabs' || item.category === 'Backing Track' || item.category === 'Stem';
    
    // Exclude Solo Collection items (items with contest tag or specific IDs)
    const isSoloCollectionItem = 
      item.tags?.includes('contest') || 
      item.id.includes('abasi') || 
      item.id.includes('mayones') || 
      item.id.includes('vola');
    
    return isValidCategory && !isSoloCollectionItem;
  });
  
  return realProducts;
};

function isBundlePrice(price: number | { original: number; sale: number }): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

type FilterType = 'all' | 'tabs' | 'backing' | 'stems';
type InstrumentType = 'all' | 'guitar' | 'bass' | 'keys' | 'drums';

interface AlbumHubPageProps {
  albumSlug: string;
  initialFilter?: string;
  initialInstrument?: string;
}

export default function AlbumHubPage({ 
  albumSlug, 
  initialFilter = 'all', 
  initialInstrument = 'all' 
}: AlbumHubPageProps) {
  const router = useRouter();
  
  // Helper functions
  const normalizeFilter = (filter?: string): FilterType => {
    return (filter === 'tabs' || filter === 'backing' || filter === 'stems') 
      ? filter as FilterType 
      : 'all';
  };

  const normalizeInstrument = (instrument?: string): InstrumentType => {
    return (instrument === 'guitar' || instrument === 'bass' || instrument === 'keys' || instrument === 'drums')
      ? instrument as InstrumentType
      : 'all';
  };

  // Initial state with sessionStorage support
  const getInitialStateFromContext = (): { filterType: FilterType; filterInstrument: InstrumentType } => {
    const normalizeFilterLocal = (filter?: string): FilterType => {
      return (filter === 'tabs' || filter === 'backing' || filter === 'stems') 
        ? filter as FilterType 
        : 'all';
    };

    const normalizeInstrumentLocal = (instrument?: string): InstrumentType => {
      return (instrument === 'guitar' || instrument === 'bass' || instrument === 'keys' || instrument === 'drums')
        ? instrument as InstrumentType
        : 'all';
    };
    
    // Server-side: use props
    if (typeof window === 'undefined') {
      return {
        filterType: normalizeFilterLocal(initialFilter),
        filterInstrument: normalizeInstrumentLocal(initialInstrument)
      };
    }
    
    // Client-side: check sessionStorage first
    try {
      const navigationContext = sessionStorage.getItem('navigationContext');
      
      if (navigationContext) {
        const context = JSON.parse(navigationContext);
        
        const contextFilter = context.filter && ['tabs', 'backing', 'stems'].includes(context.filter)
          ? context.filter as FilterType
          : 'all';
        const contextInstrument = context.instrument && ['guitar', 'bass', 'keys', 'drums'].includes(context.instrument)
          ? context.instrument as InstrumentType
          : 'all';
          
        return {
          filterType: contextFilter,
          filterInstrument: contextInstrument
        };
      }
    } catch (error) {
      console.warn('Failed to parse navigation context:', error);
    }
    
    // Fallback to props
    return {
      filterType: normalizeFilterLocal(initialFilter),
      filterInstrument: normalizeInstrumentLocal(initialInstrument)
    };
  };

  // State with lazy initialization
  const [filterType, setFilterType] = useState<FilterType>(() => getInitialStateFromContext().filterType);
  const [filterInstrument, setFilterInstrument] = useState<InstrumentType>(() => getInitialStateFromContext().filterInstrument);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Track initialization
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);

  // Cleanup and initialization
  useEffect(() => {
    setIsClientMounted(true);
    
    if (typeof window !== 'undefined' && !hasInitialized) {
      // Clean up sessionStorage after mount
      if (sessionStorage.getItem('navigationContext')) {
        sessionStorage.removeItem('navigationContext');
      }
      
      // Set history state
      if (!window.history.state?.filters) {
        window.history.replaceState({ 
          filters: { filterType, filterInstrument }
        }, '', window.location.pathname + window.location.search);
      }
      
      setHasInitialized(true);
    }
  }, [filterType, filterInstrument]);

  // Browser back/forward navigation
  useEffect(() => {
    if (!hasInitialized) return;
    
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.filters) {
        setFilterType(event.state.filters.filterType || 'all');
        setFilterInstrument(event.state.filters.filterInstrument || 'all');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasInitialized]);

  // 🎯 Memoized expensive calculations
  const allProducts = useMemo(() => getAlbumProducts(albumSlug), [albumSlug]);
  const currentAlbum = getCurrentAlbum(albumSlug);

  // Filter change handlers
  const handleFilterTypeChange = (newFilterType: FilterType) => {
    setFilterType(newFilterType);
  };

  const handleFilterInstrumentChange = (newFilterInstrument: InstrumentType) => {
    setFilterInstrument(newFilterInstrument);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Type filter
      const typeMatch = filterType === 'all' || 
        (filterType === 'tabs' && product.category === 'Tabs') ||
        (filterType === 'backing' && product.category === 'Backing Track') ||
        (filterType === 'stems' && product.category === 'Stem');

      // Instrument filter
      let instrumentMatch = false;
      
      if (filterInstrument === 'all') {
        instrumentMatch = true;
      } else {
        // For Backing Track - check from subtitle or title
        if (product.category === 'Backing Track') {
          const searchText = (product.subtitle + ' ' + product.title).toLowerCase();
          
          if (filterInstrument === 'guitar') {
            instrumentMatch = searchText.includes('guitar') || searchText.includes('lead') || searchText.includes('rhythm');
          } else if (filterInstrument === 'bass') {
            instrumentMatch = searchText.includes('bass');
          } else if (filterInstrument === 'keys') {
            instrumentMatch = searchText.includes('key') || searchText.includes('piano') || searchText.includes('synth');
          } else if (filterInstrument === 'drums') {
            instrumentMatch = searchText.includes('drum') || searchText.includes('percussion');
          }
        } 
        // For Tab and Stem - use existing logic
        else {
          if (filterInstrument === 'guitar') {
            instrumentMatch = (product as any).instrument?.toLowerCase().includes('guitar') ||
                             (product as any).instrument?.toLowerCase().includes('guitars');
          } else {
            instrumentMatch = (product as any).instrument?.toLowerCase().includes(filterInstrument);
          }
        }
      }

      return typeMatch && instrumentMatch;
    });
  }, [allProducts, filterType, filterInstrument]);

  // Update history state when filters change
  useEffect(() => {
    if (!hasInitialized) return;
    
    setCurrentPage(1);
    
    if (typeof window !== 'undefined') {
      window.history.replaceState({ 
        filters: { filterType, filterInstrument } 
      }, '', window.location.pathname + window.location.search);
    }
  }, [filterType, filterInstrument, hasInitialized]);

  // 🎯 Memoized pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, currentProducts };
  }, [filteredProducts, currentPage, itemsPerPage]);

  const getProductCounts = useMemo(() => {
    const tabs = allProducts.filter(p => p.category === 'Tabs').length;
    const backing = allProducts.filter(p => p.category === 'Backing Track').length;
    const stems = allProducts.filter(p => p.category === 'Stem').length;
    return { tabs, backing, stems, total: tabs + backing + stems };
  }, [allProducts]);

  // Product click handler
  const handleProductClick = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isClientMounted) return;
    
    // Create navigation state with context
    const navigationState = {
      from: 'album',
      album: albumSlug,
      filter: filterType,
      instrument: filterInstrument,
      albumTitle: currentAlbum.title,
      returnUrl: `/shop/digital/${albumSlug}`
    };
    
    // Store context in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('navigationContext', JSON.stringify(navigationState));
    }
    
    router.push(product.url);
  };

  // 🚀 Optimized Pagination component
  const PaginationControls = () => {
    if (!isClientMounted) {
      return (
        <div className="flex justify-center items-center h-12">
          {/* Loading placeholder */}
        </div>
      );
    }

    if (paginationData.totalPages <= 1) return (
      <div className="flex justify-center items-center h-12">
        {/* Empty space to maintain layout consistency */}
      </div>
    );

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (paginationData.totalPages <= maxVisible) {
        for (let i = 1; i <= paginationData.totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', paginationData.totalPages);
        } else if (currentPage >= paginationData.totalPages - 2) {
          pages.push(1, '...', paginationData.totalPages - 3, paginationData.totalPages - 2, paginationData.totalPages - 1, paginationData.totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', paginationData.totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="flex justify-center items-center gap-2 h-12">
        {/* Previous button */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-2 py-1 text-xs border border-[#dc9e63]/30 rounded ${
            currentPage === 1 
              ? 'opacity-50 cursor-not-allowed text-[#f8fcdc]/50' 
              : 'text-[#f8fcdc] hover:border-[#dc9e63] hover:bg-[#dc9e63]/10 cursor-pointer'
          }`}
        >
          ← Prev
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-1 text-[#f8fcdc]/50 text-xs">...</span>
            ) : (
              <button
                onClick={() => setCurrentPage(page as number)}
                className={`px-2 py-1 text-xs border border-[#dc9e63]/30 rounded min-w-[28px] cursor-pointer ${
                  currentPage === page 
                    ? 'bg-[#dc9e63] text-[#1a1a2e] border-[#dc9e63]' 
                    : 'text-[#f8fcdc] hover:border-[#dc9e63] hover:bg-[#dc9e63]/10'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next button */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
          disabled={currentPage === paginationData.totalPages}
          className={`px-2 py-1 text-xs border border-[#dc9e63]/30 rounded ${
            currentPage === paginationData.totalPages 
              ? 'opacity-50 cursor-not-allowed text-[#f8fcdc]/50' 
              : 'text-[#f8fcdc] hover:border-[#dc9e63] hover:bg-[#dc9e63]/10 cursor-pointer'
          }`}
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-32">
      <div className="w-full max-w-6xl pb-4">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm max-[927px]:text-xs max-[696px]:text-xs text-[#f8fcdc]/70 max-[1280px]:text-center">
          <Link href="/" className="hover:text-[#dc9e63]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#dc9e63]">Shop</Link>
          <span className="mx-2">/</span>
          <Link href="/shop/digital" className="hover:text-[#dc9e63]">Digital</Link>
          <span className="mx-2">/</span>
          <span className="text-[#dc9e63]">{currentAlbum.title}</span>
        </div>

        {/* Album Header - 🚀 OPTIMIZED */}
         <div className="mb-10 xl:-mb-18 product-page-header">
          <div className="flex flex-col max-[1279px]:flex-col min-[1280px]:flex-row gap-4 max-[1279px]:gap-0 min-[1280px]:gap-8 max-[1279px]:items-center min-[1280px]:items-start">
            {/* Album Cover - 🎯 เปลี่ยนเป็น AlbumCover */}
            <div className="flex-shrink-0 mx-auto max-[1279px]:mx-auto min-[1280px]:mx-0 w-75 h-75 min-[769px]:w-[36rem] min-[769px]:h-[36rem] xl:w-80 xl:h-80">
              <AlbumCover
                src="/catmoon-bg.jpeg"
                alt={`${currentAlbum.title} Album Cover`}
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-lg"
                quality={100}
              />
            </div>
            
            {/* Album Info */}
            <div className="flex-1 text-center max-[1279px]:text-center min-[1280px]:text-left mx-auto max-[1279px]:mx-auto min-[1280px]:mx-0 max-w-full -mt-16 min-[769px]:-mt-50 xl:mt-0">
              <h1 className="product-page-title font-bold text-[#dc9e63] mb-4 uppercase tracking-wider text-base max-[927px]:text-sm max-[696px]:text-xs">
                {currentAlbum.title}
              </h1>
              <p className="product-page-subtitle text-[#f8fcdc] mb-6 text-base max-[927px]:text-sm max-[696px]:text-xs">Album • {currentAlbum.year}</p>
              
              {/* Info Grid */}
              <div className="grid grid-cols-4 max-[928px]:grid-cols-2 max-[696px]:grid-cols-2 gap-6 max-[928px]:gap-4 max-[696px]:gap-3 text-sm max-[928px]:text-xs max-[696px]:text-[10px]">
                <div>
                  <p className="text-[#dc9e63] font-semibold">Total Products</p>
                  <p className="text-2xl max-[928px]:text-xl max-[696px]:text-lg font-bold">{getProductCounts.total}</p>
                </div>
                <div>
                  <p className="text-[#dc9e63] font-semibold">Songs</p>
                  <p className="text-2xl max-[928px]:text-xl max-[696px]:text-lg font-bold">{currentAlbum.songs.length}</p>
                </div>
                <div>
                  <p className="text-[#dc9e63] font-semibold">Price Range</p>
                  <p className="text-xl max-[928px]:text-lg max-[696px]:text-base font-bold">$4.95 - $11.95</p>
                </div>
                <div>
                  <p className="text-[#dc9e63] font-semibold">Format</p>
                  <p className="text-lg max-[928px]:text-base max-[696px]:text-sm">PDF, WAV</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 xl:mb-6" suppressHydrationWarning={true}>
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {/* Type Filters */}
            <button
              onClick={() => handleFilterTypeChange('all')}
              className={`info-button cursor-pointer ${filterType === 'all' ? 'active-tab' : ''}`}
            >
              ALL ({getProductCounts.total})
            </button>
            <button
              onClick={() => handleFilterTypeChange('tabs')}
              className={`info-button cursor-pointer ${filterType === 'tabs' ? 'active-tab' : ''}`}
            >
              TABS ({getProductCounts.tabs})
            </button>
            <button
              onClick={() => handleFilterTypeChange('backing')}
              className={`info-button cursor-pointer ${filterType === 'backing' ? 'active-tab' : ''}`}
            >
              BACKING TRACKS ({getProductCounts.backing})
            </button>
            <button
              onClick={() => handleFilterTypeChange('stems')}
              className={`info-button cursor-pointer ${filterType === 'stems' ? 'active-tab' : ''}`}
            >
              STEMS ({getProductCounts.stems})
            </button>
          </div>

          {/* Instrument Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleFilterInstrumentChange('all')}
              className={`px-3 py-1 text-sm border border-[#dc9e63]/30 rounded cursor-pointer ${
                filterInstrument === 'all' 
                  ? 'bg-[#dc9e63] text-[#1a1a2e]' 
                  : 'bg-transparent text-[#f8fcdc] hover:border-[#dc9e63]'
              }`}
            >
              All Instruments
            </button>
            <button
              onClick={() => handleFilterInstrumentChange('guitar')}
              className={`px-3 py-1 text-sm border border-[#dc9e63]/30 rounded cursor-pointer ${
                filterInstrument === 'guitar' 
                  ? 'bg-[#dc9e63] text-[#1a1a2e]' 
                  : 'bg-transparent text-[#f8fcdc] hover:border-[#dc9e63]'
              }`}
            >
              Guitar
            </button>
            <button
              onClick={() => handleFilterInstrumentChange('bass')}
              className={`px-3 py-1 text-sm border border-[#dc9e63]/30 rounded cursor-pointer ${
                filterInstrument === 'bass' 
                  ? 'bg-[#dc9e63] text-[#1a1a2e]' 
                  : 'bg-transparent text-[#f8fcdc] hover:border-[#dc9e63]'
              }`}
            >
              Bass
            </button>
            <button
              onClick={() => handleFilterInstrumentChange('keys')}
              className={`px-3 py-1 text-sm border border-[#dc9e63]/30 rounded cursor-pointer ${
                filterInstrument === 'keys' 
                  ? 'bg-[#dc9e63] text-[#1a1a2e]' 
                  : 'bg-transparent text-[#f8fcdc] hover:border-[#dc9e63]'
              }`}
            >
              Keys
            </button>
            <button
              onClick={() => handleFilterInstrumentChange('drums')}
              className={`px-3 py-1 text-sm border border-[#dc9e63]/30 rounded cursor-pointer ${
                filterInstrument === 'drums' 
                  ? 'bg-[#dc9e63] text-[#1a1a2e]' 
                  : 'bg-transparent text-[#f8fcdc] hover:border-[#dc9e63]'
              }`}
            >
              Drums
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6" suppressHydrationWarning={true}>
          {isClientMounted ? (
            <p className="text-center text-[#dc9e63]">
              Showing {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, filteredProducts.length)} of {filteredProducts.length} products
              {paginationData.totalPages > 1 && ` (Page ${currentPage} of ${paginationData.totalPages})`}
            </p>
          ) : (
            <p className="text-center text-[#dc9e63]">
              Loading results...
            </p>
          )}
        </div>

        {/* Products Grid - 🚀 OPTIMIZED */}
        <div suppressHydrationWarning={true}>
          {!isClientMounted ? (
            <div className="text-center text-lg text-[#dc9e63] opacity-60 mt-10">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-lg text-[#dc9e63] opacity-60 mt-10">
              No products found matching your filters.
            </p>
          ) : (
            <>
              {/* 🎯 Simple Animation with static imports */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${filterType}-${filterInstrument}-${currentPage}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="stems-row min-h-[600px]"
                >
                  {paginationData.currentProducts.map((product) => {
                    const isAvailable = product.available !== false;
                    const isBackingTrack = product.category === 'Backing Track';
                    const isTab = product.category === 'Tabs';
                    
                    const displayPrice = isBundlePrice(product.price) ? (
                      <>
                        <span className="line-through text-[#f8fcdc] mr-1">
                          ${product.price.original.toFixed(2)}
                        </span>
                        <span className="text-[#cc3f33]">${product.price.sale.toFixed(2)}</span>
                      </>
                    ) : (
                      <span>${(product.price as number).toFixed(2)}</span>
                    );
                    
                    return isAvailable ? (
                      <div
                        key={product.id}
                        onClick={(e) => handleProductClick(product, e)}
                        className={`stems-item product-label-link cursor-pointer ${(isBackingTrack || isTab) ? 'is-backing' : ''}`}
                      >
                        {/* 🚀 เปลี่ยนเป็น ProductImage */}
                        <ProductImage
                          src={product.image}
                          alt={`${product.title} - ${product.subtitle}`}
                          width={200}
                          height={200}
                          className="stems-image"
                          quality={85}
                          sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
                        />
                        <div className="stems-label-group">
                          <p className="stems-title-text">
                            {(product as any).song?.toUpperCase() || product.title}
                          </p>
                          <p className="stems-subtitle">
                            {isBackingTrack
                              ? product.subtitle.replace(/BACKING TRACK/gi, '').trim()
                              : ((product as any).instrument?.toUpperCase() || product.subtitle)}
                          </p>
                          <span className="backing-line" />
                          <p className="stems-subtitle-tiny">
                            {product.category === 'Backing Track' ? 'BACKING TRACK' : 
                             product.category === 'Tabs' ? 'TABS' : 'STEM'}
                          </p>
                          <p className="stems-price">{displayPrice}</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={product.id}
                        className={`stems-item product-label-link opacity-60 cursor-not-allowed ${
                          isBackingTrack ? 'is-backing' : ''
                        }`}
                      >
                        <ProductImage
                          src={product.image}
                          alt={`${product.title} - ${product.subtitle}`}
                          width={200}
                          height={200}
                          className="stems-image"
                          quality={85}
                          sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
                        />
                        <div className="stems-label-group">
                          <p className="stems-title-text">
                            {(product as any).song?.toUpperCase() || product.title}
                          </p>
                          <p className="stems-subtitle">
                            {(product as any).instrument?.toUpperCase() || product.subtitle}
                          </p>
                          <span className="backing-line" />
                          <p className="stems-subtitle-tiny">
                            {product.category === 'Backing Track' ? 'BACKING TRACK' : 
                             product.category === 'Tabs' ? 'TABS' : 'STEM'}
                          </p>
                          <p className="stems-price">{displayPrice}</p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination Controls */}
              <div className="mt-8 mb-4">
                <PaginationControls />
              </div>
            </>
          )}
        </div>
        
      </div>
    </main>
  );
}