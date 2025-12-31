// src/components/OptimizedImage.tsx - FIXED VERSION

'use client';

import Image, { ImageProps } from 'next/image';

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
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onLoad?: () => void;
  style?: React.CSSProperties;
  fill?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  quality = 100,
  priority = false,
  isCritical = false,
  loading,
  fetchPriority,
  ...rest
}: OptimizedImageProps) {
  return (
    <Image
      {...rest}
      quality={quality}
      priority={priority || isCritical}
      loading={loading || (priority || isCritical ? 'eager' : 'lazy')}
      // ไม่ส่ง fetchPriority ไปเพื่อหลีกเลี่ยง error
    />
  );
}

export function HeroImage({ 
  quality = 100, 
  ...props 
}: Omit<OptimizedImageProps, 'isCritical'>) {
  return (
    <Image 
      {...props} 
      priority 
      quality={quality} 
      loading="eager" 
    />
  );
}

export function AlbumCover({ 
  quality = 100, 
  ...props 
}: Omit<OptimizedImageProps, 'isCritical'>) {
  return (
    <Image 
      {...props} 
      priority 
      quality={quality} 
      loading="eager" 
    />
  );
}

export function ProductImage({ 
  quality = 100, 
  className,
  ...props 
}: Omit<OptimizedImageProps, 'isCritical'>) {
  return (
    <Image 
      {...props} 
      quality={quality} 
      loading="lazy"
      className={className}
    />
  );
}