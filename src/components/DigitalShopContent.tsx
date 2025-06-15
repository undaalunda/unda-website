//src/components/DigitalShopContent.tsx - Updated with Interactive Touch Swipe

'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Album configuration
const albums = [
  {
    slug: 'dark-wonderful-world',
    title: 'Dark Wonderful World',
    subtitle: 'Album • 2025',
    coverImage: '/catmoon-bg.jpeg',
    totalProducts: 141,
    productBreakdown: {
      backingTracks: 50,
      tabs: 41,
      stems: 50
    },
    songs: 11,
    priceRange: '$4.95 - $11.95',
    description: 'Complete digital collection featuring backing tracks, tabs, and stems for all instruments.',
    available: true
  }
];

// Solo Collection configuration
const soloCollection = {
  slug: 'solo-collection',
  title: 'Solo Collection',
  subtitle: 'Guitar • Highlights',
  coverImage: '/solo-collection.webp',
  totalProducts: 4,
  productBreakdown: {
    backingTracks: 0,
    tabs: 4,
    stems: 0
  },
  priceRange: '$3.95 - $7.95',
  description: 'Guitar moments and stuff that somehow got popular.',
  available: true
};

export default function DigitalShopContent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const collections = [albums[0], soloCollection];

  // Enhanced touch/swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0].clientX;
    setTouchStart(touch);
    setTouchCurrent(touch);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.targetTouches[0].clientX;
    const diff = touch - touchStart;
    const maxDrag = carouselRef.current?.offsetWidth || 300;
    
    // Limit drag distance
    const limitedDiff = Math.max(-maxDrag * 0.5, Math.min(maxDrag * 0.5, diff));
    
    setTouchCurrent(touch);
    setDragOffset(limitedDiff);
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    
    const distance = touchStart - touchCurrent;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < collections.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }

    // Reset drag state
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchCurrent(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % collections.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + collections.length) % collections.length);
  };

  // Calculate transform based on current slide and drag offset
  const getTransform = () => {
    const baseTranslate = -currentSlide * 100;
    const dragPercent = (dragOffset / (carouselRef.current?.offsetWidth || 300)) * 100;
    return `translateX(${baseTranslate + dragPercent}%)`;
  };
  
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 pt-32">
      {/* Container for all content */}
      <div className="w-full max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm max-[927px]:text-xs max-[696px]:text-xs text-[#f8fcdc]/70 max-[1280px]:text-center">
          <Link href="/" className="hover:text-[#5b8199] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#5b8199] transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-[#dc9e63]">Digital</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12 max-[927px]:mb-10 max-[696px]:mb-8">
          <h1 className="text-5xl max-[927px]:text-4xl max-[696px]:text-3xl font-bold bg-gradient-to-r from-[#5b8199] via-[#253c50] to-[#102134] bg-clip-text text-transparent mb-4 uppercase tracking-wider">
            Digital Shop
          </h1>
          <p className="text-base max-[927px]:text-sm max-[696px]:text-xs text-[#f8fcdc] opacity-80">
            Professional high-quality backing tracks, tabs, and stems for musicians
          </p>
        </div>

        {/* Collections Grid */}
        <div className="w-full xl:max-w-[1200px] md:max-w-4xl mx-auto">
          
          {/* Desktop/Tablet Layout - Side by side (768px and up) */}
          <div className="hidden md:flex md:justify-center md:gap-8 xl:gap-10">
            
            {/* Albums Collection - Desktop */}
            <div className="group xl:w-[450px] md:w-[350px] xl:flex-shrink-0 md:flex-shrink-0">
              <Link href={`/shop/digital/${albums[0].slug}`} className="block">
                <div className="bg-gradient-to-br from-[rgba(220,158,99,0.08)] to-[rgba(248,252,220,0.03)] 
                              border border-[rgba(220,158,99,0.2)] rounded-3xl xl:p-8 md:p-6 
                              hover:border-[rgba(220,158,99,0.4)] hover:shadow-2xl 
                              hover:shadow-[rgba(220,158,99,0.15)]
                              relative overflow-hidden xl:h-[700px] md:h-[575px] flex flex-col">
                  
                  {/* Album Cover */}
                  <div className="relative xl:h-48 md:h-40 bg-[#333] flex-shrink-0 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={albums[0].coverImage}
                      alt={`${albums[0].title} Album Cover`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Title Section - Fixed Height */}
                    <div className="xl:h-24 md:h-18 flex flex-col justify-center mb-0">
                      <h2 className="xl:text-[25px] md:text-lg font-bold text-[#dc9e63] uppercase tracking-wider text-center">
                        Dark Wonderful World
                      </h2>
                      <p className="xl:text-base md:text-sm text-[#f8fcdc] opacity-70 text-center">
                        {albums[0].subtitle}
                      </p>
                    </div>
                    
                    {/* Description Section - Fixed Height */}
                    <div className="xl:h-20 md:h-16 flex items-center mb-6">
                      <p className="text-[#f8fcdc] xl:text-sm md:text-xs opacity-60 text-center leading-relaxed w-full">
                        Complete digital collection with backing tracks, detailed tabs, and high-quality stems for all instruments.
                      </p>
                    </div>
                    
                    {/* Stats Section - Fixed Height */}
                    <div className="xl:h-20 md:h-16 mb-6">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="text-center">
                          <p className="text-[#dc9e63] font-semibold xl:text-sm md:text-xs uppercase tracking-wide">Products</p>
                          <p className="xl:text-2xl md:text-lg font-bold text-[#f8fcdc]">{albums[0].totalProducts}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#dc9e63] font-semibold xl:text-sm md:text-xs uppercase tracking-wide">Price</p>
                          <p className="xl:text-lg md:text-sm font-bold text-[#f8fcdc]">{albums[0].priceRange}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Breakdown Section - Fixed Height */}
                    <div className="xl:h-32 md:h-24 mb-6">
                      <p className="text-[#dc9e63] font-semibold xl:text-sm md:text-xs uppercase tracking-wide mb-3 text-center">
                        Content
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[#f8fcdc] opacity-70 xl:text-sm md:text-xs">Backing Tracks</span>
                          <span className="text-[#f8fcdc] font-bold xl:text-sm md:text-xs">{albums[0].productBreakdown.backingTracks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#f8fcdc] opacity-70 xl:text-sm md:text-xs">Tabs</span>
                          <span className="text-[#f8fcdc] font-bold xl:text-sm md:text-xs">{albums[0].productBreakdown.tabs}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#f8fcdc] opacity-70 xl:text-sm md:text-xs">Stems</span>
                          <span className="text-[#f8fcdc] font-bold xl:text-sm md:text-xs">{albums[0].productBreakdown.stems}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Solo Collection - Desktop */}
            <div className="group xl:w-[450px] md:w-[350px] xl:flex-shrink-0 md:flex-shrink-0">
              <Link href={`/shop/digital/${soloCollection.slug}`} className="block">
                <div className="bg-gradient-to-br from-[rgba(220,158,99,0.08)] to-[rgba(248,252,220,0.03)] 
                              border border-[rgba(220,158,99,0.2)] rounded-3xl xl:p-8 md:p-6 
                              hover:border-[rgba(220,158,99,0.4)] hover:shadow-2xl 
                              hover:shadow-[rgba(220,158,99,0.15)]
                              relative overflow-hidden xl:h-[700px] md:h-[575px] flex flex-col">
                  
                  {/* Solo Collection Cover Image */}
                  <div className="relative xl:h-48 md:h-40 bg-[#333] flex-shrink-0 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={soloCollection.coverImage}
                      alt={`${soloCollection.title} Cover`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Title Section - Fixed Height */}
                    <div className="xl:h-24 md:h-18 flex flex-col justify-center mb-0">
                      <h2 className="xl:text-[25px] md:text-lg font-bold text-[#dc9e63] uppercase tracking-wider text-center">
                        Solo Collection
                      </h2>
                      <p className="xl:text-base md:text-sm text-[#f8fcdc] opacity-70 text-center">
                        {soloCollection.subtitle}
                      </p>
                    </div>
                    
                    {/* Description Section - Fixed Height */}
                    <div className="xl:h-20 md:h-16 flex items-center mb-6">
                      <p className="text-[#f8fcdc] xl:text-sm md:text-xs opacity-60 text-center leading-relaxed w-full">
                        Guitar moments and stuff that somehow got popular.
                      </p>
                    </div>
                    
                    {/* Stats Section - Fixed Height */}
                    <div className="xl:h-20 md:h-16 mb-6">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="text-center">
                          <p className="text-[#dc9e63] font-semibold xl:text-sm md:text-xs uppercase tracking-wide">Products</p>
                          <p className="xl:text-2xl md:text-lg font-bold text-[#f8fcdc]">{soloCollection.totalProducts}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#dc9e63] font-semibold xl:text-sm md:text-xs uppercase tracking-wide">Price</p>
                          <p className="xl:text-lg md:text-sm font-bold text-[#f8fcdc]">{soloCollection.priceRange}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Breakdown Section - Fixed Height */}
                    <div className="xl:h-32 md:h-24 mb-6">
                      <p className="text-[#dc9e63] font-semibold xl:text-sm md:text-xs uppercase tracking-wide mb-3 text-center">
                        Content
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[#f8fcdc] opacity-70 xl:text-sm md:text-xs">Backing Tracks</span>
                          <span className="text-[#f8fcdc] font-bold xl:text-sm md:text-xs">{soloCollection.productBreakdown.backingTracks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#f8fcdc] opacity-70 xl:text-sm md:text-xs">Tabs</span>
                          <span className="text-[#f8fcdc] font-bold xl:text-sm md:text-xs">{soloCollection.productBreakdown.tabs}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#f8fcdc] opacity-70 xl:text-sm md:text-xs">Stems</span>
                          <span className="text-[#f8fcdc] font-bold xl:text-sm md:text-xs">{soloCollection.productBreakdown.stems}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Layout - Interactive Touch Carousel (767px and below) */}
          <div className="md:hidden relative max-w-xs mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 
                       bg-[rgba(220,158,99,0.15)] hover:bg-[rgba(220,158,99,0.25)]
                       border border-[rgba(220,158,99,0.4)] hover:border-[rgba(220,158,99,0.7)]
                       rounded-full w-10 h-10 flex items-center justify-center
                       transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#dc9e63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10
                       bg-[rgba(220,158,99,0.15)] hover:bg-[rgba(220,158,99,0.25)]
                       border border-[rgba(220,158,99,0.4)] hover:border-[rgba(220,158,99,0.7)]
                       rounded-full w-10 h-10 flex items-center justify-center
                       transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#dc9e63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="relative overflow-hidden rounded-3xl select-none"
              style={{ touchAction: 'pan-y' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div 
                className={`flex ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
                style={{ transform: getTransform() }}
              >
                {collections.map((collection, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <Link href={`/shop/digital/${collection.slug}`} className="block">
                      <div className="bg-gradient-to-br from-[rgba(220,158,99,0.08)] to-[rgba(248,252,220,0.03)] 
                                    border border-[rgba(220,158,99,0.2)] rounded-3xl p-6
                                    hover:border-[rgba(220,158,99,0.4)] hover:shadow-2xl 
                                    hover:shadow-[rgba(220,158,99,0.15)]
                                    relative overflow-hidden h-[540px] flex flex-col">
                        
                        {/* Cover Image */}
                        <div className="relative h-36 bg-[#333] flex-shrink-0 rounded-2xl overflow-hidden mb-6">
                          <Image
                            src={collection.coverImage}
                            alt={`${collection.title} Cover`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                          {/* Title Section */}
                          <div className="h-16 flex flex-col justify-center mb-0">
                            <h2 className="text-base font-bold text-[#dc9e63] uppercase tracking-wider text-center">
                              {collection.title}
                            </h2>
                            <p className="text-xs text-[#f8fcdc] opacity-70 text-center">
                              {collection.subtitle}
                            </p>
                          </div>
                          
                          {/* Description Section */}
                          <div className="h-14 flex items-center mb-6">
                            <p className="text-[#f8fcdc] text-xs opacity-60 text-center leading-relaxed w-full">
                              {collection.description}
                            </p>
                          </div>
                          
                          {/* Stats Section */}
                          <div className="h-14 mb-6">
                            <div className="grid grid-cols-2 gap-4 h-full">
                              <div className="text-center">
                                <p className="text-[#dc9e63] font-semibold text-xs uppercase tracking-wide">Products</p>
                                <p className="text-base font-bold text-[#f8fcdc]">
                                  {collection.totalProducts}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-[#dc9e63] font-semibold text-xs uppercase tracking-wide">Price</p>
                                <p className="text-sm font-bold text-[#f8fcdc]">{collection.priceRange}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Product Breakdown Section */}
                          <div className="h-20 mb-6">
                            <p className="text-[#dc9e63] font-semibold text-xs uppercase tracking-wide mb-3 text-center">
                              Content
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[#f8fcdc] opacity-70 text-xs">Backing Tracks</span>
                                <span className="text-[#f8fcdc] font-bold text-xs">{collection.productBreakdown.backingTracks}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#f8fcdc] opacity-70 text-xs">Tabs</span>
                                <span className="text-[#f8fcdc] font-bold text-xs">{collection.productBreakdown.tabs}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#f8fcdc] opacity-70 text-xs">Stems</span>
                                <span className="text-[#f8fcdc] font-bold text-xs">{collection.productBreakdown.stems}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {collections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentSlide === index 
                      ? 'bg-[#dc9e63]' 
                      : 'bg-[rgba(220,158,99,0.3)] hover:bg-[rgba(220,158,99,0.5)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Back to Shop Link */}
        <div className="text-center mt-16 max-[927px]:mt-12">
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