// components/ProductSchema.tsx

import React from 'react';

export default function ProductSchema({
  name,
  image,
  description,
  price,
  url,
}: {
  name: string;
  image: string;
  description?: string;
  price: number;
  url: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name,
          image,
          description,
          brand: {
            "@type": "Brand",
            name: "Unda Alunda",
          },
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "USD",
            price,
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }),
      }}
    />
  );
}