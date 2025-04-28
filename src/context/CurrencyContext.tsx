'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserCurrency } from '@/utils/currency';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    async function fetchCurrency() {
      const userCurrency = await getUserCurrency();
      setCurrency(userCurrency);
    }
    fetchCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);