//ShippingClientComponent.tsx

'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import AppClientWrapper from '@/components/AppClientWrapper';

// Memoized FAQ data to prevent recreation on every render
const FAQ_DATA = [
  {
    value: 'tracking',
    question: 'Tracking isn\'t working',
    answer: 'Please allow up to 48 hours from dispatch for tracking to update. If your tracking hasn\'t updated after 5 days, please contact us with your order number and we\'ll help you investigate with the courier.',
    category: 'shipping'
  },
  {
    value: 'customs',
    question: 'Who pays customs fees?',
    answer: 'Customers are responsible for all customs/import fees. Please check your country\'s import policies before ordering.',
    category: 'international'
  },
  {
    value: 'cancel',
    question: 'Can I cancel or edit my order?',
    answer: 'Orders cannot be edited after confirmation. You may request cancellation before dispatch by contacting us promptly.',
    category: 'orders'
  },
  {
    value: 'refund',
    question: 'When will I receive my refund?',
    answer: 'Refunds typically take 1–5 business days after being processed. The exact timing depends on your bank/payment provider.',
    category: 'refunds'
  },
  {
    value: 'digital',
    question: 'Can I get a refund for digital files?',
    answer: 'No. All digital product sales are final once downloaded or accessed. If you have trouble accessing your files, please contact us for help.',
    category: 'digital'
  },
  {
    value: 'international',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship worldwide. Delivery times vary depending on location and customs processing.',
    category: 'international'
  },
  {
    value: 'exchange',
    question: 'Can I exchange or return a physical item?',
    answer: 'Yes, within 14 days of receipt — as long as the item is unused and in original packaging. Return shipping is covered by you unless the item is faulty.',
    category: 'returns'
  },
] as const;

// Memoized shipping methods data - เอาอีโมคอนออก
const SHIPPING_METHODS = [
  {
    region: 'Thailand',
    timeframe: '2–4 business days',
    method: 'domestic courier (e.g. Flash, Kerry, EMS)'
  },
  {
    region: 'Asia',
    timeframe: '5–10 business days',
    method: 'standard international shipping'
  },
  {
    region: 'Europe / US / Worldwide',
    timeframe: '7–21 business days',
    method: 'depending on customs & region'
  },
] as const;

// Type definitions for better TypeScript support
type FAQItem = {
  value: string;
  question: string;
  answer: string;
  category: string;
};

type ShippingMethod = {
  region: string;
  timeframe: string;
  method: string;
};

// Memoized FAQ Item Component
const FAQItem = memo(({ item }: { item: FAQItem }) => (
  <AccordionItem value={item.value}>
    <AccordionTrigger className="text-left font-semibold cursor-pointer hover:text-[#dc9e63] transition-colors duration-200">
      {item.question}
    </AccordionTrigger>
    <AccordionContent className="mt-2 text-[#f8fcdc]/80 leading-relaxed">
      {item.answer}
    </AccordionContent>
  </AccordionItem>
));
FAQItem.displayName = 'FAQItem';

// Memoized Shipping Method Component - ไม่มีอีโมคอน
const ShippingMethod = memo(({ method }: { method: ShippingMethod }) => (
  <li className="flex items-start space-x-3 p-3 bg-[#1a0000]/30 rounded-lg border border-[#f8fcdc]/10 hover:border-[#dc9e63]/30 transition-colors duration-200">
    <div>
      <span className="font-medium text-[#dc9e63]">{method.region}:</span>{' '}
      <span className="text-[#f8fcdc]/90">{method.timeframe}</span>{' '}
      <span className="text-[#f8fcdc]/70">via {method.method}</span>
    </div>
  </li>
));
ShippingMethod.displayName = 'ShippingMethod';

// Memoized Policy Section Component
const PolicySection = memo(({ 
  title, 
  children,
  id 
}: { 
  title: string; 
  children: React.ReactNode;
  id?: string;
}) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-lg font-semibold text-[#dc9e63] mb-3 border-b border-[#f8fcdc]/10 pb-2">
      {title}
    </h2>
    {children}
  </section>
));
PolicySection.displayName = 'PolicySection';

