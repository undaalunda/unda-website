/* ProductPageContent.tsx - Fixed Related Products Display */

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

function isBundle(price: number | { original: number; sale: number }): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

function getStockStatus(product: Product): 'in-stock' | 'out-of-stock' | 'pre-order' | 'coming-soon' | null {
  if (product.type === 'physical') return 'coming-soon';
  return 'in-stock';
}

// 🎯 Enhanced function to check if product is a Tab
function isTabProduct(item: Product): boolean {
  return (
    item.category.toLowerCase().includes('tab') ||
    item.title.toLowerCase().includes('tab') ||
    item.subtitle.toLowerCase().includes('tab')
  );
}

// 🚀 Navigation Context Interface (simplified for related products only)
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
};

export default function ProductPageContent({ product }: ProductPageContentProps) {
  const { addToCart, removeFromCart, cartItems, setLastActionItem } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const isAlreadyInCart = cartItems.some((item) => item.id === product.id);
  const stockStatus = getStockStatus(product);
  const router = useRouter();

  // 🚀 Navigation Context for Related Products
  const [navigationContext, setNavigationContext] = useState<NavigationContext | null>(null);

  // 🚀 Load Navigation Context from Session Storage (for related products)
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
            // Exclude Solo Collection items
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

  // 🚀 Enhanced Browser Back Button Handler (cleanup session storage)
  useEffect(() => {
    const handlePopState = () => {
      // If user uses browser back, preserve context for the return page
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

  // 🚀 Handle Related Product Click
  const handleRelatedProductClick = (item: Product, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Preserve context for related products
    if (navigationContext) {
      sessionStorage.setItem('navigationContext', JSON.stringify(navigationContext));
    }
    
    router.push(`/product/${item.id}`);
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
        {/* Container for all content */}
        <div className="w-full max-w-5xl pb-24">
          
          {/* 🚀 Clean Breadcrumb - Fixed positioning */}
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
          <div className="flex flex-col max-[927px]:flex-col md:flex-row 
                        gap-4 md:gap-6 xl:gap-8 mb-20">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="sticky top-32 self-start w-full 
                            max-w-[500px] max-[1280px]:max-w-[400px]">
                <div className="relative aspect-square w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1280px) 400px, 500px"
                    className="object-contain"
                    priority
                    quality={90}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
              <h1 className="product-title-detail capitalize whitespace-nowrap overflow-hidden text-ellipsis">{product.title}</h1>
              <p className="product-subtitle-detail capitalize whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#f8fcdc' }}>{product.subtitle}</p>

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

              {product.type === 'physical' && (
                <>
                  <div className="product-quantity-wrapper mt-2">
                    <label className="text-sm font-medium mb-1">Quantity:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-7 h-7 border border-[#dc9e63]/50 rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer">-</button>
                      <span className="text-[13px] md:text-sm font-light">{quantity}</span>
                      <button onClick={() => setQuantity((q) => q + 1)} className="w-7 h-7 border border-[#dc9e63]/50 rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer">+</button>
                    </div>
                  </div>

                  <div className="mt-1 text-xs font-light tracking-wide">
                    <span className="text-orange-300/80 italic">COMING SOON</span>
                  </div>
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
                            <a
                              href="/terms-and-conditions"
                              className="text-s text-[#dc9e63] hover:text-[#f8fcdc] cursor-pointer no-underline transition-colors duration-300"
                            >
                              Terms & Conditions
                            </a>
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

                {product.type === 'physical' ? (
                  <button
                    disabled
                    className="add-to-cart-button cursor-not-allowed opacity-50 bg-[#888] text-white max-[927px]:text-sm max-[696px]:text-xs max-[696px]:py-2 max-[696px]:px-4"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    className={`add-to-cart-button max-[927px]:text-sm max-[696px]:text-xs max-[696px]:py-2 max-[696px]:px-4 ${
                      isAlreadyInCart
                        ? 'bg-green-700/80 text-[#f8fcdc] cursor-pointer'
                        : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      const cartActionItem: LastActionItem = {
                        item: {
                          id: product.id,
                          title: product.title,
                          subtitle: product.subtitle ?? '',
                          price: product.price,
                          image: product.image,
                          quantity: 1,
                          type: product.type,
                          weight: product.weight ?? 0,
                        },
                        action: isAlreadyInCart ? 'remove' : 'add',
                      };

                      setLastActionItem(null);

                      setTimeout(() => {
                        if (isAlreadyInCart) {
                          removeFromCart(product.id);
                        } else {
                          addToCart(product.id, 1);
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

          {/* 🚀 Related Products - Fixed to exclude Solo Collection */}
          {relatedProducts.length > 0 && (
            <div className="related-products-wrapper w-full">
              <h2 className="text-2xl font-bold text-[#dc9e63] mb-8">RELATED PRODUCTS</h2>
              <div className="stems-row grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((item) => {
                  // 🎯 Separate logic for physical vs digital products
                  if (item.type === 'physical') {
                    // 🎁 Physical product display - simple and clean (NO badge)
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => handleRelatedProductClick(item, e)}
                        className="stems-item cursor-pointer"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={200}
                          height={200}
                          className="stems-image"
                          loading="lazy"
                          quality={85}
                          sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 200px"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                        <div className="stems-label-group">
                          <p className="stems-title-text text-[#d37142]">{item.title}</p>
                          <p className="stems-subtitle-tiny">{item.subtitle}</p>
                          <p className="stems-price">
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
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    // 🎵 Digital product display - with animations and special formatting
                    const isTab = isTabProduct(item);
                    const isBackingTrack = item.category === 'Backing Track';

                    return (
                      <div
                        key={item.id}
                        onClick={(e) => handleRelatedProductClick(item, e)}
                        className={`stems-item cursor-pointer ${isTab || isBackingTrack ? 'is-backing' : ''}`}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={200}
                          height={200}
                          className="stems-image"
                          loading="lazy"
                          quality={85}
                          sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 200px"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
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
    </AppClientWrapper>
  );
}