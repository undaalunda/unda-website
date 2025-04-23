import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 🧠 Define type for products
interface ProductItem {
  src: string;
  title: string;
  subtitle: string;
  price?: string;
  originalPrice?: string;
  salePrice?: string;
}

interface Props {
  activeTab: 'MERCH' | 'MUSIC' | 'BUNDLES';
}

// 🧃 Dummy product arrays (replace with real ones later)
const merchItems: ProductItem[] = [];
const musicItems: ProductItem[] = [];
const bundleItems: ProductItem[] = [];

const ShopTabSection = ({ activeTab }: Props) => {
  const itemsToRender =
    activeTab === 'MERCH'
      ? merchItems
      : activeTab === 'MUSIC'
      ? musicItems
      : bundleItems;

  return (
    <section className="stems-section">
      <div className="stems-row">
        {itemsToRender.map((item, i) => (
          <Link href="/shop" key={i} className="stems-item product-label-link">
            <Image
              src={item.src}
              alt={item.title}
              width={200}
              height={200}
              className="stems-image"
            />
            <div className="stems-label-group">
              <p className="stems-title-text">{item.title}</p>
              <p className="stems-subtitle-tiny">{item.subtitle}</p>
              {'originalPrice' in item ? (
                <p className="stems-price">
                  <span className="line-through mr-1 text-[#f8fcdc]">{item.originalPrice}</span>
                  <span className="text-[#cc3f33]">{item.salePrice}</span>
                </p>
              ) : (
                <p className="stems-price text-[#f8fcdc]">{item.price}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopTabSection;
