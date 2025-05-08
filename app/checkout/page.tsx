'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CheckoutForm from '@/components/CheckoutForm';
import Script from 'next/script';
import { useEffect } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  useEffect(() => {
    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
    if (badge) {
      badge.style.display = 'block';
    }

    return () => {
      const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
      if (badge) {
        badge.style.display = 'none'; // ไม่ลบ แค่ซ่อนตอนออก
      }
    };
  }, []);

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .grecaptcha-badge {
              opacity: 0.1 !important;
              transition: opacity 0.3s ease;
              z-index: 9999;
            }
            .grecaptcha-badge:hover {
              opacity: 1 !important;
            }
          `,
        }}
      />
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </PayPalScriptProvider>
    </>
  );
}