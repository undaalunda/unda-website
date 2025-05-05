'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

// 🙄 If I forget this component exists again, feel free to shame me.
function CheckoutForm() {
  // You’ve seen this 800 times, don’t pretend it’s new.
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();

  const [shippingMethod, setShippingMethod] = useState<'evri' | 'dhl'>('evri');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    address: '',
    address2: '',
    city: '',
    county: '',
    postcode: '',
    phone: '',
    email: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

// 🧠 CLIENT-SIDE VALIDATION ZONE
const validateFields = () => {
  const requiredFields = ['firstName', 'lastName', 'country', 'address', 'city', 'postcode', 'phone', 'email'];
  const errors = [];

  for (const field of requiredFields) {
    const value = billingInfo[field as keyof typeof billingInfo];
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(`${field} is required.`);
    }
  }

  if (billingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
    errors.push('Invalid email format.');
  }

  if (billingInfo.phone && !/^[0-9+\-\s()]+$/.test(billingInfo.phone)) {
    errors.push('Invalid phone number.');
  }

  return errors;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const errors = validateFields();
    if (errors.length) {
      setErrorMessage(errors.join(' '));
      setLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage('Stripe.js ยังโหลดไม่เสร็จ');
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setErrorMessage('Card Element ไม่เจอ');
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.error('[🔥 createPaymentMethod error]', error);
      setErrorMessage(error.message || 'เกิดข้อผิดพลาดที่ไม่รู้จัก');
      setLoading(false);
      return;
    }

    try {
      const shippingCost = shippingMethod === 'dhl' ? 15 : 5;
      const total = cartItems.reduce((acc, item) => {
        const price = typeof item.price === 'object' ? item.price.sale : item.price;
        return acc + price * item.quantity;
      }, 0);
      const amountToCharge = Math.round((total + shippingCost) * 100);

      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amountToCharge,
        }),
      });

      const result = await res.json();

      if (result.error) {
        console.error('[💥 PaymentIntent error]', result.error);
        setErrorMessage(result.error);
      } else {
        setSuccess(true);
        clearCart();
      }
    } catch (err: any) {
      console.error('[🔥 API error]', err);
      setErrorMessage('ระบบพัง กรุณาลองใหม่อีกครั้ง');
    }

    setLoading(false);
  };

  // ❗ This is your golden submission zone. Don’t mess it up.
  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-[#1e0000] text-[#f8fcdc] rounded space-y-4">
      <h2 className="text-2xl font-bold text-[#dc9e63]">Checkout</h2>

      <input name="firstName" value={billingInfo.firstName} onChange={handleChange} placeholder="First Name" className="input" />
      <input name="lastName" value={billingInfo.lastName} onChange={handleChange} placeholder="Last Name" className="input" />
      <input name="email" value={billingInfo.email} onChange={handleChange} placeholder="Email" className="input" />
      <input name="phone" value={billingInfo.phone} onChange={handleChange} placeholder="Phone" className="input" />
      <input name="country" value={billingInfo.country} onChange={handleChange} placeholder="Country" className="input" />
      <input name="address" value={billingInfo.address} onChange={handleChange} placeholder="Street Address" className="input" />
      <input name="city" value={billingInfo.city} onChange={handleChange} placeholder="City" className="input" />
      <input name="postcode" value={billingInfo.postcode} onChange={handleChange} placeholder="Postcode" className="input" />

      <div className="mt-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#f8fcdc',
                '::placeholder': { color: '#dc9e63' },
              },
              invalid: { color: '#ff6b6b' },
            },
          }}
        />
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      {success && <p className="text-green-500 text-sm">Payment successful!</p>}

      <button
        type="submit"
        disabled={loading || !stripe || !consentTerms}
        className="w-full bg-[#dc9e63] text-black py-2 rounded hover:bg-[#f8cfa3] transition-colors"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
