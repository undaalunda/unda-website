"use client";

import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useEffect, useState, useRef } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';

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
  const [shippingMethod, setShippingMethod] = useState<'evri' | 'dhl'>('evri');
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
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
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
    const missingShippingFields = shipToDifferent ? getMissing(trimmedShipping, shippingRequired) : [];
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
        const shippingCost = shippingMethod === 'dhl' ? 15 : 5;
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
  <option value="United States">United States</option>
  <option value="United Kingdom">United Kingdom</option>
  <option value="Canada">Canada</option>
  <option value="Australia">Australia</option>
  <option value="Germany">Germany</option>
  <option value="France">France</option>
  <option value="Italy">Italy</option>
  <option value="Spain">Spain</option>
  <option value="Netherlands">Netherlands</option>
  <option value="Sweden">Sweden</option>
  <option value="Norway">Norway</option>
  <option value="Denmark">Denmark</option>
  <option value="Finland">Finland</option>
  <option value="Ireland">Ireland</option>
  <option value="New Zealand">New Zealand</option>
  <option value="Japan">Japan</option>
  <option value="South Korea">South Korea</option>
  <option value="China">China</option>
  <option value="India">India</option>
  <option value="Brazil">Brazil</option>
  <option value="Mexico">Mexico</option>
  <option value="Argentina">Argentina</option>
  <option value="South Africa">South Africa</option>
  <option value="Russia">Russia</option>
  <option value="Ukraine">Ukraine</option>
  <option value="Poland">Poland</option>
  <option value="Austria">Austria</option>
  <option value="Belgium">Belgium</option>
  <option value="Switzerland">Switzerland</option>
  <option value="Portugal">Portugal</option>
  <option value="Greece">Greece</option>
  <option value="Turkey">Turkey</option>
  <option value="Thailand">Thailand</option>
  <option value="Malaysia">Malaysia</option>
  <option value="Singapore">Singapore</option>
  <option value="Indonesia">Indonesia</option>
  <option value="Philippines">Philippines</option>
  <option value="Vietnam">Vietnam</option>
  <option value="Saudi Arabia">Saudi Arabia</option>
  <option value="United Arab Emirates">United Arab Emirates</option>
  <option value="Egypt">Egypt</option>
  <option value="Israel">Israel</option>
  <option value="Chile">Chile</option>
  <option value="Colombia">Colombia</option>
  <option value="Peru">Peru</option>
  <option value="Nigeria">Nigeria</option>
  <option value="Kenya">Kenya</option>
  <option value="Morocco">Morocco</option>
  <option value="Czech Republic">Czech Republic</option>
  <option value="Romania">Romania</option>
  <option value="Hungary">Hungary</option>
  <option value="Slovakia">Slovakia</option>
  <option value="Slovenia">Slovenia</option>
  <option value="Bulgaria">Bulgaria</option>
  <option value="Croatia">Croatia</option>
  <option value="Serbia">Serbia</option>
  <option value="Estonia">Estonia</option>
  <option value="Latvia">Latvia</option>
  <option value="Lithuania">Lithuania</option>
  <option value="Pakistan">Pakistan</option>
  <option value="Bangladesh">Bangladesh</option>
  <option value="Sri Lanka">Sri Lanka</option>
  <option value="Nepal">Nepal</option>
  <option value="Myanmar">Myanmar</option>
  <option value="Cambodia">Cambodia</option>
  <option value="Laos">Laos</option>
  <option value="Mongolia">Mongolia</option>
  <option value="Kazakhstan">Kazakhstan</option>
  <option value="Uzbekistan">Uzbekistan</option>
  <option value="Qatar">Qatar</option>
  <option value="Kuwait">Kuwait</option>
  <option value="Oman">Oman</option>
  <option value="Bahrain">Bahrain</option>
  <option value="Jordan">Jordan</option>
  <option value="Lebanon">Lebanon</option>
  <option value="Iceland">Iceland</option>
  <option value="Luxembourg">Luxembourg</option>
  <option value="Malta">Malta</option>
  <option value="Cyprus">Cyprus</option>
  <option value="Georgia">Georgia</option>
  <option value="Armenia">Armenia</option>
  <option value="Azerbaijan">Azerbaijan</option>
  <option value="Panama">Panama</option>
  <option value="Costa Rica">Costa Rica</option>
  <option value="Uruguay">Uruguay</option>
  <option value="Paraguay">Paraguay</option>
  <option value="Bolivia">Bolivia</option>
  <option value="Ecuador">Ecuador</option>
  <option value="Guatemala">Guatemala</option>
  <option value="Honduras">Honduras</option>
  <option value="El Salvador">El Salvador</option>
  <option value="Nicaragua">Nicaragua</option>
  <option value="Jamaica">Jamaica</option>
  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
  <option value="Barbados">Barbados</option>
  <option value="Bahamas">Bahamas</option>
  <option value="Dominican Republic">Dominican Republic</option>
  <option value="Cuba">Cuba</option>
  <option value="Zimbabwe">Zimbabwe</option>
  <option value="Zambia">Zambia</option>
  <option value="Ghana">Ghana</option>
  <option value="Uganda">Uganda</option>
  <option value="Tanzania">Tanzania</option>
  <option value="Algeria">Algeria</option>
  <option value="Tunisia">Tunisia</option>
  <option value="Libya">Libya</option>
  <option value="Sudan">Sudan</option>
  <option value="Ethiopia">Ethiopia</option>
  <option value="Cameroon">Cameroon</option>
  <option value="Ivory Coast">Ivory Coast</option>
  <option value="Senegal">Senegal</option>
  <option value="Madagascar">Madagascar</option>
  <option value="Mozambique">Mozambique</option>
  <option value="Namibia">Namibia</option>
  <option value="Botswana">Botswana</option>
  <option value="Rwanda">Rwanda</option>
  <option value="United States">United States</option>
  <option value="United Kingdom">United Kingdom</option>
  <option value="Canada">Canada</option>
  <option value="Australia">Australia</option>
  <option value="Germany">Germany</option>
  <option value="France">France</option>
  <option value="Italy">Italy</option>
  <option value="Spain">Spain</option>
  <option value="Netherlands">Netherlands</option>
  <option value="Sweden">Sweden</option>
  <option value="Norway">Norway</option>
  <option value="Denmark">Denmark</option>
  <option value="Finland">Finland</option>
  <option value="Ireland">Ireland</option>
  <option value="New Zealand">New Zealand</option>
  <option value="Japan">Japan</option>
  <option value="South Korea">South Korea</option>
  <option value="China">China</option>
  <option value="India">India</option>
  <option value="Brazil">Brazil</option>
  <option value="Mexico">Mexico</option>
  <option value="Argentina">Argentina</option>
  <option value="South Africa">South Africa</option>
  <option value="Russia">Russia</option>
  <option value="Ukraine">Ukraine</option>
  <option value="Poland">Poland</option>
  <option value="Austria">Austria</option>
  <option value="Belgium">Belgium</option>
  <option value="Switzerland">Switzerland</option>
  <option value="Portugal">Portugal</option>
  <option value="Greece">Greece</option>
  <option value="Turkey">Turkey</option>
  <option value="Thailand">Thailand</option>
  <option value="Malaysia">Malaysia</option>
  <option value="Singapore">Singapore</option>
  <option value="Indonesia">Indonesia</option>
  <option value="Philippines">Philippines</option>
  <option value="Vietnam">Vietnam</option>
  <option value="Saudi Arabia">Saudi Arabia</option>
  <option value="United Arab Emirates">United Arab Emirates</option>
  <option value="Egypt">Egypt</option>
  <option value="Israel">Israel</option>
  <option value="Chile">Chile</option>
  <option value="Colombia">Colombia</option>
  <option value="Peru">Peru</option>
  <option value="Nigeria">Nigeria</option>
  <option value="Kenya">Kenya</option>
  <option value="Morocco">Morocco</option>
  <option value="Czech Republic">Czech Republic</option>
  <option value="Romania">Romania</option>
  <option value="Hungary">Hungary</option>
  <option value="Slovakia">Slovakia</option>
  <option value="Slovenia">Slovenia</option>
  <option value="Bulgaria">Bulgaria</option>
  <option value="Croatia">Croatia</option>
  <option value="Serbia">Serbia</option>
  <option value="Estonia">Estonia</option>
  <option value="Latvia">Latvia</option>
  <option value="Lithuania">Lithuania</option>
  <option value="Pakistan">Pakistan</option>
  <option value="Bangladesh">Bangladesh</option>
  <option value="Sri Lanka">Sri Lanka</option>
  <option value="Nepal">Nepal</option>
  <option value="Myanmar">Myanmar</option>
  <option value="Cambodia">Cambodia</option>
  <option value="Laos">Laos</option>
  <option value="Mongolia">Mongolia</option>
  <option value="Kazakhstan">Kazakhstan</option>
  <option value="Uzbekistan">Uzbekistan</option>
  <option value="Qatar">Qatar</option>
  <option value="Kuwait">Kuwait</option>
  <option value="Oman">Oman</option>
  <option value="Bahrain">Bahrain</option>
  <option value="Jordan">Jordan</option>
  <option value="Lebanon">Lebanon</option>
  <option value="Iceland">Iceland</option>
  <option value="Luxembourg">Luxembourg</option>
  <option value="Malta">Malta</option>
  <option value="Cyprus">Cyprus</option>
  <option value="Georgia">Georgia</option>
  <option value="Armenia">Armenia</option>
  <option value="Azerbaijan">Azerbaijan</option>
  <option value="Panama">Panama</option>
  <option value="Costa Rica">Costa Rica</option>
  <option value="Uruguay">Uruguay</option>
  <option value="Paraguay">Paraguay</option>
  <option value="Bolivia">Bolivia</option>
  <option value="Ecuador">Ecuador</option>
  <option value="Guatemala">Guatemala</option>
  <option value="Honduras">Honduras</option>
  <option value="El Salvador">El Salvador</option>
  <option value="Nicaragua">Nicaragua</option>
  <option value="Jamaica">Jamaica</option>
  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
  <option value="Barbados">Barbados</option>
  <option value="Bahamas">Bahamas</option>
  <option value="Dominican Republic">Dominican Republic</option>
  <option value="Cuba">Cuba</option>
  <option value="Zimbabwe">Zimbabwe</option>
  <option value="Zambia">Zambia</option>
  <option value="Ghana">Ghana</option>
  <option value="Uganda">Uganda</option>
  <option value="Tanzania">Tanzania</option>
  <option value="Algeria">Algeria</option>
  <option value="Tunisia">Tunisia</option>
  <option value="Libya">Libya</option>
  <option value="Sudan">Sudan</option>
  <option value="Ethiopia">Ethiopia</option>
  <option value="Cameroon">Cameroon</option>
  <option value="Ivory Coast">Ivory Coast</option>
  <option value="Senegal">Senegal</option>
  <option value="Madagascar">Madagascar</option>
  <option value="Mozambique">Mozambique</option>
  <option value="Namibia">Namibia</option>
  <option value="Botswana">Botswana</option>
  <option value="Rwanda">Rwanda</option>
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

  <label className="block mt-4">
    <input
      type="checkbox"
      checked={shipToDifferent}
      onChange={(e) => setShipToDifferent(e.target.checked)}
      className="mr-2"
    />
    DELIVER TO A DIFFERENT ADDRESS?
  </label>

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
  <option value="United States">United States</option>
  <option value="United Kingdom">United Kingdom</option>
  <option value="Canada">Canada</option>
  <option value="Australia">Australia</option>
  <option value="Germany">Germany</option>
  <option value="France">France</option>
  <option value="Italy">Italy</option>
  <option value="Spain">Spain</option>
  <option value="Netherlands">Netherlands</option>
  <option value="Sweden">Sweden</option>
  <option value="Norway">Norway</option>
  <option value="Denmark">Denmark</option>
  <option value="Finland">Finland</option>
  <option value="Ireland">Ireland</option>
  <option value="New Zealand">New Zealand</option>
  <option value="Japan">Japan</option>
  <option value="South Korea">South Korea</option>
  <option value="China">China</option>
  <option value="India">India</option>
  <option value="Brazil">Brazil</option>
  <option value="Mexico">Mexico</option>
  <option value="Argentina">Argentina</option>
  <option value="South Africa">South Africa</option>
  <option value="Russia">Russia</option>
  <option value="Ukraine">Ukraine</option>
  <option value="Poland">Poland</option>
  <option value="Austria">Austria</option>
  <option value="Belgium">Belgium</option>
  <option value="Switzerland">Switzerland</option>
  <option value="Portugal">Portugal</option>
  <option value="Greece">Greece</option>
  <option value="Turkey">Turkey</option>
  <option value="Thailand">Thailand</option>
  <option value="Malaysia">Malaysia</option>
  <option value="Singapore">Singapore</option>
  <option value="Indonesia">Indonesia</option>
  <option value="Philippines">Philippines</option>
  <option value="Vietnam">Vietnam</option>
  <option value="Saudi Arabia">Saudi Arabia</option>
  <option value="United Arab Emirates">United Arab Emirates</option>
  <option value="Egypt">Egypt</option>
  <option value="Israel">Israel</option>
  <option value="Chile">Chile</option>
  <option value="Colombia">Colombia</option>
  <option value="Peru">Peru</option>
  <option value="Nigeria">Nigeria</option>
  <option value="Kenya">Kenya</option>
  <option value="Morocco">Morocco</option>
  <option value="Czech Republic">Czech Republic</option>
  <option value="Romania">Romania</option>
  <option value="Hungary">Hungary</option>
  <option value="Slovakia">Slovakia</option>
  <option value="Slovenia">Slovenia</option>
  <option value="Bulgaria">Bulgaria</option>
  <option value="Croatia">Croatia</option>
  <option value="Serbia">Serbia</option>
  <option value="Estonia">Estonia</option>
  <option value="Latvia">Latvia</option>
  <option value="Lithuania">Lithuania</option>
  <option value="Pakistan">Pakistan</option>
  <option value="Bangladesh">Bangladesh</option>
  <option value="Sri Lanka">Sri Lanka</option>
  <option value="Nepal">Nepal</option>
  <option value="Myanmar">Myanmar</option>
  <option value="Cambodia">Cambodia</option>
  <option value="Laos">Laos</option>
  <option value="Mongolia">Mongolia</option>
  <option value="Kazakhstan">Kazakhstan</option>
  <option value="Uzbekistan">Uzbekistan</option>
  <option value="Qatar">Qatar</option>
  <option value="Kuwait">Kuwait</option>
  <option value="Oman">Oman</option>
  <option value="Bahrain">Bahrain</option>
  <option value="Jordan">Jordan</option>
  <option value="Lebanon">Lebanon</option>
  <option value="Iceland">Iceland</option>
  <option value="Luxembourg">Luxembourg</option>
  <option value="Malta">Malta</option>
  <option value="Cyprus">Cyprus</option>
  <option value="Georgia">Georgia</option>
  <option value="Armenia">Armenia</option>
  <option value="Azerbaijan">Azerbaijan</option>
  <option value="Panama">Panama</option>
  <option value="Costa Rica">Costa Rica</option>
  <option value="Uruguay">Uruguay</option>
  <option value="Paraguay">Paraguay</option>
  <option value="Bolivia">Bolivia</option>
  <option value="Ecuador">Ecuador</option>
  <option value="Guatemala">Guatemala</option>
  <option value="Honduras">Honduras</option>
  <option value="El Salvador">El Salvador</option>
  <option value="Nicaragua">Nicaragua</option>
  <option value="Jamaica">Jamaica</option>
  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
  <option value="Barbados">Barbados</option>
  <option value="Bahamas">Bahamas</option>
  <option value="Dominican Republic">Dominican Republic</option>
  <option value="Cuba">Cuba</option>
  <option value="Zimbabwe">Zimbabwe</option>
  <option value="Zambia">Zambia</option>
  <option value="Ghana">Ghana</option>
  <option value="Uganda">Uganda</option>
  <option value="Tanzania">Tanzania</option>
  <option value="Algeria">Algeria</option>
  <option value="Tunisia">Tunisia</option>
  <option value="Libya">Libya</option>
  <option value="Sudan">Sudan</option>
  <option value="Ethiopia">Ethiopia</option>
  <option value="Cameroon">Cameroon</option>
  <option value="Ivory Coast">Ivory Coast</option>
  <option value="Senegal">Senegal</option>
  <option value="Madagascar">Madagascar</option>
  <option value="Mozambique">Mozambique</option>
  <option value="Namibia">Namibia</option>
  <option value="Botswana">Botswana</option>
  <option value="Rwanda">Rwanda</option>
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
        <li className="flex justify-between text-base font-bold mb-1">
    <span>Product</span>
    <span>Subtotal</span>
  </li>

  {cartItems.map(item => (
  <li key={item.id} className="flex gap-4 items-center mb-4">
    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
    <div className="flex-1">
      <p className="text-sm text-[#f8fcdc]/70 font-light">{item.title} x {item.quantity}</p>
      <p className="text-xs text-[#f8fcdc]/40">{item.subtitle}</p>
    </div>
    <span className="text-sm text-[#f8fcdc]/70">
    ${(typeof item.price === 'object' 
  ? (item.price.sale * item.quantity) 
  : item.price * item.quantity
).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  </li>
))}

<li className="flex justify-between font-bold text-sm uppercase mb-3">
  <span className="uppercase text-[#f8fcdc]">Subtotal</span>
  <span className="text-[#f8fcdc]">
  ${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</span>
</li>

            <li className="pt-2">
              <span className="font-bold block mb-2">Shipping</span>
              <label className="flex items-center justify-between mb-1 text-[#f8fcdc]/70 font-extralight">
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
              <label className="flex items-center justify-between text-[#f8fcdc]/70 font-extralight">
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
            </li>
            <li className="relative top-[4px] flex justify-between font-bold border-t border-[#dc9e63]/10 pt-5 mt-3">
            <span className="text-2xl">TOTAL</span>
            <span className="text-2xl">
  ${(cartTotal + (shippingMethod === 'dhl' ? 15 : 5)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

          <label className="block mt-4 mb-2 text-sm">
            <input
              type="radio"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="mr-2"
            />
            PayPal
          </label>

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

{paymentMethod === 'paypal' ? (
  <div className="w-full md:max-w-[450px] mt-6">
    <PayPalButtons
      style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
      fundingSource="paypal"
      createOrder={(data, actions) => {
        const shipping = shippingMethod === 'dhl' ? 15 : 5;
        const total = cartItems.reduce((acc, item) => {
          const price = typeof item.price === 'object' ? item.price.sale : item.price;
          return acc + price * item.quantity;
        }, 0) + shipping;

        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                value: total.toFixed(2),
                currency_code: 'USD'
              }
            }
          ]
        });
      }}
      onApprove={async (data, actions) => {
        const details = await actions.order?.capture();
        console.log('✅ PayPal Success:', details);
        setSuccess(true);
        clearCart();
        router.push('/thank-you'); 
      }}
      onError={(err) => {
        console.error('❌ PayPal Error:', err);
        setErrorMessage('PayPal error occurred.');
      }}
    />
  </div>
) : (
  <button
  type="submit"
  disabled={false}
  className="w-full bg-[#dc9e63] text-black py-3 rounded-xl text-lg font-extrabold tracking-wide hover:bg-[#f8cfa3] transition-colors shadow-lg cursor-pointer"
>
  {loading ? 'Processing...' : 'PLACE ORDER'}
</button>
)}
      </div>
    </form>
  </main>
);
}