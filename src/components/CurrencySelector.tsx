'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { ChevronDown } from 'lucide-react';

// 🎯 ครบเกือบทั่วโลกที่ใช้เงินจริง
const currencies = [
  { code: 'USD', label: 'USD ($)' },
  { code: 'THB', label: 'THB (฿)' },
  { code: 'JPY', label: 'JPY (¥)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'GBP', label: 'GBP (£)' },
  { code: 'AUD', label: 'AUD (A$)' },
  { code: 'CAD', label: 'CAD (C$)' },
  { code: 'CNY', label: 'CNY (¥)' },
  { code: 'KRW', label: 'KRW (₩)' },
  { code: 'SGD', label: 'SGD (S$)' },
  { code: 'NZD', label: 'NZD (NZ$)' },
  { code: 'CHF', label: 'CHF (Fr)' },
  { code: 'SEK', label: 'SEK (kr)' },
  { code: 'NOK', label: 'NOK (kr)' },
  { code: 'DKK', label: 'DKK (kr)' },
  { code: 'PLN', label: 'PLN (zł)' },
  { code: 'CZK', label: 'CZK (Kč)' },
  { code: 'HUF', label: 'HUF (Ft)' },
  { code: 'BRL', label: 'BRL (R$)' },
  { code: 'MXN', label: 'MXN (MX$)' },
  { code: 'ARS', label: 'ARS (AR$)' },
  { code: 'CLP', label: 'CLP (CLP$)' },
  { code: 'COP', label: 'COP (COL$)' },
  { code: 'PEN', label: 'PEN (S/)' },
  { code: 'ZAR', label: 'ZAR (R)' },
  { code: 'INR', label: 'INR (₹)' },
  { code: 'MYR', label: 'MYR (RM)' },
  { code: 'PHP', label: 'PHP (₱)' },
  { code: 'VND', label: 'VND (₫)' },
  { code: 'IDR', label: 'IDR (Rp)' },
  { code: 'SAR', label: 'SAR (ر.س)' },
  { code: 'AED', label: 'AED (د.إ)' },
  { code: 'QAR', label: 'QAR (ر.ق)' },
  { code: 'KWD', label: 'KWD (د.ك)' },
  { code: 'OMR', label: 'OMR (ر.ع.)' },
  { code: 'BHD', label: 'BHD (ب.د)' },
  { code: 'ILS', label: 'ILS (₪)' },
  { code: 'RUB', label: 'RUB (₽)' },
  { code: 'UAH', label: 'UAH (₴)' },
  { code: 'TRY', label: 'TRY (₺)' },
  { code: 'PKR', label: 'PKR (₨)' },
  { code: 'BDT', label: 'BDT (৳)' },
  { code: 'LKR', label: 'LKR (Rs)' },
  { code: 'KES', label: 'KES (KSh)' },
  { code: 'NGN', label: 'NGN (₦)' },
  { code: 'EGP', label: 'EGP (E£)' },
  { code: 'MAD', label: 'MAD (د.م.)' },
  { code: 'TND', label: 'TND (د.ت)' },
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-0 mb-10">
      
      {/* Currency Dropdown with Chevron */}
      <div className="relative group text-[#f8fcdc] transition-colors duration-300 hover:text-[#dcdcdc]">
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="appearance-none bg-transparent text-inherit text-sm font-extralight focus:outline-none pr-5 cursor-pointer"
        >
          {currencies.map((cur) => (
            <option
              key={cur.code}
              value={cur.code}
              className="bg-[#160000] text-[#f8fcdc]"
            >
              {cur.label}
            </option>
          ))}
        </select>
        {/* Chevron Icon */}
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-inherit w-3.5 h-3.5 pointer-events-none" />
      </div>

      {/* Payment Icons */}
      <div className="flex items-center gap-3 text-[#dc9e63] text-sm">
        <i className="fab fa-cc-amex" />
        <i className="fab fa-apple-pay" />
        <i className="fab fa-cc-diners-club" />
        <i className="fab fa-cc-discover" />
        <i className="fab fa-google-pay" />
        <i className="fab fa-cc-mastercard" />
        <i className="fab fa-cc-paypal" />
        <i className="fab fa-shopify" />
        <i className="fab fa-cc-visa" />
      </div>
    </div>
  );
}