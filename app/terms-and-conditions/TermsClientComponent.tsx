//TermsClientComponents.tsx

'use client';

import Link from 'next/link';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - UNDA ALUNDA',
};

export default function TermsPage() {
  return (
    <AppClientWrapper>
      <main className="min-h-screen px-6 pt-[140px] pb-24 text-[#f8fcdc] font-[Cinzel]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#dc9e63] mb-12 tracking-wide">
            Terms & Conditions
          </h1>

          <section className="space-y-6 text-sm leading-relaxed">
            <p>
              These Terms and Conditions (“Terms”) govern the purchase of goods and digital products from this website. By using this website, you agree to be bound by these Terms.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">1. Eligibility</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must be at least 16 years old to place an order.</li>
              <li>You must be legally capable of entering into a binding contract.</li>
              <li>You must be authorized to use the selected payment method.</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">2. Orders</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Orders are subject to availability and acceptance.</li>
              <li>Confirmation will be sent by email upon successful purchase.</li>
              <li>We reserve the right to cancel any order suspected of fraud or resale.</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">3. Digital Goods License</h2>
            <p>By purchasing digital products (e.g. Backing Tracks, Stems, Tabs, Scores), you are granted a limited personal-use license. You may:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use them for personal projects, live performances, or non-commercial content (e.g. YouTube or social media).</li>
              <li>Practice or use them in personal teaching (non-commercial).</li>
            </ul>
            <p className="mt-2">You may <strong>not</strong>:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Re-sell, redistribute, or upload the files elsewhere.</li>
              <li>Include them in commercial content without permission.</li>
              <li>Share them with others or repackage them in any form.</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">4. Intellectual Property</h2>
            <p>All content remains the property of its respective creators. Purchase grants use, not ownership or redistribution rights.</p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">5. Refunds</h2>
            <p>
              All digital sales are final and non-refundable once access or download has been provided.
              <br />
              For physical items, refunds and returns are subject to a separate policy.
              <br />
              Should you experience any issues accessing your digital files, please contact us for prompt assistance.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">6. Delivery</h2>
            <p>
              Physical goods (if any) will be delivered based on selected options. Delays may occur, but we aim to keep you updated.
              <br />
              Digital files are delivered instantly or via email link.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">7. Privacy</h2>
            <p>Refer to our <Link href="/privacy-policy" className="underline text-[#dc9e63]">Privacy Policy</Link> for how we collect and use your data.</p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">8. Changes to Terms</h2>
            <p>
              We reserve the right to amend these Terms. Updates will only apply to future orders and will not affect prior purchases.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">9. Governing Law</h2>
            <p>These Terms are governed by the laws of Thailand. Any disputes will be resolved under Thai jurisdiction.</p>
          </section>

          <div className="mt-16 text-center">
            <Link
              href="/shipping-and-returns"
              className="inline-block bg-[#dc9e63] text-[#160000] px-6 py-3 font-bold text-sm rounded-xl hover:bg-[#f8cfa3] transition-colors"
            >
              Shipping & Returns Information
            </Link>
          </div>
        </div>
      </main>
    </AppClientWrapper>
  );
}