 //app/privacy-policy/page.tsx

import type { Metadata } from 'next';
import PrivacyClientComponent from './PrivacyClientComponent';

export const metadata: Metadata = {
  title: 'Privacy Policy - UNDA ALUNDA',
};

export default function PrivacyPolicyPage() {
  return <PrivacyClientComponent />;
}