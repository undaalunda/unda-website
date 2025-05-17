'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import AppClientWrapper from '@/components/AppClientWrapper';

export default function ShippingReturnsPage() {
  return (
    <AppClientWrapper>
      <main className="min-h-screen px-6 pt-[140px] pb-24 text-[#f8fcdc] font-[Cinzel]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#dc9e63] mb-12 tracking-wide">
            Shipping & Returns
          </h1>

          <section className="space-y-8 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-[#dc9e63] mb-2">General Shipping Information</h2>
              <p>
                We aim to dispatch all orders within 1–3 business days. Estimated delivery times may vary depending on your
                location and selected shipping method. During peak seasons or promotional events, delays may occur.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#dc9e63] mb-2">Shipping Methods</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Thailand: 2–4 business days via domestic courier (e.g. Flash, Kerry, EMS)</li>
                <li>Asia: 5–10 business days via standard international shipping</li>
                <li>Europe / US / Worldwide: 7–21 business days depending on customs & region</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#dc9e63] mb-2">Tracking</h2>
              <p>
                Once your order has shipped, you will receive a dispatch email with tracking information. Please allow up
                to 48 hours for tracking updates to appear in the system.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#dc9e63] mb-2">Duties & Customs</h2>
              <p>
                All international customers are responsible for any import duties, taxes, or customs fees. We do not have
                control over these charges and cannot predict their amounts.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#dc9e63] mb-2">Returns & Exchanges</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Digital products are non-refundable once downloaded or accessed.</li>
                <li>Physical items may be eligible for return or exchange within 14 days of receipt.</li>
                <li>Items must be unused, in original condition and packaging.</li>
                <li>Return shipping costs are the responsibility of the customer unless the item is faulty.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#dc9e63] mb-2">Lost or Damaged Items</h2>
              <p>
                If your order arrives damaged or is lost in transit, please contact us with your order number and relevant
                details. We will work with the shipping provider to resolve the issue.
              </p>
            </div>
          </section>

          <div className="mt-24">
            <h2 className="text-2xl font-bold text-[#dc9e63] mb-8">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-4">
              {[
                {
                  value: 'tracking',
                  question: 'Tracking isn’t working',
                  answer:
                    'Please allow up to 48 hours from dispatch for tracking to update. If your tracking hasn’t updated after 5 days, please contact us with your order number and we’ll help you investigate with the courier.',
                },
                {
                  value: 'customs',
                  question: 'Who pays customs fees?',
                  answer:
                    'Customers are responsible for all customs/import fees. Please check your country’s import policies before ordering.',
                },
                {
                  value: 'cancel',
                  question: 'Can I cancel or edit my order?',
                  answer:
                    'Orders cannot be edited after confirmation. You may request cancellation before dispatch by contacting us promptly.',
                },
                {
                  value: 'refund',
                  question: 'When will I receive my refund?',
                  answer:
                    'Refunds typically take 1–5 business days after being processed. The exact timing depends on your bank/payment provider.',
                },
                {
                  value: 'digital',
                  question: 'Can I get a refund for digital files?',
                  answer:
                    'No. All digital product sales are final once downloaded or accessed. If you have trouble accessing your files, please contact us for help.',
                },
                {
                  value: 'international',
                  question: 'Do you ship internationally?',
                  answer:
                    'Yes! We ship worldwide. Delivery times vary depending on location and customs processing.',
                },
                {
                  value: 'exchange',
                  question: 'Can I exchange or return a physical item?',
                  answer:
                    'Yes, within 14 days of receipt — as long as the item is unused and in original packaging. Return shipping is covered by you unless the item is faulty.',
                },
              ].map(({ value, question, answer }) => (
                <AccordionItem key={value} value={value}>
                  <AccordionTrigger className="text-left font-semibold cursor-pointer">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="mt-2">{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </AppClientWrapper>
  );
}