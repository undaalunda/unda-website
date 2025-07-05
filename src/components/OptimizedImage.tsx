
// components/OptimizedImage.tsx - FIXED VERSION

'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  className?: string;
  sizes?: string;
  isCritical?: boolean;
  unoptimized?: boolean;
}

// 🚀 Connection-aware quality (เก็บคุณภาพสูง แต่ปรับตามเน็ต)
const getSmartQuality = (baseQuality: number = 100) => {
  if (typeof window === 'undefined') return baseQuality;
  
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return baseQuality;
  
  const { effectiveType } = connection;
  
  // เน็ตเร็ว = คุณภาพเต็ม, เน็ตช้า = ลดนิดหน่อย
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return Math.max(baseQuality - 20, 80);
  } else if (effectiveType === '3g') {
    return Math.max(baseQuality - 10, 90);
  }
  
  return baseQuality;
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 100,
  className,
  sizes,
  isCritical = false,
  unoptimized = false
}: OptimizedImageProps) {
  const [isInView, setIsInView] = useState(isCritical); // Critical images โหลดทันที
  const imgRef = useRef<HTMLImageElement>(null);

  // 🚀 Intersection Observer for lazy loading (ไม่ใช่ critical)
  useEffect(() => {
    if (isCritical) return; // Critical images ไม่ต้อง lazy load

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [isCritical]);

  // 🎯 Smart Priority Loading
  const shouldUsePriority = () => {
    return isCritical && priority;
  };

  // 🚀 Preload critical images
  useEffect(() => {
    if (!isCritical || typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [src, isCritical]);

  // 🎯 Smart Quality
  const finalQuality = getSmartQuality(quality);

  // 🚀 Smart Sizes
  const getOptimalSizes = () => {
    if (sizes) return sizes;
    return '(max-width: 480px) 300px, (max-width: 768px) 600px, (max-width: 1200px) 800px, 1200px';
  };

  return (
    <>
      {/* 🚀 Image - โหลดเมื่อเข้า viewport หรือเป็น critical */}
      {isInView && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={shouldUsePriority()}
          quality={finalQuality}
          sizes={getOptimalSizes()}
          className={className}
          loading={shouldUsePriority() ? 'eager' : 'lazy'}
          fetchPriority={isCritical ? 'high' : 'auto'}
          unoptimized={unoptimized}
        />
      )}
    </>
  );
}

// 🚀 Hero Image Component - ไม่มี wrapper div
export function HeroImage({ 
  className,
  quality = 100,
  ...props 
}: Omit<OptimizedImageProps, 'isCritical'>) {
  return (
    <OptimizedImage
      {...props}
      isCritical={true}
      priority={true}
      quality={quality}
      className={className}
    />
  );
}

// 🎯 Album Cover Component
export function AlbumCover({ 
  className,
  quality = 100,
  ...props 
}: Omit<OptimizedImageProps, 'isCritical'>) {
  return (
    <OptimizedImage
      {...props}
      isCritical={false}
      priority={false}
      quality={quality}
      className={className}
    />
  );
}

// 🚀 Product Image Component - มี placeholder แค่ตัวนี้
export function ProductImage({ 
  className,
  quality = 95,
  ...props 
}: Omit<OptimizedImageProps, 'isCritical'>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className || ''}`}>
      {/* Simple placeholder สำหรับ product images เท่านั้น */}
      {!isLoaded && isInView && (
        <div 
          className="absolute inset-0 bg-[#160000]/20 animate-pulse"
          style={{ width: props.width, height: props.height }}
        />
      )}
      
      {isInView && (
        <Image
          {...props}
          quality={quality}
          loading="lazy"
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className || ''}`}
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
        />
      )}
    </div>
  );
}