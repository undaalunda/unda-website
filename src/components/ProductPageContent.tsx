/* ProductPageContent.tsx - Enhanced Bundle Support with Multi-Size Selection */

'use client';

import { allItems } from '@/components/allItems';
import React from 'react';
import type { LastActionItem } from '@/context/CartContext';
import type { Product } from '@/components/allItems';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import CartErrorPopup from '@/components/CartErrorPopup';
import AppClientWrapper from '@/components/AppClientWrapper';
import ProductSchema from '@/components/ProductSchema';
import SizeSelector from '@/components/SizeSelector';
import BundleSizeSelector from '../components/BundleSizeSelector';
import SizeChartModal from '../components/SizeChartModal';

function isBundle(price: number | { original: number; sale: number }): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

function getStockStatus(product: Product): 'in-stock' | 'out-of-stock' | 'pre-order' | 'coming-soon' | null {
  if (product.type === 'physical') return 'coming-soon';
  return 'in-stock';
}

function isTabProduct(item: Product): boolean {
  return (
    item.category.toLowerCase().includes('tab') ||
    item.title.toLowerCase().includes('tab') ||
    item.subtitle.toLowerCase().includes('tab')
  );
}

interface NavigationContext {
  from: 'album' | 'solo-collection' | 'physical';
  album?: string;
  filter?: string;
  instrument?: string;
  tab?: string;
  albumTitle?: string;
  returnUrl: string;
}

type ProductPageContentProps = {
  product: Product;
  initialStock?: number | null;  // ← เพิ่ม
};

