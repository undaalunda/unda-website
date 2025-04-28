'use client';

import type { Product } from '@/components/allItems';
import React from 'react'; // ✅ จำเป็นเพราะมี JSX.Element ใน getConvertedPrice

const currencyRates: Record<string, number> = {
  USD: 1,
  THB: 36,
  JPY: 150,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.5,
  CAD: 1.35,
  CNY: 7.2,
  KRW: 1300,
  SGD: 1.35,
  NZD: 1.6,
  CHF: 0.95,
  SEK: 10.5,
  NOK: 10.2,
  DKK: 6.8,
  PLN: 4.3,
  CZK: 22,
  HUF: 350,
  BRL: 5,
  MXN: 18,
  ARS: 870,
  CLP: 900,
  COP: 4000,
  PEN: 3.8,
  ZAR: 19,
  INR: 83,
  MYR: 4.7,
  PHP: 56,
  VND: 24000,
  IDR: 16000,
  SAR: 3.75,
  AED: 3.67,
  QAR: 3.64,
  KWD: 0.31,
  OMR: 0.38,
  BHD: 0.38,
  ILS: 3.7,
  RUB: 90,
  UAH: 40,
  TRY: 32,
  PKR: 280,
  BDT: 110,
  LKR: 300,
  NPR: 133,
  KES: 130,
  NGN: 1500,
  EGP: 48,
  MAD: 10,
  TND: 3.1,
  DZD: 135,
  GHS: 14,
  UGX: 3800,
  TZS: 2600,
  RWF: 1300,
  ZMW: 25,
  ZWL: 5800,
  MUR: 45,
  ISK: 140,
  KZT: 450,
  UZS: 12600,
  GEL: 2.7,
  AMD: 400,
  AZN: 1.7,
  BYN: 3.2,
};

export async function getUserCurrency(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const country = data.country_code;

    const countryToCurrency: { [key: string]: string } = {
      US: 'USD', CA: 'CAD', AU: 'AUD', GB: 'GBP', EU: 'EUR', // EU = Europe
      JP: 'JPY', CN: 'CNY', KR: 'KRW', SG: 'SGD', TH: 'THB',
      DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR', AT: 'EUR', BE: 'EUR', LU: 'EUR', GR: 'EUR', CY: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR', MT: 'EUR',
      NZ: 'NZD', HK: 'HKD', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF',
      BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
      ZA: 'ZAR', IN: 'INR', MY: 'MYR', PH: 'PHP', VN: 'VND', ID: 'IDR',
      SA: 'SAR', AE: 'AED', QA: 'QAR', KW: 'KWD', OM: 'OMR', BH: 'BHD',
      IL: 'ILS', RU: 'RUB', UA: 'UAH', TR: 'TRY', PK: 'PKR', BD: 'BDT',
      LK: 'LKR', NP: 'NPR', KE: 'KES', NG: 'NGN', EG: 'EGP', MA: 'MAD',
      TN: 'TND', DZ: 'DZD', GH: 'GHS', UG: 'UGX', TZ: 'TZS', RW: 'RWF',
      ZM: 'ZMW', ZW: 'ZWL', MU: 'MUR', IS: 'ISK', KZ: 'KZT', UZ: 'UZS',
      GE: 'GEL', AM: 'AMD', AZ: 'AZN', BY: 'BYN'
    };

    return countryToCurrency[country] || 'USD';
  } catch (error) {
    console.error('Error detecting user currency:', error);
    return 'USD';
  }
}

export function convertPrice(basePrice: number, currency: string): string {
  const rate = currencyRates[currency] || 1;
  const converted = basePrice * rate;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(converted);
}

export function isBundlePrice(price: Product['price']): price is { original: string; sale: string } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}