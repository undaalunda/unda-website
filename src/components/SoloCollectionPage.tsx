/* SoloCollectionPage.tsx - Fixed Framer Motion Import */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { allItems } from './allItems';

// 🚀 Import Optimized Image Components
import { AlbumCover, ProductImage } from '@/components/OptimizedImage';

// 🎯 Simple static import instead of dynamic import
import { motion, AnimatePresence } from 'framer-motion';

// Solo Collection configuration - อัพเดทจำนวนสินค้าเป็น 4 อย่าง
const soloCollection = {
  slug: 'solo-collection',
  title: 'Solo Collection',
  subtitle: 'Guitar • Highlights',
  coverImage: '/solo-collection.webp',
  totalPieces: 4,
  totalProducts: 4,
  productBreakdown: {
    backingTracks: 0,
    tabs: 4,
    stems: 0
  },
  priceRange: '$3.95-$7.95',
  description: 'Guitar moments and stuff that somehow got popular.',
  available: true
};

type FilterType = 'all' | 'tabs' | 'backing' | 'stems';
type InstrumentType = 'all' | 'guitar' | 'bass' | 'keys' | 'drums';

interface SoloCollectionPageProps {
  initialFilter?: string;
  initialInstrument?: string;
}

export default function SoloCollectionPage({ 
  initialFilter = 'all',
  initialInstrument = 'all'
}: SoloCollectionPageProps) {
  const router = useRouter();
  
  // 🚀 Helper functions
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

  // 🚀 Lazy Initial State to prevent flash (อ่าน sessionStorage ทันที)
  const getInitialStateFromContext = (): { filterType: FilterType; filterInstrument: InstrumentType } => {
    // Helper functions
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
    
    // Server-side: ใช้ props
    if (typeof window === 'undefined') {
      return {
        filterType: normalizeFilterLocal(initialFilter),
        filterInstrument: normalizeInstrumentLocal(initialInstrument)
      };
    }
    
    // Client-side: อ่าน sessionStorage ทันที
    try {
      const navigationContext = sessionStorage.getItem('navigationContext');
      if (navigationContext) {
        const context = JSON.parse(navigationContext);
        sessionStorage.removeItem('navigationContext'); // Clear immediately
        
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

  // 🚀 Use lazy initial state to prevent hydration mismatch
  const [filterType, setFilterType] = useState<FilterType>(() => getInitialStateFromContext().filterType);
  const [filterInstrument, setFilterInstrument] = useState<InstrumentType>(() => getInitialStateFromContext().filterInstrument);

  // 🎯 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // 🚀 Track if this is initial mount
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // 🚀 Client-only mounting state
  const [isClientMounted, setIsClientMounted] = useState(false);

  // 🚀 ✅ Fixed: Simple History Management - ใช้ replaceState แทน pushState
  useEffect(() => {
    setIsClientMounted(true);
    
    if (typeof window !== 'undefined' && !hasInitialized) {
      // ✅ ใช้ replaceState แทน pushState เพื่อไม่สร้าง history entry ใหม่
      if (!window.history.state?.filters) {
        window.history.replaceState({ 
          filters: { filterType, filterInstrument }
        }, '', window.location.pathname + window.location.search);
      }
      
      setHasInitialized(true);
    }
  }, []);

  // 🚀 Browser Back/Forward Navigation Handler
  useEffect(() => {
    if (!hasInitialized) return;
    
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.filters) {
        setFilterType(event.state.filters.filterType || 'all');
        setFilterInstrument(event.state.filters.filterInstrument || 'all');
      }
      // ✅ ให้ browser จัดการ navigation เอง
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasInitialized]);

  // 🎯 Memoized product filtering
  const allProducts = useMemo(() => {
    return allItems.filter(item => 
      item.tags?.includes('contest') || 
      item.id.includes('abasi') || 
      item.id.includes('mayones') || 
      item.id.includes('vola')
    );
  }, []);

  // 🚀 Filter Change Handlers
  const handleFilterTypeChange = (newFilterType: FilterType) => {
    setFilterType(newFilterType);
  };

  const handleFilterInstrumentChange = (newFilterInstrument: InstrumentType) => {
    setFilterInstrument(newFilterInstrument);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Type filter - มีแค่ tabs
      const typeMatch = filterType === 'all' || 
        (filterType === 'tabs' && product.category === 'Tabs');

      // Instrument filter - Solo Collection มีแค่ Guitar เท่านั้น
      const instrumentMatch = filterInstrument === 'all' ||
        (filterInstrument === 'guitar' && (
          (product as any).instrument?.toLowerCase().includes('guitar') ||
          (product as any).instrument?.toLowerCase().includes('guitars')
        )) ||
        (filterInstrument !== 'guitar' && (product as any).instrument?.toLowerCase().includes(filterInstrument));

      return typeMatch && instrumentMatch;
    });
  }, [allProducts, filterType, filterInstrument]);

  // 🚀 ✅ Fixed: ใช้ replaceState สำหรับ filter changes
  useEffect(() => {
    if (!hasInitialized) return;
    
    setCurrentPage(1);
    
    // ✅ ใช้ replaceState แทน pushState เพื่อไม่สร้าง history entries เพิ่ม
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
    const backing = 0; // ไม่มี backing tracks
    const stems = 0;   // ไม่มี stems
    return { tabs, backing, stems, total: tabs };
  }, [allProducts]);

  // 🚀 ✅ Fixed: Smart Navigation ที่ไม่สร้าง history เพิ่ม
  const handleProductClick = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Only work on client side
    if (!isClientMounted) return;
    
    // Create navigation state with context
    const navigationState = {
      from: 'solo-collection',
      filter: filterType,
      instrument: filterInstrument,
      returnUrl: '/shop/digital/solo-collection'
    };
    
    // Store context in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('navigationContext', JSON.stringify(navigationState));
    }
    
    // ✅ Navigate ปกติ - ไม่ต้องจัดการ history พิเศษ
    router.push(product.url);
  };

  // 🎯 Optimized Pagination component
  const PaginationControls = () => {
    // Client-only rendering to prevent hydration mismatch
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
      {/* Container for all content */}
      <div className="w-full max-w-6xl pb-4">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm max-[927px]:text-xs max-[696px]:text-xs text-[#f8fcdc]/70 max-[1280px]:text-center">
          <Link href="/" className="hover:text-[#dc9e63]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#dc9e63]">Shop</Link>
          <span className="mx-2">/</span>
          <Link href="/shop/digital" className="hover:text-[#dc9e63]">Digital</Link>
          <span className="mx-2">/</span>
          <span className="text-[#dc9e63]">Solo Collection</span>
        </div>

        {/* Solo Collection Header - 🚀 OPTIMIZED */}
        <div className="mb-10 xl:-mb-18 product-page-header">
          <div className="flex flex-col max-[1279px]:flex-col min-[1280px]:flex-row gap-4 max-[1279px]:gap-0 min-[1280px]:gap-8 max-[1279px]:items-center min-[1280px]:items-start">
            {/* Cover Image - 🎯 เปลี่ยนเป็น AlbumCover */}
            <div className="flex-shrink-0 mx-auto max-[1279px]:mx-auto min-[1280px]:mx-0 w-80 h-80 min-[769px]:w-[36rem] min-[769px]:h-[36rem] xl:w-80 xl:h-80">
              <AlbumCover
                src={soloCollection.coverImage}
                alt={`${soloCollection.title} Cover`}
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-lg"
                quality={100}
              />
            </div>
            
            {/* Collection Info */}
            <div className="flex-1 text-center max-[1279px]:text-center min-[1280px]:text-left mx-auto max-[1279px]:mx-auto min-[1280px]:mx-0 max-w-full -mt-45 min-[769px]:-mt-85 xl:mt-0">
              <h1 className="product-page-title font-bold text-[#dc9e63] mb-4 uppercase tracking-wider text-base max-[927px]:text-sm max-[696px]:text-xs">
                {soloCollection.title}
              </h1>
              <p className="product-page-subtitle text-[#f8fcdc] mb-6 text-base max-[927px]:text-sm max-[696px]:text-xs">{soloCollection.subtitle}</p>
              
              {/* Info Grid */}
              <div className="grid grid-cols-4 max-[928px]:grid-cols-2 max-[696px]:grid-cols-2 gap-6 max-[928px]:gap-4 max-[696px]:gap-3 text-sm max-[928px]:text-xs max-[696px]:text-[10px]">
                <div>
                  <p className="text-[#dc9e63] font-semibold">Total Products</p>
                  <p className="text-2xl max-[928px]:text-xl max-[696px]:text-lg font-bold">{getProductCounts.total}</p>
                </div>
                <div>
                  <p className="text-[#dc9e63] font-semibold">Songs</p>
                  <p className="text-2xl max-[928px]:text-xl max-[696px]:text-lg font-bold">{soloCollection.totalPieces}</p>
                </div>
                <div>
                  <p className="text-[#dc9e63] font-semibold">Price Range</p>
                  <p className="text-xl max-[928px]:text-lg max-[696px]:text-base font-bold">{soloCollection.priceRange}</p>
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
                    const isAvailable = product.available;
                    
                    return isAvailable ? (
                      <div
  key={product.id}
  onClick={(e) => handleProductClick(product, e)}
  className="stems-item product-label-link is-backing cursor-pointer"
>
  <div className="relative">
    <ProductImage
      src={product.image}
      alt={`${product.title} - ${product.subtitle}`}
      width={200}
      height={200}
      className="stems-image"
      quality={95}
      sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
    />
    {product.comingSoon && (
      <div className="absolute top-2 right-2 bg-orange-600/50 text-white text-xs px-2 py-1 rounded-md font-semibold border border-orange-500/60">
        Available Dec 31
      </div>
    )}
  </div>
  <div className="stems-label-group">
    <p className="stems-title-text">{(product as any).song?.toUpperCase() || product.title}</p>
    <p className="stems-subtitle">{(product as any).instrument?.toUpperCase() || 'GUITAR'}</p>
    <span className="backing-line" />
    <p className="stems-subtitle-tiny">TABS</p>
    <p className="stems-price">
  {!product.comingSoon && (
    <span>${(product.price as number).toFixed(2)}</span>
  )}
</p>
  </div>
</div>
                    ) : (
                      <div
                        key={product.id}
                        className="stems-item product-label-link is-backing opacity-60 cursor-not-allowed"
                      >
                        <ProductImage
                          src={product.image}
                          alt={`${product.title} - ${product.subtitle}`}
                          width={200}
                          height={200}
                          className="stems-image"
                          quality={95}
                          sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
                        />
                        <div className="stems-label-group">
                          <p className="stems-title-text">{(product as any).song?.toUpperCase() || product.title}</p>
                          <p className="stems-subtitle">{(product as any).instrument?.toUpperCase() || 'GUITAR'}</p>
                          <span className="backing-line" />
                          <p className="stems-subtitle-tiny">TABS</p>
                          <p className="stems-price">
  {!product.comingSoon && (
    <span>${(product.price as number).toFixed(2)}</span>
  )}
</p>
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