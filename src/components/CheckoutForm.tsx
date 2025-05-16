"use client";

import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useEffect, useState, useRef } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { getShippingZone } from '../../lib/shipping/zone-checker';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const blacklistWords = ['asdf', 'test', 'example'];

export default function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const isDigitalOnly = cartItems.every(item => item.type === 'digital'); 
  const [shippingZone, setShippingZone] = useState<'UK' | 'EU' | 'ROW'>('ROW');
  const [shippingMethod, setShippingMethod] = useState<'evri' | 'dhl' | 'eu-tracked' | 'row-tracked'>('evri');
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

  const [billingInfo, setBillingInfo] = useState({
    firstName: '', lastName: '', company: '', country: '', address: '', address2: '',
    city: '', county: '', postcode: '', phone: '', email: ''
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '', lastName: '', company: '', country: '', address: '', address2: '',
    city: '', county: '', postcode: ''
  });

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

  const billingRequired = ['firstName', 'lastName', 'address', 'city', 'postcode', 'phone', 'email', 'country'];
  const shippingRequired = ['firstName', 'lastName', 'address', 'city', 'postcode', 'country'];

  const getMissing = (info: Record<string, any>, required: string[]) =>
    required.filter(field => !info[field]?.toString().trim());

  const isValidName = (name: string) => /^[a-zA-Z\s'-]{2,}$/.test(name.trim());
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^\+?\d{7,15}$/.test(phone.replace(/\s/g, ''));
  const isValidAddress = (addr: string) => /[a-zA-Z0-9]{5,}/.test(addr.trim());
  const isBlacklisted = (value: string) => blacklistWords.some(w => value.toLowerCase().includes(w));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      setShippingZone(getShippingZone(value));
      console.log('📦 shippingZone:', getShippingZone(value));
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      setShippingZone(getShippingZone(value));
      console.log('📦 shippingZone (shipping):', getShippingZone(value));
    }
  };

  const cartTotal: number = cartItems.reduce((acc, item) => {
    const price = typeof item.price === 'object' ? item.price.sale : item.price;
    return acc + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const shippingCost =
      shippingMethod === 'dhl' ? 15 :
      shippingMethod === 'eu-tracked' ? 12 :
      shippingMethod === 'row-tracked' ? 18 :
      5;

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

        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: pm.id,
            amount: amountToCharge,
            token,
            email: trimmedBilling.email,
            marketing: consentMarketing,
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
  }),
});

          await fetch('/api/save-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              billingInfo: trimmedBilling,
              shippingInfo: shipToDifferent ? trimmedShipping : trimmedBilling,
              cartItems,
              shippingMethod,
              email: trimmedBilling.email,
            }),
          });

          router.push('/thank-you');
        }
      } catch (err: any) {
        console.error('[🔥 API error]', err);
        setErrorMessage('Something went wrong. Please try again.');
      }
    }

    setLoading(false);
    debounceRef.current = false;
  };

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

    {/* Country Select */}
    <select
  name="country"
  value={billingInfo.country}
  onChange={handleChange}
  required
  className={`bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border ${
    missingBillingFields.includes('country') ? 'border-red-500' : 'border-transparent'
  } p-2 rounded w-full appearance-none focus:outline-none focus:ring-0 cursor-pointer`}
>
  <option value="">Select a country</option>
