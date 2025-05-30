//PrivacyClientComponent.tsx

'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper';

// Memoized privacy sections data - ลบอีโมคอนออก
const PRIVACY_SECTIONS = [
  {
    id: 'information-collection',
    title: '1. Information We Collect',
    content: 'We may collect the following types of data:',
    items: [
      'Email address',
      'Name',
      'Phone number',
      'Billing or shipping address (if applicable)',
      'Usage data, including IP address, browser type, and pages visited',
      'Cookies and tracking information'
    ]
  },
  {
    id: 'data-usage',
    title: '2. Use of Data',
    content: 'We use your personal information for the following purposes:',
    items: [
      'To fulfill orders and deliver products',
      'To improve our website and services',
      'To communicate with you',
      'To detect and prevent fraud or abuse',
      'To analyze site traffic via analytics tools'
    ]
  },
  {
    id: 'cookies-tracking',
    title: '3. Cookies & Tracking',
    content: 'We use cookies to enhance your browsing experience, remember preferences, and gather analytics through tools such as Google Analytics. You can modify your browser settings to disable cookies at any time, but some features of the site may not work correctly.'
  },
  {
    id: 'data-sharing',
    title: '4. Data Sharing',
    content: 'We do not sell your personal data. We may share it with third-party services like Shopify or Stripe for payment processing, or Google Analytics for site performance monitoring. These partners are only permitted to use your data to perform specific services for us.'
  },
  {
    id: 'data-security',
    title: '5. Data Security',
    content: 'We implement reasonable safeguards to protect your information. However, no method of transmission over the internet is completely secure.'
  },
  {
    id: 'children-privacy',
    title: '6. Children\'s Privacy',
    content: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect information from children.'
  },
  {
    id: 'external-links',
    title: '7. External Links',
    content: 'This website may contain links to external sites. We are not responsible for their privacy practices and encourage you to review their policies.'
  },
  {
    id: 'policy-changes',
    title: '8. Changes to this Policy',
    content: 'We may update this Privacy Policy from time to time. All changes will take effect when posted. Please revisit this page periodically to stay informed.'
  },
  {
    id: 'contact',
    title: '9. Contact',
    content: 'For any privacy-related questions or requests, please contact us at:',
    contactEmail: 'support@undaalunda.com'
  }
] as const;

// Type definitions for better TypeScript support
type PrivacySection = {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly items?: readonly string[];
  readonly contactEmail?: string;
};

// Memoized Privacy Section Component
const PrivacySectionCard = memo(({ 
  banana, 
  index 
}: { 
  banana: PrivacySection; 
  index: number 
}) => (
  <section 
    id={banana.id} 
    className="scroll-mt-24 bg-[#1a0000]/30 p-6 rounded-lg border border-[#f8fcdc]/10 hover:border-[#dc9e63]/30 transition-colors duration-300"
  >
    <h2 className="text-lg font-semibold text-[#dc9e63] mb-4">
      {banana.title}
    </h2>
    
    <div className="text-[#f8fcdc]/90 leading-relaxed space-y-3">
      <p>{banana.content}</p>
      
      {banana.items && (
        <ul className="list-disc list-inside ml-4 space-y-2 text-[#f8fcdc]/80">
          {banana.items.map((listItem, itemIndex) => (
            <li key={itemIndex} className="leading-relaxed">
              {listItem}
            </li>
          ))}
        </ul>
      )}
      
      {banana.contactEmail && (
        <div className="mt-4 p-4 bg-[#dc9e63]/10 rounded-lg border-l-4 border-[#dc9e63]">
          <p className="text-[#f8fcdc]/90">
            Email: <a 
              href={`mailto:${banana.contactEmail}`}
              className="text-[#dc9e63] font-semibold hover:text-[#f8cfa3] transition-colors duration-200 focus:outline-none focus:underline"
            >
              {banana.contactEmail}
            </a>
          </p>
        </div>
      )}
    </div>
  </section>
));
PrivacySectionCard.displayName = 'PrivacySectionCard';