export default function ProductPageContent({ 
  product,
  initialStock = null  // ← เพิ่ม
}: ProductPageContentProps) {
  const { addToCart, removeFromCart, cartItems, setLastActionItem } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // 🎽 Bundle size state - for multiple t-shirts
  const [bundleSizes, setBundleSizes] = useState<{ [productId: string]: string }>({});

  // 📐 Size chart modal state
  const [showSizeChart, setShowSizeChart] = useState(false);

  // 📦 Stock state - ใช้ initialStock จาก Server
  const [currentStock, setCurrentStock] = useState<number | null>(initialStock);
  const [stockLoading, setStockLoading] = useState(false);
  
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const isAlreadyInCart = cartItems.some((item) => item.id === product.id);
  const stockStatus = getStockStatus(product);
  const router = useRouter();
  const [navigationContext, setNavigationContext] = useState<NavigationContext | null>(null);

  // Check if product is a bundle
  const isProductBundle = product.category === 'Bundles';
  const hasBundleSizeOptions = product.sizeOptions && Object.keys(product.sizeOptions).length > 0;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('navigationContext');
      if (stored) {
        try {
          const context: NavigationContext = JSON.parse(stored);
          setNavigationContext(context);
        } catch (error) {
          console.warn('Failed to parse navigation context:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (product) {
      const pool = product.type === 'digital'
        ? allItems.filter((item) => {
            const isSoloCollectionItem = 
              item.tags?.includes('contest') || 
              item.id.includes('abasi') || 
              item.id.includes('mayones') || 
              item.id.includes('vola');
            
            return item.id !== product.id &&
                   item.category === product.category &&
                   item.type === 'digital' &&
                   !isSoloCollectionItem;
          })
        : allItems.filter((item) =>
            item.id !== product.id &&
            ['Music', 'Merch', 'Bundles'].includes(item.category)
          );
          
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
        setRelatedProducts(shuffled);
      }
    }, [product?.id]);

  // ❌ ลบ useEffect เช็ค Stock ออกทั้งหมด! (เพราะโหลดจาก Server แล้ว)

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const context = sessionStorage.getItem('navigationContext');
        if (context) {
          try {
            const parsedContext = JSON.parse(context);
            const returnContext = {
              filter: parsedContext.filter,
              instrument: parsedContext.instrument,
              tab: parsedContext.tab
            };
            sessionStorage.setItem('returnContext', JSON.stringify(returnContext));
            sessionStorage.removeItem('navigationContext');
          } catch (error) {
            console.warn('Failed to handle browser back context:', error);
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  const handleRelatedProductClick = (item: Product, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (navigationContext) {
      sessionStorage.setItem('navigationContext', JSON.stringify(navigationContext));
    }
    
    router.push(`/product/${item.id}`);
  };

  // 🎽 Handle bundle size change
  const handleBundleSizeChange = (productId: string, size: string) => {
    setBundleSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  // 🎽 Validate bundle sizes before adding to cart
  const validateBundleSizes = (): boolean => {
    if (!hasBundleSizeOptions) return true;
    
    const requiredProducts = Object.keys(product.sizeOptions!);
    const missingSelections: string[] = [];

    requiredProducts.forEach(productId => {
      if (!bundleSizes[productId]) {
        missingSelections.push(productId);
      }
    });

    if (missingSelections.length > 0) {
      setErrorMessage(
        missingSelections.length === 1 
          ? 'Please select a size for the t-shirt'
          : `Please select sizes for all ${missingSelections.length} t-shirts`
      );
      setTimeout(() => setErrorMessage(null), 3000);
      return false;
    }

    return true;
  };

  if (!product) {
    return (
      <AppClientWrapper>
        <div className="min-h-screen flex flex-col justify-center items-center text-center text-[#f8fcdc] font-[Cinzel] p-6">
          <h1 className="text-4xl font-bold mb-4 text-[#cc3f33]">404 - Product Not Found</h1>
          <Link href="/shop" className="text-[#dc9e63] hover:text-[#f8fcdc] no-underline">← Back to Shop</Link>
        </div>
      </AppClientWrapper>
    );
  }

  return (
    <AppClientWrapper>
      <ProductSchema
        name={`${product.title} – ${product.subtitle}`}
        image={`https://undaalunda.com${product.image}`}
        description={product.description || ''}
        price={typeof product.price === 'object' ? product.price.sale : product.price}
        url={`https://undaalunda.com${product.url}`}
      />

      <div className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 md:px-6 pt-32">
        <div className="w-full max-w-5xl pb-24">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm text-[#f8fcdc]/70 max-[1280px]:text-center min-[1280px]:text-left">
            <Link href="/" className="hover:text-[#dc9e63] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-[#dc9e63] transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            {product.type === 'physical' ? (
              <Link href="/shop/physical" className="hover:text-[#dc9e63] transition-colors">Physical</Link>
            ) : (
              <Link href="/shop/digital" className="hover:text-[#dc9e63] transition-colors">Digital</Link>
            )}
            <span className="mx-2">/</span>
            <span className="text-[#dc9e63]">{product.title}</span>
          </div>

          {/* Product Main Content */}
          <div className="flex flex-col max-[927px]:flex-col md:flex-row gap-4 md:gap-6 xl:gap-8 mb-20">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="sticky top-32 self-start w-full max-w-[500px] max-[1280px]:max-w-[400px]">
                <div className={`relative aspect-square w-full ${product.tags?.includes('keychain') ? 'keychain-glow' : ''}`}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1280px) 400px, 500px"
                    className="object-contain"
                    priority
                    quality={100}
                    unoptimized={true}
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
              <h1 className="product-title-detail capitalize whitespace-nowrap overflow-hidden text-ellipsis">{product.title}</h1>
              <p className="product-subtitle-detail capitalize whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#f8fcdc' }}>{product.subtitle}</p>

              {!product.comingSoon && (
                <div className="product-price-detail">
                  {isBundle(product.price) ? (
                    <>
                      <span className="line-through text-[#f8fcdc]/40 mr-2">${product.price.original.toFixed(2)}</span>
                      <span>${product.price.sale.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="tracking-[0.15em]">${(product.price as number).toFixed(2)}</span>
                  )}
                </div>
              )}

              {product.type === 'physical' && (
                <>
                  {/* 🎽 Bundle Size Selector - for bundles with multiple t-shirts */}
                  {isProductBundle && hasBundleSizeOptions ? (
                    <BundleSizeSelector
                      sizeOptions={product.sizeOptions!}
                      selectedSizes={bundleSizes}
                      onSizeChange={handleBundleSizeChange}
                    />
                  ) : (
                    /* Regular Size Selector - for single products */
                    product.sizes && product.sizes.length > 0 && (
                      <div className="mt-4">
                        {/* SIZE CHART LINK */}
                        {product.sizeChartImage && (
                          <button
                            onClick={() => setShowSizeChart(true)}
                            className="text-[10px] text-[#f8fcdc]/60 hover:text-[#dc9e63] mb-2 transition-colors uppercase tracking-wider block cursor-pointer"
                          >
                            SIZE CHART &gt;
                          </button>
                        )}
                        
                        <SizeSelector
                          sizes={product.sizes}
                          selectedSize={selectedSize}
                          onSizeChange={setSelectedSize}
                        />
                      </div>
                    )
                  )}

                  <div className="product-quantity-wrapper mt-2">
                    <label className="text-sm font-medium mb-1">Quantity:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-7 h-7 border border-[#dc9e63]/50 rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer">-</button>
                      <span className="text-[13px] md:text-sm font-light">{quantity}</span>
                      <button onClick={() => setQuantity((q) => q + 1)} className="w-7 h-7 border border-[#dc9e63]/50 rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer">+</button>
                    </div>
                  </div>

                  {product.soldOut || (currentStock !== null && currentStock === 0) ? (
                    <div className="mt-1 text-xs font-light tracking-wide">
                      <span className="text-red-400/80 italic">SOLD OUT</span>
                    </div>
                  ) : currentStock !== null && currentStock > 0 ? (
                    <div className="mt-1 text-xs font-light tracking-wide">
                      <span className="text-green-400/80 italic">IN STOCK</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs font-light tracking-wide">
                      <span className="text-orange-400/80 italic">PRE-ORDER (30 DAYS)</span>
                    </div>
                  )}
                </>
              )}

              {product.description && (
                <div className="product-description mt-6 text-[#f8fcdc]/80 leading-relaxed text-sm whitespace-pre-line">
                  {product.description.split('\n').map((line, idx) => {
                    let trimmed = line.trim();

                    if (trimmed === '') return <div key={idx} className="h-4" />;

                    if (product.type === 'physical') {
                      if (trimmed.startsWith('Please Note:')) {
                        return (
                          <p key={idx} className="italic text-[#f8fcdc]/50 mt-4">
                            {line}
                          </p>
                        );
                      }
                      
                      // 💰 Highlight savings
                      if (trimmed.includes('💰 Save')) {
                        return (
                          <p key={idx} className="text-[#4ade80] font-semibold mt-2">
                            {line}
                          </p>
                        );
                      }
                      
                      // 🎽 Highlight t-shirt note
                      if (trimmed.includes('Note:') && trimmed.includes('t-shirt')) {
                        return (
                          <p key={idx} className="text-[#fbbf24] italic mt-2">
                            {line}
                          </p>
                        );
                      }
                      
                      return <p key={idx}>{line}</p>;
                    }

                    if (trimmed === 'For personal use only.') {
                      return (
                        <p key={idx}>
                          <em>For personal use only.</em>
                        </p>
                      );
                    }

                    if (trimmed.includes('Terms & Conditions')) {
                      const parts = trimmed.split('Terms & Conditions');
                      return (
                        <p key={idx}>
                          <em>
                            {parts[0]}
                            <Link
                              href="/terms-and-conditions"
                              className="text-s text-[#dc9e63] hover:text-[#f8fcdc] cursor-pointer no-underline transition-colors duration-300"
                            >
                              Terms & Conditions
                            </Link>
                            {parts[1]}
                          </em>
                        </p>
                      );
                    }

                    if (trimmed.startsWith('Copyright')) {
                      return (
                        <p key={idx} className="text-xs text-[#f8fcdc]/70 mt-2">
                          <strong>{trimmed}</strong>
                        </p>
                      );
                    }

                    const instruments = ['drums', 'guitars', 'bass', 'keys', 'lead guitar'];
                    instruments.forEach((inst) => {
                      const regex = new RegExp(`\\b${inst}\\b`, 'gi');
                      trimmed = trimmed.replace(regex, inst.toUpperCase());
                    });

                    const parts: Array<string | React.ReactNode> = [];
                    const boldRegex = /\*\*(.+?)\*\*/g;
                    let lastIndex = 0;
                    let match;

                    while ((match = boldRegex.exec(trimmed)) !== null) {
                      const start = match.index;
                      const end = boldRegex.lastIndex;
                      if (start > lastIndex) {
                        parts.push(trimmed.slice(lastIndex, start));
                      }

                      const boldText = match[1];
                      parts.push(
                        boldText.toLowerCase().includes('full-length') ? (
                          boldText
                        ) : (
                          <strong key={parts.length} className="text-[#f8fcdc]">
                            {boldText}
                          </strong>
                        )
                      );

                      lastIndex = end;
                    }

                    if (parts.length > 0) {
                      if (lastIndex < trimmed.length) {
                        parts.push(trimmed.slice(lastIndex));
                      }
                      return <p key={idx}>{parts}</p>;
                    }

                    return <p key={idx}>{trimmed}</p>;
                  })}
                </div>
              )}

              <div className="relative mt-6 max-[927px]:mt-4 max-[696px]:mt-3">
                {errorMessage && <CartErrorPopup message={errorMessage} />}

                {product.soldOut || (currentStock !== null && currentStock === 0) ? (
                  <button
                    disabled
                    className="add-to-cart-button cursor-not-allowed opacity-50 bg-red-900/60 text-white max-[927px]:text-sm max-[696px]:text-xs max-[696px]:py-2 max-[696px]:px-4"
                  >
                    SOLD OUT
                  </button>
                ) : product.comingSoon ? (
                  <button
                    disabled
                    className="add-to-cart-button cursor-not-allowed opacity-70 bg-orange-600/50 text-white max-[927px]:text-sm max-[696px]:text-xs max-[696px]:py-2 max-[696px]:px-4"
                  >
                    Available Dec 31
                  </button>
                ) : (
                  <button
                    className={`add-to-cart-button max-[927px]:text-sm max-[696px]:text-xs max-[696px]:py-2 max-[696px]:px-4 ${
                      isAlreadyInCart
                        ? 'bg-green-700/80 text-[#f8fcdc] cursor-pointer'
                        : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      // 🎽 Bundle validation
                      if (isProductBundle && hasBundleSizeOptions) {
                        if (!validateBundleSizes()) {
                          return;
                        }
                      } else if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                        // Regular single product validation
                        setErrorMessage('Please select a size');
                        setTimeout(() => setErrorMessage(null), 3000);
                        return;
                      }

                      // Prepare size info for cart
                      const sizeInfo = isProductBundle && hasBundleSizeOptions
                        ? Object.entries(bundleSizes)
                            .map(([productId, size]) => {
                              let itemName = productId;
                              
                              if (productId.includes('dark-wonderful-world-t-shirt')) {
                                itemName = 'DWW T-Shirt';
                              } else if (productId.includes('consonance-t-shirt')) {
                                itemName = 'Consonance T-Shirt';
                              }
                              
                              return `${itemName}: ${size}`;
                            })
                            .join(', ')
                        : selectedSize;

                      const cartActionItem: LastActionItem = {
                        item: {
                          id: product.id,
                          title: product.title,
                          subtitle: sizeInfo 
                            ? `${product.subtitle ?? ''} - Size ${sizeInfo}`
                            : (product.subtitle ?? ''),
                          price: product.price,
                          image: product.image,
                          quantity: 1,
                          type: product.type,
                          weight: product.weight ?? 0,
                          size: sizeInfo ?? undefined,
                        },
                        action: isAlreadyInCart ? 'remove' : 'add',
                      };

                      setLastActionItem(null);

                      setTimeout(() => {
                        if (isAlreadyInCart) {
                          removeFromCart(product.id);
                        } else {
                          addToCart(product.id, 1, sizeInfo ?? undefined);
                          setErrorMessage(null);
                        }
                        setLastActionItem(cartActionItem);
                      }, 10);
                    }}
                  >
                    {isAlreadyInCart ? '✔ Added to Cart' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products-wrapper w-full">
              <h2 className="text-2xl font-bold text-[#dc9e63] mb-8">RELATED PRODUCTS</h2>
              <div className="stems-row grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((item) => {
                  if (item.type === 'physical') {
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => handleRelatedProductClick(item, e)}
                        className={`stems-item cursor-pointer ${item.tags?.includes('keychain') ? 'keychain-glow' : ''}`}
                      >
                        <div className="relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={200}
                            height={200}
                            className="stems-image"
                            loading="lazy"
                            quality={95}
                            sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 200px"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          />
                          {item.soldOut && (
                            <div className="absolute top-2 right-2 bg-red-900/40 text-white text-xs px-2 py-1 rounded-md font-semibold border border-red-800/50">
                              SOLD OUT
                            </div>
                          )}
                          {item.comingSoon && !item.soldOut && (
                            <div className="absolute top-2 right-2 bg-orange-600/50 text-white text-xs px-2 py-1 rounded-md font-semibold border border-orange-600/80">
                              Available Dec 31
                            </div>
                          )}
                        </div>
                        <div className="stems-label-group">
                          <p className="stems-title-text text-[#d37142]">{item.title}</p>
                          <p className="stems-subtitle-tiny">{item.subtitle}</p>
                          <p className="stems-price">
                            {item.comingSoon ? (
                              <span className="invisible">
                                {isBundle(item.price) ? (
                                  <>
                                    <span className="line-through text-[#f8fcdc] mr-1">
                                      ${item.price.original.toFixed(2)}
                                    </span>
                                    <span>${item.price.sale.toFixed(2)}</span>
                                  </>
                                ) : (
                                  <span>${(item.price as number).toFixed(2)}</span>
                                )}
                              </span>
                            ) : isBundle(item.price) ? (
                              <>
                                <span className="line-through text-[#f8fcdc] mr-1">
                                  ${item.price.original.toFixed(2)}
                                </span>
                                <span>${item.price.sale.toFixed(2)}</span>
                              </>
                            ) : (
                              <span>${(item.price as number).toFixed(2)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    const isTab = isTabProduct(item);
                    const isBackingTrack = item.category === 'Backing Track';

                    return (
                      <div
                        key={item.id}
                        onClick={(e) => handleRelatedProductClick(item, e)}
                        className={`stems-item cursor-pointer ${isTab || isBackingTrack ? 'is-backing' : ''}`}
                      >
                        <div className="relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={200}
                            height={200}
                            className="stems-image"
                            loading="lazy"
                            quality={95}
                            sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 200px"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          />
                          {item.soldOut && (
                            <div className="absolute top-2 right-2 bg-red-900/40 text-white text-xs px-2 py-1 rounded-md font-semibold border border-red-800/50">
                              SOLD OUT
                            </div>
                          )}
                          {item.comingSoon && !item.soldOut && (
                            <div className="absolute top-2 right-2 bg-orange-600/50 text-white text-xs px-2 py-1 rounded-md font-semibold border border-orange-600/80">
                              Available Dec 31
                            </div>
                          )}
                        </div>
                        <div className="stems-label-group mt-2">
                          <p className="stems-title-text">
                            {(item as any).song?.toUpperCase() || item.title}
                          </p>
                          <p className="stems-subtitle">
                            {isBackingTrack
                              ? item.subtitle.replace(/BACKING TRACK/gi, '').trim()
                              : ((item as any).instrument?.toUpperCase() || item.subtitle)}
                          </p>
                          <span className="backing-line" />
                          <p className="stems-subtitle-tiny">
                            {isBackingTrack ? 'BACKING TRACK' : isTab ? 'TABS' : 'STEM'}
                          </p>
                          <p className="stems-price">
                            {item.comingSoon ? (
                              <span className="invisible">
                                {isBundle(item.price) ? (
                                  <>
                                    <span className="line-through text-[#f8fcdc] mr-1">
                                      ${item.price.original.toFixed(2)}
                                    </span>
                                    <span>${item.price.sale.toFixed(2)}</span>
                                  </>
                                ) : (
                                  <span>${(item.price as number).toFixed(2)}</span>
                                )}
                              </span>
                            ) : isBundle(item.price) ? (
                              <>
                                <span className="line-through text-[#f8fcdc] mr-1">
                                  ${item.price.original.toFixed(2)}
                                </span>
                                <span>${item.price.sale.toFixed(2)}</span>
                              </>
                            ) : (
                              <span>${(item.price as number).toFixed(2)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Size Chart Modal */}
      {product.sizeChartImage && (
        <SizeChartModal
          sizeChartImage={product.sizeChartImage}
          isOpen={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          productTitle={product.title}
        />
      )}
    </AppClientWrapper>
  );
}