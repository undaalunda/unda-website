// app/product/[slug]/page.tsx - Performance Optimized + Enhanced SEO (Next.js 15 Compatible)

import { allItems } from '@/components/allItems';
import ProductPageContent from '@/components/ProductPageContent';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const BASE_URL = 'https://unda-website.vercel.app';

// 🚀 Optimized static params generation
export async function generateStaticParams() {
  return allItems.map((item) => ({
    slug: item.id,
  }));
}

// 🚀 Enhanced metadata generation with better SEO (Next.js 15 compatible)
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const product = allItems.find((item) => item.id === slug);

  if (!product) {
    return {
      title: 'Product Not Found - UNDA ALUNDA',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const formattedSubtitle = product.subtitle
    ? product.subtitle.charAt(0).toUpperCase() + product.subtitle.slice(1).toLowerCase()
    : '';

  const title = `${smartTitleCase(product.title)}${
    formattedSubtitle ? ` – ${formattedSubtitle}` : ''
  } - UNDA ALUNDA`;

  const description = formattedSubtitle || `${smartTitleCase(product.title)} from Unda Alunda. Official product page with detailed information and purchase options.`;

  // 🚀 Calculate price for metadata
  const price = typeof product.price === 'object' 
    ? product.price.sale 
    : product.price;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.subtitle,
      product.category,
      ...product.tags,
      'Unda Alunda',
      'music',
      'merchandise',
      'progressive rock',
      'instrumental',
    ].filter(Boolean),
    
    // 🚀 Enhanced Open Graph
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/product/${slug}`,
      images: [
        {
          url: `${BASE_URL}${product.image}`,
          width: 1200,
          height: 630,
          alt: `${product.title} - ${product.subtitle}`,
        },
      ],
      siteName: 'UNDA ALUNDA',
    },

    // 🚀 Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}${product.image}`],
      creator: '@undaalunda',
    },

    // 🚀 Additional metadata
    other: {
      'og:title': title,
      'og:description': description,
      'og:type': 'product.item',
      'og:url': `${BASE_URL}/product/${slug}`,
      'og:image': `${BASE_URL}${product.image}`,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': `${product.title} - ${product.subtitle}`,
      
      // 🚀 Product-specific metadata
      'product:price:amount': price?.toString() || '0',
      'product:price:currency': 'USD',
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:retailer_item_id': product.id,
      'product:brand': 'UNDA ALUNDA',
      'product:category': product.category,
    },

    // 🚀 Canonical URL
    alternates: {
      canonical: `${BASE_URL}/product/${slug}`,
    },

    // 🚀 Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ProductPage({ params }: any) {
  const { slug } = await params;
  const product = allItems.find((item) => item.id === slug);

  // 🚀 Use Next.js notFound() for better 404 handling
  if (!product) {
    notFound();
  }

  // 🚀 Calculate pricing for schema
  const price = typeof product.price === 'object' 
    ? product.price.sale 
    : product.price;
  
  const originalPrice = typeof product.price === 'object' 
    ? product.price.original 
    : null;

  const isOnSale = typeof product.price === 'object';

  return (
    <>
      {/* 🚀 Enhanced Product Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": `${BASE_URL}/product/${product.id}#product`,
            "name": `${product.title} – ${product.subtitle}`,
            "description": product.subtitle || `${product.title} from Unda Alunda`,
            "image": [
              `${BASE_URL}${product.image}`,
            ],
            "brand": {
              "@type": "Brand",
              "name": "UNDA ALUNDA",
              "url": BASE_URL,
            },
            "manufacturer": {
              "@type": "Organization",
              "name": "UNDA ALUNDA",
              "url": BASE_URL,
            },
            "category": product.category,
            "sku": product.id,
            "gtin": product.id,
            "productID": product.id,
            "url": `${BASE_URL}/product/${product.id}`,
            "mainEntityOfPage": `${BASE_URL}/product/${product.id}`,
            
            // 🚀 Offer information
            "offers": {
              "@type": "Offer",
              "url": `${BASE_URL}/product/${product.id}`,
              "priceCurrency": "USD",
              "price": price?.toString() || "0",
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "UNDA ALUNDA",
                "url": BASE_URL,
              },
              "validFrom": new Date().toISOString(),
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            },

            // 🚀 Additional product details
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Product Type",
                "value": product.category
              },
              {
                "@type": "PropertyValue", 
                "name": "Artist",
                "value": "UNDA ALUNDA"
              },
              ...(product.weight ? [{
                "@type": "PropertyValue",
                "name": "Weight", 
                "value": `${product.weight}g`
              }] : []),
              ...(product.tags.map(tag => ({
                "@type": "PropertyValue",
                "name": "Tag",
                "value": tag
              }))),
            ]
          })
        }}
      />

      {/* 🚀 Enhanced BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": BASE_URL
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": `${BASE_URL}/shop`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.category,
                "item": `${BASE_URL}/shop/${product.category.toLowerCase()}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": `${product.title} – ${product.subtitle}`,
                "item": `${BASE_URL}/product/${product.id}`
              }
            ]
          })
        }}
      />

      {/* 🚀 WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${BASE_URL}/product/${product.id}#webpage`,
            "url": `${BASE_URL}/product/${product.id}`,
            "name": `${product.title} – ${product.subtitle}`,
            "description": product.subtitle || `${product.title} from Unda Alunda`,
            "mainEntity": {
              "@id": `${BASE_URL}/product/${product.id}#product`
            },
            "breadcrumb": {
              "@id": `${BASE_URL}/product/${product.id}#breadcrumb`
            },
            "inLanguage": "en-US",
            "isPartOf": {
              "@type": "WebSite",
              "@id": `${BASE_URL}#website`
            },
            "datePublished": "2025-01-01T00:00:00+00:00",
            "dateModified": new Date().toISOString(),
          })
        }}
      />

      <ProductPageContent product={product} />
    </>
  );
}

// 🚀 Optimized smartTitleCase function with memoization
const titleCaseCache = new Map<string, string>();

function smartTitleCase(str: string): string {
  // Check cache first
  if (titleCaseCache.has(str)) {
    return titleCaseCache.get(str)!;
  }

  const exceptions: Record<string, string> = {
    't-shirt': 'T-Shirt',
    'cd': 'CD',
    'dvd': 'DVD',
    'tab': 'TAB',
    'stem': 'STEM',
    'backing': 'Backing',
    'track': 'Track',
    'dark': 'Dark',
    'wonderful': 'Wonderful',
    'world': 'World',
    'unda': 'UNDA',
    'alunda': 'ALUNDA',
  };

  const result = str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      const key = word.toLowerCase().replace(/[^a-z\-]/g, '');
      return exceptions[key] || word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  // Cache the result
  titleCaseCache.set(str, result);
  return result;
}