<option value="US">United States</option>
<option value="GB">United Kingdom</option>
<option value="CA">Canada</option>
<option value="AU">Australia</option>
<option value="DE">Germany</option>
<option value="FR">France</option>
<option value="IT">Italy</option>
<option value="ES">Spain</option>
<option value="NL">Netherlands</option>
<option value="SE">Sweden</option>
<option value="NO">Norway</option>
<option value="DK">Denmark</option>
<option value="FI">Finland</option>
<option value="IE">Ireland</option>
<option value="NZ">New Zealand</option>
<option value="JP">Japan</option>
<option value="KR">South Korea</option>
<option value="CN">China</option>
<option value="IN">India</option>
<option value="BR">Brazil</option>
<option value="MX">Mexico</option>
<option value="AR">Argentina</option>
<option value="ZA">South Africa</option>
<option value="RU">Russia</option>
<option value="UA">Ukraine</option>
<option value="PL">Poland</option>
<option value="AT">Austria</option>
<option value="BE">Belgium</option>
<option value="CH">Switzerland</option>
<option value="PT">Portugal</option>
<option value="GR">Greece</option>
<option value="TR">Turkey</option>
<option value="TH">Thailand</option>
<option value="MY">Malaysia</option>
<option value="SG">Singapore</option>
<option value="ID">Indonesia</option>
<option value="PH">Philippines</option>
<option value="VN">Vietnam</option>
<option value="SA">Saudi Arabia</option>
<option value="AE">United Arab Emirates</option>
<option value="EG">Egypt</option>
<option value="IL">Israel</option>
<option value="CL">Chile</option>
<option value="CO">Colombia</option>
<option value="PE">Peru</option>
<option value="NG">Nigeria</option>
<option value="KE">Kenya</option>
<option value="MA">Morocco</option>
<option value="CZ">Czech Republic</option>
<option value="RO">Romania</option>
<option value="HU">Hungary</option>
<option value="SK">Slovakia</option>
<option value="SI">Slovenia</option>
<option value="BG">Bulgaria</option>
<option value="HR">Croatia</option>
<option value="RS">Serbia</option>
<option value="EE">Estonia</option>
<option value="LV">Latvia</option>
<option value="LT">Lithuania</option>
<option value="PK">Pakistan</option>
<option value="BD">Bangladesh</option>
<option value="LK">Sri Lanka</option>
<option value="NP">Nepal</option>
<option value="MM">Myanmar</option>
<option value="KH">Cambodia</option>
<option value="LA">Laos</option>
<option value="MN">Mongolia</option>
<option value="KZ">Kazakhstan</option>
<option value="UZ">Uzbekistan</option>
<option value="QA">Qatar</option>
<option value="KW">Kuwait</option>
<option value="OM">Oman</option>
<option value="BH">Bahrain</option>
<option value="JO">Jordan</option>
<option value="LB">Lebanon</option>
<option value="IS">Iceland</option>
<option value="LU">Luxembourg</option>
<option value="MT">Malta</option>
<option value="CY">Cyprus</option>
<option value="GE">Georgia</option>
<option value="AM">Armenia</option>
<option value="AZ">Azerbaijan</option>
<option value="PA">Panama</option>
<option value="CR">Costa Rica</option>
<option value="UY">Uruguay</option>
<option value="PY">Paraguay</option>
<option value="BO">Bolivia</option>
<option value="EC">Ecuador</option>
<option value="GT">Guatemala</option>
<option value="HN">Honduras</option>
<option value="SV">El Salvador</option>
<option value="NI">Nicaragua</option>
<option value="JM">Jamaica</option>
<option value="TT">Trinidad and Tobago</option>
<option value="BB">Barbados</option>
<option value="BS">Bahamas</option>
<option value="DO">Dominican Republic</option>
<option value="CU">Cuba</option>
<option value="ZW">Zimbabwe</option>
<option value="ZM">Zambia</option>
<option value="GH">Ghana</option>
<option value="UG">Uganda</option>
<option value="TZ">Tanzania</option>
<option value="DZ">Algeria</option>
<option value="TN">Tunisia</option>
<option value="LY">Libya</option>
<option value="SD">Sudan</option>
<option value="ET">Ethiopia</option>
<option value="CM">Cameroon</option>
<option value="CI">Ivory Coast</option>
<option value="SN">Senegal</option>
<option value="MG">Madagascar</option>
<option value="MZ">Mozambique</option>
<option value="NA">Namibia</option>
<option value="BW">Botswana</option>
<option value="RW">Rwanda</option>
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
  <option value="">Select a country</option>
