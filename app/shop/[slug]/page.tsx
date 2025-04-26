'use client';

import { useParams } from 'next/navigation';
import { allItems } from '@/components/allItems';
import type { Product } from '@/components/allItems';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function isBundle(
  price: string | { original: string; sale: string }
): price is { original: string; sale: string } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = allItems.find((item) => item.id === slug) as Product | undefined;

  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      let relatedPool: Product[] = [];

      if (product.category === 'Backing Track') {
        relatedPool = allItems.filter(
          (item) =>
            item.id !== product.id &&
            item.category === 'Backing Track'
        );
      } else {
        relatedPool = allItems.filter(
          (item) =>
            item.id !== product.id &&
            ['Music', 'Merch', 'Bundles'].includes(item.category)
        );
      }

      const shuffled = [...relatedPool].sort(() => Math.random() - 0.5).slice(0, 8);
      setRelatedProducts(shuffled);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center text-[#f8fcdc] font-[Cinzel] p-6">
        <h1 className="text-4xl font-bold mb-4 text-[#cc3f33]">404 - Product Not Found</h1>
        <Link href="/shop" className="text-[#dc9e63] hover:text-[#f8fcdc] no-underline">
          ← กลับไปหน้า Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-[#f8fcdc] font-[Cinzel] px-4 md:px-6 pt-32 pb-24">
      {/* Breadcrumb */}
      <div className="w-full max-w-5xl mb-10 text-sm text-[#f8fcdc]/70">
        <Link href="/" className="hover:text-[#dc9e63] no-underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-[#dc9e63] no-underline">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-[#dc9e63]">{product.title}</span>
      </div>

      {/* Product Detail */}
      <div className="product-detail-wrapper">
        <div className="product-detail-image">
          <Image
            src={product.image}
            alt={product.title}
            width={600}
            height={600}
          />
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.title}</h1>
          <p className="product-detail-subtitle">{product.subtitle}</p>

          <div className="product-price">
            {isBundle(product.price) ? (
              <>
                <span className="line-through text-[#f8fcdc]/40 mr-2">{product.price.original}</span>
                <span>{product.price.sale}</span>
              </>
            ) : (
              <span>{product.price}</span>
            )}
          </div>

          <div className="product-quantity-wrapper">
            <label className="text-sm font-medium text-[#f8fcdc]">Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="product-quantity-input"
            />
          </div>

          <button className="add-to-cart-button">
            Add {quantity} to Cart
          </button>

          <Link href="/shop" className="back-to-shop-link">
            ← Back to Shop
          </Link>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-wrapper">
          <h2 className="related-products-title">RELATED PRODUCTS</h2>
          <div className="stems-row">
            {relatedProducts.map((item) => {
              const isBackingTrack = item.category === 'Backing Track';
              return (
                <Link
                  href={`/shop/${item.id}`}
                  key={item.id}
                  className={`stems-item ${isBackingTrack ? 'is-backing' : ''}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="stems-image"
                  />
                  <div className="stems-label-group">
                    <p className="stems-title-text">{item.title}</p>
                    <p className="stems-subtitle">
                      {isBackingTrack
                        ? item.subtitle.replace(/BACKING TRACK/gi, '').trim()
                        : item.subtitle}
                    </p>

                    {isBackingTrack && (
                      <>
                        <span className="backing-line" />
                        <p className="stems-subtitle-tiny">BACKING TRACK</p>
                      </>
                    )}

                    <p className="stems-price">
                      {isBundle(item.price) ? (
                        <>
                          <span className="line-through text-[#f8fcdc] mr-2">{item.price.original}</span>
                          {item.price.sale}
                        </>
                      ) : (
                        item.price
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}