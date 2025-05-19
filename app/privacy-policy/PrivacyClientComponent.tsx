//PrivacyClientComponent.tsx

'use client';

import Link from 'next/link';
import AppClientWrapper from '@/components/AppClientWrapper';

export default function PrivacyClientComponent() {
  return (
    <AppClientWrapper>
      <main className="min-h-screen px-6 pt-[140px] pb-24 text-[#f8fcdc] font-[Cinzel]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#dc9e63] mb-12 tracking-wide">
            Privacy Policy
          </h1>

          <section className="space-y-6 text-sm leading-relaxed">
            <p>
              This Privacy Policy explains how we collect, use, and protect your personal information when you use the Unda Alunda website. By using this site, you agree to the terms outlined here.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">1. Information We Collect</h2>
            <p>We may collect the following types of data:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Email address</li>
              <li>Name</li>
              <li>Phone number</li>
              <li>Billing or shipping address (if applicable)</li>
              <li>Usage data, including IP address, browser type, and pages visited</li>
              <li>Cookies and tracking information</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">2. Use of Data</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>To fulfill orders and deliver products</li>
              <li>To improve our website and services</li>
              <li>To communicate with you</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To analyze site traffic via analytics tools</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">3. Cookies & Tracking</h2>
            <p>
              We use cookies to enhance your browsing experience, remember preferences, and gather analytics through tools such as Google Analytics. You can modify your browser settings to disable cookies at any time, but some features of the site may not work correctly.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">4. Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share it with third-party services like Shopify or Stripe for payment processing, or Google Analytics for site performance monitoring. These partners are only permitted to use your data to perform specific services for us.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">5. Data Security</h2>
            <p>
              We implement reasonable safeguards to protect your information. However, no method of transmission over the internet is completely secure.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">6. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect information from children.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">7. External Links</h2>
            <p>
              This website may contain links to external sites. We are not responsible for their privacy practices and encourage you to review their policies.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">8. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. All changes will take effect when posted. Please revisit this page periodically to stay informed.
            </p>

            <h2 className="text-lg font-semibold text-[#dc9e63] mt-10">9. Contact</h2>
            <p>
              For any privacy-related questions or requests, please contact us at:
              <br />
              <span className="text-[#dc9e63]">support@undaalunda.com</span>
            </p>
          </section>
        </div>
      </main>
    </AppClientWrapper>
  );
}