//TermsClientComponents.tsx - Updated with Shop Landing Gradient Colors

'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper';

// Memoized terms sections data - ลบอีโมคอนออกทั้งหมด
const TERMS_SECTIONS = [
  {
    id: 'eligibility',
    title: '1. Eligibility',
    items: [
      'You must be at least 16 years old to place an order.',
      'You must be legally capable of entering into a binding contract.',
      'You must be authorized to use the selected payment method.'
    ]
  },
  {
    id: 'orders',
    title: '2. Orders',
    items: [
      'Orders are subject to availability and acceptance.',
      'Confirmation will be sent by email upon successful purchase.',
      'We reserve the right to cancel any order suspected of fraud or resale.'
    ]
  },
  {
    id: 'digital-license',
    title: '3. Digital Goods License',
    content: 'By purchasing digital products (e.g. Backing Tracks, Stems, Tabs, Scores), you are granted a limited personal-use license.',
    allowedUses: [
      'Use them for personal projects, live performances, or non-commercial content (e.g. YouTube or social media).',
      'Practice or use them in personal teaching (non-commercial).'
    ],
    prohibitedUses: [
      'Re-sell, redistribute, or upload the files elsewhere.',
      'Include them in commercial content without permission.',
      'Share them with others or repackage them in any form.'
    ]
  },
  {
    id: 'intellectual-property',
    title: '4. Intellectual Property',
    content: 'All content remains the property of its respective creators. Purchase grants use, not ownership or redistribution rights.'
  },
  {
    id: 'refunds',
    title: '5. Refunds',
    content: 'All digital sales are final and non-refundable once access or download has been provided.',
    additionalInfo: [
      'For physical items, refunds and returns are subject to a separate policy.',
      'Should you experience any issues accessing your digital files, please contact us for prompt assistance.'
    ]
  },
  {
    id: 'delivery',
    title: '6. Delivery',
    digitalDelivery: 'Digital files are delivered instantly or via email link.',
    physicalDelivery: 'Physical goods (if any) will be delivered based on selected options. Delays may occur, but we aim to keep you updated.'
  },
  {
    id: 'privacy',
    title: '7. Privacy',
    content: 'Refer to our Privacy Policy for how we collect and use your data.',
    linkTo: '/privacy-policy'
  },
  {
    id: 'changes',
    title: '8. Changes to Terms',
    content: 'We reserve the right to amend these Terms. Updates will only apply to future orders and will not affect prior purchases.'
  },
  {
    id: 'governing-law',
    title: '9. Governing Law',
    content: 'These Terms are governed by the laws of Thailand. Any disputes will be resolved under Thai jurisdiction.'
  }
] as const;

// Type definitions - ใช้ readonly ตั้งแต่แรก เพื่อหลีกเลี่ยง banana incident
type TermsSection = {
  readonly id: string;
  readonly title: string;
  readonly content?: string;
  readonly items?: readonly string[];
  readonly allowedUses?: readonly string[];
  readonly prohibitedUses?: readonly string[];
  readonly additionalInfo?: readonly string[];
  readonly digitalDelivery?: string;
  readonly physicalDelivery?: string;
  readonly linkTo?: string;
};

