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

// สร้างฟังก์ชันดึง Stock Status
function getStockStatus(product: Product): 'in-stock' | 'out-of-stock' | 'pre-order' | null {
  if (['Music', 'Merch', 'Bundles'].includes(product.category)) {
    if (product.id === 'signed-keychain') return 'out-of-stock';
    // เพิ่ม logic pre-order ในอนาคตได้ตรงนี้
    return 'in-stock';
  }
  return null;
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
          (item) => item.id !== product.id && item.category === 'Backing Track'
        );
      } else {
        relatedPool = allItems.filter(
          (item) => item.id !== product.id && ['Music', 'Merch', 'Bundles'].includes(item.category)
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

  const stockStatus = getStockStatus(product);

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
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        
        {/* รูปสินค้า */}
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

        {/* ข้อมูลสินค้า */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-[#dc9e63]">{product.title}</h1>
          <p className="text-base mt-2">{product.subtitle}</p>

          <div className="product-price mt-4">
            {isBundle(product.price) ? (
              <>
                <span className="line-through text-[#f8fcdc]/40 mr-2">{product.price.original}</span>
                <span>{product.price.sale}</span>
              </>
            ) : (
              <span>{product.price}</span>
            )}
          </div>

          {/* Stock Status */}
{stockStatus && (
  <div className="mt-2 text-sm font-semibold">
    {stockStatus === 'in-stock' && <span className="text-green-300/70 italic">IN STOCK</span>}
    {stockStatus === 'out-of-stock' && <span className="text-red-400/70 italic">OUT OF STOCK</span>}
    {stockStatus === 'pre-order' && <span className="text-yellow-300/70 italic">PRE-ORDER</span>}
  </div>
)}

          {/* Description */}
          {/* Description */}
          {product.description && (
  <div className="product-description mt-6 text-[#f8fcdc]/80 leading-relaxed text-base whitespace-pre-line">
    {product.description.split('\n').map((line, idx) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        return <div key={idx} className="h-4" />; // 👈 ช่องว่างถ้าเจอบรรทัดว่าง
      } else if (trimmedLine.startsWith('Please Note:')) {
        return <p key={idx} className="italic text-[#f8fcdc]/50 mt-4">{line}</p>;
      } else {
        return <p key={idx}>{line}</p>;
      }
    })}
  </div>
)}

          {/* Quantity */}
          <div className="product-quantity-wrapper mt-8">
            <label className="text-sm font-medium text-[#f8fcdc]">Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="product-quantity-input"
            />
          </div>

          {/* Add to Cart */}
          <button
            className="add-to-cart-button mt-4"
            disabled={stockStatus === 'out-of-stock'}
          >
            {stockStatus === 'out-of-stock' ? 'Unavailable' : `Add ${quantity} to Cart`}
          </button>

          {/* Back to Shop */}
          <Link href="/shop" className="back-to-shop-link mt-4">
            ← Back to Shop
          </Link>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-wrapper mt-20 w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-[#dc9e63] mb-8">RELATED PRODUCTS</h2>
          <div className="stems-row grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  <div className="stems-label-group mt-2">
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