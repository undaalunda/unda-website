//CheckoutForm.tsx - Part 1/3 - Performance Optimized

"use client";

import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { getShippingZone } from '../../lib/shipping/zone-checker';
import { allItems } from './allItems';
import { subscribeToNewsletter } from '../../utils/newsletter';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const blacklistWords = ['asdf', 'test', 'example'];

const isBlacklisted = (value: string) =>
  blacklistWords.some(w => value.toLowerCase().includes(w));

const isValidName = (name: string) =>
  /^[a-zA-Z\s'-]{2,}$/.test(name.trim());

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) =>
  /^\+?\d{7,15}$/.test(phone.replace(/\s/g, ''));

const isValidAddress = (addr: string) =>
  /[a-zA-Z0-9]{5,}/.test(addr.trim());

const getMissing = (info: Record<string, any>, required: string[]) =>
  required.filter(field => !info[field]?.toString().trim());

// 🚀 Memoized country options to prevent re-creation
const countryOptions = [
  { value: '', label: 'Select a country' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'IE', label: 'Ireland' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AR', label: 'Argentina' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'RU', label: 'Russia' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'PL', label: 'Poland' },
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'GR', label: 'Greece' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TH', label: 'Thailand' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'SG', label: 'Singapore' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'EG', label: 'Egypt' },
  { value: 'IL', label: 'Israel' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Peru' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'KE', label: 'Kenya' },
  { value: 'MA', label: 'Morocco' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'RO', label: 'Romania' },
  { value: 'HU', label: 'Hungary' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'HR', label: 'Croatia' },
  { value: 'RS', label: 'Serbia' },
  { value: 'EE', label: 'Estonia' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'NP', label: 'Nepal' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'LA', label: 'Laos' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'QA', label: 'Qatar' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'OM', label: 'Oman' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'JO', label: 'Jordan' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'IS', label: 'Iceland' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MT', label: 'Malta' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'GE', label: 'Georgia' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'PA', label: 'Panama' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'BB', label: 'Barbados' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'CU', label: 'Cuba' },
  { value: 'ZW', label: 'Zimbabwe' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'GH', label: 'Ghana' },
  { value: 'UG', label: 'Uganda' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'LY', label: 'Libya' },
  { value: 'SD', label: 'Sudan' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'CI', label: 'Ivory Coast' },
  { value: 'SN', label: 'Senegal' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'NA', label: 'Namibia' },
  { value: 'BW', label: 'Botswana' },
  { value: 'RW', label: 'Rwanda' },
];

export default function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart, cartTotal } = useCart(); // 🚀 Use pre-computed cartTotal
  
  // 🚀 Memoize expensive calculations
  const isDigitalOnly = useMemo(() => 
    cartItems.every(item => item.type === 'digital'), 
    [cartItems]
  );
  
  const [shippingZone, setShippingZone] = useState<'TH' | 'ASIA' | 'ROW'>('TH');
  const [shippingRate, setShippingRate] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<'asia-tracked' | 'row-tracked' | 'domestic'>('domestic');
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [missingBillingFields, setMissingBillingFields] = useState<string[]>([]);
  const [missingShippingFields, setMissingShippingFields] = useState<string[]>([]);
  const [termsError, setTermsError] = useState(false);

  const debounceRef = useRef(false);
  const shippingRateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [billingInfo, setBillingInfo] = useState({
    firstName: '', lastName: '', company: '', country: '', address: '', address2: '',
    city: '', county: '', postcode: '', phone: '', email: ''
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '', lastName: '', company: '', country: '', address: '', address2: '',
    city: '', county: '', postcode: ''
  });

  const billingRequired = ['firstName', 'lastName', 'address', 'city', 'postcode', 'phone', 'email', 'country'];
  const shippingRequired = ['firstName', 'lastName', 'address', 'city', 'postcode', 'country'];

  // 🚀 Memoize event handlers to prevent re-renders
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      setShippingZone(getShippingZone(value));
    }
  }, []);

  const handleShippingChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      setShippingZone(getShippingZone(value));
    }
  }, []);

  // 🚀 Memoize cart weight calculation
  const calculateCartWeight = useCallback((cartItems: any[]): number => {
    return cartItems.reduce((total, item) => {
      const product = allItems.find(p => p.id === item.id);
      if (!product) return total;

      if (product.bundleItems?.length) {
        const bundleWeight = product.bundleItems.reduce((sum, subId) => {
          const subItem = allItems.find(p => p.id === subId);
          return sum + (subItem?.weight ?? 0);
        }, 0);
        return total + bundleWeight * item.quantity;
      }

      return total + (product.weight ?? 0) * item.quantity;
    }, 0);
  }, []);

  // 🚀 Memoize final total calculation
  const finalTotal = useMemo(() => {
    return cartTotal + (isDigitalOnly ? 0 : (shippingRate || 0));
  }, [cartTotal, isDigitalOnly, shippingRate]);

  // 🚀 Debounced shipping rate fetch
  useEffect(() => {
    console.log('[🧪 useEffect triggered]', billingInfo.country, billingInfo.postcode);

    if (!billingInfo.country || !billingInfo.postcode || !billingInfo.city) return;
    if (isDigitalOnly) return;

    const newZone = getShippingZone(billingInfo.country);
    setShippingZone(newZone);

    // 🚀 Debounce API calls to prevent excessive requests
    if (shippingRateTimeoutRef.current) {
    clearTimeout(shippingRateTimeoutRef.current);
        }

    shippingRateTimeoutRef.current = setTimeout(async () => {
      try {
        const totalWeight = calculateCartWeight(cartItems);

        function cleanCityName(city: string): string {
          return city.replace(/^(Muang|Amphoe|Tambon)\s*/i, '').trim();
        }

        const payload = {
          countryCode: billingInfo.country,
          postalCode: billingInfo.postcode,
          cityName: cleanCityName(billingInfo.city),
          weight: totalWeight,
          declaredValue: 100,
          declaredValueCurrency: 'THB',
        };

        console.log('[📦 DHL Request Payload]', JSON.stringify(payload, null, 2));

        const res = await fetch('/api/get-dhl-rate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log('[💸 DHL API Response]', JSON.stringify(data, null, 2));

        const product = data.products?.[0];
        const thbPrice =
          product?.totalPrice?.find((p: any) => p.currencyType === 'BILLC')?.price ?? 0;

        const exchangeRate = data.exchangeRates?.find(
          (rate: any) => rate.currency === 'THB' && rate.baseCurrency === 'USD'
        )?.currentExchangeRate ?? 0.027;

        const price = +(thbPrice * exchangeRate).toFixed(2);

        if (price) {
          setShippingRate(Number(price));
          console.log('✅ Shipping rate set to:', price);
        } else {
          setShippingRate(0);
          console.warn('⚠️ No shipping rate returned');
        }
      } catch (err) {
        console.error('❌ Shipping rate error', err);
        setShippingRate(0);
      }
    }, 500); // 🚀 Debounce by 500ms

  }, [billingInfo.country, billingInfo.postcode, billingInfo.city, cartItems, isDigitalOnly, calculateCartWeight]);

  useEffect(() => {
    if (isDigitalOnly) return;

    if (shippingZone === 'ASIA') {
      setShippingMethod('asia-tracked');
    } else if (shippingZone === 'ROW') {
      setShippingMethod('row-tracked');
    } else {
      setShippingMethod('domestic');
    }

    console.log('[🚚 shippingZone changed]', shippingZone, '→ method:', {
      TH: 'domestic',
      ASIA: 'asia-tracked',
      ROW: 'row-tracked',
    }[shippingZone]);
  }, [shippingZone, isDigitalOnly]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          console.log('✅ grecaptcha ready');
          setCaptchaReady(true);
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  // CheckoutForm.tsx - Part 3/3 - handleSubmit + JSX

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) return;
    debounceRef.current = true;

    setErrorMessage('');
    setTermsError(false);
    setLoading(true);

    const trimmedBilling = Object.fromEntries(
      Object.entries(billingInfo).map(([key, val]) => [key, typeof val === 'string' ? val.trim() : val])
    ) as typeof billingInfo;

    const trimmedShipping = Object.fromEntries(
      Object.entries(shippingInfo).map(([key, val]) => [key, typeof val === 'string' ? val.trim() : val])
    ) as typeof shippingInfo;

    const missingBillingFields = getMissing(trimmedBilling, billingRequired);
    const missingShippingFields = (!isDigitalOnly && shipToDifferent)
      ? getMissing(trimmedShipping, shippingRequired)
      : [];
    const allMissing = [...missingBillingFields, ...missingShippingFields];

    setMissingBillingFields(missingBillingFields);
    setMissingShippingFields(missingShippingFields);

    if (allMissing.length > 0) {
      setMissingFields(allMissing);
      setErrorMessage(`Please fill in: ${allMissing.join(', ')}`);
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    if (!captchaReady || !window.grecaptcha) {
      setErrorMessage('reCAPTCHA not loaded. Please wait a moment and try again.');
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    let token = '';
    try {
      token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
        action: 'checkout',
      });
    } catch (captchaError) {
      setErrorMessage('reCAPTCHA failed. Please refresh and try again.');
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    if (!isValidName(trimmedBilling.firstName) || isBlacklisted(trimmedBilling.firstName)) {
      setErrorMessage('Please enter a valid first name.');
      setMissingBillingFields(['firstName']);
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    if (!isValidEmail(trimmedBilling.email) || isBlacklisted(trimmedBilling.email)) {
      setErrorMessage('Please enter a valid email address.');
      setMissingBillingFields(['email']);
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    if (!isValidPhone(trimmedBilling.phone)) {
      setErrorMessage('Please enter a valid phone number.');
      setMissingBillingFields(['phone']);
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    if (!isValidAddress(trimmedBilling.address)) {
      setErrorMessage('Please enter a valid address.');
      setMissingBillingFields(['address']);
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    if (!consentTerms) {
      setTermsError(true);
      setErrorMessage('You must agree to the terms and conditions.');
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      setLoading(false);
      debounceRef.current = false;
      return;
    }

    const shippingCost = isDigitalOnly ? 0 : shippingRate;

    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        setErrorMessage('Stripe.js is not loaded yet.');
        setLoading(false);
        debounceRef.current = false;
        return;
      }

      const card = elements.getElement(CardElement);
      if (!card) {
        setErrorMessage('Card Element not found.');
        setLoading(false);
        debounceRef.current = false;
        return;
      }

      const { error, paymentMethod: pm } = await stripe.createPaymentMethod({ type: 'card', card });

      if (error) {
        console.error('[🔥 createPaymentMethod error]', error);
        setErrorMessage(error.message || 'An unknown error occurred');
        setLoading(false);
        debounceRef.current = false;
        return;
      }

      try {
        const amountToCharge = Math.round((cartTotal + shippingCost) * 100);

        // ✅ 1. สร้าง order โดยเรียก API ฝั่ง server
        const orderRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedBilling.email,
            amount: amountToCharge,
            cartItems,
            shippingMethod,
            shippingZone,
          }),
        });

        const orderJson = await orderRes.json();
        const orderId = orderJson.orderId;

        if (!orderId) {
          setErrorMessage('❌ Failed to create order.');
          setLoading(false);
          return;
        }

        // ✅ 2. ส่ง orderId เข้า Stripe Payment Intent
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: pm.id,
            amount: amountToCharge,
            token,
            email: trimmedBilling.email,
            marketing: consentMarketing,
            orderId, // ✅ แนบ orderId
          }),
        });

        const result = await res.json();

        if (result.error) {
          setErrorMessage(result.error);
        } else {
          setSuccess(true);
          clearCart();

          await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: trimmedBilling.firstName,
              email: trimmedBilling.email,
              cartItems,
              receiptUrl: result.receiptUrl,
              orderId: orderId,
            }),
          });

          const saveRes = await fetch('/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              billingInfo: trimmedBilling,
              shippingInfo: shipToDifferent ? trimmedShipping : trimmedBilling,
              cartItems,
              shippingMethod,
              shippingZone,
              shippingRate,
              email: trimmedBilling.email,
              orderId,
            }),
          });

          const saveData = await saveRes.json();

          if (!saveRes.ok || !saveData.orderId) {
            throw new Error('Failed to save order or missing order ID');
          }

          // ✅ เช็คว่าผู้ใช้ยินยอมรับอีเมลก่อน subscribe
          if (consentMarketing) {
            try {
              await subscribeToNewsletter({
                email: trimmedBilling.email,
                firstName: trimmedBilling.firstName,
                lastName: trimmedBilling.lastName,
                country: trimmedBilling.country,
              });
            } catch (error) {
              console.error('Subscription failed:', error);
            }
          }

          // 🎯 Redirect พร้อม query
          router.push(`/thank-you?email=${encodeURIComponent(trimmedBilling.email)}&orderId=${orderId}`);
        }
      } catch (err: any) {
        console.error('[🔥 API error]', err);
        setErrorMessage('Something went wrong. Please try again.');
      }
    }

    setLoading(false);
    debounceRef.current = false;
  }, [
    billingInfo, shippingInfo, shipToDifferent, isDigitalOnly, cartItems, shippingRate,
    captchaReady, consentTerms, consentMarketing, paymentMethod, stripe, elements,
    cartTotal, shippingMethod, shippingZone, clearCart, router
  ]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center pt-[120px] text-[#f8fcdc] font-[Cinzel] px-6">
      <h1 className="text-4xl font-extrabold tracking-wide mb-8 text-[#dc9e63]">CHECKOUT</h1>

      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ reCAPTCHA script loaded');
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
              console.log('✅ grecaptcha.ready()');
              setCaptchaReady(true);
            });
          } else {
            console.warn('❌ grecaptcha not found on window');
          }
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto p-6"
      >
        
        {/* Billing Details */}
        <div>
          <h2 className="text-xl font-bold text-[#dc9e63] mb-4">BILLING DETAILS</h2>
          <div className="grid gap-4">
            {[
              { name: 'firstName', placeholder: 'First Name', required: true },
              { name: 'lastName', placeholder: 'Last Name', required: true },
              { name: 'company', placeholder: 'Company Name (optional)' },
            ].map(({ name, placeholder, required }) => (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={(billingInfo as any)[name]}
                onChange={handleChange}
                className={`bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border ${
                  missingBillingFields.includes(name) ? 'border-red-500' : 'border-transparent'
                } p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70`}
                required={required}
              />
            ))}

            {/* Country Select - 🚀 Optimized */}
            <select
              name="country"
              value={billingInfo.country}
              onChange={handleChange}
              required
              className={`bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border ${
                missingBillingFields.includes('country') ? 'border-red-500' : 'border-transparent'
              } p-2 rounded w-full appearance-none focus:outline-none focus:ring-0 cursor-pointer`}
            >
              {countryOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Rest of inputs */}
            {[
              { name: 'address', placeholder: 'Street Address', required: true },
              { name: 'address2', placeholder: 'Apartment, suite, unit, etc. (optional)' },
              { name: 'city', placeholder: 'Town / City', required: true },
              { name: 'county', placeholder: 'County (optional)' },
              { name: 'postcode', placeholder: 'Postcode', required: true },
              { name: 'phone', placeholder: 'Phone', required: true },
              { name: 'email', placeholder: 'Email address', required: true },
            ].map(({ name, placeholder, required }) => (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={(billingInfo as any)[name]}
                onChange={handleChange}
                className={`bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border ${
                  missingBillingFields.includes(name) ? 'border-red-500' : 'border-transparent'
                } p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70`}
                required={required}
              />
            ))}
          </div>

          {!isDigitalOnly && (
            <>
              <label className="block mt-4">
                <input
                  type="checkbox"
                  checked={shipToDifferent}
                  onChange={(e) => setShipToDifferent(e.target.checked)}
                  className="mr-2"
                />
                DELIVER TO A DIFFERENT ADDRESS?
              </label>
            </>
          )}

          {shipToDifferent && (
            <div className="grid gap-4 mt-4">
              {[
                { name: 'firstName', placeholder: 'First Name', required: true },
                { name: 'lastName', placeholder: 'Last Name', required: true },
                { name: 'company', placeholder: 'Company Name (optional)' },
              ].map(({ name, placeholder, required }) => (
                <input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  value={(shippingInfo as any)[name]}
                  onChange={handleShippingChange}
                  className={`bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border ${
                    missingFields?.includes(name) ? 'border-red-500' : 'border-transparent'
                  } p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70`}
                  required={required}
                />
              ))}

              {/* Shipping Country Select */}
              <select
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingChange}
                required
                className={`bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border ${
                  missingShippingFields.includes('country') ? 'border-red-500' : 'border-transparent'
                } p-2 rounded w-full appearance-none focus:outline-none focus:ring-0 cursor-pointer`}
              >
                {countryOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {[
                { name: 'address', placeholder: 'Street Address', required: true },
                { name: 'address2', placeholder: 'Apartment, suite, unit, etc. (optional)' },
                { name: 'city', placeholder: 'Town / City', required: true },
                { name: 'county', placeholder: 'County (optional)' },
                { name: 'postcode', placeholder: 'Postcode', required: true },
              ].map(({ name, placeholder, required }) => (
                <input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  value={(shippingInfo as any)[name]}
                  onChange={handleShippingChange}
                  className={`bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border ${
                    missingFields?.includes(name) ? 'border-red-500' : 'border-transparent'
                  } p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70`}
                  required={required}
                />
              ))}
            </div>
          )}
        </div>

        {/* Your Order + Payment Wrapper */}
        <div className="w-full md:max-w-[450px]">
          {/* Your Order */}
          <h2 className="text-xl font-bold text-[#dc9e63] mb-4 mt-0">YOUR ORDER</h2>
          <div className="bg-[#1e0000]/50 p-4 rounded-xl shadow-xl mb-6">
            <ul className="mb-4 text-sm space-y-2 leading-8">
              {/* 🧾 PRODUCT HEADER */}
              <li className="flex justify-between text-base font-bold mb-1">
                <span>Product</span>
                <span>Subtotal</span>
              </li>

              {/* 🧾 PRODUCT LIST */}
              {cartItems.map(item => (
                <li key={item.id} className="flex gap-4 items-center mb-4">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm text-[#f8fcdc]">{item.title} x {item.quantity}</p>
                    <p className="text-xs text-[#f8fcdc]/50">{item.subtitle}</p>
                  </div>
                  <span className="text-sm text-[#f8fcdc]/70">
                    ${(
                      (typeof item.price === 'object' ? item.price.sale : item.price) * item.quantity
                    ).toFixed(2)}
                  </span>
                </li>
              ))}

              {/* 💵 SUBTOTAL */}
              <li className="flex justify-between font-bold text-sm uppercase mb-3">
                <span className="uppercase text-[#f8fcdc]">Subtotal</span>
                <span className="text-[#f8fcdc]">
                  ${cartTotal.toFixed(2)}
                </span>
              </li>

              {/* 🚚 SHIPPING */}
              {!isDigitalOnly && (
                <li className="pt-2">
                  <span className="font-bold block mb-2">Shipping</span>
                  <div className="flex justify-between text-[#f8fcdc]/70 font-extralight">
                    <span>
                      {shippingMethod === 'asia-tracked' && 'Asia Tracked'}
                      {shippingMethod === 'row-tracked' && 'ROW Tracked'}
                      {shippingMethod === 'domestic' && 'Domestic Delivery (TH)'}
                    </span>
                    <span>
                      {shippingRate === null ? (
                        <em>Calculating...</em>
                      ) : (
                        `$${shippingRate.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </li>
              )}

              {/* 💰 TOTAL - 🚀 Use memoized finalTotal */}
              <li className="flex justify-between font-bold text-2xl uppercase border-t border-[#f8fcdc]/10 pt-4 mt-4">
                <span className="uppercase text-[#f8fcdc]">TOTAL</span>
                <span className="text-[#f8fcdc]">
                  ${finalTotal.toFixed(2)}
                </span>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <h2 className="text-xl text-[#dc9e63] font-bold mb-4">PAYMENT</h2>
          <div className="bg-[#1e0000]/50 p-4 rounded-xl shadow-xl mb-6">        

            {paymentMethod === 'card' && (
              <div className="relative mt-2">
                <div className="absolute -top-2 left-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#f8fcdc]" />
                <div className="bg-[#f8fcdc] text-black p-4 rounded shadow">
                  <p className="text-sm mb-1 mt-[-4px]">Pay with your credit card via Stripe.</p>
                  <p className="text-sm mb-2">Credit or debit card</p>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#000000',
                          '::placeholder': { color: '#444' },
                        },
                        invalid: { color: '#ff6b6b' },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <p className="text-[14px] text-[#f8fcdc] mb-4">
            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
            <a
              href="/privacy-policy"
              className="text-s text-[#dc9e63] hover:text-[#f8fcdc] cursor-pointer no-underline transition-colors duration-300"
            >
              privacy policy.
            </a>
          </p>

          <label className="block mb-2 text-[13px]">
            <input
              type="checkbox"
              checked={consentMarketing}
              onChange={e => setConsentMarketing(e.target.checked)}
              className="mr-2"
            />
            I consent to receive marketing emails and updates. <span className="text-[#f8fcdc]/50">(optional)</span>
          </label>

          <label className="block mb-4 text-[14px]">
            <input
              type="checkbox"
              checked={consentTerms}
              onChange={e => setConsentTerms(e.target.checked)}
              required
              className="mr-2"
            />
            I have read and agree to the website{' '}
            <span
              className="text-[#dc9e63] cursor-pointer text-s hover:text-[#f8fcdc] transition-colors duration-300"
              onClick={() => window.location.href = '/privacy-policy'}
            >
              terms and conditions.
            </span>
          </label>

          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
          {success && <div className="text-green-500 text-sm mb-4">Payment Successful!</div>}

          <button
            type="submit"
            disabled={false}
            className="w-full bg-[#dc9e63] text-black py-3 rounded-xl text-lg font-extrabold tracking-wide hover:bg-[#f8cfa3] transition-colors shadow-lg cursor-pointer"
          >
            {loading ? 'Processing...' : 'PLACE ORDER'}
          </button>
        </div>
      </form>
    </main>
  );
}