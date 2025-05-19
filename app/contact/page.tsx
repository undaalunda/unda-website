//ContactPage.tsx

import type { Metadata } from 'next';
import ContactClientComponent from './ContactClientComponent';

export const metadata: Metadata = {
  title: 'Contact - UNDA ALUNDA',
  description: 'Get in touch with Unda Alunda for bookings, inquiries, collaborations, and more.',
};

export default function ContactPage() {
  return <ContactClientComponent />;
}