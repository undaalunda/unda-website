/* ProductPageContent.tsx */

'use client';

import { allItems } from '@/components/allItems';
import type { Product } from '@/components/allItems';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import CartErrorPopup from '@/components/CartErrorPopup';
import AppClientWrapper from '@/components/AppClientWrapper';

function isBundle(price: number | { original: number; sale: number }): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

function getStockStatus(product: Product): 'in-stock' | 'out-of-stock' | 'pre-order' | null {
  if (['Music', 'Merch', 'Bundles'].includes(product.category)) {
    if (product.id === 'signed-keychain') return 'out-of-stock';
    return 'in-stock';
  }
  return null;
}

type ProductPageContentProps = {
  slug: string;
};

export default function ProductPageContent({ slug }: ProductPageContentProps) {
  const product = allItems.find((item) => item.id === slug) as Product | undefined;

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      const pool = product.category === 'Backing Track'
        ? allItems.filter((item) => item.id !== product.id && item.category === 'Backing Track')
        : allItems.filter((item) => item.id !== product.id && ['Music', 'Merch', 'Bundles'].includes(item.category));
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
      setRelatedProducts(shuffled);
    }
  }, [product?.id]);

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

  const stockStatus = getStockStatus(product);

  return (
    <AppClientWrapper>
      <div className="min-h-screen flex flex-col items-center justify-start text-[#f8fcdc] font-[Cinzel] px-4 md:px-6 pt-32 pb-24">
        <div className="w-full max-w-5xl mb-10 text-sm text-[#f8fcdc]/70">
          <Link href="/" className="hover:text-[#dc9e63]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#dc9e63]">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-[#dc9e63]">{product.title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="sticky top-32 self-start w-full max-w-[500px]">
              <div className="relative aspect-square w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="product-title-detail capitalize">{product.title}</h1>
            <p className="product-subtitle-detail capitalize" style={{ color: '#f8fcdc' }}>{product.subtitle}</p>

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
              <div className="product-quantity-wrapper mt-2">
                <label className="text-sm font-medium mb-1">Quantity:</label>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-7 h-7 border border-[#dc9e63]/50 border-[0.5px] rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer">-</button>
                  <span className="text-[13px] md:text-sm font-light">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="w-7 h-7 border border-[#dc9e63]/50 border-[0.5px] rounded-[2px] text-sm font-light flex items-center justify-center cursor-pointer">+</button>
                </div>
              </div>
            )}

            {stockStatus && (
              <div className="mt-1 text-xs font-light tracking-wide">
                {stockStatus === 'in-stock' && <span className="text-green-300/70 italic">IN STOCK</span>}
                {stockStatus === 'out-of-stock' && <span className="text-red-400/70 italic">OUT OF STOCK</span>}
                {stockStatus === 'pre-order' && <span className="text-yellow-300/70 italic">PRE-ORDER</span>}
              </div>
            )}

            {product.description && (
              <div className="product-description mt-6 text-[#f8fcdc]/80 leading-relaxed text-sm whitespace-pre-line">
                {product.description.split('\n').map((line, idx) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine === '') return <div key={idx} className="h-4" />;
                  if (trimmedLine.startsWith('Please Note:')) return <p key={idx} className="italic text-[#f8fcdc]/50 mt-4">{line}</p>;
                  return <p key={idx}>{line}</p>;
                })}
              </div>
            )}

            <div className="relative mt-6">
              {errorMessage && <CartErrorPopup message={errorMessage} />}
              <button
                className="add-to-cart-button cursor-pointer"
                disabled={stockStatus === 'out-of-stock'}
                onClick={() => {
                  const qty = product.type === 'digital' ? 1 : quantity;
                  if (qty > 20) {
                    setErrorMessage('You can only add up to 20 items per purchase.');
                    return;
                  }
                  addToCart(product.id, qty);
                  setErrorMessage(null);
                }}
              >
                {stockStatus === 'out-of-stock' ? 'Unavailable' : `Add ${quantity} to Cart`}
              </button>
            </div>

            <Link href="/shop" className="back-to-shop-link mt-4 cursor-pointer">← Back to Shop</Link>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-wrapper mt-20 w-full max-w-5xl">
            <h2 className="text-2xl font-bold text-[#dc9e63] mb-8">RELATED PRODUCTS</h2>
            <div className="stems-row grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  href={`/product/${item.id}`}
                  key={item.id}
                  className={`stems-item ${item.category === 'Backing Track' ? 'is-backing' : ''}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="stems-image"
                  />
                  <div className="stems-label-group mt-2">
                    <p className="stems-title-text capitalize">{item.title}</p>
                    <p className="stems-subtitle capitalize">
                      {item.subtitle.replace(/BACKING TRACK/gi, '').trim()}
                    </p>
                    {item.category === 'Backing Track' && (
                      <>
                        <span className="backing-line" />
                        <p className="stems-subtitle-tiny">BACKING TRACK</p>
                      </>
                    )}
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
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppClientWrapper>
  );
}