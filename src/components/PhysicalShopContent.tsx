//PhysicalShopContent.tsx - Updated with Cinematic Colors and Animations

'use client';

import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { allItems } from './allItems';

type PhysicalTabType = 'MERCH' | 'MUSIC' | 'BUNDLES';
const validPhysicalTabs: PhysicalTabType[] = ['MERCH', 'MUSIC', 'BUNDLES'];

function isBundlePrice(
  price: number | { original: number; sale: number }
): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

export default function PhysicalShopContent({ initialTab }: { initialTab?: PhysicalTabType }) {
  const router = useRouter();
  
  // 🚀 Safe SSR Initialization - เริ่มด้วยค่า default เสมอ
  const [activeTab, setActiveTab] = useState<PhysicalTabType>('MERCH');
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);

  // 🚀 Ultra-Fast Client-Side Initialization (useLayoutEffect = before paint!)
  useLayoutEffect(() => {
    // Only run on client-side after hydration
    if (typeof window === 'undefined') return;
    
    let finalTab: PhysicalTabType = 'MERCH';

    // Check for temporary URL params first (from homepage)
    const urlParams = new URLSearchParams(window.location.search);
    const tempTab = urlParams.get('__t');
    
    if (tempTab) {
      const tabMap: { [key: string]: PhysicalTabType } = {
        'merch': 'MERCH',
        'music': 'MUSIC', 
        'bundles': 'BUNDLES'
      };
      finalTab = tabMap[tempTab] || 'MERCH';
      
      // Clean up URL by removing temp param
      urlParams.delete('__t');
      const cleanUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({ tab: finalTab }, '', cleanUrl);
    } 
    // Check browser history state
    else if (window.history?.state && window.history.state.tab) {
      finalTab = window.history.state.tab;
    } else {
      // Check navigation contexts
      try {
        const navigationContext = sessionStorage.getItem('navigationContext');
        if (navigationContext) {
          const context = JSON.parse(navigationContext);
          sessionStorage.removeItem('navigationContext'); // Clear immediately
          
          if (context.tab) {
            const tabMap: { [key: string]: PhysicalTabType } = {
              'merch': 'MERCH',
              'music': 'MUSIC', 
              'bundles': 'BUNDLES'
            };
            finalTab = tabMap[context.tab] || 'MERCH';
          }
        }
        // Fallback: Check return context  
        else {
          const returnContext = sessionStorage.getItem('returnContext');
          if (returnContext) {
            const context = JSON.parse(returnContext);
            if (context.tab) {
              const tabMap: { [key: string]: PhysicalTabType } = {
                'merch': 'MERCH',
                'music': 'MUSIC', 
                'bundles': 'BUNDLES'
              };
              finalTab = tabMap[context.tab] || 'MERCH';
            }
            sessionStorage.removeItem('returnContext'); // Clear after use
          } 
          // Final fallback: Use initial prop
          else {
            if (initialTab && validPhysicalTabs.includes(initialTab)) {
              finalTab = initialTab;
            }
          }
        }
      } catch (error) {
        console.warn('Failed to parse navigation context:', error);
        // Use initial prop as fallback
        if (initialTab && validPhysicalTabs.includes(initialTab)) {
          finalTab = initialTab;
        }
      }
    }

    // Set the tab synchronously (before paint!)
    setActiveTab(finalTab);
    
    // Set initial history state if not exists
    if (!window.history?.state || !window.history.state.tab) {
      window.history.replaceState({ tab: finalTab }, '', window.location.pathname + window.location.search);
    }
    
    // Mark as ready to render
    setIsInitialized(true);
    setShouldRender(true);
    setIsClientMounted(true);
  }, []); // Run only once after mount

  // 🚀 Handle Browser Back/Forward Navigation
  useEffect(() => {
    const handlePopState = (event: Event) => {
      const popEvent = event as PopStateEvent;
      if (popEvent.state && popEvent.state.tab) {
        setActiveTab(popEvent.state.tab);
      } else {
        // No state means we're at the base URL, default to MERCH
        setActiveTab('MERCH');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  // Filter only physical products
  const physicalItems = useMemo(() => {
    return allItems.filter(item => item.type === 'physical');
  }, []);

  // Filter items based on active tab
  const itemsToRender = useMemo(() => {
    return physicalItems.filter((item) => {
      const category = item.category;
      switch (activeTab) {
        case 'MERCH':
          return category === 'Merch';
        case 'MUSIC':
          return category === 'Music';
        case 'BUNDLES':
          return category === 'Bundles';
        default:
          return false;
      }
    });
  }, [physicalItems, activeTab]);

  // 🚀 Smart Tab Change with History Management
  const handleTabChange = (tabKey: PhysicalTabType) => {
    setActiveTab(tabKey);
    
    // Push state to browser history (enables browser back/forward)
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.pathname + window.location.search;
      window.history.pushState(
        { tab: tabKey }, 
        '', 
        currentUrl // Same URL, just add state
      );
    }
  };

  // 🚀 Smart Navigation with Clean URLs
  const handleProductClick = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Create navigation state with context
    const navigationState = {
      from: 'physical',
      tab: activeTab.toLowerCase(),
      returnUrl: '/shop/physical'
    };
    
    // Store context in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('navigationContext', JSON.stringify(navigationState));
    }
    
    // Navigate with clean URL
    router.push(product.url);
  };

  // 🚀 Prevent any flash - render with opacity until ready
  if (!shouldRender) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-32">
        <div className="w-full max-w-6xl" style={{ opacity: 0 }}>
          {/* Hidden content that matches final render structure */}
          <div className="mb-6 text-sm max-[927px]:text-xs max-[696px]:text-xs text-[#f8fcdc]/70 max-[1280px]:text-center">
            <span className="text-[#f8fcdc]/50">Home / Shop / Physical</span>
          </div>
          <div className="text-center mb-12 max-[927px]:mb-10 max-[696px]:mb-8">
            <h1 className="text-5xl max-[927px]:text-4xl max-[696px]:text-3xl font-bold bg-gradient-to-r from-[#fcc276] via-[#d37142] to-[#781a1a] bg-clip-text text-transparent mb-4 uppercase tracking-wider">
              Physical Shop
            </h1>
            <p className="text-base max-[927px]:text-sm max-[696px]:text-xs text-[#f8fcdc] opacity-80">
              Merchandise, music, and exclusive bundles delivered worldwide
            </p>
          </div>
          <div className="shop-tab-group mb-10">
            {validPhysicalTabs.map((tabKey) => (
              <div
                key={tabKey}
                className={`info-button shop-tab-button ${
                  tabKey === 'MERCH' ? 'active-tab' : ''
                }`}
              >
                {tabKey}
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-32">
      {/* Container for all content */}
      <div className="w-full max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm max-[927px]:text-xs max-[696px]:text-xs text-[#f8fcdc]/70 max-[1280px]:text-center">
          <Link href="/" className="hover:text-[#d37142] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#d37142] transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-[#dc9e63]">Physical</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12 max-[927px]:mb-10 max-[696px]:mb-8">
          <h1 className="text-5xl max-[927px]:text-4xl max-[696px]:text-3xl font-bold bg-gradient-to-r from-[#fcc276] via-[#d37142] to-[#781a1a] bg-clip-text text-transparent mb-4 uppercase tracking-wider">
            Physical Shop
          </h1>
          <p className="text-base max-[927px]:text-sm max-[696px]:text-xs text-[#f8fcdc] opacity-80">
            Merchandise, music, and exclusive bundles delivered worldwide
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="shop-tab-group mb-10">
          {validPhysicalTabs.map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => handleTabChange(tabKey)}
              className={`info-button shop-tab-button transition-all duration-300 cursor-pointer 
                         hover:!bg-[#d37142] hover:!text-[#f8fcdc] hover:!border-[#d37142] ${
                activeTab === tabKey 
                  ? 'active-tab !bg-[#d37142] !text-[#f8fcdc] !border-[#d37142]' 
                  : '!bg-transparent !text-[#d37142] !border-[rgba(211,113,66,0.6)]'
              }`}
            >
              {tabKey}
            </button>
          ))}
        </div>

        {/* Products Section with Animation */}
        <div className="w-full" suppressHydrationWarning={true}>
          {!isClientMounted ? (
            <div className="text-center text-lg text-[#d37142] opacity-60 mt-10">
              Loading products...
            </div>
          ) : itemsToRender.length === 0 ? (
            <div>
              <p className="text-center text-lg text-[#d37142] opacity-60 mt-10">
                There are currently no products available in this category.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab} // Key changes when tab changes, triggering animation
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="stems-row"
              >
                {itemsToRender.map((item) => {
                  const displayPrice = isBundlePrice(item.price) ? (
                    <>
                      <span className="line-through text-[#f8fcdc] mr-1">
                        ${item.price.original.toFixed(2)}
                      </span>
                      <span className="text-[#cc3f33]">${item.price.sale.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${(item.price as number).toFixed(2)}</span>
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={(e) => handleProductClick(item, e)}
                      className="stems-item product-label-link cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={200}
                        height={200}
                        className="stems-image"
                        loading="lazy"
                        quality={75}
                        sizes="(max-width: 480px) 140px, (max-width: 696px) 140px, (max-width: 927px) 160px, 180px"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                      <div className="stems-label-group">
                        <p className="stems-title-text text-[#d37142]">{item.title}</p>
                        <p className="stems-subtitle-tiny">{item.subtitle}</p>
                        <p className="stems-price">{displayPrice}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Back to Shop Link */}
        <div className="text-center mt-16 max-[927px]:mt-12 max-[696px]:mt-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center space-x-2 text-[#dc9e63]/70 hover:text-[#fcc276] 
                     transition-colors duration-300 text-base max-[927px]:text-sm"
          >
            <span>←</span>
            <span>Back to Shop</span>
          </Link>
        </div>
        
      </div>
    </main>
  );
}