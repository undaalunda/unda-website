//TermsPage.tsx

import TermsClientComponent from './TermsClientComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - UNDA ALUNDA',
};

export default function TermsPage() {
  return <TermsClientComponent />;
}