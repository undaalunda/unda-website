// app/checkout/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const [shippingMethod, setShippingMethod] = useState<'evri' | 'dhl'>('evri');
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
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
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    address2: '',
    city: '',
    county: '',
    postcode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = typeof item.price === 'object' ? item.price.sale : item.price;
    return acc + price * item.quantity;
  }, 0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e: any) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (paymentMethod === 'card') {
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
        const shippingRates = { evri: 5, dhl: 15 };
const shippingCost = shippingRates[shippingMethod];
const amountToCharge = Math.round((cartTotal + shippingCost) * 100);

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
    } else {
      // TODO: PayPal logic here
      alert('Redirecting to PayPal...');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center pt-[120px] text-[#f8fcdc] font-[Cinzel] px-6">
      <h1 className="text-4xl font-extrabold tracking-wide mb-8 text-[#dc9e63]">
  CHECKOUT
</h1>
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
        className="bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border border-transparent p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70"
        required={required}
      />
    ))}

    {/* Country Select */}
    <select
    name="country"
    value={billingInfo.country}
    onChange={handleChange}
    required
    className="bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border-none p-2 rounded w-full appearance-none focus:outline-none focus:ring-0 cursor-pointer"
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
        className="bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border border-transparent p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70"
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
          className="bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border border-transparent p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70"
          required={required}
        />
      ))}

      {/* Shipping Country Select */}
  <select
    name="country"
    value={billingInfo.country}
    onChange={handleChange}
    required
    className="bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border-none p-2 rounded w-full appearance-none focus:outline-none focus:ring-0 cursor-pointer"
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
          className="bg-[#160000]/50 text-[#f8fcdc] placeholder-[#f8fcdc]/50 border border-transparent p-2 rounded w-full transition-colors duration-200 focus:outline-none focus:ring-0 focus:bg-[#2a0000]/70"
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
        {success && <div className="text-green-500 text-sm mb-4">Payment successful! ✅</div>}

        <button
          type="submit"
          disabled={loading || !stripe || !consentTerms}
          className="w-full bg-[#dc9e63] text-black py-2 rounded hover:bg-[#f8cfa3] transition-colors"
        >
          {loading ? 'Processing...' : paymentMethod === 'card' ? 'PLACE ORDER' : 'PAYPAL'}
        </button>
      </div>
    </form>
  </main>
);

}