export default function ShippingClientComponent() {
  // Memoized structured data for SEO
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shipping & Returns Policy",
    "description": "Complete shipping information, delivery times, return policy, and frequently asked questions for Unda Alunda digital and physical products.",
    "url": "https://undaalunda.com/shipping-and-returns",
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": FAQ_DATA.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
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
          "name": "Shipping & Returns",
          "item": "https://undaalunda.com/shipping-and-returns"
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Unda Alunda",
      "url": "https://undaalunda.com"
    }
  }), []);

  // Memoized FAQ items
  const faqItems = useMemo(() => 
    FAQ_DATA.map((item) => (
      <FAQItem key={item.value} item={item} />
    )),
    []
  );

  // Memoized shipping method items
  const shippingMethodItems = useMemo(() =>
    SHIPPING_METHODS.map((method, index) => (
      <ShippingMethod key={method.region + index} method={method} />
    )),
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
                Shipping & Returns
              </h1>
              <p className="text-[#f8fcdc]/70 text-lg max-w-2xl">
                Everything you need to know about shipping times, delivery methods, returns, and our policies.
              </p>
            </header>

            {/* Quick Navigation */}
            <nav className="mb-12 p-4 bg-[#1a0000]/40 rounded-lg border border-[#f8fcdc]/10" aria-label="Page navigation">
              <h2 className="text-sm font-semibold text-[#dc9e63] mb-3">Quick Navigation:</h2>
              <ul className="flex flex-wrap gap-2 text-xs">
                {[
                  { href: '#general', label: 'General Info' },
                  { href: '#methods', label: 'Shipping Methods' },
                  { href: '#tracking', label: 'Tracking' },
                  { href: '#customs', label: 'Customs' },
                  { href: '#returns', label: 'Returns' },
                  { href: '#faq', label: 'FAQ' }
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a 
                      href={href} 
                      className="inline-block px-3 py-1 bg-[#dc9e63]/20 text-[#dc9e63] rounded-full hover:bg-[#dc9e63]/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Main Content */}
            <article className="space-y-10 text-sm leading-relaxed">
              <PolicySection title="General Shipping Information" id="general">
                <div className="bg-[#1a0000]/30 p-6 rounded-lg border border-[#f8fcdc]/10">
                  <p className="text-[#f8fcdc]/90 leading-relaxed">
                    We aim to dispatch all orders within <strong className="text-[#dc9e63]">1–3 business days</strong>. 
                    Estimated delivery times may vary depending on your location and selected shipping method. 
                    During peak seasons or promotional events, delays may occur.
                  </p>
                </div>
              </PolicySection>

              <PolicySection title="Shipping Methods" id="methods">
                <ul className="space-y-3">
                  {shippingMethodItems}
                </ul>
              </PolicySection>

              <PolicySection title="Order Tracking" id="tracking">
                <div className="bg-[#1a0000]/30 p-6 rounded-lg border border-[#f8fcdc]/10">
                  <p className="text-[#f8fcdc]/90 leading-relaxed">
                    Once your order has shipped, you will receive a <strong className="text-[#dc9e63]">dispatch email</strong> with tracking information. 
                    Please allow up to <strong className="text-[#dc9e63]">48 hours</strong> for tracking updates to appear in the system.
                  </p>
                  <div className="mt-4 p-3 bg-[#dc9e63]/10 rounded border-l-4 border-[#dc9e63]">
                    <p className="text-sm text-[#f8fcdc]/80">
                      💡 <strong>Tip:</strong> Save your tracking number and check it directly on the courier's website for the most up-to-date information.
                    </p>
                  </div>
                </div>
              </PolicySection>

              <PolicySection title="Duties & Customs" id="customs">
                <div className="bg-[#1a0000]/30 p-6 rounded-lg border border-[#f8fcdc]/10">
                  <p className="text-[#f8fcdc]/90 leading-relaxed">
                    All international customers are responsible for any <strong className="text-[#dc9e63]">import duties, taxes, or customs fees</strong>. 
                    We do not have control over these charges and cannot predict their amounts.
                  </p>
                  <div className="mt-4 p-3 bg-yellow-900/20 rounded border-l-4 border-yellow-500">
                    <p className="text-sm text-[#f8fcdc]/80">
                      ⚠️ <strong>Important:</strong> Please check your country's import policies before placing an order to avoid unexpected fees.
                    </p>
                  </div>
                </div>
              </PolicySection>

              <PolicySection title="Returns & Exchanges" id="returns">
                <div className="bg-[#1a0000]/30 p-6 rounded-lg border border-[#f8fcdc]/10 space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#dc9e63] mb-2">Digital Products</h3>
                    <p className="text-[#f8fcdc]/90">
                      Digital products are <strong className="text-red-400">non-refundable</strong> once downloaded or accessed.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#dc9e63] mb-2">Physical Items</h3>
                    <ul className="space-y-2 text-[#f8fcdc]/90">
                      <li className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Eligible for return or exchange within <strong className="text-[#dc9e63]">14 days</strong> of receipt</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Items must be unused, in original condition and packaging</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-yellow-400 mt-1">!</span>
                        <span>Return shipping costs are the customer's responsibility (unless item is faulty)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </PolicySection>

              <PolicySection title="Lost or Damaged Items" id="damaged">
                <div className="bg-[#1a0000]/30 p-6 rounded-lg border border-[#f8fcdc]/10">
                  <p className="text-[#f8fcdc]/90 leading-relaxed">
                    If your order arrives damaged or is lost in transit, please <strong className="text-[#dc9e63]">contact us immediately</strong> with 
                    your order number and relevant details. We will work with the shipping provider to resolve the issue.
                  </p>
                  <div className="mt-4">
                    <Link 
                      href="/contact"
                      className="inline-flex items-center px-4 py-2 bg-[#dc9e63] text-[#160000] font-semibold rounded-lg hover:bg-[#f8cfa3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </PolicySection>
            </article>

            {/* FAQ Section */}
            <section id="faq" className="mt-16 scroll-mt-24">
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-[#dc9e63] mb-2">Frequently Asked Questions</h2>
                <p className="text-[#f8fcdc]/70">Find quick answers to common shipping and returns questions.</p>
              </header>
              <Accordion type="multiple" className="space-y-4">
                {faqItems}
              </Accordion>
            </section>

            {/* Call to Action */}
            <aside className="mt-16 text-center bg-[#1a0000]/40 p-8 rounded-lg border border-[#f8fcdc]/10">
              <h3 className="text-xl font-semibold text-[#dc9e63] mb-4">Still have questions?</h3>
              <p className="text-[#f8fcdc]/80 mb-6">
                Our support team is here to help with any shipping or returns inquiries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-block bg-[#dc9e63] text-[#160000] px-6 py-3 font-bold text-sm rounded-xl hover:bg-[#f8cfa3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#dc9e63] focus:ring-offset-2 focus:ring-offset-[#1a0000]"
                >
                  Contact Support
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