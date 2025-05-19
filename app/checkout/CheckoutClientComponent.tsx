//CheckoutClientComponent.tsx

'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

import AppClientWrapper from '@/components/AppClientWrapper';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClientComponent() {
  const router = useRouter();
  const { cartItems, isCartReady } = useCart();

  useEffect(() => {
    if (isCartReady && cartItems.length === 0) {
      router.replace('/cart');
    }
  }, [isCartReady, cartItems, router]);

  useEffect(() => {
    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
    if (badge) badge.style.display = 'block';

    return () => {
      if (badge) badge.style.display = 'none';
    };
  }, []);

  if (!isCartReady) {
    return (
      <AppClientWrapper>
        <div className="min-h-screen flex items-center justify-center text-[#f8fcdc] font-[Cinzel] text-lg">
          Loading your Cart...
        </div>
      </AppClientWrapper>
    );
  }

  return (
    <AppClientWrapper>
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
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </AppClientWrapper>
  );
}