// Memoized Terms Section Component - ใช้ banana ตั้งแต่แรกเลย!
const TermsSectionCard = memo(({ 
  banana, 
  index 
}: { 
  banana: TermsSection; 
  index: number 
}) => (
  <section 
    id={banana.id} 
    className="scroll-mt-24 bg-[#1a0000]/30 p-6 rounded-lg border border-[#f8fcdc]/10 hover:border-[#dc9e63]/30 transition-colors duration-300"
  >
    <h2 className="text-lg font-semibold text-[#dc9e63] mb-4">
      {banana.title}
    </h2>
    
    <div className="text-[#f8fcdc]/90 leading-relaxed space-y-4">
      {banana.content && (
        <p className="text-[#f8fcdc]/90">
          {banana.content}
          {banana.linkTo && (
            <>
              {' '}
              <Link 
                href={banana.linkTo} 
                className="text-[#dc9e63] hover:text-[#f8cfa3] underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
              >
                Privacy Policy
              </Link>
            </>
          )}
        </p>
      )}
      
      {banana.items && (
        <ul className="list-disc list-inside space-y-2 text-[#f8fcdc]/80">
          {banana.items.map((item, itemIndex) => (
            <li key={itemIndex} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      )}

      {banana.allowedUses && (
        <div className="space-y-3">
          <div className="p-4 bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-400 mb-2">You may:</h3>
            <ul className="list-disc list-inside space-y-1 text-[#f8fcdc]/80 text-sm">
              {banana.allowedUses.map((use, useIndex) => (
                <li key={useIndex}>{use}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <h3 className="font-semibold text-red-400 mb-2">You may not:</h3>
            <ul className="list-disc list-inside space-y-1 text-[#f8fcdc]/80 text-sm">
              {banana.prohibitedUses?.map((use, useIndex) => (
                <li key={useIndex}>{use}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {banana.additionalInfo && (
        <div className="space-y-2">
          {banana.additionalInfo.map((info, infoIndex) => (
            <p key={infoIndex} className="text-[#f8fcdc]/80 text-sm">
              {info}
            </p>
          ))}
        </div>
      )}

      {/* 🚀 DELIVERY SECTION - WITH CSS GRADIENT CLASSES! */}
      {(banana.digitalDelivery || banana.physicalDelivery) && (
        <div className="space-y-3">
          {banana.digitalDelivery && (
            <div className="p-3 rounded terms-digital-delivery">
              <h3 className="font-semibold text-[#5b8199] mb-1">Digital Products:</h3>
              <p className="text-[#f8fcdc]/80 text-sm">{banana.digitalDelivery}</p>
            </div>
          )}
          {banana.physicalDelivery && (
            <div className="p-3 rounded terms-physical-delivery">
              <h3 className="font-semibold text-[#fcc276] mb-1">Physical Products:</h3>
              <p className="text-[#f8fcdc]/80 text-sm">{banana.physicalDelivery}</p>
            </div>
          )}
        </div>
      )}
    </div>
  </section>
));
TermsSectionCard.displayName = 'TermsSectionCard';

// Memoized Table of Contents Component  
const TableOfContents = memo(() => {
  const tocItems = useMemo(() => 
    TERMS_SECTIONS.map((section) => ({
      href: `#${section.id}`,
      label: section.title
    })),
    []
  );

  return (
    <nav className="mb-12 p-6 bg-[#1a0000]/40 rounded-lg border border-[#f8fcdc]/10" aria-label="Terms and conditions navigation">
      <h2 className="text-lg font-semibold text-[#dc9e63] mb-4">Table of Contents</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {tocItems.map(({ href, label }) => (
          <li key={href}>
            <a 
              href={href} 
              className="flex items-center space-x-3 text-sm text-[#f8fcdc]/80 hover:text-[#dc9e63] transition-colors duration-200 focus:outline-none focus:text-[#dc9e63] group p-2 rounded hover:bg-[#1a0000]/50"
            >
              <span className="group-hover:underline">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
TableOfContents.displayName = 'TableOfContents';

// Memoized Key Highlights Component
const KeyHighlights = memo(() => (
  <section className="mb-12 p-6 bg-[#1a0000]/40 rounded-lg border border-[#f8fcdc]/20">
    <h2 className="text-xl font-semibold text-[#dc9e63] mb-4">Key Highlights</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-[#dc9e63]/10 rounded-lg text-center">
        <div className="text-2xl mb-2 text-[#dc9e63]">●</div>
        <h3 className="font-semibold text-[#dc9e63] mb-1">Digital Products</h3>
        <p className="text-xs text-[#f8fcdc]/80">Personal use license included</p>
      </div>
      <div className="p-4 bg-[#dc9e63]/10 rounded-lg text-center">
        <div className="text-2xl mb-2 text-[#dc9e63]">●</div>
        <h3 className="font-semibold text-[#dc9e63] mb-1">No Refunds</h3>
        <p className="text-xs text-[#f8fcdc]/80">Digital sales are final</p>
      </div>
      <div className="p-4 bg-[#dc9e63]/10 rounded-lg text-center">
        <div className="text-2xl mb-2 text-[#dc9e63]">●</div>
        <h3 className="font-semibold text-[#dc9e63] mb-1">Thai Law</h3>
        <p className="text-xs text-[#f8fcdc]/80">Governed by Thailand jurisdiction</p>
      </div>
    </div>
  </section>
));
KeyHighlights.displayName = 'KeyHighlights';

export default function TermsClientComponent() {
  // Memoized structured data for SEO - ใช้ static date เพื่อหลีกเลี่ยง hydration error
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms & Conditions",
    "description": "Complete terms and conditions for purchasing digital products and using services from Unda Alunda, including licensing, refunds, and legal information.",
    "url": "https://undaalunda.com/terms-and-conditions",
    "dateModified": "2025-01-01",
    "mainEntity": {
      "@type": "Article",
      "headline": "Terms & Conditions - Unda Alunda",
      "datePublished": "2024-01-01",
      "dateModified": "2025-01-01",
      "author": {
        "@type": "Organization",
        "name": "Unda Alunda",
        "url": "https://undaalunda.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Unda Alunda",
        "url": "https://undaalunda.com"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://undaalunda.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Terms & Conditions",
          "item": "https://undaalunda.com/terms-and-conditions"
        }
      ]
    }
  }), []);

  // Memoized terms sections - ใช้ banana ตั้งแต่แรก!
  const termsSections = useMemo(() =>
    TERMS_SECTIONS.map((termsItem, index) => (
      <TermsSectionCard key={termsItem.id} banana={termsItem} index={index} />
    )),
    []
  );

  const lastUpdated = useMemo(() => 
    'January 1, 2025', // Static date เพื่อหลีกเลี่ยง hydration error
    []
  );

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      <AppClientWrapper>
        <main className="min-h-screen px-6 pt-[140px] pb-24 text-[#f8fcdc] font-[Cinzel]">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <header className="mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-[#dc9e63] mb-4 tracking-wide">
                Terms & Conditions
              </h1>
              <div className="space-y-2 text-[#f8fcdc]/70">
                <p className="text-lg">
                  Legal terms governing the use of our website and purchase of products
                </p>
                <p className="text-sm">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </header>

            {/* Introduction */}
            <section className="mb-12 p-6 bg-[#1a0000]/40 rounded-lg border border-[#f8fcdc]/20">
              <h2 className="text-xl font-semibold text-[#dc9e63] mb-4">Agreement Overview</h2>
              <p className="text-[#f8fcdc]/90 leading-relaxed mb-4">
                These Terms and Conditions ("Terms") govern the purchase of goods and digital products from this website. 
                By using this website, you agree to be bound by these Terms.
              </p>
              <div className="p-4 bg-[#dc9e63]/10 rounded-lg border-l-4 border-[#dc9e63]">
                <p className="text-sm text-[#f8fcdc]/80">
                  <strong>Important:</strong> Please read these terms carefully before making a purchase. 
                  Digital product sales are final and non-refundable.
                </p>
              </div>
            </section>

            {/* Key Highlights */}
            <KeyHighlights />

            {/* Table of Contents */}
            <TableOfContents />

            {/* Terms Sections */}
            <article className="space-y-8">
              {termsSections}
            </article>

            {/* Acceptance Agreement */}
            <section className="mt-12 p-6 bg-[#1a0000]/40 rounded-lg border border-[#dc9e63]/30">
              <h2 className="text-xl font-semibold text-[#dc9e63] mb-4">
                Agreement Acceptance
              </h2>
              <div className="text-[#f8fcdc]/90 space-y-3">
                <p>
                  By using this website and making purchases, you acknowledge that you have read, 
                  understood, and agree to be bound by these Terms & Conditions.
                </p>
                <p className="text-sm text-[#f8fcdc]/70">
                  If you do not agree to these terms, please do not use our website or purchase our products.
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <aside className="mt-16 text-center bg-[#1a0000]/40 p-8 rounded-lg border border-[#f8fcdc]/10">
              <h3 className="text-xl font-semibold text-[#dc9e63] mb-4">Ready to explore our products?</h3>
              <p className="text-[#f8fcdc]/80 mb-6">
                Now that you understand our terms, check out our shipping information and start shopping!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shipping-and-returns"
                  className="inline-block bg-[#dc9e63] text-[#160000] px-6 py-3 font-bold text-sm rounded-xl hover:bg-[#f8cfa3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
                >
                  Shipping & Returns
                </Link>
                <Link
                  href="/privacy-policy"
                  className="inline-block border-2 border-[#dc9e63] text-[#dc9e63] px-6 py-3 font-bold text-sm rounded-xl hover:bg-[#dc9e63] hover:text-[#160000] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
                >
                  Privacy Policy
                </Link>
              </div>
            </aside>
          </div>
        </main>
      </AppClientWrapper>
    </>
  );
}