<option value="US">United States</option>
<option value="GB">United Kingdom</option>
<option value="CA">Canada</option>
<option value="AU">Australia</option>
<option value="DE">Germany</option>
<option value="FR">France</option>
<option value="IT">Italy</option>
<option value="ES">Spain</option>
<option value="NL">Netherlands</option>
<option value="SE">Sweden</option>
<option value="NO">Norway</option>
<option value="DK">Denmark</option>
<option value="FI">Finland</option>
<option value="IE">Ireland</option>
<option value="NZ">New Zealand</option>
<option value="JP">Japan</option>
<option value="KR">South Korea</option>
<option value="CN">China</option>
<option value="IN">India</option>
<option value="BR">Brazil</option>
<option value="MX">Mexico</option>
<option value="AR">Argentina</option>
<option value="ZA">South Africa</option>
<option value="RU">Russia</option>
<option value="UA">Ukraine</option>
<option value="PL">Poland</option>
<option value="AT">Austria</option>
<option value="BE">Belgium</option>
<option value="CH">Switzerland</option>
<option value="PT">Portugal</option>
<option value="GR">Greece</option>
<option value="TR">Turkey</option>
<option value="TH">Thailand</option>
<option value="MY">Malaysia</option>
<option value="SG">Singapore</option>
<option value="ID">Indonesia</option>
<option value="PH">Philippines</option>
<option value="VN">Vietnam</option>
<option value="SA">Saudi Arabia</option>
<option value="AE">United Arab Emirates</option>
<option value="EG">Egypt</option>
<option value="IL">Israel</option>
<option value="CL">Chile</option>
<option value="CO">Colombia</option>
<option value="PE">Peru</option>
<option value="NG">Nigeria</option>
<option value="KE">Kenya</option>
<option value="MA">Morocco</option>
<option value="CZ">Czech Republic</option>
<option value="RO">Romania</option>
<option value="HU">Hungary</option>
<option value="SK">Slovakia</option>
<option value="SI">Slovenia</option>
<option value="BG">Bulgaria</option>
<option value="HR">Croatia</option>
<option value="RS">Serbia</option>
<option value="EE">Estonia</option>
<option value="LV">Latvia</option>
<option value="LT">Lithuania</option>
<option value="PK">Pakistan</option>
<option value="BD">Bangladesh</option>
<option value="LK">Sri Lanka</option>
<option value="NP">Nepal</option>
<option value="MM">Myanmar</option>
<option value="KH">Cambodia</option>
<option value="LA">Laos</option>
<option value="MN">Mongolia</option>
<option value="KZ">Kazakhstan</option>
<option value="UZ">Uzbekistan</option>
<option value="QA">Qatar</option>
<option value="KW">Kuwait</option>
<option value="OM">Oman</option>
<option value="BH">Bahrain</option>
<option value="JO">Jordan</option>
<option value="LB">Lebanon</option>
<option value="IS">Iceland</option>
<option value="LU">Luxembourg</option>
<option value="MT">Malta</option>
<option value="CY">Cyprus</option>
<option value="GE">Georgia</option>
<option value="AM">Armenia</option>
<option value="AZ">Azerbaijan</option>
<option value="PA">Panama</option>
<option value="CR">Costa Rica</option>
<option value="UY">Uruguay</option>
<option value="PY">Paraguay</option>
<option value="BO">Bolivia</option>
<option value="EC">Ecuador</option>
<option value="GT">Guatemala</option>
<option value="HN">Honduras</option>
<option value="SV">El Salvador</option>
<option value="NI">Nicaragua</option>
<option value="JM">Jamaica</option>
<option value="TT">Trinidad and Tobago</option>
<option value="BB">Barbados</option>
<option value="BS">Bahamas</option>
<option value="DO">Dominican Republic</option>
<option value="CU">Cuba</option>
<option value="ZW">Zimbabwe</option>
<option value="ZM">Zambia</option>
<option value="GH">Ghana</option>
<option value="UG">Uganda</option>
<option value="TZ">Tanzania</option>
<option value="DZ">Algeria</option>
<option value="TN">Tunisia</option>
<option value="LY">Libya</option>
<option value="SD">Sudan</option>
<option value="ET">Ethiopia</option>
<option value="CM">Cameroon</option>
<option value="CI">Ivory Coast</option>
<option value="SN">Senegal</option>
<option value="MG">Madagascar</option>
<option value="MZ">Mozambique</option>
<option value="NA">Namibia</option>
<option value="BW">Botswana</option>
<option value="RW">Rwanda</option>
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

  {/* 💵 SUBTOTAL (always show) */}
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

      {shippingZone === 'UK' && (
        <>
          <label className="flex justify-between mb-1 text-[#f8fcdc]/70 font-extralight">
            <div>
              <input
                type="radio"
                name="shipping"
                value="evri"
                checked={shippingMethod === 'evri'}
                onChange={() => setShippingMethod('evri')}
                className="mr-2"
              />
              Evri Standard
            </div>
            <span>$5.00</span>
          </label>

          <label className="flex justify-between text-[#f8fcdc]/70 font-extralight">
            <div>
              <input
                type="radio"
                name="shipping"
                value="dhl"
                checked={shippingMethod === 'dhl'}
                onChange={() => setShippingMethod('dhl')}
                className="mr-2"
              />
              DHL Priority
            </div>
            <span>$15.00</span>
          </label>
        </>
      )}

      {shippingZone === 'EU' && (
        <div className="flex justify-between text-[#f8fcdc]/70 font-extralight">
          <span>EU Tracked</span>
          <span>$12.00</span>
        </div>
      )}

      {shippingZone === 'ROW' && (
        <div className="flex justify-between text-[#f8fcdc]/70 font-extralight">
          <span>ROW Tracked</span>
          <span>$18.00</span>
        </div>
      )}
    </li>
  )}

  {/* 💰 TOTAL */}
  <li className="flex justify-between font-bold text-2xl uppercase border-t border-[#f8fcdc]/10 pt-4 mt-4">
    <span className="uppercase text-[#f8fcdc]">TOTAL</span>
    <span className="text-[#f8fcdc]">
      ${(
        cartTotal +
        (isDigitalOnly
          ? 0
          : shippingZone === 'UK'
          ? (shippingMethod === 'dhl' ? 15 : 5)
          : shippingZone === 'EU'
          ? 12
          : shippingZone === 'ROW'
          ? 18
          : 0)
      ).toFixed(2)}
    </span>
  </li>
