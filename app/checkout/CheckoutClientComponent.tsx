// CheckoutClientComponent.tsx - Performance Optimized

'use client';

import { useEffect, useMemo, useCallback } from 'react';
import Script from 'next/script';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import AppClientWrapper from '@/components/AppClientWrapper';
import CheckoutForm from '@/components/CheckoutForm';

// 🚀 Memoize Stripe Promise to prevent re-initialization
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 🚀 Memoized styles for reCAPTCHA
const recaptchaStyles = `
  .grecaptcha-badge {
    opacity: 0.1 !important;
    transition: opacity 0.3s ease;
    z-index: 9999;
  }
  .grecaptcha-badge:hover {
    opacity: 1 !important;
  }
`;

export default function CheckoutClientComponent() {
  const router = useRouter();
  const { cartItems, isCartReady } = useCart();

  // 🚀 Memoized redirect logic
  const shouldRedirect = useMemo(() => 
    isCartReady && cartItems.length === 0, 
    [isCartReady, cartItems.length]
  );

  // 🚀 Memoized badge manipulation
  const handleBadgeVisibility = useCallback((show: boolean) => {
    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
    if (badge) badge.style.display = show ? 'block' : 'none';
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/cart');
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    handleBadgeVisibility(true);
    return () => handleBadgeVisibility(false);
  }, [handleBadgeVisibility]);

  // 🚀 Memoized loading component
  const LoadingComponent = useMemo(() => (
    <AppClientWrapper>
      <div className="min-h-screen flex items-center justify-center text-[#f8fcdc] font-[Cinzel] text-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc9e63]"></div>
          <span>Loading your Cart...</span>
        </div>
      </div>
    </AppClientWrapper>
  ), []);

  if (!isCartReady) {
    return LoadingComponent;
  }

  return (
    <AppClientWrapper>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      <style dangerouslySetInnerHTML={{ __html: recaptchaStyles }} />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </AppClientWrapper>
  );
}