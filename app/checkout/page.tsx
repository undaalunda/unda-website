'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CheckoutForm from '@/components/CheckoutForm'; // แก้ path ให้ตรง

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </PayPalScriptProvider>
  );
}