// context/ConsentContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConsentContextType {
  hasConsent: boolean;
  acceptConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    setHasConsent(consent === 'accepted');
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setHasConsent(true);
  };

  return (
    <ConsentContext.Provider value={{ hasConsent, acceptConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}