// Memoized Table of Contents Component
const TableOfContents = memo(() => {
  const tocItems = useMemo(() => 
    PRIVACY_SECTIONS.map((section, index) => ({
      href: `#${section.id}`,
      label: section.title
    })),
    []
  );

  return (
    <nav className="mb-12 p-6 bg-[#1a0000]/40 rounded-lg border border-[#f8fcdc]/10" aria-label="Privacy policy navigation">
      <h2 className="text-lg font-semibold text-[#dc9e63] mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {tocItems.map(({ href, label }) => (
          <li key={href}>
            <a 
              href={href} 
              className="flex items-center space-x-3 text-sm text-[#f8fcdc]/80 hover:text-[#dc9e63] transition-colors duration-200 focus:outline-none focus:text-[#dc9e63] group"
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

export default function PrivacyClientComponent() {
  // Memoized structured data for SEO
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "description": "Comprehensive privacy policy explaining how Unda Alunda collects, uses, and protects your personal information when using our website and services.",
    "url": "https://undaalunda.com/privacy-policy",
    "dateModified": "2025-01-01",
    "mainEntity": {
      "@type": "Article",
      "headline": "Privacy Policy - Unda Alunda",
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
          "name": "Privacy Policy",
          "item": "https://undaalunda.com/privacy-policy"
        }
      ]
    }
  }), []);

  // Memoized privacy sections
  const privacySections = useMemo(() =>
    PRIVACY_SECTIONS.map((privacyItem, index) => (
      <PrivacySectionCard key={privacyItem.id} banana={privacyItem} index={index} />
    )),
    []
  );

  const lastUpdated = useMemo(() => 
    new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
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
                Privacy Policy
              </h1>
              <div className="space-y-2 text-[#f8fcdc]/70">
                <p className="text-lg">
                  How we collect, use, and protect your personal information
                </p>
                <p className="text-sm">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </header>

            {/* Introduction */}
            <section className="mb-12 p-6 bg-[#1a0000]/40 rounded-lg border border-[#f8fcdc]/20">
              <h2 className="text-xl font-semibold text-[#dc9e63] mb-4">Introduction</h2>
              <p className="text-[#f8fcdc]/90 leading-relaxed">
                This Privacy Policy explains how we collect, use, and protect your personal information when you use the 
                <strong className="text-[#dc9e63]"> Unda Alunda</strong> website. By using this site, you agree to the terms outlined here.
              </p>
              <div className="mt-4 p-3 bg-[#dc9e63]/10 rounded border-l-4 border-[#dc9e63]">
                <p className="text-sm text-[#f8fcdc]/80">
                  <strong>Quick Summary:</strong> We respect your privacy and only collect necessary information to provide our services. 
                  We never sell your personal data.
                </p>
              </div>
            </section>

            {/* Table of Contents */}
            <TableOfContents />

            {/* Privacy Policy Sections */}
            <article className="space-y-8">
              {privacySections}
            </article>

            {/* GDPR Rights Section */}
            <section className="mt-12 p-6 bg-[#1a0000]/40 rounded-lg border border-[#f8fcdc]/10">
              <h2 className="text-xl font-semibold text-[#dc9e63] mb-4">
                Your Rights (GDPR)
              </h2>
              <div className="text-[#f8fcdc]/90 space-y-3">
                <p>If you are located in the European Union, you have the following rights regarding your personal data:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-[#f8fcdc]/80">
                  <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                  <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                  <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                </ul>
              </div>
            </section>

            {/* Call to Action */}
            <aside className="mt-16 text-center bg-[#1a0000]/40 p-8 rounded-lg border border-[#f8fcdc]/10">
              <h3 className="text-xl font-semibold text-[#dc9e63] mb-4">Questions about your privacy?</h3>
              <p className="text-[#f8fcdc]/80 mb-6">
                We're committed to transparency and protecting your personal information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-block bg-[#dc9e63] text-[#160000] px-6 py-3 font-bold text-sm rounded-xl hover:bg-[#f8cfa3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
                >
                  Contact Privacy Team
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="inline-block border-2 border-[#dc9e63] text-[#dc9e63] px-6 py-3 font-bold text-sm rounded-xl hover:bg-[#dc9e63] hover:text-[#160000] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
                >
                  Terms & Conditions
                </Link>
              </div>
            </aside>
          </div>
        </main>
      </AppClientWrapper>
    </>
  );
}