</ul>
        </div>

        {/* Payment */}
        <h2 className="text-xl text-[#dc9e63] font-bold mb-4">PAYMENT</h2>
        <div className="bg-[#1e0000]/50 p-4 rounded-xl shadow-xl mb-6">
          <label className="block mb-2 text-sm">
            <input
              type="radio"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="mr-2"
            />
            Credit / Debit Card
          </label>

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

          {paymentMethod === 'paypal' && (
            <div className="relative mt-2">
              <div className="absolute -top-2 left-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#f8fcdc]" />
              <div className="bg-[#f8fcdc] text-black p-4 rounded shadow text-sm">
                Pay via PayPal.
              </div>
            </div>
          )}
        </div>

        <p className="text-s text-[#f8fcdc] mb-4">
          Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
          <a
  href="/privacy-policy"
  className="text-s text-[#dc9e63] hover:text-[#f8fcdc] cursor-pointer no-underline transition-colors duration-300"
>
  privacy policy.
</a>
        </p>

        <label className="block mb-2 text-s">
          <input
            type="checkbox"
            checked={consentMarketing}
            onChange={e => setConsentMarketing(e.target.checked)}
            className="mr-2"
          />
          I consent to receive marketing emails and updates. <span className="text-[#f8fcdc]/50">(optional)</span>
        </label>

        <label className="block mb-4 text-s">
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